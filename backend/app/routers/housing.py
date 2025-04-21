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
async def get_trends():
    return []
    

@router.get("/scatter")
async def get_scatter():
    return []
    

@router.get("/distribution")
async def get_price_distribution():
    return []
    

@router.get("/bedrooms")
async def get_bedroom_distribution():
    return []
    