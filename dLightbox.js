/*
 * dLightbox.js
 * @author  dmrhn
 * @version 0.5
 * @url https://github.com/tdmrhn/dLightbox.js
 */
document.addEventListener("DOMContentLoaded", function () {
    let size, touchStartX, touchStartY, startX, startY, isDragging = false, current = null, currentX = 0;

    // Initialize all lightbox galleries
    document.querySelectorAll(".dLightbox").forEach(function (gallery, index) {
        const uniqueId = "dLightbox_" + index;
        gallery.setAttribute("data-lightbox-id", uniqueId);

        gallery.addEventListener("click", function (e) {
            e.preventDefault();
            let lightbox = document.querySelector('.dLightbox_canvas[data-lightbox-id="' + uniqueId + '"]');

            if (!lightbox) {
                lightbox = dLightboxCreate(uniqueId);
                dLightboxActions(uniqueId);
            }

            document.body.classList.add("dL_noscroll");
            lightbox.classList.add("active");

            const link = e.target.closest("a");
            if (link) {
                const index = Array.from(gallery.querySelectorAll("a")).indexOf(link);
                dLightboxSlide(uniqueId, index);
            }
        });
    });

    function dLightboxCreate(uniqueId) {
        const lightbox = document.createElement("div");
        lightbox.classList.add("dLightbox_canvas", "active");
        lightbox.setAttribute("data-lightbox-id", uniqueId);
        lightbox.innerHTML = `
            <div class="dL_info-container">
                <div class="dL_count"></div>
                <div class="dL_title"></div>
                <div class="dL_close">&#x2715;</div>
            </div>
            <div class="dL_slides-container">
                <div class="dL_prev">&#8249;</div>
                <div class="dLightbox_slider"><ul></ul></div>
                <div class="dL_next">&#8250;</div>
            </div>`;
        document.body.appendChild(lightbox);

        const slider = lightbox.querySelector(".dLightbox_slider ul");
        let thumbnailsContainer;

        // Check for thumbnails class
        const isThumbnails = document.querySelector('.dLightbox-thumbnails[data-lightbox-id="' + uniqueId + '"]');
        
        // Create thumbnail container
        const createThumbnailContainer = () => {
            const thumbnailCarousel = document.createElement("div");
            thumbnailCarousel.classList.add("dL_thumbnail-carousel");
            
            thumbnailsContainer = document.createElement("div");
            thumbnailsContainer.classList.add("dL_thumbnails-container");
            
            thumbnailCarousel.appendChild(thumbnailsContainer);
            lightbox.appendChild(thumbnailCarousel);
            
            if (isThumbnails) {
                lightbox.classList.add("dLightbox-thumbnails");
            }
        };

        // Get image links
        const imgSelector = isThumbnails ? 
            '.dLightbox-thumbnails[data-lightbox-id="' + uniqueId + '"] a' :
            '[data-lightbox-id="' + uniqueId + '"] > figure > a';
        
        const imgLinks = document.querySelectorAll(imgSelector);
        
        imgLinks.forEach(function(imgLink, index) {
            const href = imgLink.getAttribute("href");

            // Create slide
            const imgContainer = document.createElement("li");
            imgContainer.innerHTML = '<img src="' + href + '">';
            slider.appendChild(imgContainer);

            // Create thumbnail container on first iteration
            if (index === 0) {
                createThumbnailContainer();
            }

            // Create thumbnail
            const thumbnail = document.createElement("img");
            thumbnail.src = href;
            thumbnail.addEventListener("click", () => {
                dLightboxSlide(uniqueId, index);
                centerThumbnail(uniqueId, index);
            });
            thumbnailsContainer.appendChild(thumbnail);
        });

        return lightbox;
    }

    function centerThumbnail(uniqueId, activeIndex) {
        const lightbox = document.querySelector('.dLightbox_canvas[data-lightbox-id="' + uniqueId + '"]');
        const thumbnailsContainer = lightbox?.querySelector(".dL_thumbnails-container");
        const thumbnailCarousel = lightbox?.querySelector(".dL_thumbnail-carousel");
        
        if (!thumbnailsContainer || !thumbnailCarousel) return;

        const thumbnails = thumbnailsContainer.querySelectorAll("img");
        const carouselWidth = thumbnailCarousel.offsetWidth;
        const thumbnailWidth = 65; // 60px + 5px gap
        const visibleThumbnails = Math.floor(carouselWidth / thumbnailWidth);
        
        // Update active thumbnail styling
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle("active", index === activeIndex);
        });

        // Handle scrolling for overflow
        if (thumbnails.length > visibleThumbnails) {
            const centerPosition = visibleThumbnails / 2;
            const scrollOffset = (activeIndex - centerPosition + 0.5) * thumbnailWidth;
            const maxScroll = (thumbnails.length - visibleThumbnails) * thumbnailWidth;
            const constrainedOffset = Math.max(0, Math.min(scrollOffset, maxScroll));
            
            thumbnailsContainer.style.transform = `translateX(-${constrainedOffset}px)`;
        } else {
            thumbnailsContainer.style.transform = '';
        }
    }

    function dLightboxSlide(uniqueId, index) {
        isDragging = false;
        current = index;
        const counter = index + 1;
        size = document.querySelectorAll('[data-lightbox-id="' + uniqueId + '"] .dLightbox_slider ul > li').length;
        const lightbox = document.querySelector('.dLightbox_canvas[data-lightbox-id="' + uniqueId + '"]');
        const slideContainer = lightbox.querySelector(".dLightbox_slider ul");

        if (!slideContainer) return;

        // Reset zoom on all slides
        slideContainer.querySelectorAll("li").forEach(li => {
            li.classList.remove("zoomed", "active");
            li.querySelector("img").style.transform = '';
        });

        // Center thumbnail and set active slide
        centerThumbnail(uniqueId, index);
        
        const moveDistance = document.documentElement.dir === 'rtl' ? 
            current * 100 : -(current * 100);
        
        slideContainer.style.transform = `translateX(${moveDistance}%)`;
        slideContainer.children[index].classList.add("active");

        // Update title and counter
        updateSlideInfo(uniqueId, index, counter);
    }

    function updateSlideInfo(uniqueId, index, counter) {
        const lightbox = document.querySelector('.dLightbox_canvas[data-lightbox-id="' + uniqueId + '"]');
        const hasTitle = document.querySelector('[data-lightbox-id="' + uniqueId + '"]').classList.contains("dLightbox-captions");
        const figures = document.querySelectorAll('[data-lightbox-id="' + uniqueId + '"] > figure');
        
        if (index < figures.length) {
            const figcaptionElement = figures[index].querySelector("figcaption");
            const figcaption = figcaptionElement?.textContent || "";
            const imgElement = figures[index].querySelector("img");
            const alt = imgElement?.getAttribute("alt") || "";
            
            lightbox.querySelector(".dL_count").innerHTML = `${counter}/${size}`;
            if (hasTitle) {
                lightbox.querySelector(".dL_title").innerHTML = figcaption || alt;
            }
        }
    }

    function dLightboxMove(uniqueId, direction) {
        const currentSlide = current;
        const dest = direction === "prev" ? 
            (currentSlide - 1 < 0 ? size - 1 : currentSlide - 1) :
            (currentSlide + 1) % size;

        dLightboxSlide(uniqueId, dest);
    }

    function dLightboxClose(uniqueId) {
        const lightbox = document.querySelector('.dLightbox_canvas.active[data-lightbox-id="' + uniqueId + '"]');
        if (lightbox) {
            lightbox.classList.remove("active");
            document.body.classList.remove("dL_noscroll");
        }
    }

    function dLightboxActions(uniqueId) {
        const canvas = document.querySelector('.dLightbox_canvas.active[data-lightbox-id="' + uniqueId + '"]');
        const slider = canvas.querySelector('.dLightbox_slider');

        // Handle clicks
        canvas.addEventListener("click", function(e) {
            const targetClass = e.target.classList;
            if (targetClass.contains("dL_prev")) {
                dLightboxMove(uniqueId, "prev");
            } else if (targetClass.contains("dL_next")) {
                dLightboxMove(uniqueId, "next");
            } else if (targetClass.contains("dL_close") || targetClass.contains("dLightbox_canvas")) {
                dLightboxClose(uniqueId);
            }
        });

        // Touch events
        slider.addEventListener("touchstart", handleTouchStart);
        slider.addEventListener("touchmove", handleTouchMove);
        slider.addEventListener("touchend", handleTouchEnd);

        // Mouse events
        slider.addEventListener("mousedown", handleMouseDown);
        slider.addEventListener("mousemove", handleMouseMove);
        slider.addEventListener("mouseup", handleMouseUp);

        // Keyboard events
        document.body.addEventListener("keydown", function(e) {
            const activeCanvas = document.querySelector('.dLightbox_canvas.active[data-lightbox-id="' + uniqueId + '"]');
            if (activeCanvas) {
                if (e.keyCode === 27) {
                    dLightboxClose(uniqueId);
                } else if (e.keyCode === 37 || e.keyCode === 39) {
                    dLightboxMove(uniqueId, e.keyCode === 37 ? "prev" : "next");
                }
            }
        });

        // Wheel navigation
        slider.addEventListener("wheel", function(e) {
            e.preventDefault();
            dLightboxMove(uniqueId, e.deltaY > 0 ? "next" : "prev");
        });

        // Double click zoom
        slider.addEventListener("dblclick", function(e) {
            const currentLi = slider.querySelector("li.active");
            if (currentLi) {
                const img = currentLi.querySelector("img");
                if (currentLi.classList.contains("zoomed")) {
                    currentLi.classList.remove("zoomed");
                    img.style.transform = "";
                } else {            
                    currentLi.classList.add("zoomed");
                }
            }
        });

        function handleTouchStart(e) {
            const currentLi = slider.querySelector("li.active");
            if (!currentLi) return;

            const img = currentLi.querySelector("img");
            
            if (currentLi.classList.contains("zoomed")) {
                if (e.touches.length === 2) {
                    currentLi.classList.remove("zoomed");
                    img.style.transform = "";
                } else if (e.touches.length === 1 && !isDragging) {
                    const touch = e.touches[0];
                    isDragging = true;
                    const matrix = new DOMMatrixReadOnly(window.getComputedStyle(img).transform);
                    startX = touch.clientX - matrix.m41;
                    startY = touch.clientY - matrix.m42;
                }
            } else {
                touchStartX = e.changedTouches[0].clientX;
                touchStartY = e.changedTouches[0].clientY;
            }
        }

        function handleTouchMove(e) {
            if (isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                const currentImg = slider.querySelector("li.active.zoomed img");
                if (currentImg) {
                    const deltaX = touch.clientX - startX;
                    const deltaY = touch.clientY - startY;
                    currentImg.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                }
            } else {
                const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);
                const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
                if (deltaX > deltaY) {
                    e.preventDefault();
                }
            }
        }

        function handleTouchEnd(e) {
            if (isDragging) {
                isDragging = false;
            } else {
                const touchDeltaX = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(touchDeltaX) > 50) {
                    dLightboxMove(uniqueId, touchDeltaX > 0 ? "prev" : "next");
                }
            }
        }

        function handleMouseDown(e) {
            const currentImg = slider.querySelector("li.active.zoomed img");
            if (currentImg) {
                const matrix = new DOMMatrixReadOnly(window.getComputedStyle(currentImg).transform);
                startX = e.clientX - matrix.m41;
                startY = e.clientY - matrix.m42;
                isDragging = true;
            } else {      
                startX = e.clientX;
                currentX = 0;
            }
        }

        function handleMouseMove(e) {
            if (isDragging) {
                e.preventDefault();
                const currentImg = slider.querySelector("li.active.zoomed img");
                if (currentImg) {        
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    currentImg.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                }
            } else {      
                currentX = e.clientX - startX;
            }
        }

        function handleMouseUp(e) {
            if (isDragging) {
                isDragging = false;
            } else {    
                if (Math.abs(currentX) > 50) {
                    dLightboxMove(uniqueId, currentX > 0 ? "prev" : "next");
                } else {
                    dLightboxSlide(uniqueId, current);
                }
            }
        }
    }
});
