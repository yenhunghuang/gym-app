# GymApp CLAUDE.md

## 專案概覽

-   **名稱**：GymApp
-   **功能**：記錄自身及同訓伙伴的動作與重量
-   **技術棧**：Node.js + Express（後端）、React（前端）、SQLite（資料庫）
-   **架構**：前後端分離，RESTful API 設計

## 開發規範

### 程式碼風格
-   **Linting**：ESLint + Prettier
-   **語言**：JavaScript ES6+
-   **命名慣例**：camelCase（變數/函數）、PascalCase（組件/類別）
-   **縮排**：2 個空格
-   **字串**：優先使用單引號
-   **分號**：必須使用

### Git 工作流程
-   **分支策略**：feature/<task> → PR → main
-   **提交訊息**：使用繁體中文，格式：`動詞: 簡短描述`
-   **Code Review**：所有 PR 都需要 Claude 自動審查

### 測試策略
-   **後端測試**：Jest 單元測試 + Supertest API 測試
-   **前端測試**：Jest + React Testing Library
-   **覆蓋率要求**：80% 以上
-   **測試檔案命名**：`*.test.js` 或 `__tests__/*.js`

## Claude Code 整合

### 自動 Code Review
-   每個 PR 都會自動觸發 Claude 程式碼審查
-   重點檢查項目：安全性、效能、程式碼品質、最佳實踐

### 互動式協助
-   在 PR 或 Issue 中使用 `@claude` 來請求協助
-   支援的請求類型：
  - 程式碼解釋和建議
  - Bug 修復協助
  - 功能實作指導
  - 重構建議

### 觸發短語
-   `@claude review this` - 請求詳細程式碼審查
-   `@claude fix bug` - 協助修復問題
-   `@claude optimize` - 提供效能優化建議
-   `@claude explain` - 解釋程式碼邏輯

## 專案結構

```
gym-app/
├── backend/           # Express API 伺服器
│   ├── src/
│   │   ├── controllers/  # 業務邏輯控制器
│   │   ├── models/      # 資料模型
│   │   ├── routes/      # API 路由
│   │   └── middleware/  # 中介軟體
│   └── tests/          # 後端測試
├── frontend/          # React 前端應用
│   ├── src/
│   │   ├── components/  # 可重用組件
│   │   ├── pages/      # 頁面組件
│   │   ├── services/   # API 服務
│   │   └── hooks/      # 自定義 Hooks
│   └── public/        # 靜態資源
├── database/          # 資料庫檔案和 Schema
└── .github/workflows/ # GitHub Actions
```

## 常用命令

### 開發環境
-   `npm run dev`：啟動完整開發環境（前後端）
-   `npm run backend:dev`：僅啟動後端開發伺服器
-   `npm run frontend:dev`：僅啟動前端開發伺服器

### 測試
-   `npm test`：執行所有測試
-   `npm run backend:test`：執行後端測試
-   `npm run frontend:test`：執行前端測試

### 程式碼品質
-   `npm run lint`：執行 ESLint 檢查
-   `npm run lint:fix`：自動修復 ESLint 問題

### 建置
-   `npm run build`：建置前端生產版本

## API 設計原則

### RESTful API 慣例
-   **GET** `/api/users` - 取得所有用戶
-   **POST** `/api/users` - 建立新用戶
-   **PUT** `/api/users/:id` - 更新特定用戶
-   **DELETE** `/api/users/:id` - 刪除特定用戶

### 回應格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 錯誤處理
```json
{
  "success": false,
  "error": "錯誤訊息",
  "code": "ERROR_CODE"
}
```

## 安全性要求

-   **輸入驗證**：所有用戶輸入都需要驗證
-   **SQL 注入防護**：使用參數化查詢
-   **CORS 設定**：適當的跨域資源共享配置
-   **環境變數**：敏感資訊使用 `.env` 檔案
-   **API 限流**：防止 DDoS 攻擊

## 效能優化

### 前端
-   使用 React.memo 和 useMemo 優化渲染
-   圖片懶加載和壓縮
-   程式碼分割和動態載入

### 後端
-   資料庫查詢優化
-   API 回應快取
-   壓縮中介軟體

## Claude Code Review 重點

1. **程式碼品質**：是否遵循專案規範和最佳實踐
2. **安全性**：是否存在安全漏洞
3. **效能**：是否有效能問題或優化機會
4. **可維護性**：程式碼是否易於理解和維護
5. **測試覆蓋率**：是否有足夠的測試
6. **文件完整性**：是否需要額外的註解或文件

## Claude Code 使用提示

當您需要 Claude 協助時：
1. 在 PR 或 Issue 中使用 `@claude` 加上具體需求
2. 提供足夠的上下文資訊
3. 明確說明期望的結果
4. 耐心等待 Claude 的分析和建議

## 開發備忘

-   Always use in zh-tw
-   優先使用繁體中文進行溝通
-   遵循專案編碼規範和最佳實踐