const videoId = "i70br9yHXDg";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const donationButtons = document.querySelectorAll(".donation-buttons button");
const customDonation = document.querySelector("#customDonation");
const contactForm = document.querySelector(".contact-form");
const heroMedia = document.querySelector(".hero-media");

if (window.lucide) {
  window.lucide.createIcons();
} else {
  window.addEventListener("load", () => window.lucide?.createIcons());
}

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll(".nav-links a, .nav-action, .footer-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => revealObserver.observe(item));

const easeOut = (progress) => 1 - Math.pow(1 - progress, 3);

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const duration = target > 100 ? 1500 : 1000;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(easeOut(progress) * target);
    counter.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));

const loadHeroVideo = () => {
  if (!heroMedia || window.matchMedia("(max-width: 920px)").matches) return;

  window.onYouTubeIframeAPIReady = () => {
    const player = new window.YT.Player("heroVideo", {
      events: {
        onReady: (event) => {
          event.target.mute();
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            heroMedia.classList.add("is-playing");
          }

          if (event.data === window.YT.PlayerState.ENDED) {
            event.target.playVideo();
          }
        }
      }
    });
  };

  if (window.YT?.Player) {
    window.onYouTubeIframeAPIReady();
    return;
  }

  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
};

loadHeroVideo();

document.querySelector("[data-play-video]")?.addEventListener("click", (event) => {
  const card = event.currentTarget.closest("[data-video-card]");
  if (!card) return;

  card.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
      title="Veterans Dental Foundation featured story"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
});

donationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    donationButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
    customDonation.value = button.textContent.replace("$", "");
  });
});

customDonation?.addEventListener("input", () => {
  donationButtons.forEach((item) => item.classList.remove("is-selected"));
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  const original = button.innerHTML;

  button.innerHTML = '<i data-lucide="badge-check"></i> Message Ready';
  button.disabled = true;
  window.lucide?.createIcons();

  setTimeout(() => {
    button.innerHTML = original;
    button.disabled = false;
    contactForm.reset();
    window.lucide?.createIcons();
  }, 1800);
});
