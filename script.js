const guides = [
  {
    title: "Home: Your Daily Hub",
    updates: "3 New Updates",
    tagTint: "pink",
    cover: "./assets/momcozy-cover-pink.png",
    detailTitle: "What's on Home?",
    detailText:
      "Everything you use most lives right on Home. Your records, reminders, and personalized Tips are always within reach. Check your current stage, upcoming activities, explore AI Lactation Plan and AI Sleep Prediction, and discover curated articles and products—all from one place.",
    detailNote: "For informational purposes only. Always follow your healthcare provider's advice.",
  },
  {
    title: "Daily Check-ins: All Your Records in One Place",
    updates: "2 New Updates",
    tagTint: "yellow",
    cover: "./assets/momcozy-cover-purple.png",
    detailTitle: "AI Tips",
    detailText:
      "AI Tips are personalized to your current stage and updated daily with content that's relevant to you right now.\n\nTap FOR YOU, BABY CARE, or BREASTFEEDING to switch categories. From TTC to pregnancy to postpartum, your Tips evolve along with your journey.",
    detailNote: "For informational purposes only. Always follow your healthcare provider's advice.",
  },
  {
    title: "Reminder: Stay on Top of Everyday Tasks",
    updates: "1 New Updates",
    tagTint: "pink",
    cover: "./assets/momcozy-cover-pink.png",
    detailTitle: "Quick Logging",
    detailText:
      "The things you track most—pumping, feeding, sleep, and more—are now right on Home. Simply tap a card to quickly add a new record.",
  },
  {
    title: "Personalized Support: AI Lactation Plan &AI Sleep Prediction",
    updates: "2 New Updates",
    tagTint: "yellow",
    cover: "./assets/momcozy-cover-purple.png",
    detailTitle: "AI Tips",
    detailText:
      "AI Tips are personalized to your current stage and updated daily with content that's relevant to you right now.\n\nTap FOR YOU, BABY CARE, or BREASTFEEDING to switch categories. From TTC to pregnancy to postpartum, your Tips evolve along with your journey.",
  },
  {
    title: "Devices: Everything Connected in One Place",
    updates: "1 New Updates",
    tagTint: "pink",
    cover: "./assets/momcozy-cover-pink.png",
    detailTitle: "Quick Logging",
    detailText:
      "The things you track most—pumping, feeding, sleep, and more—are now right on Home. Simply tap a card to quickly add a new record.",
  },
];

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
const listTopbar = document.querySelector("#listTopbar");
const detailScreen = document.querySelector("#detailScreen");
const guideList = document.querySelector("#guideList");
const faqList = document.querySelector("#faqList");
const slides = document.querySelector("#slides");
const dots = document.querySelector("#progressDots");
const detailFooter = document.querySelector(".detail-footer");
const carousel = document.querySelector("#carousel");
const backButton = document.querySelector("#backButton");
const detailNavTitle = document.querySelector(".detail-nav h2");
const detailBackground = document.querySelector("#detailBackground");

const SHARED_TRANSITION_MS = 500;
const SHARED_LAYER_FADE_MS = 200;
const SHARED_CARD_RADIUS = "16px";
const LIST_TOPBAR_FADE_START = 0;
const LIST_TOPBAR_FADE_END = 402;

let activeIndex = 0;
let startX = 0;
let currentX = 0;
let dragging = false;
let transitionLocked = false;
let lastOpenedThumb = null;
let lockedBackgroundCover = guides[0].cover;
let currentDetailSlides = [];

function waitForFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function updateListTopbarBackground() {
  const progress = (listScreen.scrollTop - LIST_TOPBAR_FADE_START) / (LIST_TOPBAR_FADE_END - LIST_TOPBAR_FADE_START);
  const opacity = Math.max(0, Math.min(1, progress));
  listTopbar.style.setProperty("--list-nav-bg-opacity", opacity.toFixed(3));
  listTopbar.style.setProperty("--list-nav-icon-invert", (1 - opacity).toFixed(3));
}

function getRelativeRect(element) {
  const appRect = app.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left - appRect.left,
    top: rect.top - appRect.top,
    width: rect.width,
    height: rect.height,
  };
}

function getSlidePageRect(slide) {
  return getRelativeRect(slide);
}

function setRect(element, rect) {
  element.style.left = `${rect.left}px`;
  element.style.top = `${rect.top}px`;
  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;
}

function getRectWithin(containerRect, rect) {
  return {
    left: rect.left - containerRect.left,
    top: rect.top - containerRect.top,
    width: rect.width,
    height: rect.height,
  };
}

