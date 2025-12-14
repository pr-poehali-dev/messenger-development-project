import { useState, useRef, useEffect } from 'react';

interface UseWebRTCProps {
  onIncomingCall?: (callerId: string, isVideo: boolean) => void;
  onCallEnded?: () => void;
}

export const useWebRTC = ({ onIncomingCall, onCallEnded }: UseWebRTCProps = {}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const startCall = async (userId: string, isVideo: boolean) => {
    try {
      const constraints = {
        audio: true,
        video: isVideo ? { width: 1280, height: 720 } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setIsCallActive(true);
      setIsVideoEnabled(isVideo);
      setRemoteUserId(userId);

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0];
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('ICE candidate:', event.candidate);
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      return { stream, peerConnection, offer };
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  };

  const answerCall = async (userId: string, isVideo: boolean, offer?: RTCSessionDescriptionInit) => {
    try {
      const constraints = {
        audio: true,
        video: isVideo ? { width: 1280, height: 720 } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setIsCallActive(true);
      setIsVideoEnabled(isVideo);
      setRemoteUserId(userId);

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0];
      };

      if (offer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        return { stream, peerConnection, answer };
      }

      return { stream, peerConnection };
    } catch (error) {
      console.error('Error answering call:', error);
      throw error;
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    remoteStreamRef.current = null;
    setIsCallActive(false);
    setIsVideoEnabled(false);
    setIsMuted(false);
    setRemoteUserId(null);

    if (onCallEnded) {
      onCallEnded();
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  return {
    isCallActive,
    isVideoEnabled,
    isMuted,
    remoteUserId,
    localStream: localStreamRef.current,
    remoteStream: remoteStreamRef.current,
    startCall,
    answerCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
};
