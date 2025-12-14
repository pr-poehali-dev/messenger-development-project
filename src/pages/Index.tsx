import { useState, useEffect } from 'react';
import { ChatList } from '@/components/ChatList';
import { ChatWindow } from '@/components/ChatWindow';
import { ProfilePanel } from '@/components/ProfilePanel';
import { SearchUsers } from '@/components/SearchUsers';
import { IncomingCall } from '@/components/IncomingCall';
import { OutgoingCall } from '@/components/OutgoingCall';
import { CallWindow } from '@/components/CallWindow';
import { useWebRTC } from '@/hooks/useWebRTC';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner?: string;
  bio?: string;
  isPremium: boolean;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatar: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isOnline?: boolean;
}

const Index = () => {
  const [currentUser] = useState<User>({
    id: 'user1',
    username: 'myusername',
    displayName: 'Мой профиль',
    avatar: '👤',
    banner: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bio: 'Люблю общаться с друзьями',
    isPremium: true,
    isOnline: true,
  });

  const [users] = useState<User[]>([
    {
      id: 'user2',
      username: 'alice',
      displayName: 'Алиса',
      avatar: '👩',
      isPremium: true,
      isOnline: true,
    },
    {
      id: 'user3',
      username: 'bob',
      displayName: 'Боб',
      avatar: '👨',
      isPremium: false,
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 'user4',
      username: 'charlie',
      displayName: 'Чарли',
      avatar: '🧑',
      isPremium: false,
      isOnline: true,
    },
  ]);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'chat1',
      type: 'direct',
      name: 'Алиса',
      avatar: '👩',
      participants: ['user1', 'user2'],
      lastMessage: {
        id: 'msg1',
        chatId: 'chat1',
        senderId: 'user2',
        text: 'Привет! Как дела?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isRead: false,
      },
      unreadCount: 2,
      isPinned: true,
      isOnline: true,
    },
    {
      id: 'chat2',
      type: 'group',
      name: 'Рабочий чат',
      avatar: '💼',
      participants: ['user1', 'user2', 'user3', 'user4'],
      lastMessage: {
        id: 'msg2',
        chatId: 'chat2',
        senderId: 'user3',
        text: 'Встреча в 15:00',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true,
      },
      unreadCount: 0,
      isPinned: false,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg1-1',
      chatId: 'chat1',
      senderId: 'user2',
      text: 'Привет! Как дела?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: true,
    },
    {
      id: 'msg1-2',
      chatId: 'chat1',
      senderId: 'user1',
      text: 'Отлично, спасибо! А у тебя?',
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      isRead: true,
    },
    {
      id: 'msg1-3',
      chatId: 'chat1',
      senderId: 'user2',
      text: 'Тоже всё хорошо! Завтра встретимся?',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      isRead: false,
    },
  ]);

  const [selectedChat, setSelectedChat] = useState<string | null>('chat1');
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ userId: string; isVideo: boolean } | null>(null);
  const [outgoingCall, setOutgoingCall] = useState<{ userId: string; isVideo: boolean } | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const {
    isCallActive,
    isVideoEnabled,
    isMuted,
    remoteUserId,
    localStream,
    remoteStream,
    startCall,
    answerCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useWebRTC({
    onCallEnded: () => {
      setIncomingCall(null);
      setOutgoingCall(null);
      setCallDuration(0);
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleSendMessage = (text: string) => {
    if (!selectedChat || !text.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: selectedChat,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: new Date(),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat
          ? { ...chat, lastMessage: newMessage }
          : chat
      )
    );
  };

  const handlePinChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      )
    );
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (selectedChat === chatId) {
      setSelectedChat(null);
    }
  };

  const handleClearChat = (chatId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.chatId !== chatId));
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: undefined, unreadCount: 0 }
          : chat
      )
    );
  };

  const handleCreateGroup = (name: string, participantIds: string[]) => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      type: 'group',
      name,
      avatar: '👥',
      participants: [currentUser.id, ...participantIds],
      unreadCount: 0,
      isPinned: false,
    };
    setChats((prev) => [newChat, ...prev]);
  };

  const handleStartDirectChat = (userId: string) => {
    const existingChat = chats.find(
      (chat) =>
        chat.type === 'direct' &&
        chat.participants.includes(userId) &&
        chat.participants.includes(currentUser.id)
    );

    if (existingChat) {
      setSelectedChat(existingChat.id);
      setShowSearch(false);
      return;
    }

    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      type: 'direct',
      name: user.displayName,
      avatar: user.avatar,
      participants: [currentUser.id, userId],
      unreadCount: 0,
      isPinned: false,
      isOnline: user.isOnline,
    };

    setChats((prev) => [newChat, ...prev]);
    setSelectedChat(newChat.id);
    setShowSearch(false);
  };

  const handleStartCall = async (userId: string, isVideo: boolean) => {
    setOutgoingCall({ userId, isVideo });
    try {
      await startCall(userId, isVideo);
      setTimeout(() => {
        setOutgoingCall(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to start call:', error);
      setOutgoingCall(null);
    }
  };

  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    try {
      await answerCall(incomingCall.userId, incomingCall.isVideo);
      setIncomingCall(null);
    } catch (error) {
      console.error('Failed to answer call:', error);
      setIncomingCall(null);
    }
  };

  const handleDeclineCall = () => {
    setIncomingCall(null);
  };

  const handleCancelOutgoingCall = () => {
    setOutgoingCall(null);
    endCall();
  };

  const currentChatMessages = messages.filter(
    (msg) => msg.chatId === selectedChat
  );

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ChatList
        chats={chats}
        selectedChatId={selectedChat}
        onSelectChat={setSelectedChat}
        onShowProfile={() => setShowProfile(true)}
        onShowSearch={() => setShowSearch(true)}
        onPinChat={handlePinChat}
        onDeleteChat={handleDeleteChat}
        onClearChat={handleClearChat}
        currentUser={currentUser}
      />

      {selectedChat && selectedChatData ? (
        <ChatWindow
          chat={selectedChatData}
          messages={currentChatMessages}
          currentUserId={currentUser.id}
          onSendMessage={handleSendMessage}
          users={users}
          onStartCall={handleStartCall}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">Выберите чат для начала общения</p>
          </div>
        </div>
      )}

      {showProfile && (
        <ProfilePanel
          user={currentUser}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showSearch && (
        <SearchUsers
          users={users}
          currentUserId={currentUser.id}
          onClose={() => setShowSearch(false)}
          onStartChat={handleStartDirectChat}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {incomingCall && (
        <IncomingCall
          caller={users.find((u) => u.id === incomingCall.userId)!}
          isVideo={incomingCall.isVideo}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}

      {outgoingCall && !isCallActive && (
        <OutgoingCall
          recipient={users.find((u) => u.id === outgoingCall.userId)!}
          isVideo={outgoingCall.isVideo}
          onCancel={handleCancelOutgoingCall}
        />
      )}

      {isCallActive && remoteUserId && (
        <CallWindow
          user={users.find((u) => u.id === remoteUserId)!}
          isVideo={isVideoEnabled}
          isMuted={isMuted}
          isVideoEnabled={isVideoEnabled}
          localStream={localStream}
          remoteStream={remoteStream}
          onEndCall={endCall}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          callDuration={callDuration}
        />
      )}
    </div>
  );
};

export default Index;