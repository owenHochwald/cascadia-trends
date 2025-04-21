from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app) 

def test_distribution_no_filters():
    response = client.get("/housing/distribution")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert isinstance(data[0], (int, float))

def test_distribution_filtered_by_sqft():
    response = client.get("/housing/distribution?min_sqft=500&max_sqft=3000")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        for price in data:
            assert isinstance(price, (int, float))
    else:
        assert data == []
