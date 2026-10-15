const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const IMAGE_RE = /jpeg|jpg|png|gif|webp|avif/;
const VIDEO_RE = /mp4|webm|mov|quicktime|m4v|ogg/;

const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (IMAGE_RE.test(ext) && file.mimetype.startsWith('image/')) return cb(null, true);
  cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, avif)'));
};

// Accepts either an image or a video — used for carousel slides, the ad film and its poster.
const mediaFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (IMAGE_RE.test(ext) && file.mimetype.startsWith('image/')) return cb(null, true);
  if (VIDEO_RE.test(ext) && file.mimetype.startsWith('video/')) return cb(null, true);
  cb(new Error('Only images (jpg, png, webp, gif) or videos (mp4, webm, mov) are allowed'));
};

const upload = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 8 * 1024 * 1024 } });
const uploadMedia = multer({ storage, fileFilter: mediaFilter, limits: { fileSize: 250 * 1024 * 1024 } });

module.exports = upload;
module.exports.uploadMedia = uploadMedia;
