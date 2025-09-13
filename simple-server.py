import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Cambiar al directorio del proyecto
os.chdir(Path(__file__).parent)

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
    print(f"Servidor ejecutándose en http://localhost:{PORT}")
    print("Presiona Ctrl+C para detener el servidor")
    webbrowser.open(f'http://localhost:{PORT}')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido")
