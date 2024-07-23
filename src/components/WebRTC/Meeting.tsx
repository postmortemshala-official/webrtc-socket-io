// App.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CreateRoom from './Room/CreateRoom';
import JoinRoom from './Room/JoinRoom';

export default function Meeting() {
  const [peerConnection, setPeerConnection] = useState(null);

  return (
    <View style={styles.container}>
      <CreateRoom onPeerConnection={setPeerConnection} />
      <JoinRoom onPeerConnection={setPeerConnection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
