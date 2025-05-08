import torch
import torch.nn as nn


class LSTMModel(nn.Module):

    LOOKBACK = 30

    def __init__(
        self, input_size=1, hidden_layer_size=50, intermediate_size=10, output_size=1
    ):
        super(LSTMModel, self).__init__()

        self.lstm = nn.LSTM(input_size, hidden_layer_size, batch_first=True)
        self.dropout = nn.Dropout(0.2)

        # First dense layer after LSTM
        self.fc1 = nn.Linear(hidden_layer_size, intermediate_size)
        self.relu = nn.LeakyReLU()

        # Second dense layer for final output
        self.fc2 = nn.Linear(intermediate_size, output_size)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        lstm_out = self.dropout(lstm_out)
        last_time_step = lstm_out[:, -1, :]

        hidden_out = self.relu(self.fc1(last_time_step))
        output = self.fc2(hidden_out)

        return output
