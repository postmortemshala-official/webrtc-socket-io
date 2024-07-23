import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Navigate from '../utils/enum';
import app from '../utils/firebaseConfig'; // Adjust the import according to your file structure
import HomeScreen from '../screens/HomeScreen';
import CreateMeetingScreen from '../screens/CreateMeetingScreen';
import JoinMeetingScreen from '../screens/JoinMeetingScreen';






const AboutScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        Alert.alert('Success', 'User registered successfully');
        // You can navigate to another screen here or clear the form
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});



const Stack = createNativeStackNavigator();



export default function AppNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={Navigate.HOME_SCREEN}>
      <Stack.Screen name={Navigate.HOME_SCREEN} component={HomeScreen} />
      <Stack.Screen name={Navigate.CREATE_MEETING_SCREEN} component={CreateMeetingScreen} />
      <Stack.Screen name={Navigate.JOIN_MEETING_SCREEN} component={JoinMeetingScreen} />
    </Stack.Navigator>
  );
}