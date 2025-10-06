# 💾 Data Management Guide

## New Features Added

Your PWA now has a complete data management system! Access it via the **💾داده** (Data) tab.

## Features

### 📤 Export Data
**Downloads all your data as a JSON file**

- Click "📥 دانلود داده‌ها" button
- File will download automatically: `mahtab-tracker-backup-YYYY-MM-DD.json`
- Contains:
  - All activity logs
  - All planning/goals data
  - Export date and version info

**Use cases:**
- ✅ Backup your data regularly
- ✅ Transfer data to another device
- ✅ Share data with desktop for analysis
- ✅ Keep historical backups

### 📥 Import Data
**Restore data from a JSON file**

1. Click "Choose File" to select your backup JSON file
2. Click "📤 بارگذاری داده‌ها"
3. Confirm the import (warning: overwrites current data)
4. Data is restored!

**Safety features:**
- ⚠️ Warns before overwriting
- ✅ Creates automatic backup before import
- ✅ Validates file format
- ✅ Shows error if file is invalid

### 🗑️ Clear All Data
**Delete everything from localStorage**

- Double confirmation required
- Creates final backup before clearing
- Cannot be undone (except from backup)

**When to use:**
- Starting fresh
- Troubleshooting issues
- Switching to new account

### ℹ️ Storage Information
**See what's stored**

Shows:
- Number of days tracked
- Total data size (in KB)
- Planning data status
- Click "🔄 به‌روزرسانی اطلاعات" to refresh

## How to Transfer Data to Phone

### Method 1: Via Cloud (Recommended)
1. **On Computer:**
   - Open app in browser
   - Go to 💾داده tab
   - Click Export → Download JSON file
   - Upload JSON file to cloud (Google Drive, Dropbox, iCloud, etc.)

2. **On Phone:**
   - Download JSON file from cloud
   - Open your PWA
   - Go to 💾داده tab
   - Choose file → Import

### Method 2: Via Email
1. Export data on one device
2. Email the JSON file to yourself
3. Download on other device
4. Import the file

### Method 3: Via USB/AirDrop
1. Export data
2. Transfer file via USB cable or AirDrop
3. Import on other device

## Data Format

The exported JSON file looks like this:
```json
{
  "version": "1.0.7",
  "exportDate": "2025-10-06T12:00:00.000Z",
  "activityLog": {
    "2025-10-06": {
      "07:00": {
        "کار": 0.5,
        "دانش": 0.25
      },
      "_metadata": {
        "mood": 8,
        "calories": 2000
      }
    }
  },
  "planning": {
    "کار_frequency": "daily",
    "کار_hours": "8"
  }
}
```

## Safety Features

1. **Automatic Backups:**
   - Before import: `last_backup_before_import`
   - Before clear: `last_backup_before_clear`
   - Stored in localStorage (not visible in normal UI)

2. **Double Confirmation:**
   - Clear data requires 2 confirmations
   - Import requires 1 confirmation

3. **Validation:**
   - File format is checked before import
   - Invalid files are rejected

## Tips

- 📅 **Export regularly** - Make weekly/monthly backups
- 💾 **Keep multiple backups** - Don't rely on just one
- ☁️ **Use cloud storage** - Easy sync between devices
- 🏷️ **Name your files** - Include dates in filenames
- 🧪 **Test imports** - Try importing to verify backups work

## Troubleshooting

**Import not working?**
- Make sure file is valid JSON
- Check file was exported from this app
- Try exporting and re-importing to test

**Can't find downloaded file?**
- Check your browser's Downloads folder
- Look for files named `mahtab-tracker-backup-*.json`

**Lost data after clearing?**
- Check localStorage for backup (requires browser console)
- Look for `last_backup_before_clear` key

## Privacy Note

- ✅ All data stays on your device
- ✅ Export/import happens locally
- ✅ No data sent to any server
- ✅ You have full control
