// components/CreateRoom.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { createOffer } from '../Signal';

const CreateRoom = ({ onPeerConnection }) => {
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = async () => {
    const connection = await createOffer(roomId);
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
      <Button title="Create Room" onPress={handleCreateRoom} />
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

export default CreateRoom;
