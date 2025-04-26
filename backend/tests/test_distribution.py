from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app) 

def test_size_distribution_no_filters():
    response = client.get("/housing/size-distribution")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0  

def test_size_distribution_filtered_by_sqft():
    response = client.get("/housing/size-distribution?min_sqft=500&max_sqft=3000")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0  
    assert all(item >= 500 and item <= 3000 for item in data)
    
def test_price_distribution_no_filters():
    response = client.get("/housing/price-distribution")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0  

def test_price_distribution_with_filters():
    response = client.get("/housing/price-distribution?min_price=100000&max_price=300000")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0  
    assert all(item >= 100000 and item <= 300000 for item in data)
    
def test_price_distribution_bad_filter():
    response = client.get("/housing/price-distribution?min_price=abc&max_price=xyz")
    assert response.status_code == 422 



