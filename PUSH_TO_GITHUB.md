# 快速推送代码到 GitHub

## 步骤一：在 GitHub 创建仓库

1. 访问：https://github.com/new
2. 填写仓库名称：`ai-resume-optimizer`
3. **重要：不要勾选任何选项**（README、.gitignore、license 全部不选）
4. 点击 **Create repository**
5. 复制仓库地址，例如：`https://github.com/你的用户名/ai-resume-optimizer.git`

---

## 步骤二：添加远程仓库并推送

将下面的命令中的 `你的用户名` 替换为你的 GitHub 用户名，然后复制粘贴执行：

```bash
git remote add origin https://github.com/你的用户名/ai-resume-optimizer.git && git push -u origin main
```

---

## 示例

如果你的 GitHub 用户名是 `zhangsan`，命令是：

```bash
git remote add origin https://github.com/zhangsan/ai-resume-optimizer.git && git push -u origin main
```

---

## 如果提示需要认证

1. 浏览器会弹出 GitHub 登录窗口
2. 输入用户名和密码（或 Personal Access Token）
3. 点击授权

---

## 推送成功后

打开 GitHub 仓库页面，你会看到所有文件都已上传。

---

## 常见问题

### 问题：提示 "remote origin already exists"

执行以下命令：

```bash
git remote remove origin
git remote add origin https://github.com/你的用户名/ai-resume-optimizer.git
git push -u origin main
```

### 问题：提示 "failed to push some refs"

执行以下命令强制推送（仅在你确定远程仓库为空时使用）：

```bash
git push -f origin main
```

---

## 后续提交新代码

修改代码后，只需执行：

```bash
git add .
git commit -m "feat: 描述你的更改"
git push
```

就这么简单！🎉
