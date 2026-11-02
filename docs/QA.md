# RAMBA homepage review — verified 2 November 2026

## Scope delivered

Stages A–C implemented: existing-project audit, official palette/tagline, ten original conceptual images and responsive variants, seven redesigned homepage sections plus shared footer. The five-page structure is preserved. The four interior page compositions await homepage approval. No deployment/domain work was performed.

## Checks actually performed

- Build and syntax: npm run build and npm run check passed. 14 Node tests passed, zero failed/skipped. Tests cover architecture, unique IDs/H1, local links and srcset files, source/dist consistency, conceptual alt text/dimensions, metadata, restricted preview routes/404, and enquiry logic.
- Browser: actual local site opened in the in-app browser at its measured 1280 × 720 desktop viewport. The seven homepage sections were visited and inspected. Screenshots are actual browser captures, not design mockups.
- Responsive matrix: 20 real iframe cases, five pages at 320, 390, 768 and 1024 pixels wide. All had expected section counts, no body/content horizontal overflow, and no completed-but-broken image. The iframe height was 844. Scrollbars reduce usable width by 15px in this browser. Raw measurements: screenshots/responsive-results.json.
- Phone menu: opening, Escape dismissal and aria-expanded state passed using the actual visible controls.
- Experience selector: clicking Unwind changed the image/copy; ArrowRight selected Gather; End selected Wander; Home returned to Rest. Hidden scenes load when selected. Visible scene images loaded successfully.
- Motion: opening arch visibly observed; manual footer reduced-motion control yielded animation:none, transform:none and scroll-behavior:auto. Reduced rendering had no opacity-zero reveal content. System preference handling passed the automated fixture; the OS preference itself was not changed.
- Keyboard: skip-link Enter focused main-content. Native imagery FAQ/disclosure expanded. Back-to-top navigation returned to the homepage opening.
- Enquiry browser flow: empty fields showed errors and focused name; invalid email showed the correct error; valid test data produced a plain-text draft and focus moved to its heading. Mail URL retained stay@ramba.example and encoded the content. Editing hid the obsolete draft. Nothing was submitted.
- Actual download: the browser saved RAMBA-enquiry-draft.txt to Downloads. Its text was read and matched the test message and the “not sent” notice. The mail client was not launched.
- Asset validation: all 33 WebPs decoded successfully. Ten originals are 1672 × 941. Web variants total approximately 4.7 MB across all sizes, not a single page load. The largest hero variant is 335,264 bytes versus its 3,553,968-byte PNG source. Scripts have no runtime dependencies or external asset requests. No Lighthouse score or field-performance metrics are claimed.
- Solid colour contrast: sand/green 7.49:1; sand/charcoal 8.69:1. Small selected labels use sand; gold/green (3.74:1) is reserved for large text/details. The clay enquiry background was changed to charcoal for small-copy contrast. Photo overlays were darkened and visually inspected; no complete automated contrast certification is claimed.
- Direct-site browser console: the inspected session returned zero warning/error entries.

## Issues encountered and disposition

- A 2px mobile overflow was traced to an experience figure's aspect ratio and minimum height. Explicit width/min-width fixed it. The 20-case matrix was rerun successfully.
- Browser viewport override did not change innerWidth (remained 1280). Responsive checks therefore use the actual pages in the bundled local review frame, not an unverified viewport override.
- Full-page desktop capture omitted some composited images and distorted viewport-relative sections. That capture was discarded. Desktop evidence uses normal viewport screenshots; mobile/tablet evidence includes the review frame and measured dimensions.
- The iframe inspection session reported unattributed MutationObserver errors during navigation, including a clean-session repeat. The project contains no MutationObserver calls and the direct site session was clean. This appears related to iframe inspection, but its source was not proven; it remains an unresolved testing-tool limitation. Do not describe every review-console check as clean.

## Remaining work / limits

- Stage E: user review and approval of the homepage direction. Stage F redesigns and Stage G final all-page QA have not been performed.
- Approved RAMBA vector/transparent logo remains missing. Plain text identity and a colour-only favicon are interim.
- Real photography/footage and verified launch/contact/legal/commercial details remain missing. All resort scenes are explicitly AI concepts. stay@ramba.example remains non-operational.
- No Safari/Firefox/physical-device, full screen-reader or exhaustive no-JavaScript browser audit. No live backend, booking, mail-delivery or hosting test; those services are not connected.
- ZIP verification is recorded in docs/PACKAGING.md after packaging.

## Screenshots

- screenshots/desktop-hero.jpg — final opening, 1280 × 720 viewport.
- screenshots/desktop-architecture.jpg — architecture study.
- screenshots/desktop-experience.jpg — selected pool concept.
- screenshots/mobile-home-review.jpg — actual 390 × 844 page inside local review frame.
- screenshots/mobile-experience.jpg — mobile selector state.
- screenshots/tablet-home-review.jpg — actual 768 × 844 page inside local review frame.
- screenshots/enquiry-draft.jpg — local draft review UI using test data.
