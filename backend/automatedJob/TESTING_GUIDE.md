# Weekly Backup Testing Guide

## Prerequisites

### 1. Install MongoDB Database Tools
The backup script requires `mongodump` to be installed and accessible in your system PATH.

**For Windows:**
1. Download MongoDB Database Tools from: https://www.mongodb.com/try/download/database-tools
2. Extract the ZIP file
3. Add the `bin` folder to your system PATH:
   - Open System Properties → Environment Variables
   - Edit the `Path` variable
   - Add the full path to the `bin` folder (e.g., `C:\mongodb-database-tools\bin`)
4. Restart your terminal/PowerShell

**Verify installation:**
```powershell
mongodump --version
```

### 2. Ensure Environment Variables are Set
Make sure your `.env` file in the `backend` directory contains:
```
MONGO_URI=your_mongodb_connection_string
GMAIL_USER=your_email@gmail.com (optional, for storage alerts)
GMAIL_PASSWORD=your_app_password (optional, for storage alerts)
```

---

## Testing Methods

### Method 1: Test Script (Recommended) ✅

Run the test script that forces a weekly backup:

```powershell
cd backend
node automatedJob/test-backup.js
```

**What it does:**
- Forces a weekly backup regardless of the day
- Backs up all 4 collections: `complaints`, `counters`, `notifications`, `users`
- Creates a test backup folder with timestamp
- Shows progress and results
- Displays backup directory size

**Expected output:**
- ✅ Success messages for each collection
- 📁 Backup files created in `backend/backups/test-weekly-backup-YYYY-MM-DD-*_collections/`
- Each collection saved as `.gz` compressed files

---

### Method 2: Run Original Backup Script (Only works on Friday)

If today is Friday, you can run the original backup script:

```powershell
cd backend
node automatedJob/backup.js
```

**Note:** This will only run if today is Friday. Otherwise, it will say "No backup scheduled for today".

---

### Method 3: Temporarily Modify Cron Schedule

Edit `backend/index.js` and temporarily change the cron schedule to run in a few minutes:

**Original:**
```javascript
cron.schedule("0 0 * * 5", () => {  // Every Friday at midnight
```

**For testing (runs every minute):**
```javascript
cron.schedule("* * * * *", () => {  // Every minute (for testing only!)
```

**Or run in 2 minutes:**
```javascript
cron.schedule("*/2 * * * *", () => {  // Every 2 minutes
```

**Then start your server:**
```powershell
cd backend
node index.js
```

**⚠️ Remember to change it back after testing!**

---

### Method 4: Manual MongoDB Export (Alternative)

If `mongodump` is not available, you can manually test with MongoDB Compass or mongoexport:

```powershell
# Export a single collection (example)
mongoexport --uri="your_mongodb_uri" --collection=complaints --out=complaints.json
```

---

## Verifying Backup Success

### 1. Check Backup Files Exist

```powershell
# Navigate to backups directory
cd backend\backups

# List all backup folders
dir

# Check a specific backup folder
dir test-weekly-backup-*_collections
```

You should see 4 files:
- `complaints.gz`
- `counters.gz`
- `notifications.gz`
- `users.gz`

### 2. Check File Sizes

The backup files should have a size > 0 bytes. Empty files indicate an issue.

### 3. Verify Backup Content (Optional)

To restore and verify a backup:

```powershell
# Restore a collection (example)
mongorestore --uri="your_mongodb_uri" --collection=complaints --archive="backups\test-weekly-backup-*_collections\complaints.gz" --gzip
```

---

## Restoring from Backups

### ⚠️ Important Warnings

- **Data Overwrite:** Restoring will **replace existing data** in the target collections
- **Backup First:** Always create a backup of your current data before restoring
- **Database Name:** Ensure you're restoring to the correct database
- **Test Environment:** Consider testing restores in a test/staging environment first

### Prerequisites for Restoration

1. **MongoDB Database Tools installed** (includes `mongorestore`)
2. **MONGO_URI** configured in your `.env` file
3. **Database name** - either in MONGO_URI or set as `DB_NAME` in `.env`

### Restoring from Weekly Backups

Weekly backups contain 4 collections: `complaints`, `counters`, `notifications`, `users`

#### Restore a Single Collection

