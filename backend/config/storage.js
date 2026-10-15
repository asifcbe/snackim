const fs = require('fs');
const path = require('path');

const uploadToStorage = (file) =>
  Promise.resolve({ secure_url: `/uploads/${file.filename}` });

const deleteFromStorage = (url) => {
  if (!url || !url.startsWith('/uploads/')) return;
  const filename = url.split('/uploads/')[1];
  if (!filename || filename.startsWith('seed-')) return; // never delete bundled seed assets
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') console.error('File delete error:', err.message);
  });
};

module.exports = { uploadToStorage, deleteFromStorage };
