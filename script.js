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
  const interestOutput = document.getElementById("out-interest");
  const resultsPanel = document.querySelector(".calc-results");

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

  // Strip all non-digit characters to parse integers safely
  const parseNumber = (str) => {
    if (!str) return 0;
    return Number(str.toString().replace(/[^0-9]/g, "")) || 0;
  };

  // Format numeric input text box dynamically while preserving selection cursor
  const formatInputOnTheFly = (input) => {
    const rawVal = input.value;
    if (rawVal.trim() === "") {
      input.value = "";
      return 0;
    }
    const selectionStart = input.selectionStart;
    const oldLength = rawVal.length;

    // Clean non-digits
    const digits = rawVal.replace(/\D/g, "");
    if (digits === "") {
      input.value = "";
      return 0;
    }

    const num = parseInt(digits, 10);
    const formatted = num.toLocaleString("id-ID");
    input.value = formatted;

    // Adjust cursor position to avoid jumping to the end
    const newLength = formatted.length;
    const newStart = selectionStart + (newLength - oldLength);
    input.setSelectionRange(newStart, newStart);

    return num;
  };

  // Display validation error message inline
  const showError = (input, message) => {
    input.classList.add("invalid");
    const inputGroup = input.closest(".input-group");
    if (!inputGroup) return;

    let errorSpan = inputGroup.querySelector(".calc-error-message");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "calc-error-message";
      inputGroup.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
  };

  // Clear validation error message inline
  const clearError = (input) => {
    input.classList.remove("invalid");
    const inputGroup = input.closest(".input-group");
    if (!inputGroup) return;

    const errorSpan = inputGroup.querySelector(".calc-error-message");
    if (errorSpan) {
      errorSpan.textContent = "";
      errorSpan.style.display = "none";
    }
  };

  // Validate all inputs and return boolean status
  const validateInputs = () => {
    let isValid = true;

    const priceText = priceInput.value.trim();
    const dpText = dpInput.value.trim();
    const price = parseNumber(priceInput.value);
    const dp = parseNumber(dpInput.value);
    const annualInterest = parseFloat(interestInput.value);
    const tenor = parseInt(tenorInput.value, 10);

    // Validate Harga Rumah (Price)
    if (priceText === "") {
      showError(priceInput, "Harga rumah tidak boleh kosong.");
      isValid = false;
    } else if (price <= 0) {
      showError(priceInput, "Harga rumah harus lebih besar dari 0.");
      isValid = false;
    } else {
      clearError(priceInput);
    }

    // Validate DP (Down Payment)
    if (dpText === "") {
      clearError(dpInput);
    } else if (dp < 0) {
      showError(dpInput, "Uang muka tidak boleh negatif.");
      isValid = false;
    } else if (dp > price) {
      showError(dpInput, "Uang muka tidak boleh melebihi harga rumah.");
      isValid = false;
    } else {
      clearError(dpInput);
    }

    // Validate Interest Rate
    if (interestInput.value.trim() === "") {
      showError(interestInput, "Suku bunga tidak boleh kosong.");
      isValid = false;
    } else if (isNaN(annualInterest)) {
      showError(interestInput, "Suku bunga harus berupa angka.");
      isValid = false;
    } else if (annualInterest < 0) {
      showError(interestInput, "Suku bunga tidak boleh negatif.");
      isValid = false;
    } else {
      clearError(interestInput);
    }

    // Validate Tenor
    if (isNaN(tenor) || tenor <= 0) {
      showError(tenorInput, "Tenor harus lebih besar dari 0.");
      isValid = false;
    } else {
      clearError(tenorInput);
    }

    return isValid;
  };

  // Reset outputs to Rp 0
  const resetOutputs = () => {
    const price = parseNumber(priceInput.value);
    const dp = parseNumber(dpInput.value);
    const loanAmount = Math.max(0, price - dp);

    loanOutput.textContent = formatRupiah(loanAmount);
    installmentOutput.innerHTML = `${formatRupiah(0)} <span>/ Bulan</span>`;
    totalOutput.textContent = formatRupiah(0);
    if (interestOutput) {
      interestOutput.textContent = formatRupiah(0);
    }
  };

  // Perform Mortgage calculation
  const calculateKPR = () => {
    const price = parseNumber(priceInput.value);
    const dp = parseNumber(dpInput.value);
    const tenor = parseInt(tenorInput.value, 10);
    const annualInterest = parseFloat(interestInput.value);

    // Calculate Loan Amount (P)
    const loanAmount = Math.max(0, price - dp);
    loanOutput.textContent = formatRupiah(loanAmount);

    const totalMonths = tenor * 12;
    let monthlyInstallment = 0;

    if (loanAmount > 0 && totalMonths > 0) {
      if (annualInterest === 0) {
        // Flat monthly installment when interest is 0%
        monthlyInstallment = loanAmount / totalMonths;
      } else {
        // Monthly interest rate (r)
        const monthlyInterest = annualInterest / 12 / 100;
        // Formula: M = P * r * (1+r)^n / ((1+r)^n - 1)
        const factor = Math.pow(1 + monthlyInterest, totalMonths);
        const denominator = factor - 1;

        if (denominator > 0) {
          monthlyInstallment = (loanAmount * monthlyInterest * factor) / denominator;
        } else {
          monthlyInstallment = 0;
        }
      }
    }

    // Safeguard from NaN, Infinity, or negative numbers
    if (isNaN(monthlyInstallment) || !isFinite(monthlyInstallment) || monthlyInstallment < 0) {
      monthlyInstallment = 0;
    }

    const totalPayment = monthlyInstallment * totalMonths;
    const totalInterestPaid = Math.max(0, totalPayment - loanAmount);

    // Render formatted Rupiah output
    installmentOutput.innerHTML = `${formatRupiah(Math.round(monthlyInstallment))} <span>/ Bulan</span>`;
    totalOutput.textContent = formatRupiah(Math.round(totalPayment));
    if (interestOutput) {
      interestOutput.textContent = formatRupiah(Math.round(totalInterestPaid));
    }
  };

  // Trigger result section micro-animation
  const triggerResultAnimation = () => {
    if (resultsPanel) {
      resultsPanel.classList.remove("calculate-animate");
      // Force reflow
      void resultsPanel.offsetWidth;
      resultsPanel.classList.add("calculate-animate");
    }
  };

  // Sync Down Payment slider to 0%-90% of price
  const updateDPSliderFromInput = (dpValue) => {
    const price = parseNumber(priceInput.value);
    if (price > 0) {
      const percentage = (dpValue / price) * 100;
      dpSlider.value = Math.min(Math.max(Math.round(percentage), 0), 90);
    } else {
      dpSlider.value = "0";
    }
  };

  // Event Listeners: Harga Rumah
  priceInput.addEventListener("input", (e) => {
    formatInputOnTheFly(e.target);
    const price = parseNumber(e.target.value);
    const dp = parseNumber(dpInput.value);

    // Sync Down Payment slider
    updateDPSliderFromInput(dp);

    if (validateInputs()) {
      calculateKPR();
    } else {
      resetOutputs();
    }
  });

  // Event Listeners: DP Uang Muka
  dpInput.addEventListener("input", (e) => {
    const dp = formatInputOnTheFly(e.target);
    updateDPSliderFromInput(dp);

    if (validateInputs()) {
      calculateKPR();
    } else {
      resetOutputs();
    }
  });

  // Event Listeners: DP Slider (runs during dragging)
  dpSlider.addEventListener("input", (e) => {
    const percentage = Number(e.target.value);
    const price = parseNumber(priceInput.value);
    const calculatedDP = (percentage / 100) * price;
    dpInput.value = Math.round(calculatedDP).toLocaleString("id-ID");

    // Clear validation error on DP since slider inputs are within limits
    clearError(dpInput);

    if (validateInputs()) {
      calculateKPR();
    } else {
      resetOutputs();
    }
  });

  // Event Listeners: DP Slider drag release (triggers animation)
  dpSlider.addEventListener("change", () => {
    if (validateInputs()) {
      calculateKPR();
      triggerResultAnimation();
    }
  });

  // Event Listeners: Tenor (dropdown option select)
  tenorInput.addEventListener("change", () => {
    if (validateInputs()) {
      calculateKPR();
      triggerResultAnimation();
    } else {
      resetOutputs();
    }
  });

  // Event Listeners: Suku Bunga (Interest Rate)
  interestInput.addEventListener("input", () => {
    if (validateInputs()) {
      calculateKPR();
    } else {
      resetOutputs();
    }
  });

  // Handle Form Submit (Clicking "Hitung KPR" button or pressing "Enter")
  const calcForm = priceInput.closest("form");
  if (calcForm) {
    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validateInputs()) {
        calculateKPR();
        triggerResultAnimation();
      } else {
        resetOutputs();
      }
    });
  }

  // Set default placeholder formatted values
  priceInput.value = (500000000).toLocaleString("id-ID"); // 500 Mil
  dpInput.value = (50000000).toLocaleString("id-ID"); // 50 Mil (10%)
  dpSlider.value = "10";

  // Initial validation and execution
  if (validateInputs()) {
    calculateKPR();
  } else {
    resetOutputs();
  }
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
