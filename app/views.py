from app import app


@app.route('/', methods=['POST'])
def home():
    return app.send_static_file("index.html")
