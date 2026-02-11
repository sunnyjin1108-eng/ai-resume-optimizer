# 在 Vercel 导入 ai-resume-optimizer 仓库

详细步骤说明。

---

## 步骤一：登录 Vercel

1. 访问：https://vercel.com
2. 点击右上角 **"Log In"**
3. 选择 **Continue with GitHub**（推荐）
4. 授权 Vercel 访问你的 GitHub 账号

---

## 步骤二：创建新项目

登录后，进入 Vercel 控制台：

1. 点击右上角 **"Add New"** 按钮
2. 选择 **"Project"**

---

## 步骤三：选择 GitHub 仓库

1. 在 "Import Git Repository" 页面
2. 找到你的仓库：**`ai-resume-optimizer`**
3. 点击右侧的 **"Import"** 按钮

**找不到仓库？**

- 检查是否已推送到 GitHub：https://github.com/sunnyjin1108-eng/ai-resume-optimizer
- 确认仓库是 Public 或 Private（都可以）
- 点击 "Adjust GitHub App permissions" 检查权限

---

## 步骤四：配置项目设置

Vercel 会自动检测 Next.js 项目配置，确认以下设置：

### Project Name（项目名称）
```
ai-resume-optimizer
```
（可以自定义，但建议保持一致）

### Framework Preset（框架预设）
```
Next.js
```
（Vercel 自动检测）

### Root Directory（根目录）
```
./
```
（保持默认）

### Build Command（构建命令）
```
pnpm run build
```

**如果显示 `npm run build`，手动修改为 `pnpm run build`**

### Output Directory（输出目录）
```
.next
```
（Vercel 自动检测，无需修改）

### Install Command（安装命令）
```
pnpm install
```

**如果显示 `npm install`，手动修改为 `pnpm install`**

---

## 步骤五：配置环境变量（可选）

点击 **"Environment Variables"** 展开选项。

如果需要，添加以下环境变量：

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |

（本项目通常不需要额外的环境变量）

---

## 步骤六：开始部署

1. 检查所有配置是否正确
2. 滚动到底部
3. 点击 **"Deploy"** 按钮

---

## 步骤七：等待部署完成

部署过程包括：

1. **Cloning repository...** - 克隆代码
2. **Installing dependencies...** - 安装依赖（1-2 分钟）
3. **Building project...** - 构建项目（1-2 分钟）
4. **Deploying...** - 部署到 Vercel（30 秒）

**预计总时间：3-5 分钟**

---

## 步骤八：访问应用

部署成功后，Vercel 会显示一个随机生成的域名：

```
https://ai-resume-optimizer-xxxxx.vercel.app
```

点击 **"Visit"** 按钮或直接访问该链接。

---

## 验证功能

访问应用后，测试以下功能：

- [ ] 页面正常加载
- [ ] 输入公司名称、职位、简历后能优化
- [ ] 推荐原因正确显示
- [ ] 风险提示正确显示
- [ ] 面试提问建议正确显示
- [ ] 图片导出正常
- [ ] PDF 导出正常
- [ ] Word 导出正常

---

## 截图参考

### 1. 登录 Vercel 后的页面
```
┌─────────────────────────────────────┐
│  Vercel                     + Add New│
│  Dashboard                         │
│                                     │
│  Your Projects                     │
│  ┌─────────────────────────────┐   │
│  │   + Add New                 │   │
│  │   ┌─────────────────────┐   │   │
│  │   │   Project           │   │   │
│  │   └─────────────────────┘   │   │
│  │   ┌─────────────────────┐   │   │
│  │   │   Other Options...  │   │   │
│  │   └─────────────────────┘   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 2. 导入项目页面
```
┌─────────────────────────────────────────────┐
│  Import Git Repository                       │
│                                             │
│  GitHub  gitlab  bitbucket                  │
│                                             │
│  Search repositories...                      │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  ai-resume-optimizer         Import │   │
│  │  sunnyjin1108-eng                  │   │
│  │  Updated just now                  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  other-repository...         Import │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 3. 项目配置页面
```
┌─────────────────────────────────────────────┐
│  Configure Project                           │
│                                             │
│  Framework Preset: Next.js  (Auto-detected) │
│                                             │
│  Project Name:                               │
│  ┌─────────────────────────────────────┐   │
│  │ ai-resume-optimizer                  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Root Directory: ./                         │
│  Build Command: pnpm run build              │
│  Output Directory: .next                    │
│  Install Command: pnpm install              │
│                                             │
│  Environment Variables [▶]                  │
│                                             │
│                                      Deploy │
└─────────────────────────────────────────────┘
```

