#!/usr/bin/env python3
"""
简单的HTTP服务器，用于本地预览数据库表关系图
运行后可以通过浏览器访问 http://localhost:8000/数据库表关系图.html
"""
import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加CORS头，允许跨域访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def main():
    # 获取当前脚本所在目录
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        url = f"http://localhost:{PORT}/数据库表关系图.html"
        print(f"\n{'='*60}")
        print(f"🚀 数据库表关系图服务器已启动！")
        print(f"{'='*60}")
        print(f"\n📍 本地访问地址：")
        print(f"   {url}")
        print(f"\n📍 网络访问地址（局域网）：")
        print(f"   http://{socketserver.socket.gethostbyname(socketserver.socket.gethostname())}:{PORT}/数据库表关系图.html")
        print(f"\n💡 提示：")
        print(f"   - 按 Ctrl+C 停止服务器")
        print(f"   - 浏览器会自动打开页面")
        print(f"{'='*60}\n")
        
        # 自动打开浏览器
        try:
            webbrowser.open(url)
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 服务器已停止")

if __name__ == "__main__":
    main()

