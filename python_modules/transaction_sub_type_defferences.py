import pandas as pd
from datetime import datetime

# Get the current date
current_date = datetime.now()

# Format the file name with the current date
file_name = f'Transactions_short_{current_date.strftime("%Y-%-m-%-d")}.csv'

# Load the data from the CSV file
df = pd.read_csv(file_name)



# Filter data based on residential usage
residential_df = df[df['Usage'] == 'Residential']

# Get value counts of 'Transaction sub type' column
value_counts = residential_df['Transaction sub type'].value_counts()

print("Selling resedentional types since start of 2023:")
print('    ')
# Print the value counts
output = value_counts.to_string()
print(output)