function getActiveSlide() {
  return slides.children[activeIndex];
}

function getThumbForSlide(index) {
  const rows = guideList.querySelectorAll(".guide-row");
  const row = rows[index] || rows[0];
  return row?.querySelector("[data-cover-thumb]") || lastOpenedThumb;
}

function setTransitionLocked(locked) {
  transitionLocked = locked;
  app.classList.toggle("is-transition-locked", locked);
  carousel.toggleAttribute("inert", locked);
  backButton.disabled = locked;
}

function setDetailBackground(cover) {
  lockedBackgroundCover = cover || lockedBackgroundCover;
  detailBackground.src = lockedBackgroundCover;
}

function getUpdateCount(item) {
  const match = item?.updates?.match(/\d+/);
  return Math.max(1, Number(match?.[0]) || 1);
}

function getDetailSlidesForGuide(index) {
  const guideIndex = Math.max(0, Math.min(guides.length - 1, index));
  const count = getUpdateCount(guides[guideIndex]);
  return Array.from({ length: count }, (_, offset) => guides[(guideIndex + offset) % guides.length]);
}

function renderDetailPages(index) {
  currentDetailSlides = getDetailSlidesForGuide(index);
  slides.replaceChildren(...currentDetailSlides.map((item) => slideTemplate(item)));

  const shouldShowPagination = currentDetailSlides.length > 1;
  detailFooter.hidden = !shouldShowPagination;
  if (!shouldShowPagination) {
    dots.replaceChildren();
    return;
  }

  dots.replaceChildren(
    ...currentDetailSlides.map((_, dotIndex) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", `Go to page ${dotIndex + 1}`);
      dot.addEventListener("click", () => setActive(dotIndex));
      return dot;
    }),
  );
}

function makeSharedElement({ className, rect, radius, src }) {
  const element = src ? document.createElement("img") : document.createElement("div");
  element.className = className;
  if (src) {
    element.src = src;
    element.alt = "";
  }
  element.setAttribute("aria-hidden", "true");
  element.style.borderRadius = radius;
  setRect(element, rect);
  return element;
}

function animateOpacity(element, fromOpacity, toOpacity, duration = SHARED_TRANSITION_MS) {
  if (!element.animate) {
    element.style.opacity = toOpacity;
    return Promise.resolve();
  }

  const animation = element.animate([{ opacity: fromOpacity }, { opacity: toOpacity }], {
    duration,
    easing: "cubic-bezier(0.22, 0.74, 0.22, 1)",
    fill: "forwards",
  });

  return animation.finished.catch(() => undefined);
}

async function fadeOutSharedLayer(layer) {
  layer.style.opacity = "1";
  layer.style.transition = `opacity ${SHARED_LAYER_FADE_MS}ms cubic-bezier(0.22, 0.74, 0.22, 1)`;
  layer.getBoundingClientRect();
  layer.style.opacity = "0";
  await wait(SHARED_LAYER_FADE_MS);
}

function animateSharedElement(element, from, to, options = {}) {
  if (!element.animate) {
    setRect(element, to);
    element.style.opacity = options.toOpacity ?? 1;
    return Promise.resolve();
  }

  const animation = element.animate(
    [
      {
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
        borderRadius: options.fromRadius,
        opacity: options.fromOpacity ?? 1,
      },
      {
        left: `${to.left}px`,
        top: `${to.top}px`,
        width: `${to.width}px`,
        height: `${to.height}px`,
        borderRadius: options.toRadius,
        opacity: options.toOpacity ?? 1,
      },
    ],
    {
      duration: SHARED_TRANSITION_MS,
      easing: "cubic-bezier(0.22, 0.74, 0.22, 1)",
      fill: "forwards",
    },
  );

  return animation.finished.catch(() => undefined);
}

