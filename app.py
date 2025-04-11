from flask import Flask, render_template, send_from_directory, abort
import os

app = Flask(__name__,
            static_folder='static',
            template_folder='templates')

# Dynamic route handler for all HTML files
@app.route('/<page_name>')
@app.route('/<page_name>.html')
def html_page(page_name):
    template_path = f"{page_name}.html"
    if not os.path.exists(os.path.join(app.template_folder, template_path)):
        abort(404)
    return render_template(template_path)

# Special cases (optional - can be handled by the dynamic route above)
@app.route('/')
def home():
    return render_template('login.html')

@app.route('/services')
def services():
    return render_template('Services.html')

# Static files routes
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/Images/<path:filename>')
def image_files(filename):
    return send_from_directory('Images', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
