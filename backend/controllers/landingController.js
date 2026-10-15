const LandingContent = require('../models/LandingContent');
const { uploadToStorage, deleteFromStorage } = require('../config/storage');
const defaults = require('../config/landingDefaults');

const loadLanding = async () => {
  let landing = await LandingContent.findOne();
  if (!landing) {
    landing = await LandingContent.create({
      processSteps: defaults.processSteps,
      legacyMilestones: defaults.legacyMilestones,
      legacyText: defaults.legacyText
    });
  }
  return landing;
};

const fileType = (file) => (file.mimetype.startsWith('video/') ? 'video' : 'image');

const getLanding = async (req, res) => {
  try {
    res.json(await loadLanding());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLanding = async (req, res) => {
  try {
    const landing = await loadLanding();
    const allowed = ['heroTitle', 'heroSubtitle', 'processTitle', 'processSubtitle', 'legacyTitle', 'legacyText', 'processSteps', 'legacyMilestones'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) landing[key] = req.body[key];
    });
    if (req.body.adVideo) {
      ['title', 'subtitle', 'autoplayOnLanding', 'enabled'].forEach((k) => {
        if (req.body.adVideo[k] !== undefined) landing.adVideo[k] = req.body.adVideo[k];
      });
    }
    await landing.save();
    res.json(landing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---- Carousel slides (image or video) ----
const pickSlideFields = (body, slide) => {
  ['caption', 'subcaption', 'ctaText', 'ctaLink', 'theme'].forEach((k) => {
    if (body[k] !== undefined) slide[k] = body[k];
  });
};

const addSlide = async (req, res) => {
  try {
    const media = req.files?.media?.[0];
    if (!media) return res.status(400).json({ message: 'Upload an image or a video for the slide' });
    const landing = await loadLanding();
    const slide = { mediaType: fileType(media), url: (await uploadToStorage(media)).secure_url };
    const poster = req.files?.poster?.[0];
    if (poster) slide.poster = (await uploadToStorage(poster)).secure_url;
    pickSlideFields(req.body, slide);
    landing.carouselSlides.push(slide);
    await landing.save();
    res.json(landing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSlide = async (req, res) => {
  try {
    const landing = await loadLanding();
    const slide = landing.carouselSlides.id(req.params.slideId);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    pickSlideFields(req.body, slide);
    const media = req.files?.media?.[0];
    if (media) {
      deleteFromStorage(slide.url);
      slide.url = (await uploadToStorage(media)).secure_url;
      slide.mediaType = fileType(media);
    }
    const poster = req.files?.poster?.[0];
    if (poster) {
      deleteFromStorage(slide.poster);
      slide.poster = (await uploadToStorage(poster)).secure_url;
    }
    await landing.save();
    res.json(landing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSlide = async (req, res) => {
  try {
    const landing = await loadLanding();
    const slide = landing.carouselSlides.id(req.params.slideId);
    if (slide) {
      deleteFromStorage(slide.url);
      deleteFromStorage(slide.poster);
      slide.deleteOne();
      await landing.save();
    }
    res.json(landing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const reorderSlides = async (req, res) => {
  try {
    const landing = await loadLanding();
    const { order } = req.body; // array of slide ids
    const byId = new Map(landing.carouselSlides.map((s) => [String(s._id), s]));
    landing.carouselSlides = order.map((id) => byId.get(id)).filter(Boolean);
    await landing.save();
    res.json(landing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---- Full-screen ad film ----
const uploadAdVideo = async (req, res) => {
  try {
    const landing = await loadLanding();
    const video = req.files?.video?.[0];
    const poster = req.files?.poster?.[0];
    if (!video && !poster) return res.status(400).json({ message: 'Upload a video and/or a poster image' });
    if (video) {
      if (!video.mimetype.startsWith('video/')) return res.status(400).json({ message: 'The ad must be a video file' });
      deleteFromStorage(landing.adVideo.url);
      landing.adVideo.url = (await uploadToStorage(video)).secure_url;
      landing.adVideo.enabled = true;
    }
    if (poster) {
      deleteFromStorage(landing.adVideo.poster);
      landing.adVideo.poster = (await uploadToStorage(poster)).secure_url;
    }
    await landing.save();
    res.json(landing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAdVideo = async (req, res) => {
  try {
    const landing = await loadLanding();
    deleteFromStorage(landing.adVideo.url);
    deleteFromStorage(landing.adVideo.poster);
    landing.adVideo.url = undefined;
    landing.adVideo.poster = undefined;
    landing.adVideo.enabled = false;
    await landing.save();
    res.json(landing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadLegacyImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });
    const landing = await loadLanding();
    deleteFromStorage(landing.legacyImage);
    landing.legacyImage = (await uploadToStorage(req.file)).secure_url;
    await landing.save();
    res.json(landing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getLanding, updateLanding, addSlide, updateSlide, deleteSlide, reorderSlides,
  uploadAdVideo, deleteAdVideo, uploadLegacyImage
};