### 4. 部署成功页面
```
┌─────────────────────────────────────────────┐
│  Congratulations!                           │
│                                             │
│  Your project has been deployed to Vercel.  │
│                                             │
│  Visit: https://ai-resume-optimizer.vercel.app│
│  [Visit]  [Continue to Dashboard]           │
│                                             │
│  Build Logs:                                │
│  ✓ Cloning repository...                    │
│  ✓ Installing dependencies...               │
│  ✓ Building project...                      │
│  ✓ Deploying...                             │
│                                             │
│  Status: Ready (100%)                       │
└─────────────────────────────────────────────┘
```

---

## 常见问题

### Q1: 找不到 ai-resume-optimizer 仓库

**解决方案：**

1. 确认已推送到 GitHub：
   - 访问：https://github.com/sunnyjin1108-eng/ai-resume-optimizer
   - 如果页面存在，说明已推送成功

2. 检查 Vercel GitHub App 权限：
   - 点击 "Adjust GitHub App permissions"
   - 确认已授权访问该仓库
   - 重新授权

3. 刷新页面重试

### Q2: 提示 "Build failed"

**解决方案：**

1. 查看构建日志，找到具体错误
2. 常见错误：
   - **依赖安装失败**：检查 `package.json` 是否正确
   - **TypeScript 错误**：本地运行 `pnpm run build` 测试
   - **内存不足**：Vercel 会自动处理

3. 修复错误后，提交新代码，Vercel 会自动重新部署

### Q3: 构建成功，但访问报错

**解决方案：**

1. 查看实时日志：
   - 进入 Vercel 项目
   - 点击 "Logs" 标签
   - 查看错误信息

2. 检查 API 路由配置
3. 检查环境变量是否正确

### Q4: 如何更新应用？

**自动部署（推荐）：**

```bash
# 在本地修改代码
git add .
git commit -m "feat: 更新功能"
git push
```

Vercel 会自动检测到推送，自动重新部署！

**手动重新部署：**

1. 进入 Vercel 项目
2. 点击 "Deployments"
3. 点击最新的部署右侧的 "..."
4. 选择 "Redeploy"

### Q5: 如何配置自定义域名？

参考 `VERCEL_DEPLOYMENT.md` 文档中的"配置自定义域名"部分。

---

## Vercel 控制台说明

### 主要功能

| 功能 | 说明 |
|------|------|
| **Overview** | 项目概览 |
| **Deployments** | 部署历史，可以回滚版本 |
| **Settings** | 项目设置（域名、环境变量、构建配置） |
| **Logs** | 实时日志，用于调试 |
| **Analytics** | 访问分析 |
| **Domains** | 域名配置 |

### 查看日志

1. 进入项目
2. 点击 "Logs" 标签
3. 选择环境（Production / Preview）
4. 实时查看日志

### 查看部署历史

1. 进入项目
2. 点击 "Deployments" 标签
3. 查看所有部署记录
4. 点击部署详情查看构建日志

---

## 完整流程总结

```
1. 登录 Vercel
   └─ 使用 GitHub 账号登录

2. 创建新项目
   └─ Add New → Project

3. 导入仓库
   └─ 选择 ai-resume-optimizer → Import

4. 配置项目
   ├─ 确认框架：Next.js
   ├─ 修改构建命令：pnpm run build
   └─ 修改安装命令：pnpm install

5. 开始部署
   └─ 点击 Deploy 按钮

6. 等待部署
   ├─ 安装依赖（1-2 分钟）
   ├─ 构建项目（1-2 分钟）
   └─ 部署到 Vercel（30 秒）

7. 访问应用
   └─ 点击 Visit 按钮
```

---

## 快速访问链接

- **Vercel 首页**：https://vercel.com
- **Vercel 登录**：https://vercel.com/login
- **Vercel 文档**：https://vercel.com/docs
- **你的 GitHub 仓库**：https://github.com/sunnyjin1108-eng/ai-resume-optimizer

---

祝部署顺利！🚀

如有问题，参考上述常见问题或查看 Vercel 官方文档。
