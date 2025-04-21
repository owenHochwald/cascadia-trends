from pydantic import BaseSettings

class Settings(BaseSettings) :
    FRONTEND_URL: str = "*"  # Replace with frontend URL later
    DATA_PATH: str = "app/data/houses.csv"
    
settings = Settings()