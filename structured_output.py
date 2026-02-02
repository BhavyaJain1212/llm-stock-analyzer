from pydantic import BaseModel, Field
from typing import Optional, List

class Metric(BaseModel):
    name: str
    value: Optional[str]
    explanation: str
    implication: str

class Review(BaseModel):
    company_overview: str = Field(description='give a breif 1-2 line overview of company')
    key_metrics: List[Metric]
    price_vs_52_week_range: str = Field(description='explains how the current price compares to all prices of the stock within a 52 week range.')
    takeaways: List[str]
    notable_concerns: List[str]
    disclaimer: str