async function runSharedTransition(sourceThumb, direction) {
  const slide = getActiveSlide();
  const sourceCover = sourceThumb?.querySelector(".thumb-bg");
  const sourcePhone = sourceThumb?.querySelector(".thumb-phone");
  const targetPhone = slide?.querySelector(".stage-phone");

  if (!sourceCover || !sourcePhone || !targetPhone) return;

  const layer = document.createElement("div");
  layer.className = "shared-transition-layer";
  app.appendChild(layer);

  const detailPageRect = getSlidePageRect(slide);
  const coverFrom = direction === "open" ? getRelativeRect(sourceCover) : detailPageRect;
  const coverTo = direction === "open" ? detailPageRect : getRelativeRect(sourceCover);
  const phoneFrom = direction === "open" ? getRelativeRect(sourcePhone) : getRelativeRect(targetPhone);
  const phoneTo = direction === "open" ? getRelativeRect(targetPhone) : getRelativeRect(sourcePhone);
  const phoneFromInCard = getRectWithin(coverFrom, phoneFrom);
  const phoneToInCard = getRectWithin(coverTo, phoneTo);
  const cardClone = makeSharedElement({
    className: "shared-transition-card",
    rect: coverFrom,
    radius: SHARED_CARD_RADIUS,
  });
  const coverClone = makeSharedElement({
    className: "shared-transition-cover",
    src: lockedBackgroundCover,
    rect: { left: 0, top: 0, width: coverFrom.width, height: coverFrom.height },
    radius: "0px",
  });
  const maskClone = makeSharedElement({
    className: "shared-transition-mask",
    rect: { left: 0, top: 0, width: coverFrom.width, height: coverFrom.height },
    radius: "0px",
  });
  const phoneClone = makeSharedElement({
    className: "shared-transition-phone",
    src: targetPhone.src,
    rect: phoneFromInCard,
    radius: "0px",
  });

  cardClone.append(coverClone, maskClone, phoneClone);
  layer.append(cardClone);
  sourceThumb.classList.add("is-shared-source");
  detailScreen.classList.add("is-shared-transition");
  await waitForFrame();

  await Promise.all([
    animateSharedElement(cardClone, coverFrom, coverTo, {
      fromRadius: SHARED_CARD_RADIUS,
      toRadius: SHARED_CARD_RADIUS,
    }),
    animateSharedElement(
      coverClone,
      { left: 0, top: 0, width: coverFrom.width, height: coverFrom.height },
      { left: 0, top: 0, width: coverTo.width, height: coverTo.height },
      {
        fromRadius: "0px",
        toRadius: "0px",
      },
    ),
    animateSharedElement(
      maskClone,
      { left: 0, top: 0, width: coverFrom.width, height: coverFrom.height },
      { left: 0, top: 0, width: coverTo.width, height: coverTo.height },
      {
        fromRadius: "0px",
        toRadius: "0px",
      },
    ),
    animateOpacity(maskClone, direction === "open" ? 0 : 1, direction === "open" ? 1 : 0),
    animateSharedElement(phoneClone, phoneFromInCard, phoneToInCard, {
      fromRadius: "0px",
      toRadius: "0px",
    }),
  ]);

  sourceThumb.classList.remove("is-shared-source");
  if (direction === "open") {
    detailScreen.classList.remove("is-content-hidden");
    await waitForFrame();
    await fadeOutSharedLayer(layer);
    detailScreen.classList.remove("is-shared-transition");
  }
  layer.remove();
}

function bindGuideRowOpen(button, index) {
  let pressPointerId = null;
  let pressStartX = 0;
  let pressStartY = 0;
  let pressCancelled = false;

  const clearPress = () => {
    pressPointerId = null;
    pressCancelled = false;
  };

  button.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button > 0 || transitionLocked) return;

    pressPointerId = event.pointerId;
    pressStartX = event.clientX;
    pressStartY = event.clientY;
    pressCancelled = false;
    button.setPointerCapture?.(event.pointerId);
  });

  button.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pressPointerId) return;

    const movedX = Math.abs(event.clientX - pressStartX);
    const movedY = Math.abs(event.clientY - pressStartY);
    if (movedX > 8 || movedY > 8) pressCancelled = true;
  });

  button.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pressPointerId) return;

    const rect = button.getBoundingClientRect();
    const releasedInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    const shouldOpen = !pressCancelled && releasedInside;
    button.releasePointerCapture?.(event.pointerId);
    clearPress();

    if (shouldOpen) openDetail(index, button.querySelector("[data-cover-thumb]"));
  });

  button.addEventListener("pointercancel", clearPress);

  button.addEventListener("keyup", (event) => {
    if (transitionLocked || (event.key !== "Enter" && event.key !== " ")) return;
    openDetail(index, button.querySelector("[data-cover-thumb]"));
  });
}

