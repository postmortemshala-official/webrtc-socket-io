// components/JoinRoom.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { createAnswer, joinRoom } from '../Signal';

const JoinRoom = ({ onPeerConnection }:any) => {
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = async () => {
    const connection = await createAnswer(roomId);
    await joinRoom(roomId, connection);
    onPeerConnection(connection);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Room ID"
        value={roomId}
        onChangeText={setRoomId}
      />
      <Button title="Join Room" onPress={handleJoinRoom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default JoinRoom;
