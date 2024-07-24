// TestScreen.tsx
import React from "react";
import { Button, View, StyleSheet } from "react-native";
import { getDatabase, ref, set, push } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import HelperFunctions from "../utils/HelperFunction";
import Dummy from "../components/Dummy";
import JoinDummy from "../components/JoinDummy";

interface User {
  name: string;
  id: string;
  meet_id: string;
  createdAt: string;
}

const TestScreen: React.FC = () => {

  const meeting_id=HelperFunctions.generateRandomId(9)
  console.log("Testor side meet_id ==> ", meeting_id);
  

    
  const writeUserData = async () => {
    try {
      // Generate a unique key using push()
      const newUserRef = push(ref(database, 'seek-meet/creator'));

      // Define user data
      const userData: User = {
        name: 'John Doe',
        meet_id:meeting_id,
        id: newUserRef.key as string,
        createdAt:new Date().toString()
      };

      // Set data at the generated key
      await set(newUserRef, userData);
      console.log('Data written successfully');
    } catch (error) {
      console.error('Error writing data:', error);
    }
  };


  return (
    <View style={styles.container}>
      {/* <Button title="Send Data to Firebase Database" onPress={writeUserData} /> */}
      <Dummy/>
      <JoinDummy/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default TestScreen;
