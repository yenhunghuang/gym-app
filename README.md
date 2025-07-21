# GymApp - 健身訓練記錄應用程式

一個用於記錄自身及同訓伙伴動作與重量的健身追蹤應用程式。

## 技術棧

- **後端**: Node.js + Express
- **前端**: React
- **資料庫**: SQLite
- **測試**: Jest + Supertest
- **程式風格**: ESLint + Prettier

## 專案結構

```
gym-app/
├── backend/                 # 後端 API 伺服器
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 資料模型
│   │   ├── routes/          # 路由設定
│   │   ├── middleware/      # 中介軟體
│   │   └── app.js          # Express 應用程式
│   ├── tests/              # 測試檔案
│   ├── package.json
│   └── server.js           # 伺服器進入點
├── frontend/               # React 前端應用
│   ├── src/
│   │   ├── components/     # 可重用組件
│   │   ├── pages/          # 頁面組件
│   │   ├── hooks/          # 自定義 Hooks
│   │   └── App.js          # 主要應用程式
│   ├── public/
│   └── package.json
├── database/               # 資料庫檔案
│   └── schema.sql         # 資料庫結構
└── package.json           # 根目錄設定
```

## 快速開始

### 1. 安裝依賴

```bash
# 安裝所有依賴（根目錄、後端、前端）
npm run install:all
```

### 2. 啟動開發伺服器

```bash
# 同時啟動前端和後端開發伺服器
npm run dev
```

這個命令會同時啟動：
- 後端伺服器: http://localhost:3001
- 前端應用: http://localhost:3000

### 3. 單獨啟動服務

```bash
# 只啟動後端
npm run backend:dev

# 只啟動前端
npm run frontend:dev
```

## 可用的腳本

### 根目錄腳本

- `npm run dev` - 同時啟動前後端開發伺服器
- `npm run test` - 執行所有測試
- `npm run build` - 建置前端專案
- `npm run lint` - 執行所有程式碼檢查
- `npm run install:all` - 安裝所有依賴

### 後端腳本

```bash
cd backend
npm start          # 啟動生產伺服器
npm run dev        # 啟動開發伺服器（自動重啟）
npm test           # 執行測試
npm run test:watch # 監視模式執行測試
npm run lint       # 程式碼檢查
npm run lint:fix   # 自動修復程式碼風格
```

### 前端腳本

```bash
cd frontend
npm start          # 啟動開發伺服器
npm run build      # 建置生產版本
npm test           # 執行測試
npm run lint       # 程式碼檢查
npm run lint:fix   # 自動修復程式碼風格
```

## API 端點

### 使用者 API
- `GET /api/users` - 取得所有使用者
- `POST /api/users` - 新增使用者
- `PUT /api/users/:id` - 更新使用者
- `DELETE /api/users/:id` - 刪除使用者

### 運動動作 API
- `GET /api/exercises` - 取得運動動作清單
- `POST /api/exercises` - 新增運動動作
- `PUT /api/exercises/:id` - 更新運動動作
- `DELETE /api/exercises/:id` - 刪除運動動作

### 訓練紀錄 API
- `GET /api/workouts` - 取得訓練紀錄
- `POST /api/workouts` - 新增訓練紀錄
- `PUT /api/workouts/:id` - 更新訓練紀錄
- `DELETE /api/workouts/:id` - 刪除訓練紀錄

## 資料庫設計

### Users 表 - 使用者資料
- `id` - 主鍵
- `name` - 使用者姓名
- `email` - 電子郵件（可選）
- `created_at` - 建立時間

### Exercises 表 - 運動動作
- `id` - 主鍵
- `name` - 運動名稱
- `category` - 運動類別
- `description` - 運動描述
- `created_at` - 建立時間

### Workouts 表 - 訓練紀錄
- `id` - 主鍵
- `user_id` - 使用者 ID（外鍵）
- `date` - 訓練日期
- `notes` - 備註
- `created_at` - 建立時間

### Workout_Exercises 表 - 訓練動作關聯
- `id` - 主鍵
- `workout_id` - 訓練紀錄 ID（外鍵）
- `exercise_id` - 運動動作 ID（外鍵）
- `sets` - 組數
- `reps` - 次數
- `weight` - 重量
- `created_at` - 建立時間

## 開發指南

### 程式碼風格
- 使用 ESLint 進行程式碼檢查
- 使用 Prettier 進行程式碼格式化
- 使用 2 個空格縮排
- 使用單引號

### 測試
- 後端使用 Jest + Supertest
- 前端使用 React Testing Library + Jest
- 執行 `npm test` 運行所有測試

### 提交前檢查
```bash
# 執行所有檢查
npm run lint
npm run test
```

## 故障排除

### 資料庫問題
如果遇到資料庫問題，可以刪除 `database/gym.db` 檔案，重新啟動伺服器會自動重新建立。

### 埠號衝突
- 後端預設使用 3001 埠
- 前端預設使用 3000 埠
- 可以透過環境變數 `PORT` 修改後端埠號

### 依賴問題
```bash
# 清除所有 node_modules 並重新安裝
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

## 功能特色

- 使用者管理 - 管理訓練伙伴資料
- 運動動作庫 - 可自定義運動動作
- 訓練紀錄 - 記錄每次訓練的詳細資訊
- 響應式設計 - 支援桌面和行動裝置
- 即時資料同步 - 前後端資料即時更新

## 授權

MIT License