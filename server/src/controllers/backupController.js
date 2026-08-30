const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// @desc    Create database backup
// @route   POST /api/backup/create
// @access  Private (Admin only)
const createBackup = async (req, res, next) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.json`;
    const backupFilePath = path.join(backupDir, backupFileName);

    // Get all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const backupData = {
      timestamp: new Date().toISOString(),
      database: db.databaseName,
      collections: {},
    };

    // Backup each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      const documents = await db.collection(collectionName).find({}).toArray();
      backupData.collections[collectionName] = documents;
    }

    // Write backup to file
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

    res.json({ 
      success: true, 
      message: 'Backup created successfully',
      backup: {
        fileName: backupFileName,
        timestamp: backupData.timestamp,
        size: fs.statSync(backupFilePath).size,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all backups
// @route   GET /api/backup/list
// @access  Private (Admin only)
const listBackups = async (req, res, next) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    
    if (!fs.existsSync(backupDir)) {
      return res.json({ success: true, backups: [] });
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        return {
          fileName: file,
          size: stats.size,
          createdAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json({ success: true, backups: files });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore from backup
// @route   POST /api/backup/restore
// @access  Private (Admin only)
const restoreBackup = async (req, res, next) => {
  try {
    const { fileName } = req.body;
    
    if (!fileName) {
      return res.status(400).json({ success: false, message: 'Backup file name is required' });
    }

    const backupDir = path.join(__dirname, '../../backups');
    const backupFilePath = path.join(backupDir, fileName);

    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({ success: false, message: 'Backup file not found' });
    }

    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
    const db = mongoose.connection.db;

    // Clear existing collections and restore from backup
    for (const collectionName in backupData.collections) {
      await db.collection(collectionName).deleteMany({});
      if (backupData.collections[collectionName].length > 0) {
        await db.collection(collectionName).insertMany(backupData.collections[collectionName]);
      }
    }

    res.json({ 
      success: true, 
      message: 'Database restored successfully',
      restoredAt: new Date().toISOString(),
      backupTimestamp: backupData.timestamp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete backup
// @route   DELETE /api/backup/:fileName
// @access  Private (Admin only)
const deleteBackup = async (req, res, next) => {
  try {
    const { fileName } = req.params;
    
    const backupDir = path.join(__dirname, '../../backups');
    const backupFilePath = path.join(backupDir, fileName);

    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({ success: false, message: 'Backup file not found' });
    }

    fs.unlinkSync(backupFilePath);

    res.json({ success: true, message: 'Backup deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Download backup
// @route   GET /api/backup/download/:fileName
// @access  Private (Admin only)
const downloadBackup = async (req, res, next) => {
  try {
    const { fileName } = req.params;
    
    const backupDir = path.join(__dirname, '../../backups');
    const backupFilePath = path.join(backupDir, fileName);

    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({ success: false, message: 'Backup file not found' });
    }

    res.download(backupFilePath, fileName);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBackup,
  listBackups,
  restoreBackup,
  deleteBackup,
  downloadBackup,
};
