import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import type { Chat, Message, User } from '@/pages/Index';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  users: User[];
}

export const ChatWindow = ({
  chat,
  messages,
  currentUserId,
  onSendMessage,
  users,
}: ChatWindowProps) => {
  const [messageText, setMessageText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSenderInfo = (senderId: string) => {
    return users.find((u) => u.id === senderId);
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-16 border-b border-border px-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-2xl">{chat.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{chat.name}</h2>
            {chat.type === 'direct' && chat.isOnline !== undefined && (
              <p className="text-xs text-muted-foreground">
                {chat.isOnline ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    онлайн
                  </span>
                ) : (
                  'не в сети'
                )}
              </p>
            )}
            {chat.type === 'group' && (
              <p className="text-xs text-muted-foreground">
                {chat.participants.length} участников
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Phone" size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Video" size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Search" size={20} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => {
            const isOwn = message.senderId === currentUserId;
            const sender = getSenderInfo(message.senderId);

            return (
              <div
                key={message.id}
                className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isOwn && chat.type === 'group' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-lg">
                      {sender?.avatar || '👤'}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                >
                  {!isOwn && chat.type === 'group' && (
                    <span className="text-xs text-primary font-medium mb-1 px-3">
                      {sender?.displayName || 'Пользователь'}
                    </span>
                  )}
                  
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-md break-words ${
                      isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1 px-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                    {isOwn && (
                      <Icon
                        name={message.isRead ? 'CheckCheck' : 'Check'}
                        size={14}
                        className={
                          message.isRead ? 'text-primary' : 'text-muted-foreground'
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4 bg-card">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Paperclip" size={20} />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Введите сообщение..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
            >
              <Icon name="Smile" size={20} />
            </Button>
          </div>

          <Button
            onClick={handleSend}
            size="icon"
            className="rounded-full"
            disabled={!messageText.trim()}
          >
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