function rowTemplate(item, index) {
  const button = document.createElement("button");
  const tagTint = item.tagTint || "pink";
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
      <span class="update-tag update-tag--${tagTint}">${item.updates}</span>
    </span>
    <span class="chevron" aria-hidden="true">
      <img src="./assets/Icon_Arrow2.png" alt="">
    </span>
  `;
  bindGuideRowOpen(button, index);
  return button;
}

function slideTemplate(item) {
  const slide = document.createElement("article");
  slide.className = "slide";
  slide.innerHTML = `
    <div class="phone-stage">
      <figure class="phone-shot">
        <img class="stage-phone" src="./assets/momcozy-phone.png" alt="">
      </figure>
    </div>
    <div class="slide-copy">
      <h3>${item.detailTitle}</h3>
      ${item.detailText
        .split("\n\n")
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("")}
      ${item.detailNote ? `<p class="slide-note">${item.detailNote}</p>` : ""}
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
}

async function openDetail(index, sourceEl) {
  if (transitionLocked) return;

  const guideIndex = Math.max(0, Math.min(guides.length - 1, index));
  renderDetailPages(guideIndex);
  setActive(0, false);
  detailNavTitle.textContent = guides[guideIndex]?.title || "New Update";
  lastOpenedThumb = sourceEl || getThumbForSlide(guideIndex);
  setDetailBackground(guides[guideIndex]?.cover);
  setTransitionLocked(Boolean(sourceEl));

  detailScreen.classList.add("is-active", "is-content-hidden");
  detailScreen.removeAttribute("aria-hidden");

  if (!sourceEl) {
    listScreen.classList.add("is-leaving");
    listScreen.classList.remove("is-active");
    detailScreen.classList.remove("is-content-hidden");
    setTransitionLocked(false);
    return;
  }

  await waitForFrame();
  await runSharedTransition(sourceEl, "open");
  listScreen.classList.add("is-leaving");
  listScreen.classList.remove("is-active");
  setTransitionLocked(false);
}

async function closeDetail() {
  if (transitionLocked) return;

  const sourceThumb = lastOpenedThumb || getThumbForSlide(activeIndex);
  setTransitionLocked(Boolean(sourceThumb));
  detailScreen.classList.add("is-content-hidden");

  if (!sourceThumb) {
    detailScreen.classList.add("is-closing");
    window.setTimeout(() => {
      detailScreen.classList.remove("is-active", "is-closing");
      detailScreen.setAttribute("aria-hidden", "true");
      listScreen.classList.add("is-active");
      listScreen.classList.remove("is-leaving");
      setTransitionLocked(false);
    }, 300);
    return;
  }

  listScreen.classList.add("is-active", "is-return-target");
  listScreen.classList.remove("is-leaving");
  await waitForFrame();
  await runSharedTransition(sourceThumb, "close");
  detailScreen.classList.remove("is-active");
  detailScreen.setAttribute("aria-hidden", "true");
  detailScreen.classList.remove("is-shared-transition");
  listScreen.classList.remove("is-return-target");
  setTransitionLocked(false);

  if (location.hash.startsWith("#detail")) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

function setActive(index, animate = true) {
  activeIndex = Math.max(0, Math.min(currentDetailSlides.length - 1, index));
  slides.style.transitionDuration = animate ? "520ms" : "0ms";
  slides.style.transform = `translate3d(${-activeIndex * 100}%, 0, 0)`;
  [...dots.children].forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeIndex);
    dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
  });
}

function pointerDown(event) {
  if (transitionLocked) return;
  dragging = true;
  startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
  currentX = startX;
  slides.style.transitionDuration = "0ms";
}

function pointerMove(event) {
  if (!dragging || transitionLocked) return;
  currentX = event.clientX ?? event.touches?.[0]?.clientX ?? currentX;
  const delta = currentX - startX;
  const resistance =
    (activeIndex === 0 && delta > 0) || (activeIndex === currentDetailSlides.length - 1 && delta < 0)
      ? 0.28
      : 1;
  slides.style.transform = `translate3d(calc(${-activeIndex * 100}% + ${delta * resistance}px), 0, 0)`;
}

function pointerUp() {
  if (!dragging || transitionLocked) return;
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
listScreen.addEventListener("scroll", updateListTopbarBackground, { passive: true });
carousel.addEventListener("pointerdown", pointerDown);
carousel.addEventListener("pointermove", pointerMove);
carousel.addEventListener("pointerup", pointerUp);
carousel.addEventListener("pointercancel", pointerUp);
carousel.addEventListener("keydown", (event) => {
  if (transitionLocked) return;
  if (event.key === "ArrowRight") setActive(activeIndex + 1);
  if (event.key === "ArrowLeft") setActive(activeIndex - 1);
  if (event.key === "Escape") closeDetail();
});

render();
updateListTopbarBackground();

const detailMatch = location.hash.match(/^#detail-(\d+)$/);
if (detailMatch) {
  openDetail(Number(detailMatch[1]) || 0);
}
