const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadMedia } = require('../middleware/upload');
const {
  getLanding, updateLanding, addSlide, updateSlide, deleteSlide, reorderSlides,
  uploadAdVideo, deleteAdVideo, uploadLegacyImage
} = require('../controllers/landingController');

const slideFields = uploadMedia.fields([{ name: 'media', maxCount: 1 }, { name: 'poster', maxCount: 1 }]);
const adFields = uploadMedia.fields([{ name: 'video', maxCount: 1 }, { name: 'poster', maxCount: 1 }]);

router.get('/', getLanding);
router.put('/', protect, adminOnly, updateLanding);
router.post('/slides', protect, adminOnly, slideFields, addSlide);
router.put('/slides/reorder', protect, adminOnly, reorderSlides);
router.put('/slides/:slideId', protect, adminOnly, slideFields, updateSlide);
router.delete('/slides/:slideId', protect, adminOnly, deleteSlide);
router.post('/ad-video', protect, adminOnly, adFields, uploadAdVideo);
router.delete('/ad-video', protect, adminOnly, deleteAdVideo);
router.post('/legacy-image', protect, adminOnly, upload.single('image'), uploadLegacyImage);

module.exports = router;
