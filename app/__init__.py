from flask import Flask

app = Flask(__name__, static_folder='static')

#the CSRFProtect module should be used (and not disabled further with WTF_CSRF_ENABLED set to false):
csrf = CSRFProtect()
csrf.init_app(app) # Compliant

app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'df0331cefc6c2b9a5d0208a726a5d1c0fd37324feba25506'

from app import views # noqa
  