```powershell
# Navigate to backend directory
cd backend

# Restore complaints collection
mongorestore --uri="your_mongodb_uri" --db=your_database_name --collection=complaints --archive="backups\weekly-backup-2026-01-18_collections\complaints.gz" --gzip --drop

# Restore counters collection
mongorestore --uri="your_mongodb_uri" --db=your_database_name --collection=counters --archive="backups\weekly-backup-2026-01-18_collections\counters.gz" --gzip --drop

# Restore notifications collection
mongorestore --uri="your_mongodb_uri" --db=your_database_name --collection=notifications --archive="backups\weekly-backup-2026-01-18_collections\notifications.gz" --gzip --drop

# Restore users collection
mongorestore --uri="your_mongodb_uri" --db=your_database_name --collection=users --archive="backups\weekly-backup-2026-01-18_collections\users.gz" --gzip --drop
```

**Note:** The `--drop` flag removes the existing collection before restoring. Remove it if you want to merge data instead.

#### Restore All Collections from Weekly Backup

```powershell
cd backend

# Set variables (adjust paths as needed)
$backupDir = "backups\weekly-backup-2026-01-18_collections"
$mongoUri = "your_mongodb_uri"
$dbName = "your_database_name"

# Restore all collections
mongorestore --uri="$mongoUri" --db=$dbName --collection=complaints --archive="$backupDir\complaints.gz" --gzip --drop
mongorestore --uri="$mongoUri" --db=$dbName --collection=counters --archive="$backupDir\counters.gz" --gzip --drop
mongorestore --uri="$mongoUri" --db=$dbName --collection=notifications --archive="$backupDir\notifications.gz" --gzip --drop
mongorestore --uri="$mongoUri" --db=$dbName --collection=users --archive="$backupDir\users.gz" --gzip --drop
```

#### Using Environment Variables (Recommended)

```powershell
cd backend

# Load environment variables from .env
$env:MONGO_URI = (Get-Content .env | Where-Object { $_ -match "^MONGO_URI=" }) -replace "MONGO_URI=", ""
$env:DB_NAME = (Get-Content .env | Where-Object { $_ -match "^DB_NAME=" }) -replace "DB_NAME=", ""

# If DB_NAME not set, extract from MONGO_URI
if (-not $env:DB_NAME) {
    if ($env:MONGO_URI -match "/([^/?]+)(\?|$)") {
        $env:DB_NAME = $matches[1]
    } else {
        $env:DB_NAME = "test"
    }
}

# Restore all collections
$backupDir = "backups\weekly-backup-2026-01-18_collections"
mongorestore --uri="$env:MONGO_URI" --db=$env:DB_NAME --collection=complaints --archive="$backupDir\complaints.gz" --gzip --drop
mongorestore --uri="$env:MONGO_URI" --db=$env:DB_NAME --collection=counters --archive="$backupDir\counters.gz" --gzip --drop
mongorestore --uri="$env:MONGO_URI" --db=$env:DB_NAME --collection=notifications --archive="$backupDir\notifications.gz" --gzip --drop
mongorestore --uri="$env:MONGO_URI" --db=$env:DB_NAME --collection=users --archive="$backupDir\users.gz" --gzip --drop
```

### Restoring from Quarterly Backups

Quarterly backups contain:
- Resolved complaints (`resolved.gz`)
- Media files (`uploads.tar.gz`)
- All collections: `complaints`, `counters`, `notifications`, `users`

#### Restore Resolved Complaints Only

```powershell
cd backend

# Restore only resolved complaints
mongorestore --uri="your_mongodb_uri" --db=your_database_name --collection=complaints --archive="backups\quarterly-backup-2026-04-01_collections\resolved.gz" --gzip --drop
```

**Note:** This will replace your entire `complaints` collection with only resolved complaints. Use with caution!

#### Restore All Collections from Quarterly Backup

```powershell
cd backend

$backupDir = "backups\quarterly-backup-2026-04-01_collections"
$mongoUri = "your_mongodb_uri"
$dbName = "your_database_name"

# Restore all collections
mongorestore --uri="$mongoUri" --db=$dbName --collection=complaints --archive="$backupDir\complaints.gz" --gzip --drop
mongorestore --uri="$mongoUri" --db=$dbName --collection=counters --archive="$backupDir\counters.gz" --gzip --drop
mongorestore --uri="$mongoUri" --db=$dbName --collection=notifications --archive="$backupDir\notifications.gz" --gzip --drop
mongorestore --uri="$mongoUri" --db=$dbName --collection=users --archive="$backupDir\users.gz" --gzip --drop
```

