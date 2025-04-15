import random
import datetime as dt
import numpy as np
import json
import pandas as pd
import yfinance as yf  # Add this import for Yahoo Finance API


def check_available(asset: str) -> bool:
    """
    Checks if an asset is available via the Yahoo Finance API.
    """
    try:
        info = yf.Ticker(asset).history(period="7d", interval="1d")
        # return == period value for more precise check but may
        # need more complex handling to take into account non-
        # trading days, holidays, etc.
        return len(info) > 0
    except:
        return False


def fetch_tickers(output_file=None, local=True):
    if local:
        df = pd.read_csv("data/stock_data.csv")
        all_tickers = df["Ticker"].tolist()
    else:
        url = "https://gist.githubusercontent.com/ZeccaLehn/f6a2613b24c393821f81c0c1d23d4192/raw/fe4638cc5561b9b261225fd8d2a9463a04e77d19/SP500.csv"
        df = pd.read_csv(url)
        all_tickers = df["Symbol"].tolist()

    # Filter tickers to only include available ones
    if local:
        available_tickers = list(set(all_tickers))
    else:
        print("Checking availability of tickers...")
        available_tickers = []
        for ticker in all_tickers:
            if check_available(ticker):
                available_tickers.append(ticker)
                print(f"Ticker {ticker} is available.")
            else:
                print(f"Ticker {ticker} is not available.")

        print(
            f"Found {len(available_tickers)} available tickers out of {len(all_tickers)}."
        )

    # Save available tickers to text file if output_file is specified
    if output_file:
        try:
            with open(output_file, "w") as f:
                for ticker in available_tickers:
                    f.write(f"{ticker}\n")
            print(f"Successfully saved available tickers to {output_file}")
        except Exception as e:
            print(f"Error saving tickers to file: {e}")

    return available_tickers


def load_tickers_from_file(
    file_path=r"C:\Projects\school\Licenta\research\data\stock_tickers.txt",
):
    """Load stock tickers from a text file.

    Args:
        file_path (str): Path to the text file containing tickers

    Returns:
        list: List of ticker symbols, or empty list if file doesn't exist
    """
    try:
        with open(file_path, "r") as f:
            tickers = [line.strip() for line in f if line.strip()]
        print(f"Loaded {len(tickers)} tickers from {file_path}")
        return tickers
    except FileNotFoundError:
        print(
            f"File {file_path} not found. Please generate it first with fetch_snp_tickers()"
        )
        return []
    except Exception as e:
        print(f"Error reading from {file_path}: {e}")
        return []


def generate_random_portfolio(
    num_stocks=None,
    min_stocks=3,
    max_stocks=10,
):
    """Generate a random portfolio with stock tickers, weights, investment amount, and time horizon."""

    # Load stock tickers from file
    all_tickers = load_tickers_from_file()

    #
    # Ensure we have enough tickers for the minimum number of stocks
    if len(all_tickers) < min_stocks:
        raise ValueError(
            f"Not enough tickers available. Need at least {min_stocks}, but only {len(all_tickers)} found."
        )

    # If num_stocks is not specified, randomly choose a number between min_stocks and max_stocks
    if num_stocks is None:
        num_stocks = random.randint(min_stocks, min(max_stocks, len(all_tickers)))
    else:
        # Ensure num_stocks doesn't exceed available tickers
        num_stocks = min(num_stocks, len(all_tickers))

    # Select random stocks from the list
    stocks_list = random.sample(all_tickers, num_stocks)

    # Generate random weights that sum to 1
    raw_weights = np.random.uniform(0.1, 1.0, num_stocks)
    stocks_weights = (raw_weights / np.sum(raw_weights)).tolist()
    stocks_weights = [round(weight, 3) for weight in stocks_weights]

    # Make sure weights sum to exactly 1
    diff = 1 - sum(stocks_weights)
    stocks_weights[0] += diff  # Add any rounding difference to the first weight

    # Generate a random investment amount between $1,000 and $100,000
    initial_investment = round(random.uniform(1000, 100000), 2)

    # Generate a random time horizon between 30 and 365 days
    time = random.randint(2, 100)  # Days

    # Generate a random date from the past, ensuring it's at least 'time' days before now
    max_days_ago = 730  # Maximum 2 years in the past
    min_days_ago = time + 10  # At least time + 10 days ago
    days_ago = random.randint(min_days_ago, max_days_ago)
    past_date = dt.datetime(2025, 4, 30) - dt.timedelta(days=days_ago)

    # Format the date as a string
    date_str = past_date.strftime("%Y-%m-%d")

    # Create and return the portfolio dictionary
    portfolio = {
        "stocks_list": stocks_list,
        "stocks_weights": stocks_weights,
        "initial_investment": initial_investment,
        "time": time,
        "start_date": date_str,
    }

    return portfolio


def generate_multiple_portfolios(count=5):
    """Generate multiple random portfolios."""
    portfolios = [generate_random_portfolio() for _ in range(count)]
    return portfolios


def read_portfolios_from_json(file_path):
    """Read portfolios from a JSON file.

    Args:
        file_path (str): Path to the JSON file

    Returns:
        list: List of portfolio dictionaries, or empty list if file doesn't exist
    """
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"File {file_path} not found. Returning empty list.")
        return []
    except json.JSONDecodeError:
        print(f"Error decoding JSON from {file_path}. Returning empty list.")
        return []


def write_portfolios_to_json(portfolios, file_path):
    """Write portfolios to a JSON file.

    Args:
        portfolios (list): List of portfolio dictionaries
        file_path (str): Path to the JSON file

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        with open(file_path, "w") as f:
            json.dump(portfolios, f, indent=4)
        return True
    except Exception as e:
        print(f"Error writing to {file_path}: {e}")
        return False


if __name__ == "__main__":

    # fetch_tickers(output_file="data/stock_tickers.txt")

    portfolios = generate_multiple_portfolios(100)

    # Print the portfolios in a formatted way
    print(json.dumps(portfolios, indent=4))

    # Save to a file
    file_path = "data/random_portfolios.json"
    if write_portfolios_to_json(portfolios, file_path):
        print(f"Successfully wrote portfolios to {file_path}")
    else:
        print(f"Failed to write portfolios to {file_path}")

    print(f"Generated {len(portfolios)} random portfolios.")
    print("Example portfolio:")
    print(json.dumps(portfolios[0], indent=4))

    # Example of reading portfolios
    read_portfolios = read_portfolios_from_json(file_path)
    print(f"Read {len(read_portfolios)} portfolios from {file_path}")
