import torch
import torch.nn as nn


class LSTMModel(nn.Module):

    LOOKBACK = 30

    def __init__(self, input_size=1, hidden_layer_size=50, output_size=1):
        super(LSTMModel, self).__init__()

        # Define the LSTM layer
        self.lstm = nn.LSTM(input_size, hidden_layer_size, batch_first=True)

        # Define a dropout layer to prevent overfitting
        self.dropout = nn.Dropout(0.2)

        # Define the fully connected layer
        self.fc = nn.Linear(hidden_layer_size, output_size)

    def forward(self, x):
        # Pass through the LSTM layer
        lstm_out, (hn, cn) = self.lstm(x)

        # Dropout layer for regularization
        lstm_out = self.dropout(lstm_out)

        # Take the output of the last time step
        last_time_step = lstm_out[:, -1, :]

        # Pass the output through the fully connected layer
        output = self.fc(last_time_step)

        return output
