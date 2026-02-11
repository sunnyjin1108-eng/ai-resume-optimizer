# AI 简历优化助手 - Vercel 快速部署指南

**推荐！** Vercel 是 Next.js 的官方托管平台，零配置，3 分钟即可完成部署。

---

## 目录

1. [为什么选择 Vercel](#为什么选择-vercel)
2. [部署步骤](#部署步骤)
3. [配置自定义域名](#配置自定义域名)
4. [环境变量配置](#环境变量配置)
5. [常见问题](#常见问题)

---

## 为什么选择 Vercel

| 特性 | Vercel | 说明 |
|------|--------|------|
| ⚡ **零配置** | ✅ | 自动检测 Next.js 项目，无需手动配置 |
| 🚀 **极速部署** | ✅ | 3 分钟内完成部署 |
| 🌍 **全球 CDN** | ✅ | 边缘节点加速，访问更快 |
| 🔄 **自动 HTTPS** | ✅ | 免费 SSL 证书，自动续期 |
| 📊 **分析功能** | ✅ | 实时访问分析 |
| 🔧 **开发者友好** | ✅ | 预览部署、回滚、分支部署 |
| 💰 **免费额度** | ✅ | 个人项目完全免费 |
| 🔒 **安全可靠** | ✅ | 企业级安全标准 |

---

## 部署步骤

### 前提条件

- ✅ 拥有 GitHub、GitLab 或 Bitbucket 账号
- ✅ 项目代码已推送到远程仓库

### 步骤 1：创建 Git 仓库

如果还没有，先创建 Git 仓库：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "feat: AI简历优化助手 - 初始版本"

# 连接远程仓库
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 步骤 2：注册 Vercel 账号

1. 访问 Vercel 官网：https://vercel.com
2. 点击右上角 "Sign Up"
3. 使用以下方式之一注册：
   - GitHub 账号（推荐）
   - GitLab 账号
   - Bitbucket 账号
   - Email 账号

**推荐使用 GitHub 账号注册**，后续授权更方便。

### 步骤 3：连接 Git 仓库

1. 登录 Vercel 后，进入控制台（Dashboard）
2. 点击 "Add New" → "Project"
3. 首次使用需要授权访问 GitHub
4. 点击 "Import" 或 "Connect" 授权 Vercel 访问您的 GitHub

### 步骤 4：导入项目

1. 在项目列表中找到您的仓库
   - 可以搜索仓库名称
   - 或从 "Import from..." 选择仓库

2. 点击 "Import" 按钮导入项目

### 步骤 5：配置项目设置

Vercel 会自动检测 Next.js 项目配置：

#### Project Name（项目名称）
```
ai-resume-optimizer
```
（可以自定义，建议使用英文和连字符）

#### Framework Preset（框架预设）
Vercel 会自动检测并显示：
```
Next.js
```

#### Root Directory（根目录）
```
./
```
（通常不需要修改）

#### Build Command（构建命令）
Vercel 会自动检测并显示：
```
npm run build
```
或
```
pnpm run build
```

#### Output Directory（输出目录）
Vercel 会自动检测并显示：
```
.next
```
（不需要修改）

#### Install Command（安装命令）
如果使用 pnpm，手动修改：
```
pnpm install
```

### 步骤 6：配置环境变量（可选）

如果项目需要环境变量，点击 "Environment Variables"：

添加以下环境变量（如果需要）：

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |

### 步骤 7：开始部署

1. 检查所有配置是否正确
2. 点击底部的 "Deploy" 按钮
3. 等待部署完成

**部署过程包括：**
- 克隆代码仓库
- 安装依赖
- 构建项目
- 部署到 Vercel 网络

### 步骤 8：访问应用

部署完成后，Vercel 会提供一个随机生成的域名：

```
https://ai-resume-optimizer-xxxxx.vercel.app
```

点击该链接即可访问您的应用！

### 步骤 9：验证功能

测试应用功能：

- [ ] 页面能否正常访问
- [ ] 输入公司名称、职位、简历后能否优化
- [ ] 推荐原因是否正确显示
- [ ] 风险提示是否正确显示
- [ ] 面试提问建议是否正确显示
- [ ] 图片导出功能是否正常
- [ ] PDF 导出功能是否正常
- [ ] Word 导出功能是否正常

---

## 配置自定义域名

### 前提条件

- ✅ 拥有一个域名（可在阿里云、腾讯云、Namecheap 等购买）
- ✅ 有权管理该域名的 DNS 设置

### 步骤 1：添加自定义域名

1. 在 Vercel 控制台，进入您的项目
2. 点击顶部导航的 "Settings" 标签
3. 在左侧菜单中点击 "Domains"
4. 输入您的自定义域名：
   ```
   resume.example.com
   ```
5. 点击 "Add"

### 步骤 2：配置 DNS 记录

Vercel 会提供两个 DNS 记录，您需要将其添加到域名服务商：

#### 方式 A：使用 A 记录（推荐）

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 10分钟 |

#### 方式 B：使用 CNAME 记录

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | resume.example.com | cname.vercel-dns.com | 10分钟 |

**注意：**
- 如果使用子域名（如 `resume.example.com`），使用 CNAME 记录
- 如果使用根域名（如 `example.com`），使用 A 记录

### 步骤 3：添加 DNS 记录

#### 阿里云

1. 登录阿里云控制台
2. 进入 "域名" → "域名列表"
3. 找到您的域名，点击 "解析"
4. 点击 "添加记录"，填写如下：

**A 记录（根域名）：**
| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|-------|-----|
| A | @ | 76.76.21.21 | 10分钟 |

**CNAME 记录（子域名）：**
| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|-------|-----|
| CNAME | resume | cname.vercel-dns.com | 10分钟 |

5. 点击 "确定"

#### 腾讯云

1. 登录腾讯云控制台
2. 进入 "域名" → "域名管理"
3. 找到您的域名，点击 "解析"
4. 点击 "添加记录"，填写如下（同上）

#### Namecheap

1. 登录 Namecheap
2. 进入 "Domain List" → 点击 "Manage" 按钮
3. 选择 "Advanced DNS"
4. 点击 "Add New Record"，填写如下（同上）

### 步骤 4：验证 DNS 配置

1. 返回 Vercel 的 Domains 页面
2. 等待 DNS 记录生效（通常 5-30 分钟）
3. Vercel 会自动检测并验证 DNS 配置
4. 验证通过后，状态会变为 "Valid Configuration"

**手动验证：**
```bash
# 检查 A 记录
dig A example.com

# 检查 CNAME 记录
dig CNAME resume.example.com

# 或使用 nslookup
nslookup resume.example.com
```

### 步骤 5：启用 HTTPS

1. DNS 验证通过后，Vercel 会自动申请 SSL 证书
2. 等待证书签发（通常几分钟）
3. 证书状态会变为 "Issued"

**注意：**
- Vercel 提供免费 SSL 证书
- 证书会自动续期
- 支持自动 HTTP → HTTPS 重定向

### 步骤 6：测试域名

1. 在浏览器中访问：
   ```
   https://resume.example.com
   ```

2. 检查：
   - [ ] 页面是否正常加载
   - [ ] 地址栏是否显示锁图标（HTTPS）
   - [ ] 所有功能是否正常

### 步骤 7：设置主域名（可选）

如果您有多个域名（如 `example.com` 和 `www.example.com`），可以设置主域名：

1. 进入 "Settings" → "Domains"
2. 在域名列表中，点击齿轮图标
3. 选择 "Set as Primary"
4. Vercel 会自动配置重定向规则

---

## 环境变量配置

### 添加环境变量

1. 进入 Vercel 项目
2. 点击 "Settings" → "Environment Variables"
3. 点击 "Add New"
4. 填写变量名和值
5. 选择环境（Production / Preview / Development）
6. 点击 "Save"

### 常用环境变量

| Name | Value | Environment |
|------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `NEXT_PUBLIC_API_URL` | `https://api.example.com` | Production |

**注意：**
- 以 `NEXT_PUBLIC_` 开头的变量会在客户端暴露
- 不要在客户端变量中存储敏感信息

### 环境变量使用示例

**服务端环境变量：**
```typescript
// app/api/route.ts
const apiKey = process.env.API_KEY;
```

**客户端环境变量：**
```typescript
// components/Example.tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## 常见问题

### Q1: 部署失败，提示 "Build failed"

**解决方案：**

1. 检查本地构建是否成功：
   ```bash
   pnpm install
   pnpm run build
   ```

2. 查看构建日志，定位具体错误

3. 常见错误及解决：

   **错误：找不到模块**
   ```
   检查 package.json 中的 dependencies 是否完整
   ```

   **错误：TypeScript 编译错误**
   ```
   本地运行 `npx tsc --noEmit` 检查类型错误
   ```

   **错误：内存不足**
   ```
   在项目根目录创建 `vercel.json`：
   {
     "buildCommand": "NODE_OPTIONS='--max-old-space-size=4096' pnpm run build"
   }
   ```

### Q2: 部署成功，但访问报错

**解决方案：**

1. 检查应用日志：
   - 进入 Vercel 项目
   - 点击 "Deployments" → 点击具体部署
   - 查看 "Build Logs" 和 "Function Logs"

2. 常见错误：

   **错误：404 Not Found**
   ```
   检查 next.config.ts 中的 output 配置
   确保页面路径正确
   ```

   **错误：500 Internal Server Error**
   ```
   查看服务器日志，检查 API 路由逻辑
   ```

### Q3: DNS 解析不生效

**解决方案：**

1. 检查 DNS 记录是否正确
2. 确认 TTL 设置（建议 10 分钟）
3. 使用 DNS 检测工具验证：
   - https://www.whatsmydns.net/
   - https://dnschecker.org/

4. 等待更长时间（最长 48 小时）
5. 联系域名服务商

### Q4: HTTPS 证书无法获取

**解决方案：**

1. 确认 DNS 解析已生效
2. 确认域名指向正确的 Vercel IP 或 CNAME
3. 检查域名状态（是否被封禁）
4. 等待一段时间，Vercel 会自动重试
5. 联系 Vercel 支持

### Q5: 如何更新应用？

**方法一：自动部署（推荐）**

```bash
# 1. 修改代码
# 2. 提交并推送到 GitHub
git add .
git commit -m "feat: 更新功能"
git push

# 3. Vercel 会自动检测到推送，并自动部署
```

**方法二：手动触发部署**

1. 进入 Vercel 项目
2. 点击 "Deployments" 标签
3. 点击右上角 "..." → "Redeploy"

### Q6: 如何回滚到之前的版本？

1. 进入 Vercel 项目
2. 点击 "Deployments" 标签
3. 找到要回滚的部署
4. 点击右上角 "..." → "Promote to Production"

### Q7: 如何配置预览部署？

Vercel 默认为每个 Git 分支创建预览部署：

1. 创建新分支：
   ```bash
   git checkout -b feature/new-feature
   ```

2. 提交并推送：
   ```bash
   git push origin feature/new-feature
   ```

3. Vercel 自动创建预览部署：
   ```
   https://ai-resume-optimizer-feature-new-feature.vercel.app
   ```

4. 测试完成后，合并到主分支

### Q8: 免费额度限制？

Vercel Hobby（免费计划）额度：

| 资源 | 限制 |
|------|------|
| 带宽 | 100 GB / 月 |
| 无服务器函数执行时间 | 100 小时 / 月 |
| 构建时间 | 6,000 分钟 / 月 |
| 团队成员 | 1 人 |
| 项目数量 | 无限 |

**超出限制后：**
- 网站仍可访问
- 函数可能被限速
- 可以升级到 Pro 计划（$20/月）

---

## Vercel 配置文件

如果需要自定义 Vercel 配置，在项目根目录创建 `vercel.json`：

```json
{
  "buildCommand": "pnpm install && pnpm run build",
  "outputDirectory": ".next",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["hkg1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**配置说明：**

| 字段 | 说明 | 默认值 |
|------|------|--------|
| `buildCommand` | 构建命令 | 自动检测 |
| `outputDirectory` | 输出目录 | `.next` |
| `devCommand` | 开发命令 | `pnpm run dev` |
| `installCommand` | 安装命令 | `pnpm install` |
| `framework` | 框架 | 自动检测 |
| `regions` | 部署区域 | 全球 |
| `env` | 环境变量 | - |

**常用区域代码：**

| 区域 | 代码 |
|------|------|
| 香港 | `hkg1` |
| 新加坡 | `sin1` |
| 东京 | `tyo1` |
| 旧金山 | `sfo1` |

---

## 部署流程总结

```
1. 推送代码到 GitHub
   ├─ 初始化 Git 仓库
   ├─ 提交代码
   └─ 推送到 GitHub

2. 注册并登录 Vercel
   ├─ 使用 GitHub 账号登录
   └─ 授权访问仓库

3. 导入项目到 Vercel
   ├─ 选择仓库
   ├─ 确认配置
   └─ 开始部署

4. 等待部署完成
   ├─ 自动安装依赖
   ├─ 自动构建
   └─ 自动部署

5. 访问应用
   ├─ 获取 Vercel 域名
   ├─ 测试功能
   └─ 验证部署

6. 配置自定义域名（可选）
   ├─ 添加域名
   ├─ 配置 DNS
   ├─ 启用 HTTPS
   └─ 测试域名
```

---

## 完整部署时间线

| 步骤 | 时间 |
|------|------|
| 注册账号 | 1 分钟 |
| 授权 GitHub | 30 秒 |
| 导入项目 | 30 秒 |
| 安装依赖 | 1-2 分钟 |
| 构建项目 | 1-2 分钟 |
| 部署到 Vercel | 30 秒 |
| **总计** | **3-5 分钟** |

---

## Vercel vs Coze 平台对比

| 特性 | Vercel | Coze 平台 |
|------|--------|-----------|
| 部署时间 | 3 分钟 | 10-15 分钟 |
| 配置难度 | 零配置 | 需要手动配置 |
| 适合项目 | Next.js 项目 | 通用 Web 应用 |
| 全球 CDN | ✅ | 视平台而定 |
| 自动 HTTPS | ✅ | ✅ |
| 免费额度 | ✅ | ✅ |
| 域名配置 | 简单 | 较复杂 |

**建议：**
- ✅ **推荐使用 Vercel**：本项目基于 Next.js，Vercel 是最佳选择
- ⚠️ 使用 Coze 平台：仅在特定需求下（如需要 Coze 平台的特定功能）

---

## 技术支持

如果在使用 Vercel 过程中遇到问题：

1. **查看 Vercel 文档**
   - https://vercel.com/docs
   - https://vercel.com/docs/deployments/overview

2. **Vercel 社区**
   - https://vercel.com/community

3. **Vercel 支持团队**
   - Pro 计划用户可访问 24/7 支持
   - 发送邮件至 support@vercel.com

4. **GitHub Discussions**
   - https://github.com/vercel/vercel/discussions

---

祝您部署成功！🚀

如有任何问题，请参考上述常见问题部分或查看 Vercel 官方文档。
