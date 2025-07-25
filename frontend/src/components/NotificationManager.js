import React, { useState, useEffect } from 'react';


const NotificationManager = () => {
  const [permission, setPermission] = useState('default');
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // 檢查瀏覽器支持
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('This browser does not support notifications');
      return;
    }

    // 檢查當前權限狀態
    setPermission(Notification.permission);

    // 如果權限是default，延遲顯示提示
    if (Notification.permission === 'default') {
      setTimeout(() => {
        setShowPermissionPrompt(true);
      }, 30000); // 30秒後顯示
    }

    // 初始化推送訂閱
    initializePushSubscription();

    // 設置定期提醒檢查
    setupReminderSchedule();

    // 監聽Service Worker消息
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
    };
  }, []);

  const initializePushSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setSubscription(existingSubscription);
        console.log('Existing push subscription found');
      }
    } catch (error) {
      console.error('Error initializing push subscription:', error);
    }
  };

  const handleSWMessage = (event) => {
    if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
      // 處理通知點擊
      console.log('Notification clicked:', event.data);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      setShowPermissionPrompt(false);

      if (permission === 'granted') {
        showLocalNotification('通知已啟用', '我們會在適當時候提醒你進行訓練！');
        await subscribeToPush();
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || 'YOUR_VAPID_PUBLIC_KEY')
      });

      setSubscription(subscription);
      
      // 這裡應該將訂閱發送到後端服務器
      console.log('Push subscription:', subscription);
      
      // await sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  };

  const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const showLocalNotification = (title, body, options = {}) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'workout-reminder',
        renotify: true,
        requireInteraction: false,
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // 自動關閉通知
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  };

  const setupReminderSchedule = () => {
    // 檢查是否需要訓練提醒
    const checkWorkoutReminder = () => {
      const lastWorkout = localStorage.getItem('lastWorkoutDate');
      const now = new Date();
      
      if (lastWorkout) {
        const lastDate = new Date(lastWorkout);
        const daysSinceLastWorkout = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        
        // 如果超過2天沒有訓練，發送提醒
        if (daysSinceLastWorkout >= 2 && permission === 'granted') {
          showLocalNotification(
            '訓練提醒 💪',
            `你已經${daysSinceLastWorkout}天沒有訓練了，是時候重新開始了！`,
            {
              actions: [
                {
                  action: 'workout',
                  title: '開始訓練'
                },
                {
                  action: 'later',
                  title: '稍後提醒'
                }
              ]
            }
          );
        }
      }
    };

    // 每天檢查一次
    const reminderInterval = setInterval(checkWorkoutReminder, 24 * 60 * 60 * 1000);
    
    // 立即檢查一次
    checkWorkoutReminder();

    return () => clearInterval(reminderInterval);
  };

  const scheduleMotivationalNotification = () => {
    if (permission !== 'granted') return;

    const motivationalMessages = [
      '今天是訓練的好日子！💪',
      '每一次訓練都讓你變得更強！🔥',
      '堅持就是勝利，加油！⚡',
      '你的身體會感謝你的努力！🏆',
      '今天的訓練，明天的力量！💫'
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    showLocalNotification('健身動機', randomMessage);
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      showLocalNotification(
        'GymApp 測試通知',
        '通知功能運行正常！👍',
        {
          tag: 'test-notification'
        }
      );
    } else {
      alert('請先允許通知權限');
    }
  };

  const unsubscribePush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        showLocalNotification('通知已關閉', '你將不再收到推送通知');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  // 記錄訓練完成
  const recordWorkoutCompletion = () => {
    const now = new Date().toISOString();
    localStorage.setItem('lastWorkoutDate', now);
    
    if (permission === 'granted') {
      showLocalNotification(
        '訓練完成！🎉',
        '恭喜你完成了今天的訓練，保持這個節奏！'
      );
    }
  };

  // 監聽訓練記錄創建事件
  useEffect(() => {
    const handleWorkoutCreated = () => {
      recordWorkoutCompletion();
    };

    window.addEventListener('workoutCreated', handleWorkoutCreated);
    return () => window.removeEventListener('workoutCreated', handleWorkoutCreated);
  }, [permission]);

  return (
    <>
      {/* 權限請求提示 */}
      {showPermissionPrompt && permission === 'default' && (
        <div className="notification-permission-prompt">
          <div className="notification-prompt-content">
            <div className="notification-prompt-icon">🔔</div>
            <div className="notification-prompt-text">
              <h3>啟用通知</h3>
              <p>接收訓練提醒和激勵消息，幫助你保持健身習慣</p>
            </div>
            <div className="notification-prompt-actions">
              <button 
                className="btn btn-primary" 
                onClick={requestNotificationPermission}
              >
                啟用
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowPermissionPrompt(false)}
              >
                不了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 通知控制面板（開發用） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="notification-debug-panel">
          <div className="debug-panel-header">
            <h4>通知調試面板</h4>
            <div className="permission-status">
              狀態: <span className={`status-${permission}`}>{permission}</span>
            </div>
          </div>
          <div className="debug-panel-actions">
            <button 
              className="btn btn-small" 
              onClick={sendTestNotification}
              disabled={permission !== 'granted'}
            >
              測試通知
            </button>
            <button 
              className="btn btn-small" 
              onClick={scheduleMotivationalNotification}
              disabled={permission !== 'granted'}
            >
              激勵通知
            </button>
            <button 
              className="btn btn-small" 
              onClick={recordWorkoutCompletion}
            >
              模擬訓練完成
            </button>
            {subscription && (
              <button 
                className="btn btn-small btn-danger" 
                onClick={unsubscribePush}
              >
                取消訂閱
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationManager;