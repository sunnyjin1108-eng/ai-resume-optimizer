# AI 简历优化助手 - Coze 平台部署指南

本文档提供通过 Coze 平台 Web 界面手动部署应用的详细步骤。

---

## 目录

1. [准备工作](#准备工作)
2. [Coze 平台部署步骤](#coze-平台部署步骤)
3. [配置自定义域名](#配置自定义域名)
4. [常见问题](#常见问题)

---

## 准备工作

### 1. 创建代码仓库

如果还没有代码仓库，需要先将代码推送到 Git 仓库（GitHub 或 GitLab）。

#### 步骤 1：初始化 Git 仓库
```bash
# 检查是否已有 .git 目录
ls -la .git

# 如果没有，初始化 Git 仓库
git init
```

#### 步骤 2：添加所有文件到 Git
```bash
git add .
```

#### 步骤 3：提交代码
```bash
git commit -m "feat: AI简历优化助手 - 初始版本"
```

#### 步骤 4：连接到远程仓库

**GitHub:**
```bash
# 创建新仓库后，执行：
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

**GitLab:**
```bash
git remote add origin https://gitlab.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 2. 准备项目信息

在部署前，准备好以下信息：

| 项目 | 内容 | 示例 |
|------|------|------|
| 应用名称 | AI 简历优化助手 |
| 应用描述 | 智能简历优化和HR分析工具，支持简历优化、推荐原因分析、风险提示和面试建议 |
| 技术栈 | Next.js 16, TypeScript 5, Tailwind CSS 4 |
| 端口 | 5000 |
| 启动命令 | `npx next start --port 5000` |

---

## Coze 平台部署步骤

### 步骤 1：登录 Coze 平台

1. 访问 Coze 平台官网：
   - 国内：https://www.coze.cn
   - 国际：https://www.coze.com

2. 使用您的账号登录
   - 支持手机号、邮箱登录
   - 支持微信、Google 等第三方登录

### 步骤 2：进入应用管理

1. 登录后，进入控制台
2. 点击"应用管理"或"我的应用"
3. 点击"创建应用"或"新建应用"按钮

### 步骤 3：填写应用基本信息

填写以下信息：

#### 应用名称
```
AI 简历优化助手
```

#### 应用描述
```
智能简历优化和HR分析工具，支持：
- 简历智能优化
- 推荐原因分析
- 风险提示
- 面试提问建议
- 多格式导出（PDF、Word、图片）
```

#### 应用分类
选择：工具 / 效率 / HR / 其他

#### 应用图标（可选）
- 上传应用图标（建议尺寸：512x512px）
- 格式：PNG 或 JPG

#### 应用标签（可选）
```
简历, HR, 面试, AI, 效率工具
```

填写完成后，点击"下一步"或"创建"。

### 步骤 4：选择部署方式

Coze 平台通常提供以下部署方式：

#### 方式 A：连接代码仓库（推荐）

**步骤 4.1：选择代码仓库类型**
- GitHub
- GitLab
- Gitee（码云）

**步骤 4.2：授权访问**
1. 点击"授权"或"连接"按钮
2. 跳转到 GitHub/GitLab 授权页面
3. 选择要授权的仓库
4. 点击"授权应用"

**步骤 4.3：选择项目**
1. 从仓库列表中选择您的项目
2. 选择要部署的分支（通常是 `main` 或 `master`）
3. 点击"下一步"

#### 方式 B：手动上传代码包

**步骤 4.1：打包项目代码**
```bash
# 在项目根目录，打包项目（排除 node_modules）
tar -czf resume-optimizer.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=*.log \
  .

# 或者使用 zip
zip -r resume-optimizer.zip \
  -x node_modules/* \
  -x .next/* \
  -x .git/* \
  -x *.log \
  .
```

**步骤 4.2：上传代码包**
1. 点击"上传代码"或"手动部署"
2. 选择打包好的文件（`.tar.gz` 或 `.zip`）
3. 点击"上传"
4. 等待上传完成

**步骤 4.3：选择构建方式**
- 自动构建（推荐）
- 手动配置

### 步骤 5：配置构建设置

#### 5.1 选择运行环境

**Node.js 版本：**
```
Node.js 24.x
```

**包管理器：**
```
pnpm
```

#### 5.2 配置构建命令

**安装依赖：**
```bash
pnpm install
```

**构建命令：**
```bash
pnpm run build
```

**启动命令：**
```bash
npx next start --port 5000
```

或者使用：
```bash
node .next/standalone/server.js
```

#### 5.3 配置环境变量（如果需要）

添加以下环境变量：

```bash
NODE_ENV=production
PORT=5000
```

如果有其他需要的环境变量，一并添加。

### 步骤 6：配置端口

**应用端口：**
```
5000
```

**协议：**
```
HTTP
```

### 步骤 7：配置域名（可选）

#### 7.1 使用默认域名

Coze 平台通常会提供一个默认域名，格式类似：
```
https://your-app-id.coze.cn
```
或
```
https://your-app-id.coze.com
```

#### 7.2 使用自定义域名

如果您有自定义域名，可以在此配置（详见下一节）。

### 步骤 8：启动部署

1. 检查所有配置是否正确
2. 点击"部署"或"发布"按钮
3. 等待部署完成

**部署过程包括：**
- 拉取代码（如果连接了仓库）
- 安装依赖
- 构建项目
- 启动服务
- 健康检查

### 步骤 9：验证部署

1. 查看部署日志，确认没有错误
2. 访问应用地址，测试功能
3. 检查页面是否正常加载

**测试清单：**
- [ ] 页面能否正常访问
- [ ] 简历优化功能是否正常
- [ ] 推荐原因是否显示
- [ ] 风险提示是否显示
- [ ] 面试提问建议是否显示
- [ ] 导出功能是否正常

### 步骤 10：发布应用

部署成功后，可以选择：

1. **设置为公开**：所有用户可以访问
2. **设置为私有**：仅自己或指定用户可以访问
3. **设置为内测**：邀请测试用户访问

---

## 配置自定义域名

如果您希望使用自定义域名（如 `resume.example.com`），按照以下步骤配置：

### 前提条件

- 您已拥有一个域名（可在阿里云、腾讯云、Namecheap 等购买）
- 您有权管理该域名的 DNS 设置

### 步骤 1：添加自定义域名

1. 进入 Coze 平台应用管理
2. 找到您的应用
3. 进入"设置"或"域名配置"
4. 点击"添加域名"

### 步骤 2：输入域名

输入您的自定义域名：

```
resume.example.com
```

或

```
www.resume.example.com
```

**注意：**
- 不要输入 `http://` 或 `https://`
- 不要输入端口号

### 步骤 3：配置 DNS 解析

Coze 平台会为您提供 CNAME 记录值，例如：

```
cname-app.coze.cn
```

或

```
your-app-id.coze.com
```

#### 在域名服务商处配置 DNS

**阿里云：**

1. 登录阿里云控制台
2. 进入"域名" → "域名列表"
3. 找到您的域名，点击"解析"
4. 添加记录：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|-------|-----|
| CNAME | www | cname-app.coze.cn | 10分钟 |

如果使用根域名（不带 www）：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|-------|-----|
| CNAME | @ | cname-app.coze.cn | 10分钟 |

**腾讯云：**

1. 登录腾讯云控制台
2. 进入"域名" → "域名管理"
3. 找到您的域名，点击"解析"
4. 添加记录（同上）

**Namecheap：**

1. 登录 Namecheap
2. 进入"Domain List" → 点击"Manage"按钮
3. 选择"Advanced DNS"
4. 添加新的 CNAME 记录

### 步骤 4：验证 DNS 配置

1. 返回 Coze 平台
2. 点击"验证"或"检查DNS"
3. 等待 DNS 生效（通常需要 10-60 分钟）

**验证命令：**
```bash
# 检查 CNAME 记录
dig CNAME resume.example.com

# 或使用 nslookup
nslookup resume.example.com

# 或使用在线工具
# https://www.whatsmydns.net/
```

### 步骤 5：启用 SSL/HTTPS

1. DNS 验证通过后，Coze 平台会自动申请 SSL 证书
2. 等待证书签发（通常几分钟）
3. 启用强制 HTTPS（推荐）

### 步骤 6：测试域名

1. 在浏览器中访问您的域名：
   ```
   https://resume.example.com
   ```

2. 检查：
   - 页面是否正常加载
   - 地址栏是否显示锁图标（HTTPS）
   - 所有功能是否正常

---

## 常见问题

### Q1: 部署失败，提示"构建错误"

**解决方案：**
1. 检查 Node.js 版本是否为 24.x
2. 检查 `package.json` 中的脚本是否正确
3. 查看构建日志，定位具体错误
4. 本地测试构建：
   ```bash
   pnpm install
   pnpm run build
   ```

### Q2: 应用启动成功，但无法访问

**解决方案：**
1. 检查端口配置（应为 5000）
2. 检查防火墙设置
3. 查看应用日志，确认服务是否正常启动
4. 检查 Coze 平台的健康检查配置

### Q3: DNS 解析不生效

**解决方案：**
1. 确认 CNAME 记录值是否正确
2. 检查 TTL 设置（建议设置为 10 分钟）
3. 使用 `nslookup` 或 `dig` 命令验证
4. 等待更长时间（最长 48 小时）
5. 联系域名服务商

### Q4: HTTPS 证书无法获取

**解决方案：**
1. 确认 DNS 解析已生效
2. 确认域名指向正确的 Coze 平台域名
3. 检查域名状态（是否被封禁）
4. 联系 Coze 平台客服

### Q5: 应用响应慢

**解决方案：**
1. 检查应用日志，确认是否有错误
2. 检查服务器资源使用情况
3. 优化代码性能
4. 考虑升级服务器配置
5. 启用 CDN 加速

### Q6: 如何更新应用？

**通过代码仓库（推荐）：**
```bash
# 1. 提交代码到仓库
git add .
git commit -m "feat: 更新功能"
git push

# 2. 在 Coze 平台触发重新部署
```

**手动上传：**
1. 打包新代码
2. 在 Coze 平台上传新版本
3. 点击部署

---

## 项目配置文件参考

### package.json
```json
{
  "name": "projects",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "bash ./scripts/build.sh",
    "dev": "bash ./scripts/dev.sh",
    "start": "bash ./scripts/start.sh",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^4",
    "coze-coding-dev-sdk": "^0.7.15"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.1.1"
  },
  "engines": {
    "node": "24.x"
  }
}
```

### next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    PORT: '5000',
  },
};

export default nextConfig;
```

---

## 部署后检查清单

部署完成后，请确认以下事项：

### 功能检查
- [ ] 页面能否正常访问
- [ ] 输入公司名称、职位、简历后能否优化
- [ ] 推荐原因是否正确显示
- [ ] 风险提示是否正确显示
- [ ] 面试提问建议是否正确显示
- [ ] 图片导出功能是否正常
- [ ] PDF 导出功能是否正常
- [ ] Word 导出功能是否正常
- [ ] Word 导出包含完整的 HR 分析内容

### 性能检查
- [ ] 页面加载时间 < 3 秒
- [ ] 简历优化功能响应正常
- [ ] 没有明显的卡顿或延迟

### 安全检查
- [ ] HTTPS 已启用
- [ ] SSL 证书有效
- [ ] 没有安全警告

### SEO 检查（可选）
- [ ] 页面标题正确
- [ ] Meta 描述正确
- [ ] Open Graph 标签正确

---

## 技术支持

如果在部署过程中遇到问题：

1. **查看 Coze 平台文档**
   - 访问 Coze 平台的帮助中心
   - 查看部署相关文档

2. **联系 Coze 平台客服**
   - 通过平台内置的客服系统
   - 发送邮件至 support@coze.com

3. **查看应用日志**
   - 在 Coze 平台控制台查看实时日志
   - 检查错误信息

4. **社区支持**
   - 访问 Coze 开发者社区
   - 搜索相关问题
   - 提问获取帮助

---

## 部署流程总结

```
1. 准备代码
   ├─ 初始化 Git 仓库
   ├─ 提交代码
   └─ 推送到远程仓库

2. 登录 Coze 平台
   ├─ 创建应用
   └─ 填写应用信息

3. 配置部署
   ├─ 连接代码仓库（推荐）
   ├─ 配置构建命令
   ├─ 设置环境变量
   └─ 配置端口

4. 启动部署
   ├─ 点击部署按钮
   ├─ 等待构建完成
   └─ 验证应用功能

5. 配置域名（可选）
   ├─ 添加自定义域名
   ├─ 配置 DNS 解析
   ├─ 启用 HTTPS
   └─ 测试域名访问

6. 发布应用
   ├─ 设置访问权限
   └─ 分享给用户
```

---

祝您部署成功！🎉

如有任何问题，请参考上述常见问题部分或联系技术支持。
