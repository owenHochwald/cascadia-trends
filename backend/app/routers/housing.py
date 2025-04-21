from fastapi import APIRouter

router = APIRouter(
    prefix="/housing",
    tags=["housing"]
)


@router.get("/summary")
async def get_summary():
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
    