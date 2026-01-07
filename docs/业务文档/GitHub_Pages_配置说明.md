# GitHub Pages 配置说明 - 让index.html可直接访问

## 当前仓库信息
- **仓库地址**: `https://github.com/suhanguo0815-cpu/database-erd-diagram.git`
- **分支**: `main`
- **index.html位置**: 根目录

## 配置步骤

### 方法一：通过GitHub网页配置（推荐）

1. **访问仓库设置**
   - 打开：`https://github.com/suhanguo0815-cpu/database-erd-diagram/settings/pages`

2. **启用GitHub Pages**
   - 在 "Source"（源）部分：
     - 选择 **Deploy from a branch**
     - Branch（分支）选择：`main`
     - Folder（文件夹）选择：`/ (root)` （根目录）
   - 点击 **Save**（保存）

3. **等待部署**
   - 通常需要 1-5 分钟
   - 部署完成后，会显示绿色的成功提示

4. **访问地址**
   - 主页（index.html）：`https://suhanguo0815-cpu.github.io/database-erd-diagram/`
   - 注意：URL末尾**不要**加 `index.html`，GitHub Pages会自动识别

### 方法二：使用GitHub Actions（可选）

如果需要更高级的部署控制，可以创建 `.github/workflows/pages.yml` 文件。

## 验证配置

### 检查GitHub Pages是否启用
访问：`https://github.com/suhanguo0815-cpu/database-erd-diagram/settings/pages`

如果看到类似以下信息，说明已启用：
```
Your site is live at https://suhanguo0815-cpu.github.io/database-erd-diagram/
```

### 测试访问
1. 等待几分钟后，访问：`https://suhanguo0815-cpu.github.io/database-erd-diagram/`
2. 应该能看到 `index.html` 的内容

## 常见问题

### Q: 访问404错误？
**A**: 
- 检查GitHub Pages是否已启用
- 确认分支是 `main` 且文件夹是 `/ (root)`
- 等待几分钟让GitHub完成部署
- 清除浏览器缓存后重试

### Q: 页面显示但样式丢失？
**A**: 
- 检查HTML中的资源路径（CSS、JS、图片）
- 确保使用相对路径或完整的CDN链接
- 检查浏览器控制台的错误信息

### Q: 如何更新内容？
**A**: 
```bash
git add .
git commit -m "更新内容"
git push origin main
```
GitHub Pages会自动重新部署（通常1-2分钟）

## 当前项目状态

✅ `index.html` 已在根目录  
✅ 已推送到GitHub  
⏳ 需要手动在GitHub网页上启用Pages设置

## 快速链接

- **仓库设置**: https://github.com/suhanguo0815-cpu/database-erd-diagram/settings
- **Pages设置**: https://github.com/suhanguo0815-cpu/database-erd-diagram/settings/pages
- **访问地址**: https://suhanguo0815-cpu.github.io/database-erd-diagram/

