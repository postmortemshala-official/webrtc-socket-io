import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { mediaDevices, RTCPeerConnection, RTCView, MediaStream } from 'react-native-webrtc';
import { requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Color } from '../utils/globalstyles';
import Navigate from '../utils/enum';
import HelperFunctions from '../utils/HelperFunction';
import { database } from "../utils/firebaseConfig";
import { get, ref } from 'firebase/database';



const { width } = Dimensions.get("screen");

const MeetingRoomScreen = ({ navigation, route }: any) => {
  const { meeting_id } = route.params;
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [localStreamURL, setLocalStreamURL] = useState<string | null>(null);
  const peerConnection = useRef(new RTCPeerConnection());
  const [cameraOn, setCameraOn] = useState<boolean>(true);
  const [facing, setFacing] = useState<boolean>(true);
  const [statusMic, setStatusMic] = useState<boolean>(false);
  const [flashMode, setFlashMode] = useState<boolean>(false);
  const [rotation] = useState(new Animated.Value(0));
  const profileRef = useRef<View>(null);

  // get data from Firebase 
  const [data, setData] = useState<Object | any>({});

  const readUserData = async (meeting_id: string) => {
    try {
      // Create a reference to the data location
      const userRef = ref(database, `seek-meet/creator`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Find the data with the specific meeting_id
        const user = Object.values(data).find((user: any) => user.meet_id === meeting_id);
        if (user) {
          console.log('User data:', user);
          setData(user)
        } else {
          console.log('No user found with the given meeting_id');
        }
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error reading data:', error);
    }
  };





  // Start or restart the media stream
  const startStream = async (cameraType: boolean) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    const sourceId = cameraType ? 'user' : 'environment';
    const localStream = await mediaDevices.getUserMedia({
      video: { facingMode: sourceId },
      audio: !statusMic,
    });

    setStream(localStream);
    setLocalStreamURL(localStream.toURL());
    localStream.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream));
  };

  // Toggle camera facing
  const toggleCameraFacing = async () => {
    if (!cameraOn) {
      ToastAndroid.show("Please turn on the camera before switching.", ToastAndroid.SHORT);
      return;
    }
    setFacing(prev => !prev);
    await startStream(!facing);
  };

  // Toggle camera on/off
  const handleToggleCamera = async () => {
    setCameraOn(prev => !prev);
    if (cameraOn) {
      stream?.getTracks().forEach(track => track.stop());
      setStream(null);
    } else {
      await startStream(facing);
    }
  };

  // Toggle microphone state
  const toggleMic = () => {
    setStatusMic(prev => !prev);
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  // End call and navigate
  const toggleCall = () => {
    console.log("Call ended");
    navigation.navigate(Navigate.HOME_SCREEN);
  };

  // Toggle flash mode
  const toggleFlash = () => {
    console.log("Flash mode : ", flashMode);
    setFlashMode(prev => !prev);
  };

  // Copy meeting ID to clipboard
  const copyToClipboard = async () => {
    // Clipboard.setString('meeting-id');
    
    ToastAndroid.show(`Meeting ID copied : ${meeting_id}`, ToastAndroid.SHORT);
  };

  // Function to toggle between profile container and main stream
  const switchToMainStream = () => {
    if (profileRef.current) {
      profileRef.current.setNativeProps({ style: { display: 'none' } });
    }
  };


  const timeCounter = HelperFunctions.TimeCounter()

  console.log("timeCounter ==> ", timeCounter);




  // Handle WebRTC setup
  useEffect(() => {
    const startWebRTC = async () => {
      const hasPermissions = await HelperFunctions.requestPermissions();
      if (!hasPermissions) {
        console.log('Permissions not granted');
        return;
      }

      await startStream(facing);

      peerConnection.current.onicecandidate = (event: any) => {
        if (event.candidate) {
          // Handle ICE candidates
        }
      };

      peerConnection.current.ontrack = (event: any) => {
        // remote stream 
        // Handle remote stream
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      // Send the offer to the remote peer
    };

    startWebRTC();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
      peerConnection.current.close();
    };
  }, [facing]);

  // Read Database using function 
  useEffect(() => {
    readUserData(meeting_id)
  }, []);



  return (
    <View style={{ flex: 1, position: "relative" }}>
      <RTCView streamURL={localStreamURL || ''} objectFit={'cover'} style={styles.rtcView} />

      {!cameraOn && statusMic && (
        <View style={styles.closedCameraContainer}>
          <Feather name={"video-off"} size={28} style={[styles.icon, { width: 50, height: 50 }]} color={Color.darkGray} />
          <Text style={styles.closedCameraText}>Camera-off</Text>
        </View>
      )}

      {cameraOn && !statusMic && (
        <View style={[styles.closedCameraContainer, { backgroundColor: 'transparent' }]}>
          <Feather name={"mic-off"} size={28} style={[styles.icon, { width: 50, height: 50 }]} color={Color.darkGray} />
          <Text style={styles.closedCameraText}>Microphone-off</Text>
        </View>
      )}

      {!cameraOn && !statusMic && (
        <View style={styles.closedCameraContainer}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Feather name={"video-off"} size={28} style={[styles.icon, { width: 50, height: 50 }]} color={Color.darkGray} />
            <Feather name={"mic-off"} size={28} style={[styles.icon, { width: 50, height: 50 }]} color={Color.darkGray} />
          </View>
          <Text style={styles.closedCameraText}>{`Camera and Microphone\nare off`}</Text>
        </View>
      )}

      <TouchableOpacity style={{ marginRight: 13 }} onPress={switchToMainStream}>
        <View style={styles.profileContainer} ref={profileRef}>
          {localStreamURL ? (
            <RTCView streamURL={localStreamURL} style={styles.localStream} />
          ) : (
            <FontAwesome5 name="user-astronaut" size={115} color="black" />
          )}
        </View>
      </TouchableOpacity>

      <View style={{ position: "absolute", width: "100%", height: "100%" }}>
        <View style={styles.topOptions}>
          <View>
            <Text style={styles.infoText}>Created By: <Text style={styles.infoTextBold}>{data.name}</Text></Text>
            <Text style={styles.infoText}>Meet Id: <Text style={styles.infoTextBold}>{data.meet_id}</Text></Text>
          </View>

          <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>

            <Text style={{ color: Color.white, width: '31%',textAlign:'right' }}>{timeCounter}</Text>

            <TouchableOpacity onPress={toggleFlash}>
              <MaterialIcons name={flashMode ? "flash-off" : "flash-on"} size={24} color={Color.white} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCameraFacing} disabled={!cameraOn}>
              <Animated.View  >
                <Entypo name="cycle" size={24} color={Color.white} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <TouchableOpacity style={styles.button} onPress={toggleMic}>
              <Feather name={statusMic ? "mic" : "mic-off"} size={24} style={styles.icon} color={statusMic ? Color.white : Color.red} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleToggleCamera}>
              <Feather name={cameraOn ? "camera" : "camera-off"} style={styles.icon} size={24} color={cameraOn ? Color.white : Color.red} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={toggleCall}>
            <Ionicons name="call-outline" size={24} style={[styles.icon, { width: 100, backgroundColor: Color.red }]} color={Color.white} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", flex: 1 }}>
            <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
              <MaterialIcons name="content-copy" size={24} style={styles.icon} color={Color.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => { }}>
              <MaterialCommunityIcons name="dots-vertical" size={24} style={styles.icon} color={Color.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rtcView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  localStream: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  closedCameraContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  closedCameraText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Color.black,
  },
  profileContainer: {
    position: "absolute",
    bottom: 80,
    right: 0,
    borderWidth: 1,
    width: 190,
    height: 120,
    borderRadius: 15,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    position: 'absolute',
    backgroundColor: "transparent",
    marginVertical: 25,
    bottom: 0
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  icon: {
    backgroundColor: Color.darkDeepGray,
    verticalAlign: "middle",
    textAlign: "center",
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  topOptions: {
    position: "absolute",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: 'row',
    marginTop: width * 0.07,
    paddingHorizontal: width * 0.02,
  },
  infoText: {
    color: Color.gray,
    fontSize: width * 0.05,
    fontWeight: '300',
  },
  infoTextBold: {
    color: Color.gray,
    fontSize: width * 0.05,
    fontWeight: '500',
  },
});

export default MeetingRoomScreen;
