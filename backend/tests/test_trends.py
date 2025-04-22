from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_trends_no_range():
    res = client.get("/housing/trends")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "year" in data[0]
    assert "average_price" in data[0]
    
def test_trends_with_range():
    res = client.get("/housing/trends?start_year=2015&end_year=2015&start_month=1&end_month=10")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "year" in data[0]
    assert "average_price" in data[0]
    years = [i['year'] for i in data]
    assert all(year == 2015 for year in years)
    months = [i['month'] for i in data]
    assert all(month in range(1, 11) for month in months)


def test_trends_invalid_year_range():
    response = client.get("/housing/trends?start_year=2050&end_year=2060")
    assert response.status_code == 200
    data = response.json()
    assert data == [] 
    
    
def test_trends_flipped_year_range():
    response = client.get("/housing/trends?start_year=2010&end_year=2000")
    assert response.status_code == 200
    data = response.json()
    assert data == [] 
    
def test_trends_start_year_too_early():
    # be able to retrieve data from 2014 to 2015 even if the start year is 2013
    response = client.get("/housing/trends?start_year=2013&end_year=2015")
    assert response.status_code == 200
    data = response.json()
    assert data != [] 
    assert len(data) > 0
    
def test_trends_invalid_months():
    response = client.get("/housing/trends?start_year=2014&end_year=2015&start_month=13&end_month=15")
    assert response.status_code == 200
    data = response.json()
    assert data == [] 

    
    
