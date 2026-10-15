// Default storytelling content — used when the landing doc is first created and by the seed script.
const processSteps = [
  { time: '4:30 AM', icon: 'farm', title: 'Picked at dawn', text: 'Raw Nendran bananas come straight from partner farms in Kerala — green, firm and harvested the same morning.' },
  { time: '6:00 AM', icon: 'peel', title: 'Peeled by hand', text: 'Our crew peels every banana by hand. No machines bruising the fruit, no shortcuts.' },
  { time: '6:45 AM', icon: 'slice', title: 'Sliced paper-thin', text: 'Each one is sliced straight into the kadai, so the slices never sit around waiting.' },
  { time: '7:00 AM', icon: 'fry', title: 'Fried in coconut oil', text: 'Small batches go into pure coconut oil in the same iron kadai we have used since 1995.' },
  { time: '7:05 AM', icon: 'salt', title: 'A splash of turmeric salt water', text: 'Thrown in mid-fry, the way Ammachi taught us. That sizzle is where the golden colour and the flavour come from.' },
  { time: '8:30 AM', icon: 'taste', title: 'The crunch test', text: 'Someone from the crew tastes every batch. If it doesn’t snap, it doesn’t ship.' },
  { time: '9:00 AM', icon: 'pack', title: 'Sealed while still warm', text: 'Packed in nitrogen-flushed, triple-layer bags that lock the crunch in.' },
  { time: '11:00 AM', icon: 'ship', title: 'Out the door', text: 'Your order leaves the kitchen the day it was packed and heads straight to you.' }
];

const legacyMilestones = [
  { year: '1995', title: 'One kadai, one street corner', text: 'Appa starts frying banana chips in a tiny shop near the bus stand. Queues by 7 AM.' },
  { year: '2003', title: 'The whole town knows', text: 'Weddings, temple festivals, train journeys. If there is a celebration, there is a Snackim packet.' },
  { year: '2012', title: 'A proper kitchen', text: 'We move into a bigger kitchen and keep the original kadai and the same recipe.' },
  { year: '2020', title: 'The kids start helping', text: 'Lockdown means the next generation is home, and suddenly they are on frying duty.' },
  { year: '2025', title: 'Gen Z takes the wheel', text: 'New packs, new flavours, and online orders across India. The recipe is still Appa’s.' }
];

const legacyText = 'For 30 years, our family has woken up before the sun to fry banana chips the old-school way. Now the grandkids run the show. We are Gen Z, we are online and we are a bit loud about it, but the recipe hasn’t changed. Same Nendran bananas, same coconut oil, same 4:30 AM alarm.';

module.exports = { processSteps, legacyMilestones, legacyText };
