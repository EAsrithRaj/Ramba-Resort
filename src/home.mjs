import { conceptImage as photo, conceptCaption } from './imagery.mjs';

const arrow = '<span aria-hidden="true">↗</span>';
const textLink = (href, text) => `<a class="editorial-link" href="${href}"><span>${text}</span>${arrow}</a>`;
const moments = [
  ['interior', 'Rest', 'A slower beginning.', 'Soft light. An unhurried morning. A little more room for yourself.'],
  ['pool', 'Unwind', 'Let the hours drift.', 'The feeling of cool water and a day with nothing to prove.'],
  ['dining', 'Gather', 'Stay for the conversation.', 'A shared table. Familiar voices. Moments that need no occasion.'],
  ['lifestyle', 'Wander', 'Take the long way.', 'An open afternoon, a shaded path and the freedom to follow a feeling.']
];

export const home = {
  file: 'index.html',
  title: 'RAMBA RESORTS — Curating Memories',
  description: 'A quieter vision of coming away. Explore the conceptual world of RAMBA RESORTS, a retreat taking shape. Interiors and pool are under construction.',
  sections: 7,
  content: `
  <section class="home-hero hero" aria-labelledby="hero-title">
    <div class="hero-visual" data-portal>${photo('hero', {eager:true})}</div>
    <div class="hero-wash" aria-hidden="true"></div>
    <div class="hero-editorial">
      <p class="eyebrow hero-entrance">A retreat in the making</p>
      <h1 id="hero-title"><span class="headline-line">Let the world</span><span class="headline-line"><em>wait a little.</em></span></h1>
      <p class="hero-subline hero-entrance">A quieter vision of coming away.</p>
      <a class="hero-enquire hero-entrance" href="enquire.html">Begin a conversation ${arrow}</a>
    </div>
    <div class="hero-bottom"><span class="hero-tagline">Curating Memories</span><a class="scroll-disc" href="#introduction" aria-label="Discover RAMBA, scroll to introduction"><span aria-hidden="true">↓</span></a><span class="hero-disclosure">AI-generated concept <br>Not the actual RAMBA property</span></div>
  </section>

  <section class="home-intro home-space" id="introduction" aria-labelledby="intro-title">
    <div class="wrap">
      <div class="chapter-line"><span>01 / The RAMBA feeling</span><span>A little less hurry. A little more here.</span></div>
      <div class="intro-heading"><span class="fine-rule" aria-hidden="true"></span><h2 id="intro-title" class="reveal">Curating<br><em>Memories.</em></h2></div>
      <div class="intro-composition">
        <figure class="intro-detail image-reveal reveal">${photo('texture',{portrait:true})}<figcaption>Material study / AI concept</figcaption></figure>
        <div class="intro-copy reveal"><p class="large-copy">Not every moment needs<br>to be extraordinary.<br>Some just need <em>space.</em></p><p>RAMBA begins with that thought. A retreat taking shape around warm spaces, a gentler pace, and the simple pleasure of being present.</p>${textLink('story.html','The story behind RAMBA')}</div>
        <figure class="intro-garden image-reveal reveal">${photo('garden',{sizes:'(max-width: 600px) 90vw, 26vw'})}<figcaption>A landscape imagined / AI concept</figcaption></figure>
      </div>
    </div>
  </section>

  <section class="home-story" aria-labelledby="story-title">
    <div class="story-sticky">${photo('evening')}<div class="story-wash" aria-hidden="true"></div>
      <div class="story-heading wrap"><p class="eyebrow reveal">02 / A different rhythm</p><h2 id="story-title" class="reveal">The art of<br><em>staying awhile.</em></h2></div>
      <div class="story-bottom wrap"><p class="story-note reveal">We’re imagining a place where the best part of the day might be the part you hadn’t planned.</p>${conceptCaption}</div>
    </div>
  </section>

  <section class="home-architecture home-space" aria-labelledby="architecture-title"><div class="wrap">
    <div class="chapter-line"><span>03 / Architecture &amp; surroundings</span><span>A study in belonging</span></div>
    <div class="architecture-heading"><h2 id="architecture-title" class="reveal">Grounded in nature.<br><em>Open to possibility.</em></h2><p class="reveal">Stone, shade, light and landscape. A visual exploration of the atmosphere guiding RAMBA — not a specification of the finished retreat.</p></div>
    <div class="architecture-images">
      <figure class="villa-study image-reveal reveal">${photo('villa',{sizes:'(max-width: 700px) 90vw, 60vw'})}<figcaption><span>01 / Architecture in the landscape</span>${conceptCaption}</figcaption></figure>
      <figure class="detail-study image-reveal reveal">${photo('exterior',{portrait:true})}<figcaption><span>02 / Light, held in texture</span>${conceptCaption}</figcaption></figure>
    </div>
    <div class="architecture-bottom"><span class="material-note">Earth / Timber / Stillness</span>${textLink('retreat.html','Explore the retreat')}</div>
  </div></section>

  <section class="home-experiences home-space" aria-labelledby="experience-title"><div class="wrap">
    <div class="chapter-line"><span>04 / The experience, imagined</span><span>Small moments. Lasting impressions.</span></div>
    <div class="experience-heading"><h2 id="experience-title" class="reveal">Less on the agenda.<br><em>More to remember.</em></h2><p>These are ideas for the feeling of a stay.<br>Facilities and experiences are not yet confirmed.</p></div>
    <div class="experience-stage" data-switcher>
      <div class="experience-frames">
        ${moments.map(([name,label,title,copy],i)=>`<figure class="experience-frame" data-panel="${name}" id="moment-${name}" aria-label="${label} concept">${photo(name,{sizes:'(max-width: 820px) 90vw, 58vw'})}<figcaption><span class="moment-number">0${i+1}</span><div><h3>${title}</h3><p>${copy}</p></div>${conceptCaption}</figcaption></figure>`).join('')}
      </div>
      <div class="experience-menu"><p class="eyebrow">Find your moment</p><div class="switcher-controls" aria-label="Explore intended experiences">${moments.map(([name,label],i)=>`<button type="button" data-choice="${name}" aria-controls="moment-${name}" aria-pressed="${i===0}"><span class="choice-number">0${i+1}</span><span>${label}</span><span aria-hidden="true">↗</span></button>`).join('')}</div><p class="experience-note">An invitation to imagine.<br>No live facilities or bookings.</p>${textLink('experience.html','Explore the feeling')}</div>
    </div>
  </div></section>

  <section class="home-property home-space" aria-labelledby="property-title"><div class="wrap">
    <div class="chapter-line"><span>05 / A place in the making</span><span>The real story, so far</span></div>
    <div class="property-layout"><div class="property-title"><h2 id="property-title" class="reveal">A vision.<br>A place.<br><em>A beginning.</em></h2><p>Discover what is taking shape at RAMBA, and what is still to come.</p>${textLink('retreat.html','Follow the progress')}</div>
    <div class="property-facts"><p class="large-copy reveal">Good things deserve<br>the time to <em>become.</em></p><dl class="status-ledger"><div><dt><span>01</span>Villa exteriors</dt><dd>Complete</dd></div><div><dt><span>02</span>Interiors</dt><dd>Under construction</dd></div><div><dt><span>03</span>Pool</dt><dd>Under construction</dd></div></dl><p class="property-footnote">Opening dates, availability and commercial details are not confirmed. This is a brand presentation, not a booking or property offer.</p>
    <details class="imagery-disclosure"><summary>About the imagery <span class="disclosure" aria-hidden="true"></span></summary><p>All resort scenes on this website are original AI-generated concepts. They do not show the actual RAMBA property, its surroundings or completed facilities. Approved photography will replace them as it becomes available.</p></details></div></div>
  </div></section>

  <section class="home-enquiry home-space" aria-labelledby="enquiry-title"><div class="wrap">
    <p class="eyebrow reveal">06 / Your next chapter</p><div class="enquiry-composition"><h2 id="enquiry-title" class="reveal">Something<br><em>on your mind?</em></h2><a class="enquiry-circle" href="enquire.html" aria-label="Prepare your RAMBA enquiry draft"><span>Let’s begin</span>${arrow}</a></div>
    <div class="enquiry-bottom"><p>Bring a question. Leave a thought.<br>Start with a simple hello.</p><p class="draft-notice">Prepare and save an enquiry draft.<br>Nothing is sent. Email setup is pending.</p></div>
  </div></section>`
};
