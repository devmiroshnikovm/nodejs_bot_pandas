import pandas as pd
from tabulate import tabulate

def dataframe_to_markdown(df):
    markdown = df.to_markdown(index=False, tablefmt="pipe")
    return markdown

# Load the data from a CSV file
df = pd.read_csv('difference.csv', low_memory=False)

# Convert instance_date to datetime
df['instance_date'] = pd.to_datetime(df['Transaction Date'], infer_datetime_format=True, errors='coerce')

# Filter the DataFrame for residential usage
residential_df = df[df['Usage'] == 'Residential']

# Group by Project and Area, and count the number of transactions
grouped_projects = residential_df.groupby(['Project', 'Area']).size().reset_index(name='Number_of_Transactions')

# Sort the grouped DataFrame in descending order by the number of transactions and get the top 3 projects
top_3_projects = grouped_projects.sort_values(by='Number_of_Transactions', ascending=False).head(3)

# Convert the DataFrame to a Markdown table
output_header = "Top 3 Residential Projects:\n\n"
output_str = output_header + dataframe_to_markdown(top_3_projects)

print(output_str)



top_3_projects_list = top_3_projects['Project'].tolist()
filtered_top_3 = residential_df[residential_df['Project'].isin(top_3_projects_list)]

min_amount_idx = filtered_top_3['Amount'].idxmin()
max_amount_idx = filtered_top_3['Amount'].idxmax()

min_amount = filtered_top_3.loc[min_amount_idx]
max_amount = filtered_top_3.loc[max_amount_idx]

print("\nMinimum price in top 3 projects:")
print(f"Amount: {min_amount['Amount']}")
print(f"Property Size (sq.m): {min_amount['Property Size (sq.m)']}")
print(f"Room(s): {min_amount['Room(s)']}")
print(f"Project: {min_amount['Project']}")
print(f"Property Sub Type: {min_amount['Property Sub Type']}")
print(f"Area: {min_amount['Area']}")

print("\nMaximum price in top 3 projects:")
print(f"Amount: {max_amount['Amount']}")
print(f"Property Size (sq.m): {max_amount['Property Size (sq.m)']}")
print(f"Room(s): {max_amount['Room(s)']}")
print(f"Project: {max_amount['Project']}")
print(f"Property Sub Type: {max_amount['Property Sub Type']}")
print(f"Area: {max_amount['Area']}")




