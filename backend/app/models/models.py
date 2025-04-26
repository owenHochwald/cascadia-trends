from pydantic import BaseModel

class SummaryResponse(BaseModel):
# skeleton for fastapi models
    average_price: float
    median_sqft: float
    total_sales: int