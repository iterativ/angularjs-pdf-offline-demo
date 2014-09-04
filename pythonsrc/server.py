# grunt flask integration from:
# http://thomassileo.com/blog/2013/12/12/using-yeoman-with-flask/

import os

from flask import Flask, current_app, send_file, render_template_string, jsonify, request, make_response, render_template
from werkzeug.exceptions import NotFound

from crossdomain.crossdomain import crossdomain

PROJECT_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir)
DEBUG = int(os.environ.get('FLASK_YEOMAN_DEBUG', False))
YEOMAN_PATH = 'dist'
# While developing, we serve the app directory
if DEBUG:
    YEOMAN_PATH = 'app'

DEFAULT_PATH = os.path.join(PROJECT_ROOT, YEOMAN_PATH)
PDF_PATH = os.path.join(DEFAULT_PATH, 'pdf')

app = Flask(__name__)

@app.route('/listpdf', methods=['GET'])
@crossdomain(origin='*')
def pdf_files():
    files = [f for f in os.listdir(PDF_PATH) if os.path.isfile(os.path.join(PDF_PATH, f))]
    return jsonify(files=files)

@app.route('/manifest.appcache')
def manifest():
    default_path_abs = os.path.join(DEFAULT_PATH, 'manifest.appcache')
    response = make_response(send_file(default_path_abs))
    response.headers["Content-Type"] = "text/cache-manifest"
    return response

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_index(path):
    default_path_abs = os.path.join(DEFAULT_PATH, path)

    if os.path.isfile(default_path_abs):
        if path == 'index.html':
            # If index.html is requested, we inject the Flask current_app config
            return render_template_string(open(default_path_abs).read().decode('utf-8'),
                                          config=current_app.config, debug=DEBUG)
        return send_file(default_path_abs)

    # While development, we must check the .tmp dir as fallback
    if DEBUG:
        # The .tmp dir is used by compass and for the template file
        alt_path = os.path.join(PROJECT_ROOT, '.tmp')
        alt_path_abs = os.path.join(alt_path, path)
        if os.path.isfile(alt_path_abs):
            return send_file(alt_path_abs)

        if path.startswith('bower_components'):
            alt_path = PROJECT_ROOT
            alt_path_abs = os.path.join(alt_path, path)
            if os.path.isfile(alt_path_abs):
                return send_file(alt_path_abs)

    raise NotFound()


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)