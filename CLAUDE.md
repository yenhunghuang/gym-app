# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概覽

**GymApp** - 健身訓練記錄PWA應用程式，用於記錄自身及同訓伙伴的動作與重量。

**技術棧**：
- 後端：Node.js + Express + SQLite
- 前端：React + PWA功能
- 部署：GitHub Actions CI/CD
- 語言環境：繁體中文 (zh-TW)

## 核心架構

### API 服務架構
- RESTful API 設計，基於 `/api` 路徑
- 標準化回應格式：`{ success: boolean, data: any, message?: string }`
- 錯誤處理：`{ success: false, error: string, code?: string }`
- API 層級位於 `frontend/src/services/api.js`

### 前端組件架構
```
src/
├── components/          # 可重用組件
│   ├── PWAManager.js           # PWA生命週期管理
│   ├── NotificationManager.js  # 推送通知系統
│   ├── AchievementSystem.js    # 成就系統
│   ├── ProgressChart.js        # SVG圖表組件
│   ├── StatsDashboard.js       # 統計儀表板
│   ├── SwipeGestures.js        # 觸控手勢系統
│   ├── BottomNavigation.js     # 移動端導航
│   └── FloatingActionButton.js # 浮動操作按鈕
├── pages/               # 頁面組件
└── services/           # API 服務層
```

### PWA 架構特色
- Service Worker (`public/sw.js`) 提供離線功能
- Manifest (`public/manifest.json`) 支援應用安裝
- 推送通知與背景同步
- 觸控手勢支援（滑動刪除、下拉刷新）
- 響應式設計（桌面/移動端）

### 資料庫設計
核心實體關係：
- `Users` ← `Workouts` ← `WorkoutExercises` → `Exercises`
- 支援多用戶訓練記錄追蹤
- 成就系統基於 localStorage 持久化

## 開發命令

### 環境啟動
```bash
# 完整開發環境（推薦）
npm run dev

# 個別服務
npm run backend:dev     # 後端 :3001
npm run frontend:dev    # 前端 :3000
```

### 程式碼品質
```bash
# ESLint 檢查與修復
npm run lint            # 全專案檢查
npm run lint:fix        # 自動修復（在 backend/ 或 frontend/ 內執行）

# 測試執行
npm test                # 全專案測試
npm run backend:test    # 後端測試 (Jest + Supertest)
npm run frontend:test   # 前端測試 (React Testing Library)
```

### 建置部署
```bash
npm run build           # 前端生產建置
```

## PWA 特定開發注意事項

### Service Worker 更新
- 修改 `public/sw.js` 後需更新 `CACHE_NAME` 版本號
- 透過 PWAManager 組件處理更新提示

### 推送通知開發
- NotificationManager 處理權限請求與訂閱
- 開發模式下有調試面板可測試通知功能
- 需要 VAPID keys 用於生產環境

### 成就系統
- AchievementSystem 監聽 `workoutCreated` 自定義事件
- 統計計算基於 `getWorkouts()` API 呼叫
- 13 種成就類型，涵蓋頻率、重量、時間等維度

### 觸控手勢
- SwipeGestures 組件提供滑動與下拉手勢
- SwipeToDelete 用於列表項目刪除
- 手勢反饋透過動態 DOM 元素實現

## 開發規範

### 程式碼風格
- ESLint + Prettier 自動化格式
- 2 空格縮排，單引號字串
- React Hooks 模式，functional components
- camelCase 變數，PascalCase 組件

### API 呼叫模式
使用 `services/api.js` 的封裝函式：
```javascript
// 標準用法
const users = await getUsers();
const workout = await createWorkout(workoutData);

// 帶參數查詢
const userWorkouts = await getWorkouts(userId);
const categoryExercises = await getExercises(category);
```

### 事件系統
應用程式使用自定義事件進行組件間通信：
```javascript
// 觸發事件
window.dispatchEvent(new CustomEvent('workoutCreated', { detail: workoutData }));

// 監聽事件
window.addEventListener('workoutCreated', handleWorkoutCreated);
```

### 狀態管理
- React hooks 為主 (useState, useEffect)
- localStorage 用於 PWA 資料持久化
- API 層統一處理錯誤與載入狀態

## 常見開發場景

### 新增 API 端點
1. 後端：在 `backend/src/routes/` 新增路由
2. 前端：在 `services/api.js` 新增對應函式
3. 組件：使用 try/catch 處理 API 呼叫

### 新增移動端手勢
1. 包裝組件於 `<SwipeGestures>` 或 `<SwipeToDelete>`
2. 設定對應的手勢回調函式
3. 實作手勢反饋 UI

### 擴展成就系統
1. 在 `AchievementSystem.js` 的 `achievementDefinitions` 新增定義
2. 確保 `calculateUserStats` 計算相關統計
3. 在 `getAchievementProgress` 新增進度計算邏輯

### PWA 功能除錯
- 使用 Chrome DevTools > Application > Service Workers
- 檢查 Manifest 安裝條件
- 測試離線功能與快取策略

## 部署注意事項

### 環境變數
- `REACT_APP_API_URL`：前端 API 基礎 URL
- `REACT_APP_VAPID_PUBLIC_KEY`：推送通知公鑰

### PWA 資源
確保以下檔案存在於 `public/`：
- `manifest.json`（應用清單）
- `sw.js`（Service Worker）
- `icon-192.png`, `icon-512.png`（應用圖示）

## 語言與本地化

- 所有使用者介面使用繁體中文
- 註解與變數命名可混用中英文
- API 回應訊息使用繁體中文
- 成就標題與描述使用中文，適合台灣健身文化