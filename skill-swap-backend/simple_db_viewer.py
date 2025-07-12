import sqlite3
import os

def view_database_simple():
    db_path = "skill_swap.db"
    
    if not os.path.exists(db_path):
        print("❌ Database file not found!")
        return
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("🔍 SKILL SWAP DATABASE VIEWER")
    print("=" * 50)
    
    # Check if tables exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    if not tables:
        print("❌ No tables found in database!")
        return
    
    print(f"📊 Found {len(tables)} table(s): {[table[0] for table in tables]}\n")
    
    # View Users table
    print("👥 USERS TABLE")
    print("-" * 30)
    try:
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        if users:
            print(f"Found {len(users)} user(s):")
            for user in users:
                print(f"  ID: {user[0]}, Email: {user[1]}, Name: {user[3]}, Location: {user[4]}")
        else:
            print("No users found")
    except sqlite3.OperationalError:
        print("Users table doesn't exist yet")
    print()
    
    # View Skill Swap Requests table
    print("🔄 SKILL SWAP REQUESTS TABLE")
    print("-" * 40)
    try:
        cursor.execute("SELECT * FROM skill_swap_requests")
        requests = cursor.fetchall()
        if requests:
            print(f"Found {len(requests)} request(s):")
            for req in requests:
                print(f"  ID: {req[0]}, User ID: {req[1]}, Offered: {req[2]}, Wanted: {req[3]}, Status: {req[5]}")
        else:
            print("No skill swap requests found")
    except sqlite3.OperationalError:
        print("Skill swap requests table doesn't exist yet")
    print()
    
    # Show table schemas
    print("📋 TABLE SCHEMAS")
    print("-" * 20)
    for table in tables:
        table_name = table[0]
        print(f"\n🔧 {table_name.upper()} SCHEMA:")
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        for col in columns:
            print(f"  • {col[1]} ({col[2]})")
    
    conn.close()

if __name__ == "__main__":
    view_database_simple() 