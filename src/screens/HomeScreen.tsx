import React, { useState } from "react";
import { Button, Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Color, FontSize } from "../utils/globalstyles";
import PrimaryButton from "../components/Button/PrimaryButton";
import SecondaryButton from "../components/Button/SecondaryButton";
import Navigate from "../utils/enum";
import TextField from "../components/Input/TextField";
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
const { width, height } = Dimensions.get("screen");

const HomeScreen = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = () => {
    setModalVisible(false);
    navigation.navigate(Navigate.CREATE_MEETING_SCREEN, { name });
  };

  const handleCreate = () => {
    console.log('handleCreate');
  };
  
  const handleJoin = () => {
    console.log('handleJoin');
    navigation.navigate(Navigate.JOIN_MEETING_SCREEN);
    // navigation.navigate(Navigate.JOIN_MEETING_SCREEN);
  };

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
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <View style={{width:'100%',  alignItems:'flex-end'}}>
            <TouchableOpacity onPress={() => setModalVisible(false)} >
              {/* <Image source={require('../assets/icons/cross.png')} style={{width:20, height:20}}/> */}
              <AntDesignIcon name="closecircleo" size={22} color={Color.black}/>
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
              <PrimaryButton onPress={() => handleSubmit()} text='Submit' />
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
    paddingVertical:25,
    paddingHorizontal:25,
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
    color:Color.black
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    color:Color.black
  },
});

export default HomeScreen;
