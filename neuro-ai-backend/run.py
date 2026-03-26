from app import create_app

app = create_app()

if __name__ == '__main__':
    # Starts the backend server without auto-reloader to avoid connection resets during tests
    app.run(debug=True, port=5000, use_reloader=False)