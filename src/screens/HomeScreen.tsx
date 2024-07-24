import React, { useEffect, useState } from "react";
import { Button, Dimensions, Image, Modal, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { Color, FontSize } from "../utils/globalstyles";
import PrimaryButton from "../components/Button/PrimaryButton";
import SecondaryButton from "../components/Button/SecondaryButton";
import Navigate from "../utils/enum";
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import HelperFunctions from "../utils/HelperFunction";
import { getDatabase, ref, set, push } from "firebase/database";
import { database } from "../utils/firebaseConfig";
interface User {
  name: string;
  id: string;
  meet_id: string;
  createdAt: string;
}

const { width, height } = Dimensions.get("screen");

const HomeScreen = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [loading, setloading] = useState(false)
  const [disableBtn, setDisableBtn] = useState(false);
  const [buttonColor, setButtonColor] = useState(Color.darkGray);

  // Write in Firebase 
  const meeting_id = HelperFunctions.generateRandomId(9)
  const writeUserData = async () => {
    try {
      // Generate a unique key using push()
      const newUserRef = push(ref(database, 'seek-meet/creator'));

      // Define user data
      const userData: User = {
        name: name,
        meet_id: meeting_id,
        id: newUserRef.key as string,
        createdAt: new Date().toString()
      };

      // Set data at the generated key
      await set(newUserRef, userData);
      console.info('Data written successfully');
      console.info('Meeting id ==> ', meeting_id);
      ToastAndroid.show(`Meeting ID : ${meeting_id}`, ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error writing data:', error);
    }
  };



  const handleSubmit = async () => {
    try {
      setloading(true)
      await writeUserData()
      setModalVisible(false);
      setloading(false)

      navigation.navigate(Navigate.MEETING_ROOM_SCREEN, { meeting_id });

    } catch (error) {
      console.log("Error at HOME_SCREEN ==> ", error);


    }
  };


  const handleJoin = () => {
    console.log('handleJoin');
    navigation.navigate(Navigate.JOIN_MEETING_SCREEN);
    // navigation.navigate(Navigate.JOIN_MEETING_SCREEN);
  };


  useEffect(() => {
    if (name.length < 3) {
      setButtonColor(Color.darkGray);
      setDisableBtn(true);
    } else if (name.length >= 2) {
      setButtonColor(Color.blue);
      setDisableBtn(false);
    }
  }, [name]);




  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
        marginHorizontal: width * 0.1,
        gap: width * 0.05,
      }}
    >
      <Image
        source={require("../assets/logo.png")}
        style={{
          width: width * 0.3,
          height: width * 0.3,
        }}
      />
      <Text style={{ textAlign: "center", color: Color.textGray }}>
        Lorem ipsum, dolor s sdf sdfg sdfg wef sequi voluptatem unde pariatur vel!
      </Text>
      <View style={{ flexDirection: 'row', gap: width * 0.05 }}>
        <PrimaryButton onPress={() => setModalVisible(true)} text='Create' />
        <SecondaryButton onPress={handleJoin} text='Join' />
        <SecondaryButton onPress={() => { navigation.navigate('TestScreen') }} text='Test' />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <View style={{ width: '100%', alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} >
                {/* <Image source={require('../assets/icons/cross.png')} style={{width:20, height:20}}/> */}
                <AntDesignIcon name="closecircleo" size={22} color={Color.black} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Enter your name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={Color.midGray}
              value={name}
              onChangeText={setName}
            />
            <View style={{ flexDirection: 'row', gap: width * 0.05 }}>
              <PrimaryButton onPress={() => handleSubmit()} bgColor={buttonColor}
                text='Submit' loading={loading} disableBtn={disableBtn}
              />
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: FontSize.size_lr,
    color: Color.black
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    color: Color.black
  },
});

export default HomeScreen;
