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

def test_summary_max_price_filter():
    response = client.get("/housing/summary?max_price=1000000")
    assert response.status_code == 200
    data = response.json()
    assert "average_price" in data

def test_summary_bedroom_category_medium_filter():
    response = client.get("/housing/summary?bedroom_category=medium")
    assert response.status_code == 200
    data = response.json()
    assert "average_price" in data
    assert "median_sqft" in data

def test_summary_min_sqft_filter():
    response = client.get("/housing/summary?min_sqft=2000")
    assert response.status_code == 200
    data = response.json()
    assert "average_price" in data

def test_summary_max_sqft_filter():
    response = client.get("/housing/summary?max_sqft=2000")
    assert response.status_code == 200
    data = response.json()
    assert "average_price" in data

def test_summary_year_built_filter():
    response = client.get("/housing/summary?year_built=2000")
    assert response.status_code == 200
    data = response.json()
    assert "average_price" in data

def test_summary_invalid_min_price_type():
    response = client.get("/housing/summary?min_price=abc")
    assert response.status_code == 200  
    data = response.json()
    assert data["total_sales"] == 0

def test_summary_invalid_filter_key():
    response = client.get("/housing/summary?min_prike=100000")  # Typo: "prike"
    assert response.status_code == 200  
    data = response.json()
    assert "total_sales" in data

