import pandas as pd
import numpy as np
import datetime as dt
import yfinance as yf
from scipy.stats import norm, t


class PortofolioData:
    def __init__(self, stocks, weights, Time, initial_investment):
        self.stocks = stocks
        self.weights = np.array(weights)
        self.Time = Time
        self.initial_investment = initial_investment
        self.returns, self.mean_returns, self.cov_matrix = self.get_data()

    def get_data(
        self,
        start_date=dt.datetime.now() - dt.timedelta(days=800),
        end_date=dt.datetime.now(),
    ):
        # Get historical data and calculate returns
        stock_data = yf.download(self.stocks, start=start_date, end=end_date)

        stock_data = stock_data["Close"]
        returns = stock_data.pct_change()
        mean_returns = returns.mean()
        cov_matrix = returns.cov()
        returns = returns.dropna()
        returns["portofolio"] = returns.dot(self.weights)
        return returns, mean_returns, cov_matrix

    def get_expected_portofolio_performance(self):
        expected_returns = np.sum(self.mean_returns * self.weights) * self.Time
        expected_std = np.sqrt(
            np.dot(self.weights.T, np.dot(self.cov_matrix, self.weights))
        ) * np.sqrt(self.Time)
        return expected_returns, expected_std

    def __str__(self):
        txt = ""
        txt += f"PORTOFOLIO: {self.initial_investment}\n"
        for i in range(len(self.stocks)):
            txt += f"{self.stocks[i]}:{self.weights[i]*100}%\n"
        txt += "--------------------------\n"
        txt += "Returns:\n"
        txt += f"{self.returns}\n"
        txt += "--------------------------\n"
        txt += "Mean Returns:\n"
        txt += f"{self.mean_returns}\n"
        txt += "--------------------------\n"
        txt += "Covariance Matrix\n"
        txt += f"{self.cov_matrix}\n"
        txt += "--------------------------\n"
        return txt


if __name__ == "__main__":
    stock_list = ["CBA", "BHP", "TLS", "NAB", "WBC", "STO"]
    weights = [0.2, 0.1, 0.3, 0.05, 0.15, 0.2]
    portofolio_data = PortofolioData(stock_list, weights, 100, 10000)
    print(portofolio_data)
