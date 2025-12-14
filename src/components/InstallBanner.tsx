import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { usePWA } from '@/hooks/usePWA';

export const InstallBanner = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('install-banner-dismissed') === 'true';
    
    if (isInstallable && !isDismissed && !isInstalled) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowBanner(false);
      localStorage.setItem('install-banner-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('install-banner-dismissed', 'true');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-primary text-primary-foreground shadow-lg animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Icon name="Download" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm md:text-base">
                Установить мессенджер
              </h3>
              <p className="text-xs md:text-sm opacity-90 truncate">
                Быстрый доступ с главного экрана
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleInstall}
              className="whitespace-nowrap"
            >
              <Icon name="Download" size={16} className="mr-1 md:mr-2" />
              <span className="hidden md:inline">Установить</span>
              <span className="md:hidden">ОК</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-primary-foreground hover:bg-white/10"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
