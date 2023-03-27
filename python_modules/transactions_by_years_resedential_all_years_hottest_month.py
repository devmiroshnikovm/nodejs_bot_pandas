import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Load the data from a CSV file
df = pd.read_csv('Transactions.csv')

# Convert instance_date to datetime
df['instance_date'] = pd.to_datetime(df['instance_date'], infer_datetime_format=True, errors='coerce')

# Extract year and month from the datetime
df['year'] = df['instance_date'].dt.year
df['month'] = df['instance_date'].dt.month

# Filter only residential properties
filtered_df = df[df['property_usage_en'] == 'Residential']

# Group by year and month, and count the number of transactions for each group
grouped_transactions = filtered_df.groupby(['year', 'month'])['instance_date'].count().reset_index()

# Rename the columns for better readability
grouped_transactions.columns = ['Year', 'Month', 'Number_of_Transactions']

# Create a dictionary to map month numbers to month names
month_name = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}

# Sort the transactions in descending order and get the top 3 months for each year
top_months = grouped_transactions.groupby('Year').apply(lambda x: x.nlargest(3, 'Number_of_Transactions')).reset_index(drop=True)

# Map month numbers to month names
top_months['Month_Name'] = top_months['Month'].map(month_name)

# Convert year values to integers
top_months['Year'] = top_months['Year'].astype(int)

# Drop the Month column
top_months = top_months.drop('Month', axis=1)

print("Check hypothesis in hottest months people start to sell properties, so we calulate number of transactions (registration notes) for all years by month:")
print("\n")  # Add an extra line break between the two outputs
print("Year, number of transactions, Month:")

# Print the top_months DataFrame without index values, adding a line separator after each year
prev_year = None
for _, row in top_months.iterrows():
    if prev_year is not None and prev_year != row['Year']:
        print("________")
    prev_year = row['Year']
    print(f"{row['Year']} {row['Number_of_Transactions']} {row['Month_Name']}")

print("\n")  # Add an extra line break between the two outputs

# Aggregate the transactions across years for each month
monthly_transactions = grouped_transactions.groupby('Month')['Number_of_Transactions'].sum().reset_index()

# Map month numbers to month names
monthly_transactions['Month_Name'] = monthly_transactions['Month'].map(month_name)

# Sort the transactions in descending order and get the top 3 months
top_3_months_overall = monthly_transactions.nlargest(3, 'Number_of_Transactions')

# Drop the Month column
top_3_months_overall = top_3_months_overall.drop('Month', axis=1)

# Print the top_3_months_overall DataFrame without index values
print("Top 3 month for all years since 1995 have most transactions:")
for _, row in top_3_months_overall.iterrows():
    print(f"{row['Number_of_Transactions']} {row['Month_Name']}")