#### Restore Media Files from Quarterly Backup

```powershell
cd backend

# Extract media files from tar.gz archive
$backupDir = "backups\quarterly-backup-2026-04-01_collections"
$uploadsDir = "uploads"

# Create uploads directory if it doesn't exist
if (-not (Test-Path $uploadsDir)) {
    New-Item -ItemType Directory -Path $uploadsDir | Out-Null
}

# Extract the tar.gz file (requires tar command or 7-Zip)
# Using tar (Windows 10+)
tar -xzf "$backupDir\uploads.tar.gz" -C $uploadsDir

# Or using 7-Zip (if installed)
# 7z x "$backupDir\uploads.tar.gz" -so | tar -x -C $uploadsDir
```

### Restore Without Dropping (Merge Data)

To merge backup data with existing data instead of replacing:

```powershell
# Remove --drop flag to merge instead of replace
mongorestore --uri="your_mongodb_uri" --db=your_database_name --collection=complaints --archive="backups\weekly-backup-2026-01-18_collections\complaints.gz" --gzip
```

**Warning:** This may create duplicate documents if IDs match. Use with caution!

### Verify Restoration

After restoring, verify the data:

```powershell
# Connect to MongoDB and check document counts
mongosh "your_mongodb_uri"

# In mongosh shell:
use your_database_name
db.complaints.countDocuments()
db.counters.countDocuments()
db.notifications.countDocuments()
db.users.countDocuments()

# Check a sample document
db.complaints.findOne()
```

### Complete Restoration Script Example

Here's a complete PowerShell script to restore from a weekly backup:

```powershell
# restore-weekly-backup.ps1
param(
    [Parameter(Mandatory=$true)]
    [string]$BackupDate,  # Format: 2026-01-18
    
    [string]$DatabaseName = "",
    [switch]$NoDrop
)

cd backend

# Load environment variables
$env:MONGO_URI = (Get-Content .env | Where-Object { $_ -match "^MONGO_URI=" }) -replace "MONGO_URI=", ""
if ($DatabaseName) {
    $dbName = $DatabaseName
} else {
    $dbName = (Get-Content .env | Where-Object { $_ -match "^DB_NAME=" }) -replace "DB_NAME=", ""
    if (-not $dbName) {
        if ($env:MONGO_URI -match "/([^/?]+)(\?|$)") {
            $dbName = $matches[1]
        } else {
            $dbName = "test"
        }
    }
}

$backupDir = "backups\weekly-backup-$BackupDate_collections"
$dropFlag = if ($NoDrop) { "" } else { "--drop" }

if (-not (Test-Path $backupDir)) {
    Write-Host "❌ Backup directory not found: $backupDir" -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Restoring from: $backupDir" -ForegroundColor Cyan
Write-Host "📊 Database: $dbName" -ForegroundColor Cyan
Write-Host ""

$collections = @("complaints", "counters", "notifications", "users")

foreach ($collection in $collections) {
    $archive = "$backupDir\$collection.gz"
    if (Test-Path $archive) {
        Write-Host "⏳ Restoring $collection..." -ForegroundColor Yellow
        mongorestore --uri="$env:MONGO_URI" --db=$dbName --collection=$collection --archive=$archive --gzip $dropFlag
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $collection restored successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to restore $collection" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  Backup file not found: $archive" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ Restoration complete!" -ForegroundColor Green
```

**Usage:**
```powershell
# Restore with drop (replace existing data)
.\restore-weekly-backup.ps1 -BackupDate "2026-01-18"

# Restore without drop (merge data)
.\restore-weekly-backup.ps1 -BackupDate "2026-01-18" -NoDrop

# Restore to specific database
.\restore-weekly-backup.ps1 -BackupDate "2026-01-18" -DatabaseName "my_database"
```

---

## Troubleshooting

### Error: `mongodump is not recognized`
- **Solution:** Install MongoDB Database Tools and add to PATH (see Prerequisites)

### Error: `MONGO_URI environment variable is not set`
- **Solution:** Check your `.env` file in the `backend` directory

### Error: `Failed to connect to MongoDB`
- **Solution:** Verify your `MONGO_URI` is correct and MongoDB is accessible

### Backup files are empty (0 bytes)
- **Solution:** Check if collections exist in your database and have data

### Permission errors
- **Solution:** Ensure you have write permissions to the `backend/backups` directory

---

## Testing Checklist

