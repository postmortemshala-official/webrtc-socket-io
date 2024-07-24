// webRTCConfig.ts
export const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    // Add your TURN servers here if needed
  ];
  
  export const pcConfig: RTCConfiguration = {
    iceServers,
  };
  