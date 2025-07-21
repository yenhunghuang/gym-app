# PRP: GymApp Initial Setup

## 概述
建立 GymApp 的初始專案架構，包含前端、後端及資料庫設定。此應用程式用於記錄自身及同訓伙伴的動作與重量。

## 技術棧
- **後端**: Node.js + Express
- **前端**: React
- **資料庫**: SQLite
- **測試**: Jest + Supertest
- **程式風格**: ESLint + Prettier

## 實作步驟

### 1. 專案結構設定
```
gym-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.js
│   ├── tests/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── App.js
│   ├── public/
│   └── package.json
├── database/
│   └── schema.sql
└── package.json (root)
```

### 2. 後端開發

#### 2.1 Express 伺服器設定
- 建立基本的 Express 應用程式
- 設定 CORS 和 JSON 解析
- 建立基本的路由結構

#### 2.2 資料庫設定
- 建立 SQLite 資料庫
- 設計資料表結構：
  - `users` - 使用者資料
  - `exercises` - 運動動作
  - `workouts` - 訓練紀錄
  - `workout_exercises` - 訓練動作關聯

#### 2.3 API 端點
- `GET /api/users` - 取得所有使用者
- `POST /api/users` - 新增使用者
- `GET /api/exercises` - 取得運動動作清單
- `POST /api/exercises` - 新增運動動作
- `GET /api/workouts` - 取得訓練紀錄
- `POST /api/workouts` - 新增訓練紀錄
- `PUT /api/workouts/:id` - 更新訓練紀錄
- `DELETE /api/workouts/:id` - 刪除訓練紀錄

### 3. 前端開發

#### 3.1 React 應用程式設定
- 建立 React 應用程式架構
- 設定路由 (React Router)
- 建立基本的頁面組件

#### 3.2 主要頁面
- 首頁 - 訓練概覽
- 使用者管理 - 管理訓練伙伴
- 運動動作 - 管理運動動作清單
- 訓練紀錄 - 記錄和查看訓練

#### 3.3 組件開發
- `UserSelector` - 使用者選擇器
- `ExerciseList` - 運動動作清單
- `WorkoutForm` - 訓練紀錄表單
- `WorkoutHistory` - 訓練歷史記錄

### 4. 測試設定

#### 4.1 後端測試
- 設定 Jest 和 Supertest
- 建立 API 端點測試
- 建立資料庫操作測試

#### 4.2 前端測試
- 設定 React Testing Library
- 建立組件單元測試
- 建立整合測試

### 5. 開發工具設定

#### 5.1 程式風格
- 設定 ESLint 規則
- 設定 Prettier 格式化
- 建立 pre-commit hooks

#### 5.2 開發腳本
- `npm run dev` - 同時啟動前後端開發伺服器
- `npm run test` - 執行所有測試
- `npm run build` - 建置專案
- `npm run lint` - 程式碼檢查

## 資料庫設計

### Users 表
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Exercises 表
```sql
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Workouts 表
```sql
CREATE TABLE workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date DATE NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Workout_Exercises 表
```sql
CREATE TABLE workout_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER,
    exercise_id INTEGER,
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(5,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES workouts(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
```

## 驗收標準

### 後端
- [ ] Express 伺服器成功啟動
- [ ] 所有 API 端點正常運作
- [ ] 資料庫連接和操作正常
- [ ] API 測試覆蓋率 > 80%

### 前端
- [ ] React 應用程式成功啟動
- [ ] 所有頁面正常顯示
- [ ] 能夠與後端 API 正常互動
- [ ] 組件測試覆蓋率 > 70%

### 整合
- [ ] 前後端正常通信
- [ ] 資料能夠正確儲存和讀取
- [ ] 使用者能夠完成完整的訓練紀錄流程

## 後續開發計劃

1. **進階功能**
   - 訓練計劃管理
   - 進度追蹤和圖表
   - 社群功能

2. **效能優化**
   - 資料庫查詢優化
   - 前端快取策略
   - 圖片和檔案處理

3. **部署準備**
   - Docker 容器化
   - CI/CD 流程
   - 雲端部署設定

## 時程規劃

- **第 1 週**: 專案結構設定和後端基礎
- **第 2 週**: 資料庫設計和 API 開發
- **第 3 週**: 前端基礎架構和主要組件
- **第 4 週**: 功能整合和測試
- **第 5 週**: 優化和部署準備