import React from "react";
import { Button, TouchableOpacity, View, StyleSheet } from "react-native";
import { getDatabase, ref, set } from "firebase/database";
import app from "../utils/firebaseConfig"; // Ensure the correct path to your firebaseConfig

const TestScreen = () => {
  const writeUserData = (userId: any, name: any, email: any, imageUrl: any) => {
    const db = getDatabase(app);
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      profile_picture: imageUrl
    })
    .then(() => {
      console.log("Data saved successfully!");
    })
    .catch((error) => {
      console.error("Error saving data: ", error);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => writeUserData(123, 'Anshu', 'anshu@gmail.com', 'NAN_img')}>
        <Button title="Send Data to Firebase Database" onPress={() => {}} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestScreen;
