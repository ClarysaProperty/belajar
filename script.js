/**
 * Clarysa Property Website Script
 * Clean Vanilla JavaScript
 */

// ==========================================================================
// DYNAMIC PROMO SYSTEM CONFIGURATION
// ==========================================================================
// This object can be easily edited to update the dynamic promo scrolling banner
const promoConfig = {
  promos: [
    "🔥 SPECIAL PROMO: Free DP (Down Payment)*",
    "✨ Free Angsuran KPR Selama 1 Tahun*",
    "🏡 Free BPHTB, AJB, dan Balik Nama (SHM)*",
    "🚗 BONUS: Pagar Minimalis & Carport Premium*",
    "🍳 BONUS: Dapur Bersih + Kitchen Sink Modern*",
    "📞 Hubungi Marketing Kami Untuk Detail Lebih Lanjut",
  ],
  validityText: "Promo berlaku s.d. akhir bulan ini!",
};

document.addEventListener("DOMContentLoaded", () => {
  initPromoBanner();
  initStickyHeader();
  initMobileNav();
  initFAQAccordion();
  initProjectFilter();
  initKPRCalculator();
  initBookingForm();
  initGalleryFilter();
  initLightbox();
  initLocationSwitcher();
  initScrollReveal();
  initBackToTop();
  initLazyLoading();
  initGaleryVideos();
});

// ==========================================================================
// PROMO BANNER INITIALIZER
// ==========================================================================
function initPromoBanner() {
  const promoContainer = document.getElementById("promo-banner-content");
  if (!promoContainer) return;

  // Clear any placeholder
  promoContainer.innerHTML = "";

  // Load promos twice to ensure continuous looping if the content is short
  const promoList = [...promoConfig.promos, ...promoConfig.promos];

  promoList.forEach((text) => {
    const item = document.createElement("div");
    item.className = "promo-bar-item";

    const bullet = document.createElement("span");
    bullet.className = "promo-bar-bullet";
    bullet.innerHTML = "✦";

    const content = document.createElement("span");
    content.textContent = text;

    item.appendChild(bullet);
    item.appendChild(content);
    promoContainer.appendChild(item);
  });

  // Also update the static visual promo validity text in the promo section if present
  const validityEl = document.getElementById("promo-validity-text");
  if (validityEl) {
    validityEl.textContent = promoConfig.validityText;
  }
}

// ==========================================================================
// STICKY HEADER & ACTIVE NAV HIGHLIGHT
// ==========================================================================
function initStickyHeader() {
  const header = document.querySelector("header");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  window.addEventListener("scroll", () => {
    // Toggle sticky class
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Scroll active link highlighter
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    const highlightLink = (links, activeClass) => {
      links.forEach((link) => {
        link.classList.remove(activeClass);
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add(activeClass);
        }
      });
    };

    highlightLink(navLinks, "active");
    highlightLink(mobileNavLinks, "active");
  });
}

// ==========================================================================
// MOBILE NAVIGATION (DRAWER & OVERLAY)
// ==========================================================================
function initMobileNav() {
  const burgerBtn = document.getElementById("burger-btn");
  const drawer = document.getElementById("mobile-drawer");
  const overlay = document.getElementById("nav-overlay");
  const drawerLinks = document.querySelectorAll(".mobile-nav-link");

  if (!burgerBtn || !drawer || !overlay) return;

  const toggleDrawer = () => {
    drawer.classList.toggle("open");
    overlay.classList.toggle("show");
  };

  const closeDrawer = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
  };

  burgerBtn.addEventListener("click", toggleDrawer);
  overlay.addEventListener("click", closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

// ==========================================================================
// FAQ ACCORDION
// ==========================================================================
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll(".faq-header");

  faqHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = item.classList.contains("active");

      // Close all other accordion items
      document.querySelectorAll(".faq-item").forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-content").style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
        content.style.maxHeight = null;
      } else {
        item.classList.add("active");
        // ScrollHeight calculates the exact size of contents inside
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

// ==========================================================================
// PROJECT FILTER SYSTEM
// ==========================================================================
function initProjectFilter() {
  const filterTabs = document.querySelectorAll("#projects .filter-tab");
  const projectCards = document.querySelectorAll(".project-card");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active from other tabs
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filterValue = tab.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        // Add fade out animation class, then filter
        card.style.opacity = "0";
        card.style.transform = "scale(0.95)";

        setTimeout(() => {
          if (filterValue === "all" || category === filterValue) {
            card.style.display = "flex";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            }, 50);
          } else {
            card.style.display = "none";
          }
        }, 300);
      });
    });
  });
}

