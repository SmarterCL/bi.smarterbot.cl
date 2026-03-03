#!/usr/bin/env python3
"""
Simple webhook server for auto-deploy
Listens on port 8888 and triggers deploy.sh when GitHub webhook is received
"""

import http.server
import socketserver
import subprocess
import os
import json
from urllib.parse import urlparse

PORT = 8888
DEPLOY_SCRIPT = "/root/bi-smarterbot/deploy.sh"
LOG_FILE = "/var/log/bi-webhook.log"

class WebhookHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        # Log the request
        with open(LOG_FILE, 'a') as f:
            f.write(f"Received webhook: {self.headers.get('X-GitHub-Event', 'unknown')}\n")
        
        # Trigger deploy in background
        try:
            subprocess.Popen(
                ['bash', DEPLOY_SCRIPT],
                stdout=open(LOG_FILE, 'a'),
                stderr=subprocess.STDOUT
            )
            
            response = {"status": "success", "message": "Deploy triggered"}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        except Exception as e:
            response = {"status": "error", "message": str(e)}
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        
        with open(LOG_FILE, 'a') as f:
            f.write(f"Response: {response}\n\n")
    
    def do_GET(self):
        """Health check endpoint"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok", "service": "bi-webhook"}).encode())
    
    def log_message(self, format, *args):
        with open(LOG_FILE, 'a') as f:
            f.write(f"{self.address_string()} - {format % args}\n")

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), WebhookHandler) as httpd:
        print(f"Webhook server running on port {PORT}")
        httpd.serve_forever()
