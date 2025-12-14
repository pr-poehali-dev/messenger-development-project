import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import type { User } from '@/pages/Index';

interface IncomingCallProps {
  caller: User;
  isVideo: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCall = ({
  caller,
  isVideo,
  onAccept,
  onDecline,
}: IncomingCallProps) => {
  const [isRinging, setIsRinging] = useState(true);

  useEffect(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
    audio.loop = true;
    
    if (isRinging) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isRinging]);

  const handleAccept = () => {
    setIsRinging(false);
    onAccept();
  };

  const handleDecline = () => {
    setIsRinging(false);
    onDecline();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-card rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="mb-6">
          <Avatar className="h-24 w-24 mx-auto mb-4 animate-pulse">
            <AvatarFallback className="text-5xl bg-primary/20">
              {caller.avatar}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-2xl font-semibold mb-2">{caller.displayName}</h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Icon name={isVideo ? 'Video' : 'Phone'} size={18} />
            {isVideo ? 'Видеозвонок' : 'Голосовой звонок'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-4">
          <Button
            size="lg"
            variant="destructive"
            className="rounded-full h-16 w-16"
            onClick={handleDecline}
          >
            <Icon name="PhoneOff" size={28} />
          </Button>

          <Button
            size="lg"
            className="rounded-full h-20 w-20 bg-green-500 hover:bg-green-600"
            onClick={handleAccept}
          >
            <Icon name={isVideo ? 'Video' : 'Phone'} size={32} />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Входящий звонок...
        </p>
      </div>
    </div>
  );
};