// ==========================================================================
// KPR CALCULATOR ENGINE
// ==========================================================================
function initKPRCalculator() {
  const priceInput = document.getElementById("calc-price");
  const dpInput = document.getElementById("calc-dp");
  const dpSlider = document.getElementById("calc-dp-slider");
  const tenorInput = document.getElementById("calc-tenor");
  const interestInput = document.getElementById("calc-interest");

  // Output fields
  const loanOutput = document.getElementById("out-loan");
  const installmentOutput = document.getElementById("out-installment");
  const totalOutput = document.getElementById("out-total");

  if (!priceInput || !dpInput || !dpSlider || !tenorInput || !interestInput)
    return;

  // Formatting helpers
  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const parseNumber = (str) => {
    return Number(str.replace(/[^0-9.-]+/g, "")) || 0;
  };

  const calculateKPR = () => {
    const price = parseNumber(priceInput.value);
    const dp = parseNumber(dpInput.value);
    const tenor = Number(tenorInput.value);
    const annualInterest = Number(interestInput.value);

    // Calculate loan amount
    const loanAmount = Math.max(0, price - dp);
    loanOutput.textContent = formatRupiah(loanAmount);

    if (loanAmount <= 0 || tenor <= 0 || annualInterest <= 0) {
      installmentOutput.textContent = formatRupiah(0);
      totalOutput.textContent = formatRupiah(0);
      return;
    }

    // Mortgage formula (Anuitas):
    // P = L * [ i * (1 + i)^n ] / [ (1 + i)^n - 1 ]
    // L = Loan amount, i = monthly interest, n = total months
    const monthlyInterest = annualInterest / 100 / 12;
    const totalMonths = tenor * 12;

    const x = Math.pow(1 + monthlyInterest, totalMonths);
    const monthlyInstallment = (loanAmount * (monthlyInterest * x)) / (x - 1);
    const totalPayment = monthlyInstallment * totalMonths;

    installmentOutput.innerHTML = `${formatRupiah(Math.round(monthlyInstallment))} <span>/ Bulan</span>`;
    totalOutput.textContent = formatRupiah(Math.round(totalPayment));
  };

  // Event handlers for dynamic formatting and KPR sync
  priceInput.addEventListener("input", (e) => {
    let raw = parseNumber(e.target.value);
    e.target.value = raw.toLocaleString("id-ID");

    // Sync Down Payment slider to 10%-90% of price
    updateDPSliderRange(raw);
    calculateKPR();
  });

  dpInput.addEventListener("input", (e) => {
    let raw = parseNumber(e.target.value);
    e.target.value = raw.toLocaleString("id-ID");

    // Match DP slider position
    const price = parseNumber(priceInput.value);
    if (price > 0) {
      const percentage = (raw / price) * 100;
      dpSlider.value = Math.min(Math.max(percentage, 0), 100);
    }
    calculateKPR();
  });

  dpSlider.addEventListener("input", (e) => {
    const percentage = Number(e.target.value);
    const price = parseNumber(priceInput.value);
    const calculatedDP = (percentage / 100) * price;
    dpInput.value = Math.round(calculatedDP).toLocaleString("id-ID");
    calculateKPR();
  });

  tenorInput.addEventListener("change", calculateKPR);
  interestInput.addEventListener("input", calculateKPR);

  function updateDPSliderRange(price) {
    const currentDP = parseNumber(dpInput.value);
    if (price > 0 && currentDP > 0) {
      const percentage = (currentDP / price) * 100;
      dpSlider.value = Math.min(Math.max(percentage, 0), 100);
    }
  }

  // Set default placeholder formatted values
  priceInput.value = (500000000).toLocaleString("id-ID"); // 500 Mil
  dpInput.value = (50000000).toLocaleString("id-ID"); // 50 Mil (10%)
  dpSlider.value = "10";
  calculateKPR();
}

// ==========================================================================
// BOOKING SURVEY FORM & VALIDATION (WHATSAPP REDIRECT)
// ==========================================================================
function initBookingForm() {
  const form = document.getElementById("booking-survey-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Fields
    const nama = document.getElementById("book-nama").value.trim();
    const phone = document.getElementById("book-wa").value.trim();
    const email = document.getElementById("book-email").value.trim();
    const perumahan = document.getElementById("book-project").value;
    const tanggal = document.getElementById("book-date").value;
    const jam = document.getElementById("book-time").value;
    const pesan = document.getElementById("book-msg").value.trim();

    // Simple validations
    if (!nama || !phone || !tanggal || !jam || !perumahan) {
      showToast("Harap isi semua kolom wajib (*)");
      return;
    }

    // Direct WhatsApp message formatting
    const waNumber = "6282234567890"; // Replaced with dummy developer WhatsApp number
    const textMessage =
      `Halo Clarysa Property, saya ingin booking survey perumahan.%0A%0A` +
      `*Detail Survey:*%0A` +
      `- Nama: ${nama}%0A` +
      `- WhatsApp: ${phone}%0A` +
      `- Email: ${email || "-"}%0A` +
      `- Pilihan Unit: ${perumahan}%0A` +
      `- Tanggal: ${tanggal}%0A` +
      `- Jam: ${jam}%0A` +
      `- Catatan: ${pesan || "-"}`;

    // Show custom toast notification
    showToast("✓ Permintaan Survey Berhasil Dikirim!");

    // Redirect to WhatsApp web/app after delay
    setTimeout(() => {
      window.open(
        `https://api.whatsapp.com/send?phone=${waNumber}&text=${textMessage}`,
        "_blank",
      );
      form.reset();
    }, 1500);
  });
}

