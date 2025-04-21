from fastapi import APIRouter
from app.services import housing_service
from typing import Optional

router = APIRouter(
    prefix="/housing",
    tags=["housing"]
)

@router.get("/summary")
async def get_summary(
    min_price: Optional[str] = None,
    max_price: Optional[str] = None,
    bedroom_category: Optional[str] = None,
    min_sqft: Optional[str] = None,
    max_sqft: Optional[str] = None,
):
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


@router.get("/trends")
async def get_trends(
    start_year: int | None = None,
    end_year: int | None = None,
    start_month: int | None = None,
    end_month: int | None = None
):
    return []
    

@router.get("/scatter")
async def get_scatter(
    min_sqft: float | None = None,
    max_sqft: float | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
):
    return []
    

@router.get("/distribution")
async def get_price_distribution(
    min_sqft: float | None = None,
    max_sqft: float | None = None,
):
    return []
    

@router.get("/bedrooms")
async def get_bedroom_distribution(
    min_price: float | None = None,
    max_price: float | None = None,
    bedroom_category: str | None = None,
):
    return []
    