# Build a Romantic Starry Night Website

This guide walks through the ideas behind this small, framework-free project. It is written for beginners who want to learn by changing a working example.

## 1. Start with three files

`index.html` defines the sections and controls, `style.css` handles the visual design and responsive layout, and `app.js` adds animation and interaction. Open `index.html` in a modern browser to run the project; there is no build step.

The HTML includes two canvases: `#sky` for the background stars and `#heart` for the interactive heart. It also includes six memory cards created by JavaScript, a `<dialog>` for reading each memory, and a wish form.

## 2. Draw a moving star field

In `app.js`, `resizeSky()` measures the viewport, scales the canvas for the device pixel ratio, and creates random stars. `drawSky()` clears the canvas and redraws each star with a slowly changing position and opacity. `requestAnimationFrame()` repeats this drawing while the page is visible.

Try changing the star count or the small movement multiplier in `drawSky()` to see how the atmosphere changes. Keep the count modest on phones so scrolling stays smooth.

## 3. Shape and animate the heart

`resizeHeart()` builds points using a parametric heart curve. Each point has a target position and a current position. During every animation frame, a spring force moves the point back toward its target. Pointer movement adds a short repulsion force, so the particles scatter and gather again.

Try changing the spring value (`.018`) or damping value (`.89`) in `drawHeart()`. Smaller spring values make the heart re-form more slowly; lower damping values make particles settle sooner.

## 4. Add your own memories

At the top of `app.js`, edit the six objects in the `memories` array. Change each `title`, `text`, and `image`. Put photos in an `images/` folder and use paths such as `./images/photo-1.jpg`.

The cards and dialog use `textContent` for story text, so a memory is displayed as text rather than interpreted as HTML. Images use `object-fit: cover` to fill each card without stretching.

## 5. Save wishes in the browser

The wish form trims the message, limits it to 80 characters, and stores it in `localStorage`. The background canvas then draws a brighter star for each saved wish. Reopen the page in the same browser to see the saved wishes.

`localStorage` belongs to one browser on one device. It does not sync wishes between people. If you need shared wishes later, you would add a server or database.

## 6. Make the layout work on phones

The viewport meta tag and CSS media queries adjust the page at narrower widths. The card grid changes from three columns to two, the wish form becomes vertical, and the hero stacks its text and heart. The input uses a readable font size to avoid unwanted zoom on iPhones.

The page also checks `prefers-reduced-motion`; when that setting is enabled, it renders a still starry scene instead of running continuous animation.

## Next experiments

- Change the color variables in `style.css` for a different night-sky palette.
- Add captions or dates to the `memories` objects.
- Let a selected wish star show its text in a small popover.
- Add a local-only export button so a visitor can download their wishes as JSON.
