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
import { View, Button, TextInput, StyleSheet, Text } from 'react-native';
import { ref, onValue, set } from 'firebase/database';
import { Color } from '../utils/globalstyles';

const JoinDummy: React.FC = () => {
  const [name, setName] = useState('');
  const [peerId, setPeerId] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);

  useEffect(() => {
    if (!meetingId) return;

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

    const initializePeerConnection = async () => {
      pc.current = new RTCPeerConnection(pcConfig);

      pc.current.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = new RTCIceCandidate(event.candidate);
          const candidateRef = ref(database, `/seek-meet/creator/${meetingId}/candidates`);
          set(candidateRef, candidate.toJSON());
        }
      };

      pc.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      const meetingRef = ref(database, `/seek-meet/creator/${meetingId}`);
      onValue(meetingRef, async (snapshot) => {
        const data = snapshot.val();
        if (data?.offer) {
          const offer = new RTCSessionDescription(data.offer);
          await pc.current?.setRemoteDescription(offer);
          const answer = await pc.current?.createAnswer();
          await pc.current?.setLocalDescription(answer);
          set(meetingRef, {
            answer: answer.toJSON(),
          });
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

    if (meetingId) {
      startLocalStream();
      initializePeerConnection();
    }

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      pc.current?.close();
    };
  }, [meetingId]);

  const joinMeeting = () => {
    if (!peerId) {
      alert('Please enter a valid Peer ID.');
      return;
    }
    setMeetingId(peerId);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Meeting ID"
        value={peerId}
        onChangeText={setPeerId}
      />
      <Button title="Join Meeting" onPress={joinMeeting} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
    color:Color.red
  },
});

export default JoinDummy;
