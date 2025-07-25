# Claude Code VSCode 擴充套件設定指引

## ✅ 安裝完成

已安裝的 AI 輔助工具：
- **Claude Dev**: `saoudrizwan.claude-dev` v3.19.7 ✅
- **ChatGPT**: `openai.chatgpt` v0.1.1741291060 ✅
- **SuperClaude**: v3.0.0 ✅ (Python 套件，非 VSCode 擴充套件)

## ✅ SuperClaude 成功安裝！

SuperClaude 是一個 **Python 框架**，不是 VSCode 擴充套件。它透過以下方式增強 Claude Code：

### 🚀 SuperClaude 功能
- **16 個專門指令**: `/sc:implement`, `/sc:build`, `/sc:design` 等
- **智慧人格系統**: 自動選擇適合的專家（架構師、前端、後端等）
- **MCP 伺服器整合**: Context7, Sequential, Magic, Playwright
- **任務管理**: 追蹤開發進度
- **Token 最佳化**: 處理長對話

### 📁 安裝位置
SuperClaude 檔案已安裝到：
- `/Users/yenhung/.claude/` - 核心框架檔案
- `/Users/yenhung/.claude/commands/sc/` - 17 個指令定義

## 初始設定

### 1. 開啟 Claude Dev 擴充套件
1. 開啟 VSCode
2. 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux) 開啟命令面板
3. 輸入 "Claude Dev" 並選擇相關命令
4. 或者點擊左側活動欄中的 Claude 圖示（如果可見）

### 2. 設定 API 金鑰
擴充套件首次運行時會提示您輸入 Anthropic API 金鑰：

1. 前往 [Anthropic Console](https://console.anthropic.com/)
2. 登入並建立 API 金鑰
3. 複製 API 金鑰（格式：`sk-ant-api03-...`）
4. 在 VSCode 中貼上 API 金鑰

### 3. VSCode 設定檔配置（可選）

您可以在 VSCode 設定中配置 Claude Dev：

```json
{
  "claudeDev.apiKey": "your-api-key-here",
  "claudeDev.maxTokens": 4000,
  "claudeDev.temperature": 0.7,
  "claudeDev.model": "claude-3-sonnet-20240229"
}
```

## 主要功能

### 💬 程式碼對話
- 直接在 VSCode 中與 Claude 對話
- 詢問程式碼相關問題
- 獲取實作建議

### 🔧 程式碼生成
- 根據描述生成程式碼
- 重構現有程式碼
- 修復 bug 和錯誤

### 📚 程式碼解釋
- 解釋複雜的程式碼邏輯
- 提供最佳實踐建議
- 程式碼審查和優化建議

### 🚀 專案整合
- 與 GymApp 專案無縫整合
- 理解專案結構和上下文
- 遵循專案的程式碼規範

## 使用方式

### 方法 1: 命令面板
1. `Cmd+Shift+P` → 搜尋 "Claude"
2. 選擇適當的 Claude Dev 命令
3. 開始對話或輸入任務

### 方法 2: 右鍵選單
1. 選擇程式碼片段
2. 右鍵點擊
3. 選擇 Claude Dev 相關選項

### 方法 3: 快捷鍵（如果設定）
檢查擴充套件是否提供快捷鍵設定

## GymApp 專案相關提示

由於您的專案已經配置了完整的 Claude Code 整合，建議在使用 VSCode 擴充套件時：

1. **提及專案上下文**: 告訴 Claude 這是 GymApp 專案
2. **參考專案規範**: 引用 `CLAUDE.md` 中的規範
3. **遵循技術棧**: 提醒使用 Node.js + Express + React + SQLite
4. **使用繁體中文**: 與專案設定保持一致

### 範例對話
```
我正在開發 GymApp 專案（Node.js + Express + React），
請幫我優化這段 API 程式碼，遵循專案的 RESTful 設計原則...
```

## 疑難排解

### 無法連接到 API
1. 檢查 API 金鑰是否正確
2. 確認 API 金鑰有足夠額度
3. 檢查網路連接狀況

### 擴充套件未顯示
1. 重新載入 VSCode (`Cmd+R` 或 `Ctrl+R`)
2. 檢查擴充套件是否已啟用
3. 查看 VSCode 輸出面板的錯誤訊息

### 回應速度慢
1. 減少輸入的程式碼量
2. 使用較快的模型（如 claude-3-haiku）
3. 檢查網路狀況

## 進階設定

### 工作區設定
在專案根目錄建立 `.vscode/settings.json`：

```json
{
  "claudeDev.projectContext": "GymApp - 健身房訓練記錄應用程式",
  "claudeDev.codeStyle": "ESLint + Prettier",
  "claudeDev.preferredLanguage": "繁體中文"
}
```

### 自定義提示範本
可以設定常用的提示範本來提高效率。

## AI 工具組合建議

### 🎯 最佳使用策略

1. **SuperClaude 指令** - 專業開發任務
   - `/sc:implement` - 功能實作
   - `/sc:analyze` - 程式碼分析
   - `/sc:troubleshoot` - 問題排解
   - `/sc:design` - 系統設計

2. **Claude Dev** - 一般程式碼協助
   - 寫程式碼、除錯、重構
   - 解釋程式碼邏輯
   - 程式碼審查和優化

3. **ChatGPT** - 輔助用於一般任務
   - 概念解釋和學習
   - 文檔撰寫
   - 問題解決思路

### 🔄 與 GitHub Actions 的配合

完整的 AI 輔助開發流程：
- **SuperClaude 指令** - 專業開發任務和智慧人格系統
- **VSCode 中的 Claude Dev** - 本地開發協助
- **VSCode 中的 ChatGPT** - 學習和解釋
- **GitHub 上的 Claude** - 自動程式碼審查
- 形成四重 AI 輔助開發生態系統

## 支援與資源

- **擴充套件文檔**: 查看 VSCode 擴充套件頁面
- **GitHub Issues**: 回報問題和建議
- **Anthropic 文檔**: Claude API 官方文檔

---

**恭喜！Claude Code VSCode 擴充套件已成功安裝並準備使用！** 🎉