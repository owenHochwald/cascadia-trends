from fastapi import APIRouter

router = APIRouter(
    prefix="/housing",
    tags=["housing"]
)

# example request: GET /housing/summary?min_price=300000&max_price=700000&bedrooms=3,4&waterfront=1
@router.get("/summary")
async def get_summary(
    min_price: float | None = None,
    max_price: float | None = None,
    bedroom_category: str | None = None,
    min_sqft: float | None = None,
    max_sqft: float | None = None,
    year_built: float | None = None,
):
    return []

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
async def get_price_distribution():
    return []
    

@router.get("/bedrooms")
async def get_bedroom_distribution():
    return []
    