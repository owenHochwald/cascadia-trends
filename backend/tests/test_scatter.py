from fastapi.testclient import TestClient
from app.models.models import ScatterResponse
from app.routers.housing import router as housing_router

client = TestClient(housing_router)


def test_scatter_no_filter():
    res = client.get("/housing/scatter")
    assert res.status_code == 200
    data = res.json()
    
    assert isinstance(data, list)
    assert len(data) > 0
    assert "price" in data[0]
    assert "bedroom_category" in data[0]
    assert "sqft_living" in data[0]
    
def test_scatter_with_filter():
    res = client.get("/housing/scatter?min_sqft=1000&max_sqft=3000&min_price=300000&max_price=700000")
    assert res.status_code == 200
    data = res.json()
    
    assert isinstance(data, list)
    assert len(data) > 0
    assert "price" in data[0]
    assert "bedroom_category" in data[0]
    assert "sqft_living" in data[0]
    
    for item in data:
        assert item["sqft_living"] >= 1000
        assert item["sqft_living"] <= 3000
        assert item["price"] >= 300000
        assert item["price"] <= 700000
        
# def test_scatter_empty_result():
#     res = client.get("/housing/scatter?min_sqft=0&max_sqft=0")
#     assert res.status_code == 200
#     data = res.json()
#     assert len(data) == 0