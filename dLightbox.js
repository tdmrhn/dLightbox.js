/*
 * dLightbox.js
 * @author  dmrhn
 * @version 0.6
 * @url https://github.com/tdmrhn/dLightbox.js
 */

document.addEventListener("DOMContentLoaded", () => {
    let size, touchStartX, touchStartY, startX, startY, isDragging = false, current = 0, currentX = 0;

    document.querySelectorAll(".dhn-lightbox").forEach((gallery, i) => {
        const uniqueId = "dLightbox_" + i;
        gallery.dataset.lightboxId = uniqueId;

        gallery.addEventListener("click", e => {
            const link = e.target.closest("a");
            if (!link) return;

            e.preventDefault();

            let lightbox = document.querySelector(`.dLightbox_canvas[data-lightbox-id="${uniqueId}"]`);
            if (!lightbox) {
                lightbox = dLightboxCreate(uniqueId, gallery);
                dLightboxActions(uniqueId);
            }

            document.body.classList.add("dL_noscroll");
            lightbox.classList.add("active");

            const index = [...gallery.querySelectorAll("a")].indexOf(link);
            dLightboxSlide(uniqueId, index);
        });
    });

    function dLightboxCreate(uniqueId, gallery) {
        const lightbox = document.createElement("div");
        lightbox.className = "dLightbox_canvas active";
        lightbox.dataset.lightboxId = uniqueId;

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
            </div>
        `;

        document.body.appendChild(lightbox);

        const slider = lightbox.querySelector(".dLightbox_slider ul");
        const isThumbnails = gallery.classList.contains("dLightbox-thumbnails");

        let thumbsWrap = null;

        if (isThumbnails) {
            const thumbCarousel = document.createElement("div");
            thumbCarousel.className = "dL_thumbnail-carousel";

            thumbsWrap = document.createElement("div");
            thumbsWrap.className = "dL_thumbnails-container";

            thumbCarousel.appendChild(thumbsWrap);
            lightbox.appendChild(thumbCarousel);

            lightbox.classList.add("dLightbox-thumbnails");
        }

        gallery.querySelectorAll("figure > a").forEach((a, index) => {
            const href = a.getAttribute("href");

            const li = document.createElement("li");
            li.innerHTML = `<img src="${href}">`;
            slider.appendChild(li);

            if (thumbsWrap) {
                const thumb = document.createElement("img");
                thumb.src = href;
                thumb.addEventListener("click", () => {
                    dLightboxSlide(uniqueId, index);
                    centerThumbnail(uniqueId, index);
                });
                thumbsWrap.appendChild(thumb);
            }
        });

        return lightbox;
    }

    function centerThumbnail(uniqueId, activeIndex) {
        const lightbox = document.querySelector(`.dLightbox_canvas[data-lightbox-id="${uniqueId}"]`);
        const wrap = lightbox?.querySelector(".dL_thumbnails-container");
        const carousel = lightbox?.querySelector(".dL_thumbnail-carousel");

        if (!wrap || !carousel) return;

        const thumbs = wrap.querySelectorAll("img");
        thumbs.forEach((t, i) => t.classList.toggle("active", i === activeIndex));

        const containerWidth = carousel.offsetWidth;
        const thumbWidth = 65;
        const visible = Math.floor(containerWidth / thumbWidth);

        if (thumbs.length <= visible) {
            wrap.style.transform = "";
            return;
        }

        const centerPos = visible / 2;
        const offset = (activeIndex - centerPos + 0.5) * thumbWidth;
        const maxScroll = (thumbs.length - visible) * thumbWidth;
        const finalOffset = Math.max(0, Math.min(offset, maxScroll));

        wrap.style.transform = `translateX(-${finalOffset}px)`;
    }

    function dLightboxSlide(uniqueId, index) {
        current = index;

        const lightbox = document.querySelector(`.dLightbox_canvas[data-lightbox-id="${uniqueId}"]`);
        const slider = lightbox.querySelector(".dLightbox_slider ul");
        const slides = slider.children;

        size = slides.length;

        [...slides].forEach(li => {
            li.classList.remove("zoomed", "active");
            li.querySelector("img").style.transform = "";
        });

        centerThumbnail(uniqueId, index);

        const translate = document.documentElement.dir === "rtl" ? index * 100 : -(index * 100);
        slider.style.transform = `translateX(${translate}%)`;
        slides[index].classList.add("active");

        updateSlideInfo(uniqueId, index);
    }

    function updateSlideInfo(uniqueId, index) {
        const lightbox = document.querySelector(`.dLightbox_canvas[data-lightbox-id="${uniqueId}"]`);
        const gallery = document.querySelector(`.dhn-lightbox[data-lightbox-id="${uniqueId}"]`);
        const figures = gallery.querySelectorAll("figure");

        const counter = lightbox.querySelector(".dL_count");
        counter.textContent = `${index + 1}/${size}`;

        if (gallery.classList.contains("dLightbox-captions") && figures[index]) {
            const caption = figures[index].querySelector("figcaption")?.textContent ||
                            figures[index].querySelector("img")?.alt || "";
            lightbox.querySelector(".dL_title").textContent = caption;
        }
    }

    function dLightboxMove(uniqueId, dir) {
        const next = dir === "prev"
            ? (current - 1 + size) % size
            : (current + 1) % size;

        dLightboxSlide(uniqueId, next);
    }

    function dLightboxClose(uniqueId) {
        const lightbox = document.querySelector(`.dLightbox_canvas.active[data-lightbox-id="${uniqueId}"]`);
        if (!lightbox) return;

        lightbox.classList.remove("active");
        document.body.classList.remove("dL_noscroll");
    }

function dLightboxActions(uniqueId) {
    const canvas = document.querySelector(`.dLightbox_canvas.active[data-lightbox-id="${uniqueId}"]`);
    const slider = canvas.querySelector(".dLightbox_slider");

    canvas.addEventListener("click", e => {
        const c = e.target.classList;
        if (c.contains("dL_prev")) return dLightboxMove(uniqueId, "prev");
        if (c.contains("dL_next")) return dLightboxMove(uniqueId, "next");
        if (c.contains("dL_close") || c.contains("dLightbox_canvas")) return dLightboxClose(uniqueId);
    });
    
    canvas.tabIndex = 0;
    canvas.focus();
    
    canvas.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            dLightboxClose(uniqueId);
        } else if (e.key === "ArrowLeft") {
            dLightboxMove(uniqueId, "prev");
        } else if (e.key === "ArrowRight") {
            dLightboxMove(uniqueId, "next");
        }
    });


    // Touch handlers
    slider.addEventListener("touchstart", touchStart);
    slider.addEventListener("touchmove", touchMove);
    slider.addEventListener("touchend", touchEnd);

    // Mouse handlers
    slider.addEventListener("mousedown", mouseDown);
    slider.addEventListener("mousemove", mouseMove);
    slider.addEventListener("mouseup", mouseUp);

    // Wheel
    slider.addEventListener("wheel", e => {
        e.preventDefault();
        dLightboxMove(uniqueId, e.deltaY > 0 ? "next" : "prev");
    });

    // Double-click zoom toggle
    slider.addEventListener("dblclick", () => {
        const li = slider.querySelector("li.active");
        if (!li) return;
        const img = li.querySelector("img");

        if (li.classList.contains("zoomed")) {
            li.classList.remove("zoomed");
            img.style.transform = "";
        } else {
            li.classList.add("zoomed");
        }
    });

        function touchStart(e) {
            const li = slider.querySelector("li.active");
            if (!li) return;

            const img = li.querySelector("img");

            if (li.classList.contains("zoomed")) {
                if (e.touches.length === 2) {
                    li.classList.remove("zoomed");
                    img.style.transform = "";
                } else if (e.touches.length === 1) {
                    const t = e.touches[0];
                    const m = new DOMMatrixReadOnly(getComputedStyle(img).transform);
                    isDragging = true;
                    startX = t.clientX - m.m41;
                    startY = t.clientY - m.m42;
                }
            } else {
                touchStartX = e.changedTouches[0].clientX;
                touchStartY = e.changedTouches[0].clientY;
            }
        }

        function touchMove(e) {
            if (isDragging) {
                e.preventDefault();
                const t = e.touches[0];
                const img = slider.querySelector("li.active.zoomed img");
                if (!img) return;

                const dx = t.clientX - startX;
                const dy = t.clientY - startY;
                img.style.transform = `translate(${dx}px, ${dy}px)`;
            } else {
                const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
                const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
                if (dx > dy) e.preventDefault();
            }
        }

        function touchEnd(e) {
            if (isDragging) {
                isDragging = false;
                return;
            }

            const delta = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(delta) > 50) {
                dLightboxMove(uniqueId, delta > 0 ? "prev" : "next");
            }
        }

        function mouseDown(e) {
            const img = slider.querySelector("li.active.zoomed img");
            if (img) {
                const m = new DOMMatrixReadOnly(getComputedStyle(img).transform);
                isDragging = true;
                startX = e.clientX - m.m41;
                startY = e.clientY - m.m42;
            } else {
                startX = e.clientX;
                currentX = 0;
            }
        }

        function mouseMove(e) {
            if (isDragging) {
                e.preventDefault();
                const img = slider.querySelector("li.active.zoomed img");
                if (!img) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                img.style.transform = `translate(${dx}px, ${dy}px)`;
            } else {
                currentX = e.clientX - startX;
            }
        }

        function mouseUp() {
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
