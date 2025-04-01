import random
import datetime as dt
import numpy as np
import json


def generate_random_portfolio(num_stocks=None, min_stocks=3, max_stocks=10):
    """Generate a random portfolio with stock tickers, weights, investment amount, and time horizon."""

    # Popular stock tickers to randomly sample from
    all_tickers = [
        "AAPL",
        "MSFT",
        "AMZN",
        "GOOGL",
        "META",
        "TSLA",
        "NVDA",
        "V",
        "JPM",
        "JNJ",
        "WMT",
        "PG",
        "DIS",
        "NFLX",
        "PYPL",
        "ADBE",
        "CSCO",
        "INTC",
        "CMCSA",
        "PEP",
        "KO",
        "T",
        "VZ",
        "MRK",
        "PFE",
        "ABT",
        "CVX",
        "XOM",
        "BAC",
        "C",
        "MS",
        "GS",
        "AMD",
        "IBM",
        "ORCL",
        "CRM",
        "ACN",
        "TXN",
        "QCOM",
        "MU",
    ]

    # If num_stocks is not specified, randomly choose a number between min_stocks and max_stocks
    if num_stocks is None:
        num_stocks = random.randint(min_stocks, max_stocks)

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
    time = random.randint(30, 365)

    # Generate a random date from the past, ensuring it's at least 'time' days before now
    max_days_ago = 730  # Maximum 2 years in the past
    min_days_ago = time + 10  # At least time + 10 days ago
    days_ago = random.randint(min_days_ago, max_days_ago)
    past_date = dt.datetime.now() - dt.timedelta(days=days_ago)

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
    # Generate 5 random portfolios
    portfolios = generate_multiple_portfolios(20)

    # Print the portfolios in a formatted way
    print(json.dumps(portfolios, indent=4))

    # Save to a file
    file_path = "random_portfolios.json"
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
