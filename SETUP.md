# Claude Code GitHub Actions 設置指引

## 概覽
此專案已配置 Claude Code GitHub Actions 整合，提供自動程式碼審查和互動式 AI 協助功能。

## 前置需求

### 1. GitHub Repository 權限
- 需要 Repository **Admin** 權限
- 確保 GitHub Actions 已啟用

### 2. Claude Code GitHub App
GitHub App 應該已經安裝到您的 repository。如果尚未安裝：
1. 前往 [Claude Code GitHub App](https://github.com/apps/claude-code)
2. 點擊 "Install" 
3. 選擇要安裝的 repository
4. 授權必要的權限

## API 金鑰設置

### 步驟 1: 獲取 Anthropic API 金鑰
1. 前往 [Anthropic Console](https://console.anthropic.com/)
2. 登入或建立帳號
3. 導航到 "API Keys" 頁面
4. 點擊 "Create Key" 建立新的 API 金鑰
5. 複製生成的 API 金鑰（格式：`sk-ant-api03-...`）

### 步驟 2: 設置 Repository Secret
1. 在 GitHub repository 頁面，點擊 "Settings"
2. 在左側選單中點擊 "Secrets and variables" → "Actions"
3. 點擊 "New repository secret"
4. 設置以下 secret：
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: 您的 Anthropic API 金鑰

## 功能驗證

### 自動 Code Review
設置完成後，每次建立或更新 PR 時：
1. GitHub Actions 會自動觸發
2. Claude 會分析變更的程式碼
3. 在 PR 中留下審查評論和建議

### 互動式協助
在任何 PR 或 Issue 中，您可以：
- 使用 `@claude` 來請求一般協助
- 使用 `@claude review this` 來請求詳細審查
- 使用 `@claude explain` 來解釋程式碼
- 使用 `@claude optimize` 來獲取效能建議

## 測試設置

### 建立測試 PR
1. 建立一個新分支：`git checkout -b test-claude-integration`
2. 進行小幅程式碼修改（例如：新增註解）
3. 提交並推送：`git push origin test-claude-integration`
4. 建立 PR
5. 觀察 GitHub Actions 是否觸發 Claude review

### 測試互動功能
在 PR 中留言：`@claude review this code change`，等待 Claude 回應。

## 故障排除

### Claude Action 未觸發
1. 檢查 API 金鑰是否正確設置
2. 確認 GitHub Actions 頁面中的 workflow 狀態
3. 檢查 repository 權限和 App 安裝狀態

### API 金鑰問題
- 確保 API 金鑰格式正確（`sk-ant-api03-...`）
- 檢查 API 金鑰是否有足夠的使用額度
- 驗證 API 金鑰尚未過期

### 權限問題
- 確保 GitHub App 有 PR 和 Issues 的寫入權限
- 檢查 workflow 檔案中的 permissions 設置

## 成本考量

### API 使用費用
- Anthropic API 按使用量計費
- 每次 code review 會消耗 API token
- 建議設置使用量警告和限制

### 優化建議
1. 設置 `review-changed-files-only: true` 只審查變更的檔案
2. 避免在非常小的變更上過度使用
3. 定期檢查 API 使用量

## 安全性注意事項

1. **API 金鑰保護**
   - 絕不在程式碼中硬編碼 API 金鑰
   - 只在 GitHub Secrets 中儲存
   - 定期輪換 API 金鑰

2. **程式碼隱私**
   - Claude 會讀取您的程式碼進行分析
   - 確保符合您的隱私政策
   - 避免在敏感專案上使用

## 進階配置

### 自定義 Prompt
可以在 `claude.yml` 中修改 `system-prompt` 來自定義 Claude 的審查風格：

```yaml
system-prompt: |
  您的自定義指示...
  重點關注特定領域...
```

### 觸發條件調整
修改 workflow 的觸發條件：
- `trigger-on-pr`: 是否在 PR 時自動觸發
- `trigger-phrase`: 自定義觸發短語

## 支援

如遇到問題：
1. 檢查 GitHub Actions logs
2. 參考 [Claude Code 文件](https://docs.anthropic.com/en/docs/claude-code)
3. 在 repository Issues 中回報問題