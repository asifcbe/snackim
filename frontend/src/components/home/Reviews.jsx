import React from 'react';

// Placeholder reviews for the demo — replace with real customer reviews before launch.
import Marquee from '../Marquee';

const REVIEWS = [
  { name: 'Aditi, Bengaluru', text: 'Opened the box and the whole room smelled of coconut oil. Gone in 10 minutes.', color: 'yellow' },
  { name: 'Rahul, Pune', text: 'They taste like the ones my grandmother used to bring back from Kerala. Unreal crunch.', color: 'sky' },
  { name: 'Sneha, Chennai', text: 'Peri Peri banana chips are dangerous. Ordered 4 more packs.', color: 'pink' },
  { name: 'Faiz, Kochi', text: 'As a Malayali I was ready to judge. I’m now a subscriber. Respect.', color: 'teal' },
  { name: 'Meera, Delhi', text: 'Thin, golden, not oily at all. Every chip snaps properly.', color: 'plum' },
  { name: 'Arjun, Hyderabad', text: 'The packaging is cute but the chips are cuter. 10/10 vibes.', color: 'yellow' }
];

const Reviews = () => (
  <section className="reviews section">
    <div className="container" style={{ textAlign: 'center', marginBottom: 40 }}>
      <span className="eyebrow">Snackers say</span>
      <h2>Certified crunchy by <span className="text-pink">real humans</span></h2>
    </div>
    <Marquee
      items={REVIEWS}
      speed={60}
      separator={null}
      renderItem={(r) => (
        <figure className={`review review-${r.color}`}>
          <div className="review-stars">★★★★★</div>
          <blockquote>&ldquo;{r.text}&rdquo;</blockquote>
          <figcaption>— {r.name}</figcaption>
        </figure>
      )}
    />
  </section>
);

export default Reviews;
