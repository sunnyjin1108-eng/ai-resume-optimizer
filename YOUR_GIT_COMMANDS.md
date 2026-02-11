# 为您准备的推送命令

## 步骤一：在 GitHub 创建仓库

1. 访问：https://github.com/new
2. 填写仓库名称：`ai-resume-optimizer`
3. **重要：不要勾选任何选项**（README、.gitignore、license 全部不选）
4. 点击 **Create repository**

---

## 步骤二：在本地电脑执行以下命令

打开你的电脑终端（或 VS Code 终端），依次执行：

```bash
# 添加远程仓库
git remote add origin https://github.com/sunnyjin1108-eng/ai-resume-optimizer.git

# 验证远程仓库
git remote -v

# 推送代码
git push -u origin main
```

---

## 为什么需要在本地电脑执行？

推送代码到 GitHub 需要身份验证（用户名和密码），这个过程需要在你的电脑上完成，无法在沙箱环境中自动执行。

---

## 首次推送需要认证

执行 `git push` 时，会要求输入：

1. **Username**: `sunnyjin1108-eng`
2. **Password**: 你的 GitHub 密码或 **Personal Access Token**

### 关于 Personal Access Token

如果提示密码无效，GitHub 可能要求使用 Personal Access Token：

**创建步骤：**
1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 点击 "Generate token"
5. 复制生成的 Token（只显示一次）
6. 推送时，密码输入这个 Token

---

## 推送成功后

打开 https://github.com/sunnyjin1108-eng/ai-resume-optimizer 查看你的代码！

---

## 下一步：部署到 Vercel

代码推送到 GitHub 后，就可以部署到 Vercel 了：

1. 访问：https://vercel.com
2. 登录你的账号（推荐用 GitHub 账号登录）
3. 点击 "Add New" → "Project"
4. 选择 `ai-resume-optimizer` 仓库
5. 点击 "Import"
6. 点击 "Deploy"

3 分钟内完成部署！🚀
