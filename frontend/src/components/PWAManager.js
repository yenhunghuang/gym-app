import React, { useState, useEffect } from 'react';

const PWAManager = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 檢查是否已安裝PWA
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkIfInstalled();

    // 監聽安裝提示事件
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      
      // 延遲顯示安裝提示（避免打擾用戶）
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 10000); // 10秒後顯示
    };

    // 監聽安裝完成事件
    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setShowInstallPrompt(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
      
      // 顯示安裝成功消息
      showToast('應用已成功安裝到主屏幕！', 'success');
    };

    // 監聽網路狀態變化
    const handleOnline = () => {
      console.log('PWA: Back online');
      setIsOnline(true);
      setShowOfflineMessage(false);
      showToast('網路連接已恢復', 'success');
    };

    const handleOffline = () => {
      console.log('PWA: Gone offline');
      setIsOnline(false);
      setShowOfflineMessage(true);
      showToast('網路連接已斷開，將使用離線模式', 'warning');
    };

    // Service Worker消息監聽
    const handleSWMessage = (event) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        showToast(event.data.message, 'success');
      }
    };

    // 註冊事件監聽器
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    navigator.serviceWorker?.addEventListener('message', handleSWMessage);

    // 清理函數
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, [isInstalled]);

  // 註冊Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('PWA: Service Worker registered:', registration);
          
          // 檢查更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showToast('新版本可用，請重新整理頁面', 'info');
              }
            });
          });
        } catch (error) {
          console.error('PWA: Service Worker registration failed:', error);
        }
      });
    }
  }, []);

  // 處理安裝應用
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      showToast('安裝功能暫時不可用', 'warning');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        showToast('正在安裝應用...', 'info');
      } else {
        console.log('PWA: User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('PWA: Error during install:', error);
      showToast('安裝過程中發生錯誤', 'error');
    }
  };

  // 顯示通知
  const showToast = (message, type = 'info') => {
    // 創建toast通知
    const toast = document.createElement('div');
    toast.className = `pwa-toast pwa-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // 顯示動畫
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 自動隱藏
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return (
    <>
      {/* 安裝提示 */}
      {showInstallPrompt && !isInstalled && (
        <div className="pwa-install-prompt">
          <div className="pwa-install-content">
            <div className="pwa-install-icon">📱</div>
            <div className="pwa-install-text">
              <h3>安裝GymApp</h3>
              <p>將應用安裝到主屏幕，享受更好的使用體驗</p>
            </div>
            <div className="pwa-install-actions">
              <button 
                className="btn btn-primary" 
                onClick={handleInstallClick}
              >
                安裝
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowInstallPrompt(false)}
              >
                稍後
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 離線狀態指示 */}
      {showOfflineMessage && (
        <div className="pwa-offline-banner">
          <span className="pwa-offline-icon">⚠️</span>
          <span className="pwa-offline-text">
            離線模式 - 部分功能可能受限
          </span>
          <button 
            className="pwa-offline-close"
            onClick={() => setShowOfflineMessage(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* 網路狀態指示器 */}
      <div className={`pwa-connection-indicator ${isOnline ? 'online' : 'offline'}`}>
        <span className="pwa-connection-dot"></span>
      </div>
    </>
  );
};

export default PWAManager;