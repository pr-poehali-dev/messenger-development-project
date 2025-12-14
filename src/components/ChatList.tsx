import { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import type { Chat, User } from '@/pages/Index';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onShowProfile: () => void;
  onShowSearch: () => void;
  onPinChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onClearChat: (chatId: string) => void;
  currentUser: User;
}

export const ChatList = ({
  chats,
  selectedChatId,
  onSelectChat,
  onShowProfile,
  onShowSearch,
  onPinChat,
  onDeleteChat,
  onClearChat,
  currentUser,
}: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isInstallable, installApp } = usePWA();

  const filteredChats = chats
    .filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      const aTime = a.lastMessage?.timestamp.getTime() || 0;
      const bTime = b.lastMessage?.timestamp.getTime() || 0;
      return bTime - aTime;
    });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин`;
    if (hours < 24) return `${hours} ч`;
    if (days < 7) return `${days} дн`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="w-80 border-r border-border flex flex-col bg-card">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onShowProfile}
            className="rounded-full"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-2xl">
                {currentUser.avatar}
              </AvatarFallback>
            </Avatar>
          </Button>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowSearch}
              className="rounded-full"
            >
              <Icon name="UserPlus" size={20} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onShowSearch}>
                  <Icon name="Users" size={16} className="mr-2" />
                  Создать группу
                </DropdownMenuItem>
                {isInstallable && (
                  <DropdownMenuItem onClick={installApp}>
                    <Icon name="Download" size={16} className="mr-2" />
                    Установить приложение
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Icon name="Settings" size={16} className="mr-2" />
                  Настройки
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative">
          <Icon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Поиск чатов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Icon name="MessageSquare" size={48} className="mx-auto mb-2 opacity-20" />
            <p>Нет чатов</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors relative ${
                  selectedChatId === chat.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-2xl">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{chat.name}</span>
                      {chat.isPinned && (
                        <Icon name="Pin" size={14} className="text-primary" />
                      )}
                      {chat.type === 'group' && (
                        <Icon name="Users" size={14} className="text-muted-foreground" />
                      )}
                    </div>
                    
                    {chat.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage.text}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {chat.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(chat.lastMessage.timestamp)}
                      </span>
                    )}
                    {chat.unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="rounded-full h-5 min-w-5 px-1.5"
                      >
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon name="MoreVertical" size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPinChat(chat.id)}>
                      <Icon name="Pin" size={16} className="mr-2" />
                      {chat.isPinned ? 'Открепить' : 'Закрепить'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onClearChat(chat.id)}>
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Очистить историю
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteChat(chat.id)}
                      className="text-destructive"
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Удалить чат
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};