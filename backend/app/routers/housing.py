from fastapi import APIRouter
from app.services import housing_service
from typing import Optional, Any
from app.models.models import *

router = APIRouter(
    prefix="/housing",
    tags=["housing"]
)

@router.get("/summary", response_model=SummaryResponse)
async def get_summary(
    min_price: Optional[str] = None,
    max_price: Optional[str] = None,
    bedroom_category: Optional[str] = None,
    min_sqft: Optional[str] = None,
    max_sqft: Optional[str] = None,
) -> Any:
    try:
        min_price = float(min_price) if min_price is not None else None
        max_price = float(max_price) if max_price is not None else None
        min_sqft = float(min_sqft) if min_sqft is not None else None
        max_sqft = float(max_sqft) if max_sqft is not None else None
        # bedroom_category is passed as string (no cast)
    except ValueError:
        return {
            "average_price": 0,
            "median_sqft": 0,
            "total_sales": 0
        }
    
    return housing_service.get_summary(
        min_price=min_price,
        max_price=max_price,
        bedroom_category=bedroom_category,
        min_sqft=min_sqft,
        max_sqft=max_sqft
    )


@router.get("/trends", response_model=TrendsResponse)
async def get_trends(
    start_year: int | None = None,
    end_year: int | None = None,
    start_month: int | None = None,
    end_month: int | None = None
) -> Any:
    
    if start_year and end_year and start_year > end_year:
        return []
    if start_month and end_month and (start_month < 1 or end_month > 12):
        return []
    if start_month and end_month and start_month > end_month:
        return []
    
    return housing_service.get_trends(
        start_year=start_year,
        end_year=end_year,
        start_month=start_month,
        end_month=end_month
    )
    

@router.get("/scatter", response_model=ScatterResponse)
async def get_scatter(
    min_sqft: float | None = None,
    max_sqft: float | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
) -> Any:
    data = housing_service.get_scatter(
        min_sqft=min_sqft, max_sqft=max_sqft, min_price=min_price, max_price=max_price
    )
    return data if data else {}
    

@router.get("/size-distribution", response_model=DistributionResponse)
async def get_size_distribution(
    min_sqft: float | None = None,
    max_sqft: float | None = None,
) -> Any:
    return housing_service.get_size_distribution(
        min_sqft=float(min_sqft) if min_sqft is not None else None,
        max_sqft=float(max_sqft) if max_sqft is not None else None
    )
    
@router.get("/price-distribution", response_model=DistributionResponse)
async def get_price_distribution(
    min_price: float | None = None,
    max_price: float | None = None,
) -> Any:
    return housing_service.get_price_distribution(
        min_price=float(min_price) if min_price is not None else None,
        max_price=float(max_price) if max_price is not None else None
    )

    

@router.get("/bedrooms", response_model=BedroomResponse)
async def get_bedroom_distribution(
    min_price: float | None = None,
    max_price: float | None = None,
    bedroom_category: str | None = None,
) -> Any:
    try:
        min_price = float(min_price) if min_price is not None else None
        max_price = float(max_price) if max_price is not None else None
    except ValueError:
        return {
            "small": 0,
            "medium": 0,
            "large": 0,
            "total": 0
        }
    
    return housing_service.get_bedrooms(
        min_price=min_price,
        max_price=max_price,
        bedroom_category=bedroom_category
    )
    