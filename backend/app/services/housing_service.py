import pandas as pd
import numpy as np
from typing import Optional

def load_data() -> pd.DataFrame:
    df = pd.read_csv("./data/houses.csv")
    return df

def sample_data(df: pd.DataFrame, max_samples: int = 1000) -> pd.DataFrame:
    """Sample data while preserving distribution of key features."""
    if len(df) <= max_samples:
        return df
        
    # Stratify by bedroom category and year to maintain distribution
    strata = df['bedroom_category'].astype(str) + '_' + df['year'].astype(str)
    
    # Calculate sample size per stratum
    n_strata = len(strata.unique())
    samples_per_stratum = max(1, max_samples // n_strata)
    
    sampled_df = df.groupby(strata).apply(
        lambda x: x.sample(
            n=min(len(x), samples_per_stratum),
            random_state=42
        )
    ).reset_index(drop=True)
    
    # If we still have too many samples, take a random subset
    if len(sampled_df) > max_samples:
        sampled_df = sampled_df.sample(max_samples, random_state=42)
    
    return sampled_df

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
    
    # For trends, we don't sample as we need accurate aggregates
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
    
def get_size_distribution(**filters):
    df = load_data()
    df = apply_filters(df, **filters)
    sampled_df = sample_data(df, max_samples=750)
    return sampled_df["sqft_living"].tolist()

def get_price_distribution(**filters):
    df = load_data()
    df = apply_filters(df, **filters)
    sampled_df = sample_data(df, max_samples=750)
    return sampled_df["price"].tolist()

def get_scatter(**filters):
    df = load_data()
    df = apply_filters(df, **filters)

    if df.empty:
        return {}
        
    df = df[["price", "bedroom_category", "sqft_living"]].replace([np.inf, -np.inf], np.nan).dropna()

    if df.empty:
        return {}

    sampled_df = sample_data(df, max_samples=500)
    return sampled_df[["price", "bedroom_category", "sqft_living"]].to_dict(orient="records")