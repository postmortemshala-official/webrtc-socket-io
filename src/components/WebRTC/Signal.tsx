// signaling.tsx
import { firestore } from '../../../firebaseConfig';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';

const servers: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
};

const getMediaStream = async (): Promise<MediaStream> => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });
  return stream;
};

export const createOffer = async (roomId: string): Promise<RTCPeerConnection> => {
  const peerConnection = new RTCPeerConnection(servers);
  const stream = await getMediaStream();
  stream.getTracks().forEach(track => {
    peerConnection.addTrack(track, stream);
  });

  peerConnection.ontrack = (event: RTCTrackEvent) => {
    const [remoteStream] = event.streams;
    // Attach remoteStream to video element
  };

  peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      sendIceCandidate(roomId, event.candidate.toJSON());
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  const roomRef = firestore.collection('rooms').doc(roomId);
  const roomSnapshot = await roomRef.get();
  if (!roomSnapshot.exists) {
    await roomRef.set({
      offer: {
        type: offer.type,
        sdp: offer.sdp
      }
    });
  }

  return peerConnection;
};

export const createAnswer = async (roomId: string): Promise<RTCPeerConnection> => {
  const roomRef = firestore.collection('rooms').doc(roomId);
  const roomSnapshot = await roomRef.get();
  const offer = roomSnapshot.data()?.offer;

  const peerConnection = new RTCPeerConnection(servers);
  const stream = await getMediaStream();
  stream.getTracks().forEach(track => {
    peerConnection.addTrack(track, stream);
  });

  peerConnection.ontrack = (event: RTCTrackEvent) => {
    const [remoteStream] = event.streams;
    // Attach remoteStream to video element
  };

  peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      sendIceCandidate(roomId, event.candidate.toJSON());
    }
  };

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  await roomRef.update({
    answer: {
      type: answer.type,
      sdp: answer.sdp
    }
  });

  return peerConnection;
};

export const joinRoom = async (roomId: string, peerConnection: RTCPeerConnection): Promise<void> => {
  const roomRef = firestore.collection('rooms').doc(roomId);

  roomRef.collection('iceCandidates').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data();
    if (data && data.answer && !peerConnection.currentRemoteDescription) {
      const answer = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(answer);
    }
  });
};

export const sendIceCandidate = async (roomId: string, candidate: RTCIceCandidateInit): Promise<void> => {
  const roomRef = firestore.collection('rooms').doc(roomId);
  await roomRef.collection('iceCandidates').add(candidate);
};
