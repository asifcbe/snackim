const mongoose = require('mongoose');

// A carousel slide is either an image or a video. Video slides autoplay muted & looped
// in the carousel and can be opened full-screen with sound.
const slideSchema = new mongoose.Schema({
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  url: { type: String, required: true },
  poster: { type: String },
  caption: { type: String },
  subcaption: { type: String },
  ctaText: { type: String },
  ctaLink: { type: String },
  theme: { type: String, default: 'yellow' }
});

const timelineStepSchema = new mongoose.Schema({
  time: { type: String },
  title: { type: String, required: true },
  text: { type: String },
  icon: { type: String, default: 'banana' }
});

const legacyMilestoneSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String }
});

const landingSchema = new mongoose.Schema({
  heroTitle: { type: String, default: 'Crunch that hits different.' },
  heroSubtitle: { type: String, default: 'Kerala banana chips, fried in small batches in pure coconut oil.' },
  carouselSlides: [slideSchema],

  // Full-screen "ad" film shown on landing (optionally auto-plays once per session).
  adVideo: {
    url: { type: String },
    poster: { type: String },
    title: { type: String, default: 'The Snackim Film' },
    subtitle: { type: String, default: 'Watch how the crunch happens' },
    autoplayOnLanding: { type: Boolean, default: true },
    enabled: { type: Boolean, default: false }
  },

  processTitle: { type: String, default: 'From the farm to your crunch' },
  processSubtitle: { type: String, default: 'Every pack follows the same sunrise-to-sunset ritual.' },
  processSteps: [timelineStepSchema],

  legacyTitle: { type: String, default: '30 years. Same kadai. New crew.' },
  legacyText: { type: String },
  legacyImage: { type: String },
  legacyMilestones: [legacyMilestoneSchema]
}, { timestamps: true });

module.exports = mongoose.model('LandingContent', landingSchema);
