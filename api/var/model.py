import torch
import torch.nn as nn
import datetime as dt
import numpy as np


class LSTMModel(nn.Module):

    LOOKBACK = 30

    def __init__(
        self, input_size=1, hidden_layer_size=50, intermediate_size=10, output_size=1
    ):
        super(LSTMModel, self).__init__()

        self.lstm = nn.LSTM(input_size, hidden_layer_size, batch_first=True)
        self.dropout = nn.Dropout(0.2)

        self.fc1 = nn.Linear(hidden_layer_size, intermediate_size)
        self.relu = nn.LeakyReLU()

        self.fc2 = nn.Linear(intermediate_size, output_size)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        lstm_out = self.dropout(lstm_out)
        last_time_step = lstm_out[:, -1, :]

        hidden_out = self.relu(self.fc1(last_time_step))
        output = self.fc2(hidden_out)

        return output


def prepare_input_data(returns, forecast_start_date, lookback_period=30):
    returns_array = (
        returns.loc[
            forecast_start_date
            - dt.timedelta(days=(lookback_period * 2)) : forecast_start_date
        ]
        .tail(lookback_period)
        .values
    )
    return torch.tensor(returns_array, dtype=torch.float32).reshape(
        1, lookback_period, 1
    )


def enable_dropout(model):
    for m in model.modules():
        if isinstance(m, nn.Dropout):
            m.train()
