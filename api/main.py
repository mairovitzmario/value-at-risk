from fastapi import FastAPI
from pydantic import BaseModel, Field, field_validator
from typing import List
import yfinance as yf
from var.portofolio_data import PortofolioData
from var.var import VaR
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PortofolioVaRModel(BaseModel):
    stocks: List[str]
    weights: List[float]
    time: int
    initial_investment: float
    confidence_level: float


@app.get("/")
async def root():
    return {"message": "pong"}


@app.post("/var")
async def get_var(request_portofolio: PortofolioVaRModel):
    request_portofolio = request_portofolio.model_dump()
    portofolio = PortofolioData(
        request_portofolio["stocks"],
        request_portofolio["weights"],
        request_portofolio["time"],
        request_portofolio["initial_investment"],
    )
    var = VaR(portofolio, confidence_level=request_portofolio["confidence_level"])

    response_dict = {}

    response_dict["historical"] = var.calculate_historical_var()
    response_dict["parametric"] = var.calculate_parametric_var()
    response_dict["monte_carlo"] = var.calculate_monte_carlo_var()
    response_dict["lstm"] = var.calculate_lstm_var()

    print(response_dict["lstm"]["absolute"])
    print(response_dict["parametric"]["absolute"])

    print(response_dict)

    return response_dict


@app.get("/validate-ticker")
async def validate_ticker(ticker: str):
    info = yf.Ticker(ticker).history(period="7d", interval="1d")
    return len(info) > 0


"""
{
  "stocks": [
    "CBA.AX", "BHP.AX", "TLS.AX", "NAB.AX", "WBC.AX", "STO.AX"
  ],
  "weights": [
    0.2, 0.1, 0.3, 0.05, 0.15, 0.2
  ],
  "time": 100,
  "initial_investment": 10000,
  "confidence_level": 0.95
}
"""
