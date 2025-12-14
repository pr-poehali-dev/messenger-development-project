import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import type { User } from '@/pages/Index';

interface CallWindowProps {
  user: User;
  isVideo: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  callDuration: number;
}

export const CallWindow = ({
  user,
  isVideo,
  isMuted,
  isVideoEnabled,
  localStream,
  remoteStream,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  callDuration,
}: CallWindowProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-50 flex flex-col">
      <div className="flex-1 relative">
        {isVideo && remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-6">
                <AvatarFallback className="text-6xl bg-primary/20 text-white">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {user.displayName}
              </h2>
              <p className="text-white/70">{formatDuration(callDuration)}</p>
            </div>
          </div>
        )}

        {isVideo && localStream && (
          <div className="absolute top-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
            {isVideoEnabled ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <Icon name="VideoOff" size={32} className="text-white/50" />
              </div>
            )}
          </div>
        )}

        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-white font-medium">{formatDuration(callDuration)}</p>
        </div>
      </div>

      <div className="p-8 flex items-center justify-center gap-4">
        {isVideo && (
          <Button
            size="lg"
            variant={isVideoEnabled ? 'secondary' : 'destructive'}
            className="rounded-full h-14 w-14"
            onClick={onToggleVideo}
          >
            <Icon name={isVideoEnabled ? 'Video' : 'VideoOff'} size={24} />
          </Button>
        )}

        <Button
          size="lg"
          variant={isMuted ? 'destructive' : 'secondary'}
          className="rounded-full h-14 w-14"
          onClick={onToggleMute}
        >
          <Icon name={isMuted ? 'MicOff' : 'Mic'} size={24} />
        </Button>

        <Button
          size="lg"
          variant="destructive"
          className="rounded-full h-16 w-16"
          onClick={onEndCall}
        >
          <Icon name="PhoneOff" size={28} />
        </Button>
      </div>
    </div>
  );
};
