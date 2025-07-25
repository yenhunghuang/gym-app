# SuperClaude 使用指引

## ✅ 安裝完成

SuperClaude v3.0.0 已成功安裝並整合到您的 Claude Code 環境中！

## 🎯 什麼是 SuperClaude？

SuperClaude 是一個強大的 **Python 框架**，透過以下方式增強 Claude Code：

- **16 個專業指令** - 針對特定開發任務優化
- **智慧人格系統** - 自動選擇適合的專家角色
- **MCP 伺服器整合** - 外部工具和服務整合
- **任務管理** - 追蹤和組織開發進度

## 🛠️ 16 個 SuperClaude 指令

### 開發類指令
- **`/sc:implement`** - 實作新功能或模組
- **`/sc:build`** - 編譯和打包專案
- **`/sc:design`** - 系統架構設計

### 分析類指令
- **`/sc:analyze`** - 深度程式碼分析
- **`/sc:troubleshoot`** - 問題診斷和除錯
- **`/sc:explain`** - 詳細解釋程式碼邏輯

### 品質類指令
- **`/sc:improve`** - 程式碼優化和重構
- **`/sc:test`** - 測試策略和實作
- **`/sc:cleanup`** - 程式碼清理和整理

### 文檔類指令
- **`/sc:document`** - 生成文檔和註解

### 其他實用指令
- **`/sc:git`** - Git 操作協助
- **`/sc:estimate`** - 工作量評估
- **`/sc:task`** - 任務管理
- **`/sc:index`** - 專案索引和導航
- **`/sc:load`** - 載入和配置
- **`/sc:spawn`** - 創建新組件或模板
- **`/sc:workflow`** - 工作流程優化

## 🎭 智慧人格系統

SuperClaude 會根據任務自動選擇適合的專家：

- 🏗️ **architect** - 系統設計和架構
- 🎨 **frontend** - UI/UX 和前端開發
- ⚙️ **backend** - API 和後端服務
- 🔍 **analyzer** - 程式碼分析和除錯
- 🛡️ **security** - 安全性審查
- ✍️ **scribe** - 文檔撰寫
- *...還有更多專家角色*

## 🔧 MCP 整合服務

SuperClaude 連接以下外部服務：

- **Context7** - 官方文檔和最佳實踐
- **Sequential** - 複雜多步驟思考
- **Magic** - 現代 UI 組件生成
- **Playwright** - 瀏覽器自動化測試

## 📋 在 GymApp 中使用 SuperClaude

### 實際使用範例

#### 1. 功能實作
```
/sc:implement 添加用戶認證系統，包含註冊、登入、密碼重置功能
```

#### 2. 程式碼分析
```
/sc:analyze 分析目前的 API 設計，檢查是否符合 RESTful 最佳實踐
```

#### 3. 問題排解
```
/sc:troubleshoot 前端無法正確連接到後端 API，顯示 CORS 錯誤
```

#### 4. 系統設計
```
/sc:design 設計一個可擴展的訓練記錄系統，支援多用戶和數據分析
```

#### 5. 程式碼優化
```
/sc:improve 優化目前的資料庫查詢效能，特別是 workout 相關的查詢
```

### 針對 GymApp 的最佳實踐

1. **使用專案上下文**
   ```
   /sc:implement 在 GymApp（Node.js + Express + React + SQLite）中實作...
   ```

2. **遵循專案規範**
   - 參考 `CLAUDE.md` 中的規範
   - 使用 ESLint + Prettier 風格
   - 遵循 RESTful API 設計

3. **整合現有工具**
   - 與 Claude Dev 配合使用
   - 搭配 GitHub Actions 自動審查
   - 結合 ChatGPT 進行學習

## ⚡ 使用技巧

### 1. 組合使用指令
```
/sc:design 設計用戶權限系統
然後
/sc:implement 實作上述設計的權限系統
最後
/sc:test 為權限系統寫測試
```

### 2. 指定專家角色
```
/sc:analyze 請 security 專家檢查這段程式碼是否有安全漏洞
```

### 3. 階段性開發
```
/sc:task 將「添加訓練統計功能」分解為具體的開發任務
```

## 🔧 配置文件

SuperClaude 的配置位於：
- `/Users/yenhung/.claude/.superclaude-metadata.json` - 主要設定
- `/Users/yenhung/.claude/ORCHESTRATOR.md` - 行為規則
- `/Users/yenhung/.claude/PERSONAS.md` - 人格定義

## 🆚 與其他工具的差異

| 功能 | SuperClaude | Claude Dev | ChatGPT |
|------|------------|------------|---------|
| 專業指令 | ✅ 16個 | ❌ | ❌ |
| 智慧人格 | ✅ 11個專家 | ❌ | ❌ |
| 任務管理 | ✅ | 基本 | 基本 |
| MCP 整合 | ✅ | ❌ | ❌ |
| 程式碼編輯 | ✅ | ✅ | ❌ |
| 即時對話 | ✅ | ✅ | ✅ |

## 📚 進階功能

### 工作流程最佳化
```
/sc:workflow 為 GymApp 設計一個完整的功能開發流程
```

### 專案索引
```
/sc:index 建立 GymApp 的程式碼導航索引
```

### 估算工作量
```
/sc:estimate 評估實作「用戶數據匯出功能」需要的時間和複雜度
```

## 🔄 重啟 Claude Code

要讓 SuperClaude 完全生效：
1. 關閉 Claude Code 會話
2. 重新啟動 Claude Code
3. SuperClaude 指令和功能現在可以使用

## 🎉 恭喜！

您現在擁有完整的 AI 輔助開發環境：
- **SuperClaude 指令** - 專業開發任務
- **Claude Dev** - VSCode 整合
- **ChatGPT** - 一般協助
- **GitHub Actions** - 自動審查

開始享受超強的 AI 輔助開發體驗吧！ 🚀