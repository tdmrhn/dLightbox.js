# dLightbox.js

Extremely lightweight yet powerful and touch-friendly, jQuery-free Lightbox. dLightbox.js is custom coded from scratch, ensuring efficient performance and compatibility with modern web development practices.

dLightbox.js is fully responsive, supporting touch, mousewheel, keyboard, double click zoom and mouse drag interactions, build-in thumbnails, as well as slide counters and figcaption. dLightbox.js ensures optimal viewing experiences across all devices.

Extremely lightweight at only 2.78kb gzipped for both dLightbox.js and dLightbox.css

<a href="https://codepen.io/dmrhn/pen/NPNyGdJ" target=_blank>Codepen Live Demo - v0.6</a>

<a href="https://codepen.io/dmrhn/pen/vEOQxbL" target=_blank>Codepen Live Demo - v0.5</a>

<a href="https://codepen.io/dmrhn/pen/mdgZNNZ" target=_blank>Codepen Live Demo - v0.4</a>

<a href="https://codepen.io/dmrhn/pen/KKYbGXK" target=_blank>Codepen Live Demo - v0.3</a>

<a href="https://codepen.io/dmrhn/pen/abxYyQg" target=_blank>Codepen Live Demo - v0.1</a>

<img src="https://i.imgur.com/Djj1nv7.png">



# Features:

* Class based module controls, no js fuss
* Supports touch, mousewheel, keyboard, double click zoom and mouse drag interactions.
* Slide counter and figcaption support (class -> dLightbox-captions).
* Thumbnail support (class -> dLightbox-thumbnails).
* Easy customizations via CSS flex.
* jQuery-Free, lightweight at only 2.78kb gzipped for both dLightbox.js and dLightbox.css
* Fully responsive.

# Installation

Download dLightbox.js and dLightbox.css and use dLightbox class for the galleries you want to enable lightbox feature.
Example HTML markup:

```
<div class="dLightbox dLightbox-thumbnails dLightbox-captions">
  <figure><a href="imgurl"><img src="imgurl" alt="Image"></a>
    <figcaption>Title</figcaption>
  </figure>
</div>
```

# Frequently Asked Questions

* Is it mobile touch friendly? 

dLightbox.js supports touch, mousewheel, keyboard, and mouse drag interactions.

* Is it supports thumbnails?

Yes it supports thumbnails with "dLightbox-thumbnails" class like Codepen demo. Also thumbnails can be easily positioned via CSS according to your needs.

* Is the lightbox responsive?

Yes, the lightbox feature provided by Gallery Lightbox is fully responsive, ensuring optimal viewing experiences across all devices.

* Does it need jQuery?

No, there is no dependency on jQuery. dLightbox is custom coded from scratch, ensuring efficient performance and compatibility with modern web development practices.

* Does dLightbox.js impact page loading speed?

Extremely lightweight at only 2.78kb gzipped for both dLightbox.js and dLightbox.css

# Changelog

= 0.6 =
* Improved dLightbox.js code
* Fixed an issue when toogle off thumbnails

= 0.5 =
* Improved js code
* Added auto carousel to thumbnails container if wider than viewport

= 0.4 =
* Improved double click to zoom
* Added double tap to zoom on mobile

= 0.3 =
* Added Zoom to original image size on double click

= 0.2 =
* Added Dynamic Thumbnails

= 0.1 =
* Initial release
