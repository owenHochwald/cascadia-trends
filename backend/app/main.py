from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import housing

app = FastAPI(
    title="Cascadia Housing Trends API",
    description="Explore and analyze housing trends for King County, WA",
    version="1.0.0"
)

origins = [
    "http://localhost:5174",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(housing.router)



# this stays because why not
@app.get("/")
async def root():
    return {"message": "Hello World"}