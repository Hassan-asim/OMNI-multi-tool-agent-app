import requests

def test_social_publish_stub():
    resp = requests.post('http://localhost:5000/api/social/publish', json={
        'postId': 'test-post',
        'platforms': ['twitter','linkedin']
    }, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert data.get('success') is True
    results = data.get('results', {})
    assert 'twitter' in results and results['twitter'].get('success') is True
    assert 'linkedin' in results and results['linkedin'].get('success') is True


