const CACHE_NAME = 'gymapp-v1.0.0';
const API_CACHE_NAME = 'gymapp-api-v1.0.0';

// 需要快取的靜態資源
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// 需要快取的API端點
const apiUrlsToCache = [
  '/api/users',
  '/api/exercises',
  '/api/workouts'
];

// 安裝Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // 快取靜態資源
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(urlsToCache);
      }),
      
      // 預快取API數據
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Pre-caching API data');
        return Promise.all(
          apiUrlsToCache.map(url => {
            return fetch(`http://localhost:3001${url}`)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response.clone());
                }
              })
              .catch(err => console.log('Failed to cache:', url, err));
          })
        );
      })
    ]).then(() => {
      // 立即接管所有頁面
      self.skipWaiting();
    })
  );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    // 清理舊快取
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即控制所有客戶端
      self.clients.claim();
    })
  );
});

// 攔截網路請求
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // API請求處理
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // 靜態資源處理
  event.respondWith(handleStaticRequest(event.request));
});

// 處理API請求
async function handleApiRequest(request) {
  const url = request.url.replace('http://localhost:3001', '');
  
  try {
    // 嘗試網路請求
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 成功時更新快取
      const cache = await caches.open(API_CACHE_NAME);
      
      // 只快取GET請求
      if (request.method === 'GET') {
        cache.put(url, networkResponse.clone());
      }
      
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed, trying cache:', url);
    
    // 網路失敗時返回快取
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(url);
    
    if (cachedResponse) {
      // 添加離線標記
      const responseHeaders = new Headers(cachedResponse.headers);
      responseHeaders.set('X-Served-By', 'ServiceWorker-Cache');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: responseHeaders
      });
    }
    
    // 如果沒有快取，返回離線頁面
    return new Response(JSON.stringify({
      error: 'Network unavailable',
      message: '網路連線不可用，請稍後再試',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 處理靜態資源請求
async function handleStaticRequest(request) {
  try {
    // 網路優先策略
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 更新快取
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // 網路失敗時使用快取
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果是導航請求且沒有快取，返回首頁
    if (request.mode === 'navigate') {
      return cache.match('/');
    }
    
    throw error;
  }
}

// 背景同步
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// 同步離線數據
async function syncOfflineData() {
  console.log('Service Worker: Syncing offline data...');
  
  try {
    // 這裡可以實現離線數據同步邏輯
    // 例如從IndexedDB取出離線存儲的數據並上傳
    
    // 通知客戶端同步完成
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        message: '數據同步完成'
      });
    });
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// 推送通知
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : '您有新的健身提醒！',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看詳情',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: '關閉',
        icon: '/icon-192.png'  
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('GymApp', options)
  );
});

// 通知點擊處理
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});