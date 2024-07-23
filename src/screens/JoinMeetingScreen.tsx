import {
    Dimensions,
    Image,
    Text,
    View,
    StyleSheet,
    ScrollView,
    Button,
    ActivityIndicator,
  } from "react-native";
  import { useCallback, useEffect, useMemo, useRef, useState } from "react";
  import BackButton from "../components/Button/BackButton";
  import PrimaryButton from "../components/Button/PrimaryButton";
  import TextField from "../components/Input/TextField";
  import { Color, FontSize } from "../utils/globalstyles";
  import TermAndCondition from "../components/TermAndCondition";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Entypo from 'react-native-vector-icons/Entypo'
import Navigate from "../utils/enum";
  
  const { width, height } = Dimensions.get("screen");
  
  const JoinMeetingScreen = ({ navigation }: any) => {
    const [meetId, setMeetId] = useState("");
    const [userName, setUserName] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [buttonColor, setButtonColor] = useState(Color.darkGray);
    const [disableBtn, setDisableBtn] = useState(false);
  
    const pasteFromClipboard = async () => {
    //   const clipboardContent = await Clipboard.getString();
    //   setInputValue(clipboardContent);
    };
  
    console.log("My recent copied value ==> ", inputValue);
  
    const snapPoints = useMemo(() => ["25%", "1%", "90%"], []);
  
    // callbacks
  
    // const handleSnapPress = useCallback((index: any) => {
    //   sheetRef.current?.snapToIndex(index);
    // }, []);
    // const handleClosePress = useCallback(() => {
    //   sheetRef.current?.close();
    // }, []);
  
    console.log("meetId==>", meetId);
    console.log("userName==>", userName);
  
    function handleMeetId(e: any) {
      setMeetId(e);
    }
  
    function handleUserName(e: any) {
      setUserName(e);
    }
  
    function handleJoin() {
      handleSnapPress(2);
      setTimeout(() => {
        navigation.replace(Navigate.CREATE_MEETING_SCREEN)
        
      }, 5000);
    }
  
    useEffect(() => {
      if (meetId.length < 9 && userName.length == 0) {
        setButtonColor(Color.darkGray);
        setDisableBtn(true);
      } else if (meetId.length >= 9) {
        setButtonColor(Color.blue);
        setDisableBtn(false);
      }
    }, [meetId, userName]);
  
   
    return (
      <View style={{ flex: 1 }}>
          <BackButton navigation={navigation} />
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
            />
          </View>
  
          <Text style={styles.description}>
            Lorem ipsum, dolor s sdf sdfg sdfg wef sequi voluptatem unde pariatur
            vel!
          </Text>
  
          <View style={styles.inputContainer}>
            <TextField
              label={"Your name..."}
              placeholder={"Your name..."}
              onInputChange={handleUserName}
            />
  
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "85%" }}>
                <TextField
                  label={"Seek-meet-id"}
                  placeholder={"Seek-meet-id"}
                  value={inputValue}
                  onInputChange={handleMeetId}
                />
              </View>
              <TouchableOpacity
                onPress={pasteFromClipboard}
                style={{ borderWidth: 1, padding: 8, borderRadius: 4 }}
              >
                <FontAwesome6 name="paste" size={24} color="black" />
              </TouchableOpacity>
            </View>
  
            <PrimaryButton
              disableBtn={disableBtn}
              bgColor={buttonColor}
              onPress={handleJoin}
              text="Join now"
            />
          </View>
        </ScrollView>
  
        {/* <BottomSheet ref={sheetRef} index={1} snapPoints={snapPoints}>
          <BottomSheetScrollView
            contentContainerStyle={{ paddingHorizontal: 15, flex: 1 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: FontSize.size_xxl }}>
                Seek-meet waiting room
              </Text>
              <TouchableOpacity onPress={() => handleClosePress()}>
                <Entypo name="circle-with-cross" size={25} color="black" />
              </TouchableOpacity>
            </View>
  
            <View
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                flexDirection: "column",
                flexGrow: 1,
                marginVertical: 20,
              }}
            >
              <View style={{ marginVertical: 30, alignItems: "center" }}>
                <Image
                  source={require("../assets/logo.png")}
                  style={{ width: width * 0.2, height: width * 0.2 }}
                />
              </View>
  
              
  
  
              <Text style={{fontWeight:'700', lineHeight:25, fontSize:25, textAlign:'center'}}>
              Hey {userName},
              </Text>
              <Text style={{fontWeight:'700', lineHeight:25, fontSize:15, textAlign:'center'}}>
              Please wait, the meeting host will let you in soon.
              </Text>
  
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ transform: [{ scale: 2 }] }}>
                  <ActivityIndicator color={Color.darkGray} size="large" />
                </View>
              </View>
  
  
  
  
  
  
            </View>
          </BottomSheetScrollView>
        </BottomSheet> */}
  
        <TermAndCondition />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    scrollViewContainer: {
      justifyContent: "center",
      paddingHorizontal: width * 0.1,
      paddingVertical: height * 0.05,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: height * 0.05,
    },
    logo: {
      width: width * 0.4,
      height: width * 0.4,
    },
    description: {
      textAlign: "center",
      color: Color.textGray,
      marginBottom: height * 0.02,
    },
    inputContainer: {
      gap: height * 0.02,
    },
  });
  
  export default JoinMeetingScreen;