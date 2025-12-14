import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { User } from '@/pages/Index';

interface OutgoingCallProps {
  recipient: User;
  isVideo: boolean;
  onCancel: () => void;
}

export const OutgoingCall = ({
  recipient,
  isVideo,
  onCancel,
}: OutgoingCallProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center">
        <Avatar className="h-32 w-32 mx-auto mb-6 animate-pulse">
          <AvatarFallback className="text-6xl bg-primary/20 text-white">
            {recipient.avatar}
          </AvatarFallback>
        </Avatar>

        <h2 className="text-3xl font-semibold text-white mb-2">
          {recipient.displayName}
        </h2>
        
        <div className="flex items-center justify-center gap-2 text-white/70 mb-8">
          <Icon name={isVideo ? 'Video' : 'Phone'} size={20} />
          <p className="text-lg">Звоним...</p>
        </div>

        <div className="flex gap-3 animate-pulse">
          <div className="w-3 h-3 bg-white/50 rounded-full" />
          <div className="w-3 h-3 bg-white/50 rounded-full animation-delay-150" />
          <div className="w-3 h-3 bg-white/50 rounded-full animation-delay-300" />
        </div>
      </div>

      <div className="absolute bottom-8">
        <Button
          size="lg"
          variant="destructive"
          className="rounded-full h-16 w-16"
          onClick={onCancel}
        >
          <Icon name="PhoneOff" size={28} />
        </Button>
      </div>
    </div>
  );
};
