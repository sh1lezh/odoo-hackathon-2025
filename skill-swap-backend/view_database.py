import sqlite3
import os

def view_database():
    db_path = "skill_swap.db"
    
    if not os.path.exists(db_path):
        print("Database file not found!")
        return
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print("=== SKILL SWAP DATABASE CONTENTS ===\n")
    
    for table in tables:
        table_name = table[0]
        print(f"📋 TABLE: {table_name}")
        print("-" * 50)
        
        # Get table schema
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        print("Columns:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
        
        # Get all data from table
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        if rows:
            print(f"\nData ({len(rows)} rows):")
            for row in rows:
                print(f"  {row}")
        else:
            print("\nData: No rows found")
        
        print("\n" + "=" * 60 + "\n")
    
    conn.close()

if __name__ == "__main__":
    view_database() 