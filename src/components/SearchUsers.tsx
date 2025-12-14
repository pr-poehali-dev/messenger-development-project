import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import type { User } from '@/pages/Index';

interface SearchUsersProps {
  users: User[];
  currentUserId: string;
  onClose: () => void;
  onStartChat: (userId: string) => void;
  onCreateGroup: (name: string, participantIds: string[]) => void;
}

export const SearchUsers = ({
  users,
  currentUserId,
  onClose,
  onStartChat,
  onCreateGroup,
}: SearchUsersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');

  const searchTerm = searchQuery.toLowerCase().replace('@', '');
  
  const filteredUsers = users
    .filter((user) => user.id !== currentUserId)
    .filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.displayName.toLowerCase().includes(searchTerm)
    );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      onCreateGroup(groupName.trim(), selectedUsers);
      onClose();
    }
  };

  const formatLastSeen = (date: Date | undefined) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `был(а) ${minutes} мин назад`;
    if (hours < 24) return `был(а) ${hours} ч назад`;
    return `был(а) ${date.toLocaleDateString('ru-RU')}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 max-h-[80vh]">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Icon name="UserPlus" size={24} />
            Новый чат
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="search" className="flex-1">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="search" className="flex-1">
              Поиск пользователей
            </TabsTrigger>
            <TabsTrigger value="group" className="flex-1">
              Создать группу
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="m-0">
            <div className="p-4 border-b">
              <div className="relative">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Найти пользователя (@никнейм или имя)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Icon name="Users" size={48} className="mx-auto mb-2 opacity-20" />
                  {searchQuery.trim() ? (
                    <div>
                      <p className="font-medium mb-1">Пользователь не найден</p>
                      <p className="text-sm">Попробуйте ввести @{searchQuery.replace('@', '')} или другой никнейм</p>
                    </div>
                  ) : (
                    <p>Начните вводить никнейм для поиска</p>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => onStartChat(user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-2xl">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">
                              {user.displayName}
                            </span>
                            {user.isPremium && (
                              <Badge
                                variant="default"
                                className="bg-gradient-to-r from-yellow-500 to-amber-500 h-5 px-1.5"
                              >
                                <Icon name="Crown" size={10} />
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            @{user.username}
                          </p>
                          {!user.isOnline && user.lastSeen && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatLastSeen(user.lastSeen)}
                            </p>
                          )}
                        </div>

                        <Icon name="MessageCircle" size={20} className="text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="group" className="m-0">
            <div className="p-4 space-y-4 border-b">
              <Input
                placeholder="Название группы"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <div className="relative">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Найти по @никнейму..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Users" size={16} />
                  Выбрано: {selectedUsers.length}
                </div>
              )}
            </div>

            <ScrollArea className="h-[300px]">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Icon name="Users" size={48} className="mx-auto mb-2 opacity-20" />
                  {searchQuery.trim() ? (
                    <div>
                      <p className="font-medium mb-1">Пользователь не найден</p>
                      <p className="text-sm">Проверьте правильность никнейма</p>
                    </div>
                  ) : (
                    <p>Введите никнейм для поиска</p>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />

                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xl">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">
                              {user.displayName}
                            </span>
                            {user.isPremium && (
                              <Icon name="Crown" size={12} className="text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t">
              <Button
                className="w-full"
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedUsers.length === 0}
              >
                <Icon name="Plus" size={18} className="mr-2" />
                Создать группу
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};