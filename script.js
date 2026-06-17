const guides = [
  {
    title: "Home: Your Daily Hub",
    updates: "3 New Updates",
    cover: "./assets/momcozy-cover-pink.png",
    detailTitle: "What's on Home?",
    detailText:
      "Everything you use most lives right on Home. Your records, reminders, and personalized Tips are always within reach. Check your current stage, upcoming activities, explore AI Lactation Plan and AI Sleep Prediction, and discover curated articles and products—all from one place.",
  },
  {
    title: "Daily Check-ins: All Your Records in One Place",
    updates: "2 New Updates",
    cover: "./assets/momcozy-cover-purple.png",
    detailTitle: "AI Tips",
    detailText:
      "AI Tips are personalized to your current stage and updated daily with content that's relevant to you right now.\n\nTap FOR YOU, BABY CARE, or BREASTFEEDING to switch categories. From TTC to pregnancy to postpartum, your Tips evolve along with your journey.\n\nFor informational purposes only. Always follow your healthcare provider's advice.",
  },
  {
    title: "Reminder: Stay on Top of Everyday Tasks",
    updates: "1 New Updates",
    cover: "./assets/momcozy-cover-pink.png",
    detailTitle: "Quick Logging",
    detailText:
      "The things you track most—pumping, feeding, sleep, and more—are now right on Home. Simply tap a card to quickly add a new record.",
  },
  {
    title: "Personalized Support: AI Lactation Plan &AI Sleep Prediction",
    updates: "2 New Updates",
    cover: "./assets/momcozy-cover-purple.png",
    detailTitle: "AI Tips",
    detailText:
      "AI Tips are personalized to your current stage and updated daily with content that's relevant to you right now.\n\nTap FOR YOU, BABY CARE, or BREASTFEEDING to switch categories. From TTC to pregnancy to postpartum, your Tips evolve along with your journey.",
  },
  {
    title: "Devices: Everything Connected in One Place",
    updates: "1 New Updates",
    cover: "./assets/momcozy-cover-pink.png",
    detailTitle: "Quick Logging",
    detailText:
      "The things you track most—pumping, feeding, sleep, and more—are now right on Home. Simply tap a card to quickly add a new record.",
  },
];

const detailSlides = guides.slice(0, 3);
const faqs = [
  {
    title: "This is a chapter title",
    text:
      "The weeks after birth are a full-body reset — physical, emotional, hormonal. Some changes are expected and healthy; others are signals to reach out for support.",
  },
  {
    title: "This is a chapter title",
    text:
      "The weeks after birth are a full-body reset — physical, emotional, hormonal. Some changes are expected and healthy; others are signals to reach out for support.",
    expanded: true,
  },
  {
    title: "This is a chapter title",
    text:
      "The weeks after birth are a full-body reset — physical, emotional, hormonal. Some changes are expected and healthy; others are signals to reach out for support.",
  },
  {
    title: "This is a chapter title",
    text:
      "The weeks after birth are a full-body reset — physical, emotional, hormonal. Some changes are expected and healthy; others are signals to reach out for support.",
  },
  {
    title: "This is a chapter title",
    text:
      "The weeks after birth are a full-body reset — physical, emotional, hormonal. Some changes are expected and healthy; others are signals to reach out for support.",
  },
  {
    title: "This is a chapter title",
    text:
      "The weeks after birth are a full-body reset — physical, emotional, hormonal. Some changes are expected and healthy; others are signals to reach out for support.",
  },
];

const app = document.querySelector(".app");
const listScreen = document.querySelector("#listScreen");
const detailScreen = document.querySelector("#detailScreen");
const guideList = document.querySelector("#guideList");
const faqList = document.querySelector("#faqList");
const slides = document.querySelector("#slides");
const dots = document.querySelector("#progressDots");
const carousel = document.querySelector("#carousel");
const backButton = document.querySelector("#backButton");

let activeIndex = 0;
let startX = 0;
let currentX = 0;
let dragging = false;

function rowTemplate(item, index) {
  const button = document.createElement("button");
  button.className = "guide-row";
  button.type = "button";
  button.setAttribute("aria-label", `${item.title}, open details`);
  button.innerHTML = `
    <span class="thumb" data-cover-thumb>
      <img class="thumb-bg" src="${item.cover}" alt="">
      <img class="thumb-phone" src="./assets/momcozy-phone.png" alt="">
    </span>
    <span class="guide-copy">
      <h3>${item.title}</h3>
      <span class="update-tag">${item.updates}</span>
    </span>
    <span class="chevron" aria-hidden="true">
      <img src="./assets/Icon_Arrow2.png" alt="">
    </span>
  `;
  button.addEventListener("click", () => openDetail(index, button.querySelector("[data-cover-thumb]")));
  return button;
}

function slideTemplate(item) {
  const slide = document.createElement("article");
  slide.className = "slide";
  slide.innerHTML = `
    <div class="phone-stage">
      <figure class="phone-shot">
        <img src="./assets/momcozy-phone.png" alt="">
      </figure>
    </div>
    <div class="slide-copy">
      <h3>${item.detailTitle}</h3>
      ${item.detailText
        .split("\n\n")
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("")}
    </div>
  `;
  return slide;
}

