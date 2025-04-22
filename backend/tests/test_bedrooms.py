from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_bedrooms_no_filters():
    response = client.get("/housing/bedrooms")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert all(isinstance(k, str) for k in data.keys()) 
    assert all(isinstance(v, int) for v in data.values()) 

def test_bedrooms_filtered_by_price_range():
    response = client.get("/housing/bedrooms?min_price=400000&max_price=800000")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    if data:
        for category, count in data.items():
            assert isinstance(category, str)
            assert isinstance(count, int)

def test_bedrooms_filtered_by_small_category():
    response = client.get("/housing/bedrooms?bedroom_category=small")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "small" in data and "medium" in data and "large" in data

    assert data["medium"] == 0
    assert data["large"] == 0
    assert data["small"] >= 0
    assert data["total"] == data["small"]

def test_bedrooms_no_results():
    response = client.get("/housing/bedrooms?min_price=10000000")  # Unrealistic price
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert data == {"small": 0, "medium": 0, "large": 0, "total": 0}


def test_bedrooms_invalid_bedroom_category():
    response = client.get("/housing/bedrooms?bedroom_category=superluxury")
    assert response.status_code in (200, 422)
    if response.status_code == 200:
        assert response.json() == {"small": 0, "medium": 0, "large": 0, "total": 0}
