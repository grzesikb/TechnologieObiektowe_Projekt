# pip install pytest 
# pip install httpx
# python -m pytest -vv Tests/

from fastapi.testclient import TestClient
from main import app

from uuid import uuid4

client = TestClient(app)

# TEST AUTH 

test_user = ""
test_email = f"test-{uuid4()}@example.com"
test_password = "Qwerty123!"

def test_create_user():
    global test_user
    payload = {
        "email": test_email,
        "password": test_password,
        "role": 2,
        "personal_data": {
            "first_name": "John",
            "last_name": "Doe",
            "phone": "123456789"
        },
        "address": {
            "street": "Test Street",
            "postal_code": "12345",
            "city": "Test City",
            "house_number": "1",
            "country": "Test Country",
            "voivodeship": "Test Voivodeship"
        }
    }
    response = client.post("/user/", json=payload)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()
    test_user = response.json()["payload"]


test_access_token = ""
test_refresh_token = ""

def test_auth_login():
    global test_access_token,  test_refresh_token
    payload = {
       "email": test_email,
       "password": test_password
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 200
    assert response.json()["access_token"] != ""
    assert response.json()["refresh_token"] != ""

    test_refresh_token = response.json()["refresh_token"]

def test_auth_refreshToken():  
    global test_access_token,  test_refresh_token, header
    response = client.get("/auth/refreshToken",  headers={
        "Authorization": f"Bearer {test_refresh_token}"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.json()

    test_access_token = response.json()["access_token"]

    header = {
        "Authorization": f"Bearer {test_access_token}"
    }

# TEST USER

def test_create_personal_data():
    payload = {
        "personal_data": {
            "first_name": "John",
            "last_name": "Doe",
            "phone": "123456789"
        },
        "address": {
            "street": "Test Street",
            "postal_code": "12345",
            "city": "Test City",
            "house_number": "1",
            "country": "Test Country",
            "voivodeship": "Test Voivodeship"
        }
    }
    response = client.post("/user/create-personal-data", json=payload, headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

def test_check_email():
    response = client.get(f"/user/checkEmail?email=example@example.com",  headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

def test_get_usr_personal_data():
    user_id = test_user["user_id"]
    response = client.get(f"/user/user_info/{user_id}", headers=header)
    assert response.status_code == 200

def test_read_users_me():
    response = client.get("/user/me", headers=header)
    assert response.status_code == 200

def test_update_user():
    payload = {
        "personal_data": {
            "first_name": "John",
            "last_name": "Doe",
            "phone": "123456789"
        },
        "address": {
            "street": "New Street",
            "postal_code": "54321",
            "city": "New City",
            "house_number": "2",
            "country": "New Country",
            "voivodeship": "New Voivodeship"
        }
    }
    response = client.post("/user/update", json=payload, headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

def test_reset_pwd():
    payload = {
        "old_password": test_password,
        "password": test_password
    }
    response = client.post("/user/resetPwd", json=payload, headers=header)
    assert response.status_code == 200

def test_read_workers(): 
    response = client.get("/user/worker/workers", headers=header)
    assert response.status_code == 403 # Because worker cant read other workers

def test_delete_worker(): 
    response = client.delete(f"/user/worker/{test_user['user_id']}", headers=header)
    assert response.status_code == 403 # Because worker cant read other workers

# TEST ORDER

def test_create_order():
    global test_order
    payload = {
        "name": "Test Order",
        "bar_option": True,
        "security": True,
        "cost": 0,
        "payment_token": "string",
        "type": 1,
        "start_date": "string",
        "additional_info": "string",
        "status": 1,
        "artist_name": "string",
        "max_nr_of_people": 0,
        "minimal_age": 0,
        "company_name": "string",
        "catering": True,
        "number_of_seats": 0
    }
    response = client.post("/order/", json=payload, headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()
    test_order = response.json()["payload"]

def test_get_order():
    response = client.get("/order/", headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

def test_get_user_orders():
    response = client.get("/order/my", headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

def test_update_order():
    payload = {
        "id": test_order["id"],
        "name": "Test Order EDIT",
        "bar_option": True,
        "security": True,
        "cost": 0,
        "payment_token": "string",
        "type": 1,
        "start_date": "string",
        "additional_info": "string",
        "status": 1,
        "artist_name": "string",
        "max_nr_of_people": 0,
        "minimal_age": 0,
        "company_name": "string",
        "catering": True,
        "number_of_seats": 0
    }
    response = client.post("/order/update", json=payload, headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

def test_update_order_by_worker():
    payload = {
        "id": test_order["id"],
        "name": "Test Order EDIT WORKER",
        "bar_option": True,
        "security": True,
        "cost": 0,
        "payment_token": "string",
        "type": 1,
        "start_date": "string",
        "additional_info": "string",
        "status": 1,
        "artist_name": "string",
        "max_nr_of_people": 0,
        "minimal_age": 0,
        "company_name": "string",
        "catering": True,
        "number_of_seats": 0
    }
    response = client.post("/order/update_by_worker", json=payload, headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

def test_get_order_by_id():
    response = client.get(f"/order/{test_order['id']}", headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

def test_check_date_availability():
    response = client.post("/order/check_date?date=2023-06-08", headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

def test_get_orders_dates():
    response = client.get("/order/validation/orders_dates", headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()

# TEST GUEST

test_list = ""

def test_create_guest_list(): 
    global test_list
    payload = {
        "order_id": test_order["id"]
    }
    response = client.post("/guestList/", json=payload, headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()
    test_list = response.json()["payload"]

test_guest = ""

def test_create_guest():
    global test_guest
    payload = {
        "id": str(uuid4()),
        "order_id": test_order["id"],
        "name": "John",
        "surname": "Doe",
        "table_number": "1"
    }
    response = client.post("/guest/", json=payload, headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()
    test_guest = response.json()["payload"]

def test_create_guest_invalid_payload():
    payload = {
        "id": str(uuid4()),
        "order_id": "0",
        "name": "John",
        "surname": "Doe",
    }
    response = client.post("/guest/", json=payload, headers=header)
    assert response.status_code == 422

def test_delete_guest():
    response = client.delete(f"/guest/{test_guest['id']}", headers=header)
    assert response.status_code == 200

def test_delete_guestList(): 
    response = client.delete(f"/guestList/{test_list['id']}", headers=header)
    assert response.status_code == 200

# TEST INVOICE 

def test_create_valid_invoice():
    payload = {
        "invoice_nr": str(uuid4()),
        "created_at": "Jhon",
        "nip": 0,
        "client_id": str(uuid4()),
        "order_id": test_order["id"]
    }
    response = client.post('/invoice/', json=payload, headers=header)
    assert response.status_code == 409
    assert response.json()["status"] == 0

def test_get_invoice_when_dont_exist():
    response = client.get(f'/invoice/{test_order["id"]}', headers=header)
    assert response.status_code == 409 # Because dont create eariel
    assert response.json()["status"] == 0

def test_invoice_item(): 
    payload = {
        "name": "name",
        "count": 0,
        "price_per_item": 0,
        "invoice_id": str(uuid4())
    }
    response = client.post(f'/invoice_item/', json=payload, headers=header)
    assert response.status_code == 409 # Because dont create eariel
    assert response.json()["status"] == 0

# TEST PAYMENT 

def test_create_payment_details():
    payload = {
        "name": "jhon",
        "surname": "doe",
        "number": 1234567890123456778,
        "CCV": 233,
        "expiration_date": "12/2025"
    }
    response = client.post('/payment/', json=payload, headers=header)
    assert response.status_code == 403 # Because only user have this option

def test_update_payment_details():
    payload = {
        "name": "bob",
        "surname": "doe",
        "number": 1234567890123456778,
        "CCV": 233,
        "expiration_date": "12/2025",
        "id": str(uuid4())
    }
    response = client.post('/payment/update', json=payload, headers=header)
    assert response.status_code == 403 # Because only user have this option

# TEST ORDER DELETE

def test_delete_order():
    response = client.delete(f"/order/{test_order['id']}", headers=header)
    assert response.status_code == 200
    assert response.json()["status"] == 1
    assert "payload" in response.json()