- [ ] MongoDB Database Tools installed
- [ ] `mongodump` command works (`mongodump --version`)
- [ ] `.env` file configured with `MONGO_URI`
- [ ] Test script runs successfully
- [ ] Backup files created in `backend/backups/`
- [ ] All 4 collections backed up (complaints, counters, notifications, users)
- [ ] Backup files have content (size > 0)
- [ ] Storage monitoring works (check console output)

---

## Clean Up Test Backups

After testing, you can delete test backup folders:

```powershell
cd backend\backups
# Delete test backups (be careful!)
rmdir /s test-weekly-backup-*
```

---

## Production Schedule

The weekly backup runs automatically:
- **Schedule:** Every Friday at 12:00 AM (midnight)
- **Location:** `backend/backups/weekly-backup-YYYY-MM-DD_collections/`
- **Triggered by:** Cron job in `backend/index.js`

---

## Quick Reference: Common Restore Scenarios

### Scenario 1: Restore Single Collection from Latest Weekly Backup

```powershell
cd backend
$latestBackup = (Get-ChildItem "backups\weekly-backup-*_collections" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).Name
mongorestore --uri="$env:MONGO_URI" --db=your_database --collection=complaints --archive="backups\$latestBackup\complaints.gz" --gzip --drop
```

### Scenario 2: Restore All Collections from Specific Date

```powershell
cd backend
$backupDate = "2026-01-18"
$backupDir = "backups\weekly-backup-$backupDate_collections"
mongorestore --uri="$env:MONGO_URI" --db=your_database --collection=complaints --archive="$backupDir\complaints.gz" --gzip --drop
mongorestore --uri="$env:MONGO_URI" --db=your_database --collection=counters --archive="$backupDir\counters.gz" --gzip --drop
mongorestore --uri="$env:MONGO_URI" --db=your_database --collection=notifications --archive="$backupDir\notifications.gz" --gzip --drop
mongorestore --uri="$env:MONGO_URI" --db=your_database --collection=users --archive="$backupDir\users.gz" --gzip --drop
```

### Scenario 3: Restore to Different Database (Test/Staging)

```powershell
cd backend
mongorestore --uri="$env:MONGO_URI" --db=test_database --collection=complaints --archive="backups\weekly-backup-2026-01-18_collections\complaints.gz" --gzip --drop
```

### Scenario 4: Restore Quarterly Backup (All Collections + Media)

```powershell
cd backend
$backupDir = "backups\quarterly-backup-2026-04-01_collections"

# Restore collections
mongorestore --uri="$env:MONGO_URI" --db=your_database --collection=complaints --archive="$backupDir\complaints.gz" --gzip --drop
mongorestore --uri="$env:MONGO_URI" --db=your_database --collection=counters --archive="$backupDir\counters.gz" --gzip --drop
mongorestore --uri="$env:MONGO_URI" --db=your_database --collection=notifications --archive="$backupDir\notifications.gz" --gzip --drop
mongorestore --uri="$env:MONGO_URI" --db=your_database --collection=users --archive="$backupDir\users.gz" --gzip --drop

# Restore media files
tar -xzf "$backupDir\uploads.tar.gz" -C uploads
```

### Scenario 5: List Available Backups

```powershell
cd backend\backups

# List all weekly backups
Get-ChildItem -Directory -Filter "weekly-backup-*" | Sort-Object LastWriteTime -Descending | Format-Table Name, LastWriteTime

# List all quarterly backups
Get-ChildItem -Directory -Filter "quarterly-backup-*" | Sort-Object LastWriteTime -Descending | Format-Table Name, LastWriteTime
```

### Scenario 6: Verify Backup Before Restoring

```powershell
# Check backup file sizes
cd backend\backups
Get-ChildItem "weekly-backup-2026-01-18_collections\*.gz" | Format-Table Name, @{Name="Size (MB)";Expression={[math]::Round($_.Length/1MB,2)}}

# List contents of backup archive (without extracting)
# Note: This requires additional tools or manual inspection
```

---

## Database Name Configuration

The backup scripts automatically extract the database name from `MONGO_URI`. If your URI doesn't include the database name, you can:

1. **Add database name to MONGO_URI:**
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/your_database_name
   ```

2. **Or set DB_NAME in .env:**
   ```
   DB_NAME=your_database_name
   ```

The backup scripts will use the database name from the URI or fall back to `DB_NAME` environment variable.
