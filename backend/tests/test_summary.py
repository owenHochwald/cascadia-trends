from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)

def test_summary_no_filters():
    response = client.get("/housing/summary")
    assert response.status_code == 200
    data = response.json()
    assert "average_price" in data
    assert "median_sqft" in data
    assert "total_sales" in data
    
def test_summary_min_price_filter():
    response = client.get("/housing/summary?min_price=500000")
    assert response.status_code == 200
    data = response.json()
    assert "average_price" in data
    assert data["average_price"] >= 500000
    
def test_summary_max_price_filter():
    res = client.get("/housing/summary?max_price=1000000")
    assert res.status_code == 200
    data = res.json()
    assert "average_price" in data
    assert data["average_price"] <= 1000000
    
def test_summary_bedroom_category_filter():
    res = client.get("/housing/summary?bedroom_category=medium")
    assert res.status_code == 200
    data = res.json()
    assert "average_price" in data
    assert "bedroom_category" in data
    assert data["bedroom_category"] == "medium"
    
def test_summary_bedroom_category_small_filter():
    res = client.get("/housing/summary?bedroom_category=small")
    assert res.status_code == 200
    data = res.json()
    assert "bedroom_category" in data
    assert data["bedroom_category"] == "small"
    
    
def test_summary_min_sqft_filter():
    response = client.get("/housing/summary?min_sqft=2000")
    assert response.status_code == 200
    data = response.json()
    assert "min_sqft" in data
    assert data["min_sqft"] >= 2000
    
def test_summary_max_sqft_filter():
    res = client.get("/housing/summary?max_sqft=2000")
    assert res.status_code == 200
    data = res.json()
    assert "max_sqft" in data
    assert data["max_sqft"] <= 2000
    
def test_summary_year_built_filter():
    res = client.get("/housing/summary?year_built=2000")
    assert res.status_code == 200
    data = res.json()
    assert "year_built" in data
    assert data["year_built"] == 2000
    
def test_summary_error_bad_value():
    res = client.get("/housing/summary?min_price=abc")
    assert res.status_code == 422  # Unprocessable Entity
    data = res.json()
    assert "detail" in data
    assert "value is not a valid type" in data["detail"][0]["msg"]
    
def test_summary_error_bad_key():
    res = client.get("/housing/summary?min_prike=100000")
    assert res.status_code == 422  # Unprocessable Entity
    data = res.json()
    assert "detail" in data
    assert "key is not a valid filter" in data["detail"][0]["msg"]