function faqTemplate(item, index) {
  const faq = document.createElement("article");
  const contentId = `faq-panel-${index}`;
  faq.className = "faq-item";
  faq.classList.toggle("is-expanded", Boolean(item.expanded));
  faq.innerHTML = `
    <button class="faq-row" type="button" aria-expanded="${item.expanded ? "true" : "false"}" aria-controls="${contentId}">
      <span>${item.title}</span>
      <img src="./assets/Icon_Arrow2.png" alt="" aria-hidden="true">
    </button>
    <div class="faq-panel" id="${contentId}">
      <p>${item.text}</p>
    </div>
  `;

  const button = faq.querySelector(".faq-row");
  button.addEventListener("click", () => {
    const expanded = faq.classList.toggle("is-expanded");
    button.setAttribute("aria-expanded", expanded ? "true" : "false");
  });

  return faq;
}

function render() {
  const rows = document.createDocumentFragment();
  guides.forEach((item, index) => rows.appendChild(rowTemplate(item, index)));
  guideList.appendChild(rows);

  const faqRows = document.createDocumentFragment();
  faqs.forEach((item, index) => faqRows.appendChild(faqTemplate(item, index)));
  faqList.appendChild(faqRows);

  const slideFragment = document.createDocumentFragment();
  detailSlides.forEach((item) => slideFragment.appendChild(slideTemplate(item)));
  slides.appendChild(slideFragment);

  detailSlides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Go to page ${index + 1}`);
    dot.addEventListener("click", () => setActive(index));
    dots.appendChild(dot);
  });

  setActive(0, false);
}

function setOpenOrigin(sourceEl) {
  if (!sourceEl) {
    detailScreen.style.setProperty("--enter-x", "0px");
    detailScreen.style.setProperty("--enter-y", "0px");
    return;
  }

  const appRect = app.getBoundingClientRect();
  const sourceRect = sourceEl.getBoundingClientRect();
  const sourceX = sourceRect.left + sourceRect.width / 2 - appRect.left;
  const sourceY = sourceRect.top + sourceRect.height / 2 - appRect.top;
  const targetX = appRect.width / 2;
  const targetY = 320;

  detailScreen.style.setProperty("--enter-x", `${sourceX - targetX}px`);
  detailScreen.style.setProperty("--enter-y", `${sourceY - targetY}px`);
}

function openDetail(index, sourceEl) {
  setOpenOrigin(sourceEl);
  setActive(index % detailSlides.length, false);
  listScreen.classList.add("is-leaving");
  listScreen.classList.remove("is-active");
  detailScreen.classList.add("is-active", "is-opening");
  detailScreen.removeAttribute("aria-hidden");
  window.setTimeout(() => detailScreen.classList.remove("is-opening"), 720);
}

function closeDetail() {
  detailScreen.classList.add("is-closing");
  window.setTimeout(() => {
    detailScreen.classList.remove("is-active", "is-closing");
    detailScreen.setAttribute("aria-hidden", "true");
    listScreen.classList.add("is-active");
    listScreen.classList.remove("is-leaving");
    if (location.hash.startsWith("#detail")) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }, 300);
}

function setActive(index, animate = true) {
  activeIndex = Math.max(0, Math.min(detailSlides.length - 1, index));
  slides.style.transitionDuration = animate ? "520ms" : "0ms";
  slides.style.transform = `translate3d(${-activeIndex * 100}%, 0, 0)`;
  [...dots.children].forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeIndex);
    dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
  });
}

function pointerDown(event) {
  dragging = true;
  startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
  currentX = startX;
  slides.style.transitionDuration = "0ms";
}

function pointerMove(event) {
  if (!dragging) return;
  currentX = event.clientX ?? event.touches?.[0]?.clientX ?? currentX;
  const delta = currentX - startX;
  const resistance =
    (activeIndex === 0 && delta > 0) || (activeIndex === detailSlides.length - 1 && delta < 0)
      ? 0.28
      : 1;
  slides.style.transform = `translate3d(calc(${-activeIndex * 100}% + ${delta * resistance}px), 0, 0)`;
}

function pointerUp() {
  if (!dragging) return;
  dragging = false;
  const delta = currentX - startX;
  const threshold = Math.min(76, carousel.clientWidth * 0.2);

  if (delta < -threshold) {
    setActive(activeIndex + 1);
  } else if (delta > threshold) {
    setActive(activeIndex - 1);
  } else {
    setActive(activeIndex);
  }
}

backButton.addEventListener("click", closeDetail);
carousel.addEventListener("pointerdown", pointerDown);
carousel.addEventListener("pointermove", pointerMove);
carousel.addEventListener("pointerup", pointerUp);
carousel.addEventListener("pointercancel", pointerUp);
carousel.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") setActive(activeIndex + 1);
  if (event.key === "ArrowLeft") setActive(activeIndex - 1);
  if (event.key === "Escape") closeDetail();
});

render();

const detailMatch = location.hash.match(/^#detail-(\d+)$/);
if (detailMatch) {
  openDetail(Number(detailMatch[1]) || 0);
}
