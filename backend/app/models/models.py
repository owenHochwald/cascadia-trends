from pydantic import BaseModel, RootModel
from typing import List


# GET summary response model
class SummaryResponse(BaseModel):
    average_price: float
    median_sqft: float
    total_sales: int
    
# GET trends response models
class TrendItem(BaseModel):
    year: int
    month: int
    average_price: float
    median_sqft: float
    average_price_per_sqft: float
    total_sales: int
    
class TrendsResponse(RootModel[List[TrendItem]]):
    pass

#GET scatter response model
class ScatterItem(BaseModel):
    price: float
    bedroom_category: str
    sqft_living: float
    
class ScatterResponse(RootModel[List[ScatterItem]]):
    pass
    
# GET size / price distribution response model
class DistributionResponse(RootModel[List[float]]):
    pass

# GET bedroom response model
class BedroomResponse(BaseModel):
    small: int
    medium: int
    large: int
    total: int