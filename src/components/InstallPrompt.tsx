import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { usePWA } from '@/hooks/usePWA';

export const InstallPrompt = () => {
  const { isInstallable, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    setDismissed(isDismissed);

    if (isInstallable && !isDismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || !isInstallable || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center animate-fade-in md:left-auto md:right-4 md:w-96">
      <Card className="p-4 shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon name="Download" size={24} className="text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">Установить приложение</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Установите мессенджер на устройство для быстрого доступа
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="flex-1"
              >
                <Icon name="Download" size={16} className="mr-2" />
                Установить
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
              >
                Позже
              </Button>
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 flex-shrink-0"
            onClick={handleDismiss}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
};
