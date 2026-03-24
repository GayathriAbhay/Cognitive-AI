import requests

# 1. Register
url_register = "http://127.0.0.1:5000/auth/register"
res = requests.post(url_register, json={"name": "sreya", "email": "sreya@gmail.com", "password": "babu"})
print("Register:", res.status_code, res.text)

# 2. Login
url_login = "http://127.0.0.1:5000/auth/login"
res = requests.post(url_login, json={"email": "sreya@gmail.com", "password": "babu"})
print("Login:", res.status_code, res.text)

if res.status_code == 200:
    token = res.json().get("access_token")
    print("Token:", token)
    
    # 3. GET Preferences
    url_prefs = "http://127.0.0.1:5000/student/preferences"
    headers = {"Authorization": f"Bearer {token}"}
    res_get = requests.get(url_prefs, headers=headers)
    print("GET Preferences:", res_get.status_code, res_get.text)
    
    # 4. PUT Preferences
    res_put = requests.put(url_prefs, headers=headers, json={"font_size": "large"})
    print("PUT Preferences:", res_put.status_code, res_put.text)

    # 5. POST Progress (History table check)
    url_progress = "http://127.0.0.1:5000/student/progress"
    # Testing with a high score to also verify rule-based adaptation
    res_progress = requests.post(
        url_progress, 
        headers=headers, 
        json={"topic": "Math", "score": 85}
    )
    print("POST Progress (History Check):", res_progress.status_code, res_progress.text)