function showToast(message) {
  let toast = document.getElementById("toast-msg");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-msg";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="toast-icon">✦</span> ${message}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// ==========================================================================
// GALLERY FILTER SYSTEM
// ==========================================================================
function initGalleryFilter() {
  const filterTabs = document.querySelectorAll("#gallery .filter-tab");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filterValue = tab.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        const category = item.getAttribute("data-category");

        item.style.opacity = "0";
        item.style.transform = "scale(0.85)";

        setTimeout(() => {
          if (filterValue === "all" || category === filterValue) {
            item.style.display = "block";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }, 50);
          } else {
            item.style.display = "none";
          }
        }, 300);
      });
    });
  });
}

// ==========================================================================
// GALLERY LIGHTBOX (MODAL PREVIEW)
// ==========================================================================
function initLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item img");

  // Create lightbox markup programmatically
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox-modal";
  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <img class="lightbox-img" src="" alt="Property View">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  galleryItems.forEach((img) => {
    img.parentElement.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.add("open");
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    setTimeout(() => {
      lightboxImg.src = "";
    }, 400);
  };

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

// ==========================================================================
// LOCATION SWITCHER (GOOGLE MAP INTEGRATION)
// ==========================================================================
function initLocationSwitcher() {
  const locCards = document.querySelectorAll(".location-card");
  const mapIframe = document.getElementById("google-map-iframe");

  locCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Remove active state
      locCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      // Switch Google Maps Source Link
      const mapSrc = card.getAttribute("data-map-src");
      if (mapIframe && mapSrc) {
        mapIframe.src = mapSrc;
      }
    });
  });
}

// ==========================================================================
// COUNTER & SCROLL REVEAL ANIMATIONS
// ==========================================================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 100; // Trigger when 100px visible

      if (elementTop < windowHeight - elementVisible) {
        el.classList.add("reveal-active");

        // Counter animation check
        if (el.classList.contains("about-stats") && !el.dataset.counted) {
          el.dataset.counted = "true";
          animateCounters();
        }
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  // Trigger initial check on load
  revealOnScroll();
}

function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  const speed = 100; // lower is faster

  counters.forEach((counter) => {
    const updateCount = () => {
      const target = Number(counter.getAttribute("data-target"));
      const current = Number(counter.innerText.replace("+", ""));

      const increment = Math.ceil(target / speed);

      if (current < target) {
        counter.innerText = `${current + increment}+`;
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = `${target}+`;
      }
    };
    updateCount();
  });
}

// ==========================================================================
// BACK TO TOP FLOATING BUTTON
// ==========================================================================
function initBackToTop() {
  const toTopBtn = document.getElementById("back-to-top-btn");
  if (!toTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      toTopBtn.classList.add("show");
    } else {
      toTopBtn.classList.remove("show");
    }
  });

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initGaleryVideos() {
  const videoCards = document.querySelectorAll(".video-card");
  let currentlyPlayingVideo = null;

  videoCards.forEach((card) => {
    const video = card.querySelector("video");
    const playBtn = card.querySelector(".play-btn");
    const soundBtn = card.querySelector(".sound-btn");

    const iconPlay = playBtn.querySelector(".icon-play");
    const iconPause = playBtn.querySelector(".icon-pause");

    const iconMute = soundBtn.querySelector(".icon-mute");
    const iconUnmute = soundBtn.querySelector(".icon-unmute");

    // Default: Unmuted (suara aktif saat diputar)
    video.muted = false;

    // Fungsi Toggle Play/Pause
    const togglePlay = () => {
      if (video.paused) {
        // Hentikan video lain yang sedang berputar agar tidak bentrok
        if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
          currentlyPlayingVideo.pause();
        }

        video.play();
        currentlyPlayingVideo = video;
      } else {
        video.pause();
      }
    };

    // Event listener untuk tombol play/pause & area video
    playBtn.addEventListener("click", togglePlay);

    // Event listener untuk status video
    video.addEventListener("play", () => {
      iconPlay.style.display = "none";
      iconPause.style.display = "block";
    });

    video.addEventListener("pause", () => {
      iconPlay.style.display = "block";
      iconPause.style.display = "none";
    });

    video.addEventListener("ended", () => {
      iconPlay.style.display = "block";
      iconPause.style.display = "none";
      video.currentTime = 0;
    });

    // Toggle Mute/Unmute Suara
    soundBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Mencegah pemicu event play/pause
      video.muted = !video.muted;

      if (video.muted) {
        iconMute.style.display = "block";
        iconUnmute.style.display = "none";
      } else {
        iconMute.style.display = "none";
        iconUnmute.style.display = "block";
      }
    });
  });
}

// ==========================================================================
// LAZY LOADING IMAGES FOR PERFORMANCE
// ==========================================================================
function initLazyLoading() {
  const lazyImages = document.querySelectorAll("img[loading='lazy']");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          if (image.dataset.src) {
            image.src = image.dataset.src;
          }
          imageObserver.unobserve(image);
        }
      });
    });

    lazyImages.forEach((image) => {
      imageObserver.observe(image);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    lazyImages.forEach((image) => {
      if (image.dataset.src) {
        image.src = image.dataset.src;
      }
    });
  }
}
