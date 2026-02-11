# 如何在本地电脑创建项目并推送到 GitHub

## 问题说明

你的项目目前在这个沙箱环境中，本地电脑上还没有项目文件，所以执行 Git 命令时会提示 "not a git repository"。

## 解决方案

### 方案一：下载项目压缩包（推荐）

我已经帮你打包了项目文件，但需要你提供一种方式从沙箱环境传输文件到本地电脑。

**由于沙箱环境的限制，你需要手动创建项目文件。**

请按照以下步骤操作：

---

### 方案二：手动创建项目（最可靠）

#### 步骤 1：在本地电脑创建项目文件夹

1. 在桌面或任意位置新建文件夹
2. 命名为 `ai-resume-optimizer`

#### 步骤 2：初始化 Git 仓库

打开命令行（或 PowerShell），进入项目文件夹：

```bash
# 进入项目目录（替换为你的实际路径）
cd C:\Users\你的用户名\Desktop\ai-resume-optimizer

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "feat: AI简历优化助手 - 初始版本"
```

#### 步骤 3：添加远程仓库

```bash
git remote add origin https://github.com/sunnyjin1108-eng/ai-resume-optimizer.git
```

#### 步骤 4：推送代码

```bash
git push -u origin main
```

---

## 方案三：使用 GitHub Desktop（最简单，适合 Windows）

### 步骤 1：安装 GitHub Desktop

下载地址：https://desktop.github.com/

### 步骤 2：登录 GitHub

1. 打开 GitHub Desktop
2. 使用你的 GitHub 账号登录

### 步骤 3：克隆或创建仓库

**选项 A：从 GitHub 克隆（如果已有远程仓库）**

1. 点击 "File" → "Clone Repository"
2. 选择 `ai-resume-optimizer`
3. 选择本地保存位置
4. 点击 "Clone"

**选项 B：本地创建并推送**

1. 点击 "File" → "New Repository"
2. 填写仓库名称：`ai-resume-optimizer`
3. 选择本地保存位置
4. 点击 "Create Repository"
5. 在 GitHub 网站创建同名仓库
6. 在 GitHub Desktop 中点击 "Publish repository"

---

## 方案四：使用 VS Code（推荐开发者）

### 步骤 1：安装 VS Code

下载地址：https://code.visualstudio.com/

### 步骤 2：安装 Git

参考之前的指南安装 Git

### 步骤 3：在 VS Code 中打开项目

1. 打开 VS Code
2. 点击 "File" → "Open Folder"
3. 选择你的项目文件夹

### 步骤 4：使用 VS Code 的 Git 功能

1. 查看左侧边栏的 Git 图标（或按 `Ctrl+Shift+G`）
2. 查看文件更改
3. 输入提交消息
4. 点击 "Commit"
5. 点击 "Sync" 或在命令行执行 `git push`

---

## 快速测试方案

如果你只是想快速测试推送功能，可以创建一个简单的测试项目：

### 1. 创建测试文件夹

```bash
# 在桌面创建文件夹
mkdir test-git
cd test-git

# 创建一个测试文件
echo "Hello GitHub" > README.md

# 初始化 Git
git init

# 添加文件
git add .

# 提交
git commit -m "initial commit"

# 添加远程仓库
git remote add origin https://github.com/sunnyjin1108-eng/ai-resume-optimizer.git

# 推送
git push -u origin main
```

---

## 当前情况总结

### 问题：
- ❌ 你的项目在沙箱环境中
- ❌ 本地电脑还没有项目文件
- ❌ 无法执行 Git 命令

### 解决方案：
1. **推荐**：手动创建项目文件（参考方案二）
2. **简单**：使用 GitHub Desktop（参考方案三）
3. **专业**：使用 VS Code（参考方案四）
4. **测试**：创建测试项目（参考快速测试方案）

---

## 我的建议

**如果你是初学者：**
→ 使用方案三（GitHub Desktop），图形界面，操作简单

**如果你是开发者：**
→ 使用方案四（VS Code），功能强大，集成好

**如果你只是想快速测试：**
→ 使用快速测试方案，5 分钟完成

---

## 下一步

选择一个方案，按照步骤操作。如果有任何问题，随时告诉我！

---

## 常见错误

### Q1: 提示 "fatal: not a git repository"
**原因**：当前目录不是 Git 仓库
**解决**：先执行 `git init` 初始化仓库

### Q2: 提示 "nothing to commit"
**原因**：没有文件可以提交
**解决**：先创建一些文件，再执行 `git add .`

### Q3: 提示 "remote origin already exists"
**原因**：已经添加了远程仓库
**解决**：执行 `git remote remove origin` 后重新添加

### Q4: 提示 "failed to push"
**原因**：认证失败或远程仓库不存在
**解决**：
- 确认已在 GitHub 创建仓库
- 检查用户名和密码（或 Personal Access Token）
