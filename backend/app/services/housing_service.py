import pandas as pd
from typing import Optional

def load_data() -> pd.DataFrame:
    df = pd.read_csv("./data/houses.csv")
    return df

def apply_filters(
    df: pd.DataFrame,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedroom_category: Optional[str] = None,
    min_sqft: Optional[float] = None,
    max_sqft: Optional[float] = None,
    start_year: Optional[int] = None,
    end_year: Optional[int] = None,
    start_month: Optional[int] = None,
    end_month: Optional[int] = None
) -> pd.DataFrame:
    if min_price is not None:
        df = df[df['price'] >= min_price]
    if max_price is not None:
        df = df[df['price'] <= max_price]
    if start_year is not None:
        df = df[df['year'] >= start_year]
    if end_year is not None:
        df = df[df['year'] <= end_year]
    if start_month is not None:
        df = df[df['month'] >= start_month]
    if end_month is not None:
        df = df[df['month'] <= end_month]
    if bedroom_category is not None:
        df = df[df['bedroom_category'] == bedroom_category]
    if min_sqft is not None:
        df = df[df['sqft_living'] >= min_sqft]
    if max_sqft is not None:
        df = df[df['sqft_living'] <= max_sqft]    
    return df

def get_summary(**filters):
    df = load_data()
    df = apply_filters(df, **filters)
    
    return {
        "average_price": round(df["price"].mean(), 2) if not df.empty else 0,
        "median_sqft": round(df["sqft_living"].median(), 2) if not df.empty else 0,
        "total_sales": len(df)
    }
    
def get_bedrooms(**filters):
    df = load_data()
    df = apply_filters(df, **filters)
    
    counts = df["bedroom_category"].value_counts()
    
    return {
        "small": int(counts.get("small", 0)),
        "medium": int(counts.get("medium", 0)),
        "large": int(counts.get("large", 0)),
        "total": len(df)
    }
    
def get_trends(**filters):
    df = load_data()
    df = apply_filters(df, **filters)
    
    result = (
        df.groupby(["year", "month"])
        .agg(
            average_price=("price", "mean"),
            median_sqft=("sqft_living", "median"),
            average_price_per_sqft=("price_per_sqft", "mean"),
            total_sales=("bedroom_category", "count"),
        )
        .reset_index()
        .to_dict(orient="records")
    )

    return result
    
    
