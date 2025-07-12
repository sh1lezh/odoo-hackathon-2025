import sqlite3
import os
from tabulate import tabulate

def view_database_advanced():
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
            headers = ["ID", "Email", "Password", "Name", "Location", "Profile Photo", "Availability"]
            print(tabulate(users, headers=headers, tablefmt="grid"))
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
            headers = ["ID", "User ID", "Skills Offered", "Skills Wanted", "Message", "Status"]
            print(tabulate(requests, headers=headers, tablefmt="grid"))
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
            nullable = "NOT NULL" if col[3] else "NULL"
            default = f"DEFAULT {col[4]}" if col[4] else ""
            print(f"  • {col[1]} ({col[2]}) {nullable} {default}".strip())
    
    conn.close()

def add_sample_data():
    """Add some sample data to the database for testing"""
    db_path = "skill_swap.db"
    
    if not os.path.exists(db_path):
        print("❌ Database file not found!")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Add sample users
    sample_users = [
        ("john@example.com", "password123", "John Doe", "New York", None, "Weekends"),
        ("jane@example.com", "password456", "Jane Smith", "Los Angeles", None, "Evenings"),
        ("bob@example.com", "password789", "Bob Johnson", "Chicago", None, "Weekdays")
    ]
    
    try:
        cursor.executemany(
            "INSERT INTO users (email, password, name, location, profile_photo, availability) VALUES (?, ?, ?, ?, ?, ?)",
            sample_users
        )
        
        # Add sample skill swap requests
        sample_requests = [
            (1, "Python Programming", "JavaScript", "Looking to learn JavaScript in exchange for Python help", "Pending"),
            (2, "Graphic Design", "Web Development", "Can help with design in exchange for web dev skills", "Pending"),
            (3, "Cooking", "Photography", "Home chef looking to learn photography", "Pending")
        ]
        
        cursor.executemany(
            "INSERT INTO skill_swap_requests (user_id, skills_offered, skills_wanted, message, status) VALUES (?, ?, ?, ?, ?)",
            sample_requests
        )
        
        conn.commit()
        print("✅ Sample data added successfully!")
        
    except sqlite3.OperationalError as e:
        print(f"❌ Error adding sample data: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    print("Choose an option:")
    print("1. View database contents")
    print("2. Add sample data")
    
    choice = input("Enter your choice (1 or 2): ").strip()
    
    if choice == "1":
        view_database_advanced()
    elif choice == "2":
        add_sample_data()
        print("\n" + "="*50)
        view_database_advanced()
    else:
        print("Invalid choice!") 