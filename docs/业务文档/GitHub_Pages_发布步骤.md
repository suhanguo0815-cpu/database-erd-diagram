# GitHub Pages 发布步骤

## 快速发布指南

### 步骤 1: 在GitHub上创建新仓库

1. 访问 https://github.com/new
2. 仓库名称：`database-erd-diagram` （或您喜欢的名称）
3. 选择 **Public**（公开）
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

### 步骤 2: 推送代码到GitHub

在终端中执行以下命令（将 `YOUR_USERNAME` 替换为您的GitHub用户名）：

```bash
cd "/Users/guotongxue/Desktop/AI营养师小程序"

# 添加远程仓库（替换 YOUR_USERNAME 为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/database-erd-diagram.git

# 确保分支名为 main
git branch -M main

# 推送代码
git push -u origin main
```

### 步骤 3: 启用GitHub Pages

1. 在GitHub仓库页面，点击 **Settings**（设置）
2. 在左侧菜单中找到 **Pages**（页面）
3. 在 "Source"（源）部分：
   - 选择 **Deploy from a branch**
   - Branch（分支）选择 `main`
   - Folder（文件夹）选择 `/ (root)`
4. 点击 **Save**（保存）

### 步骤 4: 访问您的网站

等待几分钟后（通常1-5分钟），您的网站将在以下地址可用：

- **主页**: `https://YOUR_USERNAME.github.io/database-erd-diagram/`
- **直接访问图表**: `https://YOUR_USERNAME.github.io/database-erd-diagram/数据库表关系图.html`

## 注意事项

- GitHub Pages 发布可能需要几分钟时间
- 如果图表无法显示，请确保浏览器控制台没有错误
- 图表使用CDN加载Mermaid.js，需要网络连接

## 更新内容

以后如果需要更新内容，只需要：

```bash
git add .
git commit -m "更新内容"
git push
```

GitHub Pages 会自动重新部署（通常1-2分钟）。


