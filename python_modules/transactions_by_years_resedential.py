import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Set Seaborn style for the plot
sns.set(style='whitegrid')

# Load the data from a CSV file
df = pd.read_csv('Transactions.csv')

# Convert instance_date to datetime
df['instance_date'] = pd.to_datetime(df['instance_date'], infer_datetime_format=True, errors='coerce')

# Extract year from the datetime
df['year'] = df['instance_date'].dt.year

# Filter only residential properties
filtered_df = df[df['property_usage_en'] == 'Residential']

# Group by year and count the number of transactions for each year
yearly_transactions = filtered_df.groupby('year')['instance_date'].count().reset_index()

# Rename the columns for better readability
yearly_transactions.columns = ['Year', 'Number_of_Transactions']

# Create a bar chart using the data
fig, ax = plt.subplots()
sns.barplot(x='Year', y='Number_of_Transactions', data=yearly_transactions, ax=ax, palette='viridis')

# Add the number of transactions as labels on top of each bar, formatted as integers and with 8px font size
for i, value in yearly_transactions.iterrows():
    ax.text(i, value['Number_of_Transactions'] + 50, f'{int(value["Number_of_Transactions"])}', fontsize=8, ha='center', va='bottom', rotation=90)

# Set x-axis labels to display all years as integers and rotate them by 90 degrees
ax.set_xticklabels(yearly_transactions['Year'].astype(int), rotation=90)

plt.xlabel('Year')
plt.ylabel('Number of Transactions')
plt.title('Number of Resedential Transactions by Year')

# Save the plot to a file
plt.savefig("transactions_by_years_residential.png", dpi=300)

#plt.show()
