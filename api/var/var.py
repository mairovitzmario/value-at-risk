import pandas as pd
import numpy as np
import datetime as dt
import yfinance as yf
from scipy.stats import norm, t
import torch

from var.portofolio_data import PortofolioData
from var.model import LSTMModel, prepare_input_data, enable_dropout

# from portofolio_data import PortofolioData


class VaR:
    def __init__(self, portofolio: PortofolioData, confidence_level=0.95):
        self.portofolio = portofolio
        self.confidence_level = confidence_level
        self.alpha = 1 - confidence_level

    def calculate_historical_var(self):
        h_var = -np.percentile(
            self.portofolio.returns["portofolio"], self.alpha * 100
        ) * np.sqrt(self.portofolio.Time)

        return {
            "relative": h_var,
            "absolute": self.portofolio.initial_investment * h_var,
        }

    def calculate_parametric_var(self):

        expected_portofolio_return, expected_portofolio_std = (
            self.portofolio.get_expected_portofolio_performance()
        )

        p_var = (
            norm.ppf(self.confidence_level) * expected_portofolio_std
            - expected_portofolio_return
        )

        return {
            "relative": p_var,
            "absolute": self.portofolio.initial_investment * p_var,
        }

    def calculate_monte_carlo_var(self, simulations=1000):

        mean_m = np.full(
            shape=(self.portofolio.Time, len(self.portofolio.weights)),
            fill_value=self.portofolio.mean_returns,
        )
        mean_m = mean_m.T

        portfolio_sims = np.full(
            shape=(self.portofolio.Time, simulations), fill_value=0.0
        )

        for m in range(0, simulations):
            Z = np.random.normal(
                size=(self.portofolio.Time, len(self.portofolio.weights))
            )
            L = np.linalg.cholesky(self.portofolio.cov_matrix)
            daily_returns = mean_m + np.inner(L, Z)
            portfolio_sims[:, m] = (
                np.cumprod(np.inner(self.portofolio.weights, daily_returns.T) + 1)
                * self.portofolio.initial_investment
            )

        portResults = pd.Series(portfolio_sims[-1, :])
        kept = np.percentile(portResults, self.alpha * 100)

        absolute_mc_var = self.portofolio.initial_investment - kept
        relative_mc_var = absolute_mc_var / self.portofolio.initial_investment

        return {
            "relative": relative_mc_var,
            "absolute": absolute_mc_var,
        }

    def calculate_lstm_var(self):

        forecast_start_date = dt.datetime.now()

        model = LSTMModel()
        model.load_state_dict(
            torch.load("var/lstm_model.pth", map_location=torch.device("cpu"))
        )

        actual_data, _, _ = self.portofolio.get_data(
            start_date=forecast_start_date - dt.timedelta(days=200),
            end_date=forecast_start_date + dt.timedelta(days=20),
        )
        returns = actual_data["portofolio"]

        base_input = prepare_input_data(returns, forecast_start_date)
        device = next(model.parameters()).device
        base_input = base_input.to(device)

        model.eval()
        enable_dropout(model)

        base_std = base_input.std().item()
        noise_std = base_std * np.log(1 / (1 - self.confidence_level))

        with torch.no_grad():
            predictions = torch.stack(
                [
                    model(base_input + torch.randn_like(base_input) * noise_std)
                    for _ in range(1000)
                ]
            )

        predictions = predictions.squeeze().cpu().numpy()
        var = np.percentile(predictions, 100 * (1 - self.confidence_level))

        relative_lstm_var = -var * np.sqrt(self.portofolio.Time)
        absolute_lstm_var = self.portofolio.initial_investment * relative_lstm_var

        print(
            f"Relative LSTM VaR: {relative_lstm_var}, Absolute LSTM VaR: {absolute_lstm_var}"
        )

        return {
            "relative": np.float64(relative_lstm_var),
            "absolute": np.float64(absolute_lstm_var),
        }

    def __str__(self):
        historical_var = self.calculate_historical_var()
        parametric_var = self.calculate_parametric_var()
        monte_carlo_var = self.calculate_monte_carlo_var()
        lstm_var = self.calculate_lstm_var()

        txt = "Value at Risk (VaR) Analysis:\n"
        txt += f"Confidence Level: {self.confidence_level * 100}%\n"
        txt += f"Historical VaR: {historical_var}\n"
        txt += f"Parametric VaR: {parametric_var}\n"
        txt += f"Monte Carlo VaR: {monte_carlo_var}\n"
        txt += f"LSTM VaR: {lstm_var}\n"
        return txt


if __name__ == "__main__":
    stock_list = ["TSLA", "META", "GOOG"]
    weights = [0.5, 0.3, 0.2]
    portofolio_data = PortofolioData(stock_list, weights, 100, 10000)

    var = VaR(portofolio_data)
    print(var)
