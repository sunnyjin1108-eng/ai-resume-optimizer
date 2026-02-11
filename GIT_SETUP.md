# AI 简历优化助手 - Git 仓库创建指南

**好消息！** 您的项目已经初始化了 Git 仓库，只需要连接到远程仓库（如 GitHub）并推送代码即可。

---

## 目录

1. [当前状态](#当前状态)
2. [创建 GitHub 仓库](#创建-github-仓库)
3. [连接远程仓库](#连接远程仓库)
4. [推送代码到 GitHub](#推送代码到-github)
5. [常见问题](#常见问题)

---

## 当前状态

✅ 项目已经初始化 Git 仓库
✅ 当前分支：`main`
✅ 工作目录干净（无未提交的更改）

接下来只需要：
1. 在 GitHub 创建远程仓库
2. 连接本地仓库到 GitHub
3. 推送代码

---

## 创建 GitHub 仓库

### 步骤 1：注册/登录 GitHub

1. 访问 GitHub：https://github.com
2. 注册新账号或登录现有账号

### 步骤 2：创建新仓库

1. 点击右上角 **"+"** 图标
2. 选择 **"New repository"**

### 步骤 3：填写仓库信息

填写以下信息：

#### Repository name（仓库名称）
```
ai-resume-optimizer
```
或
```
resume-optimizer
```

**建议：**
- 使用小写字母
- 使用连字符 `-` 分隔单词
- 避免使用空格和特殊字符

#### Description（仓库描述，可选）
```
AI 简历优化助手 - 智能简历优化和 HR 分析工具
```

#### Visibility（可见性）

| 选项 | 说明 | 推荐 |
|------|------|------|
| Public | 公开，所有人可见 | ✅ 推荐开源项目 |
| Private | 私有，仅自己可见 | ✅ 推荐个人项目 |

**选择：** `Public`（如果打算开源）或 `Private`（如果是个人项目）

### 步骤 4：初始化设置

**重要：不要勾选以下选项**
- ❌ Add a README file
- ❌ Add .gitignore
- ❌ Choose a license

**原因：** 您的本地仓库已经有这些文件，如果勾选会导致冲突。

保持默认（全部不勾选），点击 **"Create repository"** 按钮。

### 步骤 5：获取仓库地址

创建后，GitHub 会显示仓库地址，例如：

```
https://github.com/your-username/ai-resume-optimizer.git
```

**复制这个地址**，下一步会用到。

---

## 连接远程仓库

### 方法一：使用 HTTPS（推荐）

**优点：**
- 简单易用
- 不需要配置 SSH 密钥

**执行命令：**
```bash
git remote add origin https://github.com/your-username/ai-resume-optimizer.git
```

**替换：** `your-username` 为您的 GitHub 用户名

### 方法二：使用 SSH（高级用户）

**优点：**
- 更安全
- 不需要每次输入密码

**前提：** 需要先配置 SSH 密钥

**执行命令：**
```bash
git remote add origin git@github.com:your-username/ai-resume-optimizer.git
```

### 验证远程仓库连接

```bash
git remote -v
```

**预期输出：**
```
origin  https://github.com/your-username/ai-resume-optimizer.git (fetch)
origin  https://github.com/your-username/ai-resume-optimizer.git (push)
```

---

## 推送代码到 GitHub

### 步骤 1：确认当前分支

```bash
git branch
```

**预期输出：**
```
* main
```

### 步骤 2：推送代码

```bash
git push -u origin main
```

**参数说明：**
- `-u`：设置上游分支，以后只需 `git push` 即可
- `origin`：远程仓库名称
- `main`：本地分支名称

### 步骤 3：首次推送需要认证

如果使用 HTTPS：
1. 浏览器会弹出 GitHub 登录窗口
2. 输入用户名和密码（或 Personal Access Token）
3. 授权访问

如果使用 SSH：
1. 使用 SSH 密钥认证，无需输入密码

### 步骤 4：推送成功

成功后，输出类似：
```
Enumerating objects: 123, done.
Counting objects: 100% (123/123), done.
Delta compression using up to 8 threads
Compressing objects: 100% (98/98), done.
Writing objects: 100% (123/123), 100.50 KiB | 2.50 MiB/s, done.
Total 123 (delta 25), reused 0 (delta 0), pack-reused 0
To https://github.com/your-username/ai-resume-optimizer.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

### 步骤 5：验证推送

1. 打开 GitHub
2. 进入您的仓库页面
3. 确认所有文件都已上传

---

## 完整命令总结

将以下命令中的 `your-username` 替换为您的 GitHub 用户名，然后依次执行：

```bash
# 1. 添加远程仓库
git remote add origin https://github.com/your-username/ai-resume-optimizer.git

# 2. 验证远程仓库
git remote -v

# 3. 推送代码
git push -u origin main
```

**一条命令完成（推荐）：**
```bash
git remote add origin https://github.com/your-username/ai-resume-optimizer.git && git push -u origin main
```

---

## 后续使用

### 提交新更改

```bash
# 添加所有更改
git add .

# 提交更改
git commit -m "feat: 描述你的更改"

# 推送到 GitHub
git push
```

### 查看远程仓库状态

```bash
# 查看远程仓库
git remote -v

# 查看远程分支
git branch -r

# 拉取最新代码
git pull
```

---

## 常见问题

### Q1: 提示 "fatal: remote origin already exists"

**原因：** 已经配置了远程仓库 `origin`

**解决方案：**

**方法一：查看并更新：**
```bash
# 查看现有远程仓库
git remote -v

# 更新远程仓库地址
git remote set-url origin https://github.com/your-username/ai-resume-optimizer.git
```

**方法二：删除后重新添加：**
```bash
# 删除现有远程仓库
git remote remove origin

# 添加新的远程仓库
git remote add origin https://github.com/your-username/ai-resume-optimizer.git
```

### Q2: 推送时提示 "error: failed to push some refs"

**原因：** 远程仓库有本地没有的提交（例如初始化时创建了 README）

**解决方案：**

**方法一：合并远程更改：**
```bash
# 拉取远程更改
git pull origin main --allow-unrelated-histories

# 解决冲突（如果有）
# ...

# 重新推送
git push origin main
```

**方法二：强制推送（慎用）：**
```bash
# 强制覆盖远程仓库
git push -f origin main
```

**注意：** 强制推送会丢失远程仓库的更改，只在确定远程仓库为空时使用。

### Q3: 提示 "authentication failed"

**原因：** 认证失败（密码错误或需要 Personal Access Token）

**解决方案：**

**方法一：使用 Personal Access Token（推荐）：**

1. 生成 GitHub Personal Access Token：
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 勾选 `repo` 权限
   - 点击生成并复制 Token

2. 使用 Token 推送：
   ```bash
   # 推送时会提示输入密码，输入 Token 而不是密码
   git push -u origin main
   ```

**方法二：使用 Git Credential Helper（保存凭据）：**
```bash
# 配置凭据缓存（临时保存）
git config --global credential.helper cache

# 或永久保存（不推荐共享电脑）
git config --global credential.helper store
```

### Q4: 如何删除远程仓库？

**在 GitHub 网页端：**
1. 进入仓库页面
2. 点击 "Settings"
3. 滚动到底部
4. 点击 "Delete this repository"

**在本地：**
```bash
# 删除远程仓库连接
git remote remove origin
```

### Q5: 如何更改仓库名称？

**在 GitHub 网页端：**
1. 进入仓库页面
2. 点击 "Settings" → "General"
3. 找到 "Repository name"
4. 修改名称
5. 点击 "Rename"

**更新本地远程仓库地址：**
```bash
git remote set-url origin https://github.com/your-username/new-repo-name.git
```

### Q6: 如何克隆别人的仓库？

```bash
git clone https://github.com/username/repository-name.git
```

---

## Git 基础操作

### 查看状态
```bash
git status
```

### 查看提交历史
```bash
git log
```

### 查看分支
```bash
git branch
```

### 创建新分支
```bash
git checkout -b feature/new-feature
```

### 切换分支
```bash
git checkout main
```

### 合并分支
```bash
git checkout main
git merge feature/new-feature
```

### 删除分支
```bash
git branch -d feature/new-feature
```

---

## 完整工作流程

### 日常开发流程

```bash
# 1. 开始新功能
git checkout -b feature/new-feature

# 2. 修改代码...

# 3. 查看更改
git status

# 4. 添加更改
git add .

# 5. 提交更改
git commit -m "feat: 添加新功能"

# 6. 推送到远程
git push -u origin feature/new-feature

# 7. 在 GitHub 创建 Pull Request
```

### 合并到主分支

```bash
# 1. 切换到主分支
git checkout main

# 2. 拉取最新代码
git pull origin main

# 3. 合并功能分支
git merge feature/new-feature

# 4. 推送到远程
git push origin main

# 5. 删除功能分支
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

---

## Git 提交消息规范

### 常用类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加简历优化功能` |
| `fix` | 修复 Bug | `fix: 修复 PDF 导出失败问题` |
| `docs` | 文档更新 | `docs: 更新部署指南` |
| `style` | 代码格式 | `style: 格式化代码` |
| `refactor` | 重构 | `refactor: 优化组件结构` |
| `test` | 测试 | `test: 添加单元测试` |
| `chore` | 构建/工具 | `chore: 更新依赖` |

### 提交消息格式

```
<类型>(<范围>): <主题>

<详细描述>
```

**示例：**
```
feat(api): 添加公司信息查询接口

- 支持通过公司名称获取公司信息
- 添加 Clearbit Logo 集成
- 添加错误处理和缓存
```

---

## 下一步

创建 Git 仓库并推送到 GitHub 后，您就可以：

### ✅ 部署到 Vercel
1. 访问 https://vercel.com
2. 导入您的 GitHub 仓库
3. 自动部署（3 分钟）

### ✅ 部署到 Coze 平台
1. 访问 Coze 平台
2. 连接 GitHub 仓库
3. 配置并部署

### ✅ 协作开发
- 邀请团队成员
- 使用 Pull Request 代码审查
- 进行版本管理

---

祝您 Git 仓库创建成功！🎉

如有任何问题，请参考上述常见问题部分。
