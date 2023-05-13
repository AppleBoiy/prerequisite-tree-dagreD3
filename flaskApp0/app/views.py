#!/usr/bin/env python3
from app import app


@app.route('/')
def home():
    return "hello world!"

@app.route('/home')
def index():
    return app.send_static_file('index.html')
