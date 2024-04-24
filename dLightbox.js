/*
 * dLightbox.js
 * @author  dmrhn
 * @version 0.3
 * @url https://github.com/tdmrhn/dLightbox.js
 */
document.addEventListener("DOMContentLoaded", function () {
  var current = null;
  var size;
  var slider;
  var canvas;
  var originalTransform = "";
  var touchStartX, touchStartY, startX, currentX, isZoomed = false;
  
  document.querySelectorAll(".dLightbox").forEach(function(gallery, index) {
  var uniqueId = "dLightbox_" + index;
  gallery.setAttribute("data-lightbox-id", uniqueId);
  
  gallery.addEventListener("click", function(e) {
    e.preventDefault();
    var lightbox = document.querySelector('.dLightbox_canvas[data-lightbox-id="' + uniqueId + '"]');
    
    if (!lightbox) {
      lightbox = dLightboxCreate(uniqueId);
      dLightboxActions(uniqueId);
    }
    
    document.body.classList.add("dL_noscroll");
    lightbox.classList.add("active");
    
    var link = e.target.closest("a");
    if (link) {
      var index = Array.from(gallery.querySelectorAll("a")).indexOf(link);
      var direction = index > current ? "next" : "prev";
      dLightboxSlide(uniqueId, index, direction);
    }
  });
});


  function dLightboxCreate(uniqueId) {
    var lightbox = document.createElement("div");
    lightbox.classList.add("dLightbox_canvas", "active");
    lightbox.setAttribute("data-lightbox-id", uniqueId);
    lightbox.innerHTML = `<div class="dL_info-container"><div class="dL_count"></div><div class="dL_title"></div><div class="dL_close">&#x2715;</div></div><div class="dL_slides-container"><div class="dL_prev">&#8249;</div><div class="dLightbox_slider"><ul></ul></div><div class="dL_next">&#8250;</div></div>`;
    document.body.appendChild(lightbox);

  var slider = lightbox.querySelector(".dLightbox_slider ul");
  var thumbnailsContainer;
  var thumbnails = [];

  var isThumbnails = document.querySelector('.dLightbox-thumbnails[data-lightbox-id="' + uniqueId + '"]');
  if (isThumbnails) {
    lightbox.classList.add("dLightbox-thumbnails");
    thumbnailsContainer = document.createElement("div");
    thumbnailsContainer.classList.add("dL_thumbnails-container");
    lightbox.appendChild(thumbnailsContainer);

    isThumbnails.querySelectorAll("a").forEach(function(imgLink, index) {
      var href = imgLink.getAttribute("href");
      var thumbnail = document.createElement("img");
      thumbnail.src = href;

      thumbnail.addEventListener("click", function() {
        thumbnails.forEach(function(th) {
          th.classList.remove("active");
        });
        thumbnail.classList.add("active");
        slider.style.transform = "translateX(-" + index * 100 + "%)";
        dLightboxSlide(uniqueId, index);
      });

      thumbnails.push(thumbnail);
      thumbnailsContainer.appendChild(thumbnail);
    });
  }

  var imgLinks = document.querySelectorAll('[data-lightbox-id="' + uniqueId + '"] > figure > a');
  imgLinks.forEach(function(imgLink, index) {
    var href = imgLink.getAttribute("href");

    var imgContainer = document.createElement("li");
    imgContainer.innerHTML = '<img src="' + href + '">';

    var thumbnail = document.createElement("img");
    thumbnail.src = href;

    thumbnail.addEventListener("click", function() {
      thumbnails.forEach(function(thumb) {
        thumb.classList.remove("active");
      });
      thumbnail.classList.add("active");
      slider.style.transform = "translateX(-" + index * 100 + "%)";
      dLightboxSlide(uniqueId, index);
    });

    thumbnails.push(thumbnail);

    slider.appendChild(imgContainer);
  });

  function updateActiveThumbnail() {
    var currentIndex = Math.round(slider.scrollLeft / slider.clientWidth);

    thumbnails.forEach(function(thumb) {
      thumb.classList.remove("active");
    });

    thumbnails[currentIndex].classList.add("active");
  }

  lightbox.querySelector(".dLightbox_slider").addEventListener("scroll", updateActiveThumbnail);

  updateActiveThumbnail();

  return lightbox;
}

 function dLightboxSlide(uniqueId, index, direction) {
  current = index;
  var counter = index + 1;
  size = document.querySelectorAll('[data-lightbox-id="' + uniqueId + '"] .dLightbox_slider ul > li').length;
  var lightbox = document.querySelector('.dLightbox_canvas[data-lightbox-id="' + uniqueId + '"]');
  var slideContainer = lightbox.querySelector(".dLightbox_slider ul");
  var thumbnails = lightbox.querySelectorAll(".dL_thumbnails-container img");

  if (slideContainer) {    slideContainer.querySelectorAll("li.zoomed").forEach(function(img) {
      img.classList.remove("zoomed");
      img.querySelector("img").style.transform = originalTransform;
    });

    var moveDistance = -(current * 100);
    slideContainer.style.transform = "translateX(" + moveDistance + "%)";
    slideContainer.querySelectorAll("li").forEach(function(slide) {
      slide.classList.remove("active");
    });
    slideContainer.children[index].classList.add("active");

    if (thumbnails[index]) {
      thumbnails.forEach(function(thumb) {
        thumb.classList.remove("active");
      });
      thumbnails[index].classList.add("active");
    }

    var title = document.querySelector('[data-lightbox-id="' + uniqueId + '"]').classList.contains("dLightbox-captions");
    var figures = document.querySelectorAll('[data-lightbox-id="' + uniqueId + '"] > figure');
    if (index < figures.length) {
      var figcaptionElement = figures[index].querySelector("figcaption");
      var figcaption = figcaptionElement ? figcaptionElement.textContent : "";
      var imgElement = figures[index].querySelector("img");
      var alt = imgElement ? imgElement.getAttribute("alt") : "";
      lightbox.querySelector(".dL_count").innerHTML = counter + "/" + size;
      if (title) {
        lightbox.querySelector(".dL_title").innerHTML = figcaption || alt;
      }
    }
  }
}




  function dLightboxMove(uniqueId, direction) {
  var dest;
  var lightbox = document.querySelector('.dLightbox_canvas.active[data-lightbox-id="' + uniqueId + '"]');
  var currentSlide = current;

  if (direction === "prev") {
    dest = currentSlide - 1 < 0 ? size - 1 : currentSlide - 1;
  } else if (direction === "next") {
    dest = (currentSlide + 1) % size;
  }

  dLightboxSlide(uniqueId, dest);
}

function dLightboxClose(uniqueId) {
  var lightbox = document.querySelector('.dLightbox_canvas.active[data-lightbox-id="' + uniqueId + '"]');
  if (lightbox) {
    lightbox.classList.remove("active");
    document.body.classList.remove("dL_noscroll");
  }
}


  function dLightboxActions(uniqueId) {
  var canvas = document.querySelector('.dLightbox_canvas.active[data-lightbox-id="' + uniqueId + '"]');
  var slider = canvas.querySelector('.dLightbox_slider');
  
  canvas.addEventListener("click", function(e) {
    const targetClass = e.target.classList;
    if (targetClass.contains("dL_prev")) dLightboxMove(uniqueId, "prev");
    else if (targetClass.contains("dL_next")) dLightboxMove(uniqueId, "next");
    else if (targetClass.contains("dL_close") || targetClass.contains("dLightbox_canvas")) dLightboxClose(uniqueId);
  });
  
  slider.addEventListener("touchstart", function(e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  });

  slider.addEventListener("touchmove", function(e) {
    if (Math.abs(e.changedTouches[0].clientX - touchStartX) > Math.abs(e.changedTouches[0].clientY - touchStartY))
      e.preventDefault();
  });

  slider.addEventListener("touchend", function(e) {
    const touchDeltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(touchDeltaX) > 50)
      dLightboxMove(uniqueId, touchDeltaX > 0 ? "prev" : "next");
  });

  document.body.addEventListener("keydown", function(e) {
    var activeCanvas = document.querySelector('.dLightbox_canvas.active[data-lightbox-id="' + uniqueId + '"]');
    if (activeCanvas) {
      if (e.keyCode === 27) dLightboxClose(uniqueId);
      else if (e.keyCode === 37 || e.keyCode === 39)
        dLightboxMove(uniqueId, e.keyCode === 37 ? "prev" : "next");
    }
  });

  slider.addEventListener("wheel", function(e) {
    e.preventDefault();
    dLightboxMove(uniqueId, e.deltaY > 0 ? "next" : "prev");
  });

  slider.addEventListener("mousedown", function(e) {
    startX = e.clientX;
    currentX = 0;
  });

  slider.addEventListener("mousemove", function(e) {
    currentX = e.clientX - startX;
  });

  slider.addEventListener("mouseup", function(e) {
    if (Math.abs(currentX) > 50) {
      dLightboxMove(uniqueId, currentX > 0 ? "prev" : "next");
    } else {
      dLightboxSlide(uniqueId, current);
    }
  });

  slider.addEventListener("dblclick", function(e) {
    var currentImage = slider.querySelector("li.active");
    if (currentImage) {
      currentImage.classList.toggle("zoomed");
      isZoomed = !isZoomed;
    }
  });

slider.addEventListener("mousemove", function(e) {
  var currentImage = slider.querySelector("li.active.zoomed img");
  if (currentImage) {
    var offsetX = (e.offsetX - currentImage.offsetWidth / 2) / currentImage.offsetWidth;
    var offsetY = (e.offsetY - currentImage.offsetHeight / 2) / currentImage.offsetHeight;

    var transformValue = "translate(" + offsetX * 100 + "%, " + offsetY * 100 + "%)";
    currentImage.style.transform = transformValue;
  }
});
}
});
