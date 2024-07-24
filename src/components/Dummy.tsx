import React, { useState, useEffect, useRef } from 'react';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
  RTCView,
} from 'react-native-webrtc';
import { database } from '../utils/firebaseConfig';
import { pcConfig } from '../utils/webRTCConfig';
import { View, Button, StyleSheet, Text } from 'react-native';
import { ref, set, onValue, push } from 'firebase/database';

const Dummy: React.FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const meetingId = 'your-meeting-id'; // Replace with dynamic ID or generate it
  const dbRef = ref(database, `/seek-meet/creator/${meetingId}`);

  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (pc.current) {
          stream.getTracks().forEach((track) => {
            pc.current?.addTrack(track, stream);
          });
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    startLocalStream();

    pc.current = new RTCPeerConnection(pcConfig);

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = new RTCIceCandidate(event.candidate);
        const candidateRef = push(ref(database, `/seek-meet/creator/${meetingId}/candidates`));
        set(candidateRef, candidate.toJSON());
      }
    };

    pc.current.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      pc.current?.close();
    };
  }, []);

  const createOffer = async () => {
    if (!pc.current) return;

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    set(dbRef, {
      offer: offer.toJSON(),
    });

    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.answer) {
        const answer = new RTCSessionDescription(data.answer);
        pc.current?.setRemoteDescription(answer);
      }
    });

    const candidatesRef = ref(database, `/seek-meet/creator/${meetingId}/candidates`);
    onValue(candidatesRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const candidate = new RTCIceCandidate(childSnapshot.val());
        pc.current?.addIceCandidate(candidate);
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Meeting</Text>
      <View style={styles.videoContainer}>
        <View style={styles.stream}>
          {localStream && (
            <RTCView
              streamURL={localStream.toURL()}
              style={styles.rtcView}
            />
          )}
          <Text style={styles.streamLabel}>Local Stream</Text>
        </View>
        <View style={styles.stream}>
          {remoteStream && (
            <RTCView
              streamURL={remoteStream.toURL()}
              style={styles.rtcView}
            />
          )}
          <Text style={styles.streamLabel}>Remote Stream</Text>
        </View>
      </View>
      <Button title="Create Offer" onPress={createOffer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stream: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  rtcView: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
  streamLabel: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Dummy;
