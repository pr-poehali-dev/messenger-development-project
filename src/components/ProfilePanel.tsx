import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import type { User } from '@/pages/Index';

interface ProfilePanelProps {
  user: User;
  onClose: () => void;
}

export const ProfilePanel = ({ user, onClose }: ProfilePanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0">
        <div className="relative">
          <div
            className="h-32 w-full"
            style={{
              background: user.banner || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {isEditing && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
              >
                <Icon name="Camera" size={16} className="mr-2" />
                Изменить баннер
              </Button>
            )}
          </div>

          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarFallback className="text-5xl bg-card">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                >
                  <Icon name="Camera" size={16} />
                </Button>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <ScrollArea className="max-h-[500px]">
          <div className="p-6 pt-16 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                {isEditing ? (
                  <>
                    <Input
                      value={editedUser.displayName}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, displayName: e.target.value })
                      }
                      placeholder="Имя"
                      className="font-semibold text-xl mb-2"
                    />
                    <Input
                      value={editedUser.username}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, username: e.target.value })
                      }
                      placeholder="@username"
                      className="text-muted-foreground"
                    />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-semibold">{user.displayName}</h2>
                      {user.isPremium && (
                        <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-amber-500">
                          <Icon name="Crown" size={12} className="mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </>
                )}
              </div>

              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Icon name="Pencil" size={16} className="mr-2" />
                  Изменить
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">О себе</label>
              {isEditing ? (
                <Textarea
                  value={editedUser.bio}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, bio: e.target.value })
                  }
                  placeholder="Расскажите о себе..."
                  rows={3}
                />
              ) : (
                <p className="text-sm">
                  {user.bio || 'Информация отсутствует'}
                </p>
              )}
            </div>

            {!user.isPremium && (
              <div className="border border-primary rounded-lg p-4 bg-primary/5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Icon name="Crown" size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Получите Premium</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Эксклюзивные возможности, больше места для файлов и специальный значок
                    </p>
                    <Button size="sm" className="w-full">
                      Купить Premium за 199₽/мес
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Настройки</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <Icon name="User" size={18} className="mr-3" />
                  Мой аккаунт
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Icon name="Bell" size={18} className="mr-3" />
                  Уведомления
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Icon name="Lock" size={18} className="mr-3" />
                  Приватность
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Icon name="Palette" size={18} className="mr-3" />
                  Внешний вид
                </Button>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditedUser(user);
                    setIsEditing(false);
                  }}
                >
                  Отмена
                </Button>
                <Button className="flex-1" onClick={handleSave}>
                  Сохранить
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
