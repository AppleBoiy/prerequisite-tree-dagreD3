from flask import Flask

app = Flask(__name__, static_folder='static')

app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'df0331cefc6c2b9a5d0208a726a5d1c0fd37324feba25506'

from app import views # noqa
