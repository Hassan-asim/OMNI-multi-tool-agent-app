import requests

def test_health_local():
    resp = requests.get('http://localhost:5000/api/health', timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert data.get('status') == 'healthy'


