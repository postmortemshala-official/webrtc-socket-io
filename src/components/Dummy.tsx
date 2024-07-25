import {Button, Text, View} from 'react-native';
import {Color} from '../utils/globalstyles';

import {
	ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';
import {useEffect, useState} from 'react';

const Dummy = () => {
  const [localStreamURL, setLocalStreamURL] = useState<string | null | any>(
    null,
  );
  const [cameraCount, setCameraCount] = useState(0)
  const [localMediaStream, setLocalMediaStream] = useState({})
  // Defining Media Constraints
  let mediaConstraints = {
    audio: true,
    video: {
      frameRate: 30,
      facingMode: 'user',
    },
  };

  // const initialize = async () => {

  const DeviceCameraFind = async () => {
    let cameraCount = 0;

    try {
      const devices = await mediaDevices.enumerateDevices();

      devices.map((device: any) => {
        if (device.kind != 'videoinput') {
          return;
        }

        cameraCount = cameraCount + 1;
      });
    } catch (err) {
      console.log('Device Error ==> ', err);
    }

    console.log('Camera Count ==> ', cameraCount);
    setCameraCount(cameraCount)
  };

  // Getting a Media Stream using getUserMedia
  const StartLocalStreaming = async () => {
    let localMediaStream: any;
    let isVoiceOnly = false;

    try {
      const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

      if (isVoiceOnly) {
        let videoTrack = await mediaStream.getVideoTracks()[0];
        videoTrack.enabled = false;
      }

      localMediaStream = mediaStream;
      setLocalMediaStream(localMediaStream)
      setLocalStreamURL(localMediaStream.toURL());
    } catch (err) {
      console.log('Media Stream using getUserMedia Error ==> ', err);
    }

    console.log('Loading Stream ==> ', localMediaStream);
  };

 
// //  Toogle Mic 
const ToogleMic = async()=>{
  let isMuted = false;

  try {
    const audioTrack = await localMediaStream.getAudioTracks()[ 0 ];
    audioTrack.enabled = !audioTrack.enabled;
  
    isMuted = !isMuted;
    console.log("Mic==> ", isMuted);
    
  } catch( err ) {
    console.log("Error Toogle Mic ==> ", err);
  };
}

// Switch Camera 
const ToogleCamera=async()=>{
  let isFrontCam = true;

try {
	// Taken from above, we don't want to flip if we don't have another camera.
	if ( cameraCount < 2 ) { return; };

	const videoTrack = await localMediaStream.getVideoTracks()[ 0 ];
	videoTrack._switchCamera();

	isFrontCam = !isFrontCam;
} catch( err ) {
	console.log("Error Toogle Camera ==> ", err);
};
}

  useEffect(() => {
    DeviceCameraFind();
  }, []);

  return (
    <>
      <Text style={{color: Color.black, textAlign: 'center', fontSize: 25}}>
        Test Mode
      </Text>

      <View>
        <Text style={{color: Color.black, textAlign: 'center', fontSize: 25}}>
          Local Stream
        </Text>

        <Button
          title="Start Stream"
          onPress={() => {
            StartLocalStreaming();
          }}
        />
        {localStreamURL && (
          <>
            <RTCView
              streamURL={localStreamURL}
              objectFit={'cover'}
              mirror={true}
              style={{width: 150, height: 150}}
            />
            
          <Button
            title="Camera Toogle"
            onPress={() => {
              ToogleCamera();
            }}
          />
          <Button
            title="Mic Toogle"
            onPress={() => {
              ToogleMic();
            }}
          />
           
          </>
        )}
      </View>
    </>
  );
};

export default Dummy;
