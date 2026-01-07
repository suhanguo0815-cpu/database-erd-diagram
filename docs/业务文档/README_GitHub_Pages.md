# 🚀 GitHub Pages 快速发布指南

## 一键发布（3步完成）

### 步骤 1: 在GitHub上创建仓库

访问此链接创建新仓库：
👉 **https://github.com/new**

**仓库设置：**
- Repository name: `database-erd-diagram`
- Description: `AI营养师小程序 - 数据库表关系图`
- 选择 **Public**（公开）
- ❌ **不要**勾选 "Add a README file"
- ❌ **不要**勾选 "Add .gitignore"
- ❌ **不要**勾选 "Choose a license"
- 点击 **"Create repository"**

### 步骤 2: 推送代码

在终端执行以下命令：

```bash
cd "/Users/guotongxue/Desktop/AI营养师小程序"

# 如果仓库已创建，执行以下命令推送
git remote add origin https://github.com/guotongxue/database-erd-diagram.git
git branch -M main
git push -u origin main
```

### 步骤 3: 启用GitHub Pages

1. 推送完成后，访问仓库设置页面：
   👉 **https://github.com/guotongxue/database-erd-diagram/settings/pages**

2. 在 "Source" 部分：
   - 选择 **"Deploy from a branch"**
   - Branch: 选择 **`main`**
   - Folder: 选择 **`/ (root)`**
   - 点击 **"Save"**

3. 等待1-2分钟，GitHub会自动部署

### 步骤 4: 访问您的网站

网站将在以下地址可用：
- 🌐 **主页**: https://guotongxue.github.io/database-erd-diagram/
- 📊 **直接访问图表**: https://guotongxue.github.io/database-erd-diagram/数据库表关系图.html

---

## ⚡ 快速命令（复制粘贴）

如果您已经创建了GitHub仓库，直接执行：

```bash
cd "/Users/guotongxue/Desktop/AI营养师小程序" && \
git remote add origin https://github.com/guotongxue/database-erd-diagram.git 2>/dev/null || \
git remote set-url origin https://github.com/guotongxue/database-erd-diagram.git && \
git branch -M main && \
git push -u origin main
```

---

## 📝 当前状态

✅ Git仓库已初始化  
✅ 文件已提交  
✅ 远程仓库已配置  
⏳ 等待：在GitHub创建仓库并推送代码  
⏳ 等待：启用GitHub Pages  

---

## 🔄 更新内容

以后更新内容只需要：

```bash
git add .
git commit -m "更新内容"
git push
```

GitHub Pages会自动重新部署（通常1-2分钟）。

---

## ❓ 常见问题

**Q: 推送时提示 "Repository not found"**  
A: 请先在GitHub上创建仓库（步骤1）

**Q: 推送时提示需要认证**  
A: 使用GitHub Personal Access Token，或配置SSH密钥

**Q: 图表无法显示**  
A: 确保网络连接正常，Mermaid.js通过CDN加载

**Q: Pages页面显示404**  
A: 等待几分钟，GitHub Pages部署需要时间


