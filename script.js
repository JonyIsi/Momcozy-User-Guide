const guides = [
  {
    title: "探索全新流动设计",
    text: "Liquid Glass 让 App 图标、导航和控制更加生动有趣。若要更改图标外观，请按住主屏幕，轻点“编辑”，轻点“自定义”，然后轻点“透明”。",
    image: "./assets/state-play.png",
    phoneImage: "./assets/phone-flow.png",
    crop: "50% 27%",
  },
  {
    title: "让锁定屏幕生动起来",
    text: "将墙纸照片设为 3D 空间场景。按住锁定屏幕，轻点“自定义”，然后轻点空间场景按钮。",
    image: "./assets/state-setup.png",
    phoneImage: "./assets/phone-flow.png",
    crop: "50% 18%",
  },
  {
    title: "添加背景",
    text: "在“信息”对话中，轻点人名或群组名称，轻点“背景”，然后选取一个动态背景或任何一张照片。",
    image: "./assets/state-complete.png",
    phoneImage: "./assets/phone-background.png",
    crop: "50% 24%",
  },
  {
    title: "投票决定",
    text: "让群聊成员一起做决定。轻点加号，然后选取“投票”。任何人都可添加更多选项，只需轻点“添加选项”即可。",
    image: "./assets/state-setup.png",
    phoneImage: "./assets/phone-background.png",
    crop: "50% 70%",
  },
  {
    title: "筛选未知发件人",
    text: "用新的筛选视图整理消息。未知发件人与垃圾信息会分开放置，让常用对话保持清爽。",
    image: "./assets/state-play.png",
    phoneImage: "./assets/phone-flow.png",
    crop: "50% 62%",
  },
  {
    title: "轻松共享实时进展",
    text: "在需要同步状态时共享实时活动，朋友可以直接在锁定屏幕或灵动岛中查看最新进度。",
    image: "./assets/state-complete.png",
    phoneImage: "./assets/phone-background.png",
    crop: "50% 66%",
  },
  {
    title: "用新方式表达自己",
    text: "用更鲜活的效果、背景和分享入口，让每一次沟通都更贴近你的当下心情。",
    image: "./assets/state-setup.png",
    phoneImage: "./assets/phone-flow.png",
    crop: "50% 42%",
  },
];

const listScreen = document.querySelector("#listScreen");
const detailScreen = document.querySelector("#detailScreen");
const guideList = document.querySelector("#guideList");
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
  button.setAttribute("aria-label", `${item.title}，点击查看详情`);
  button.innerHTML = `
    <span class="thumb"><img src="${item.image}" alt="" style="object-position:${item.crop}"></span>
    <span class="guide-copy">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </span>
    <span class="chevron" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
    </span>
  `;
  button.addEventListener("click", () => openDetail(index));
  return button;
}

function slideTemplate(item) {
  const slide = document.createElement("article");
  slide.className = "slide";
  slide.innerHTML = `
    <div class="phone-stage">
      <figure class="phone-shot">
        <img src="${item.phoneImage}" alt="${item.title}示意图">
      </figure>
    </div>
    <div class="slide-copy">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </div>
  `;
  return slide;
}

function render() {
  const fragment = document.createDocumentFragment();
  guides.slice(0, 4).forEach((item, index) => fragment.appendChild(rowTemplate(item, index)));
  guideList.appendChild(fragment);

  const slideFragment = document.createDocumentFragment();
  guides.forEach((item) => slideFragment.appendChild(slideTemplate(item)));
  slides.appendChild(slideFragment);

  guides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `跳转到第 ${index + 1} 页`);
    dot.addEventListener("click", () => setActive(index));
    dots.appendChild(dot);
  });

  setActive(0);
}

function openDetail(index) {
  setActive(index, false);
  listScreen.classList.add("is-leaving");
  listScreen.classList.remove("is-active");
  detailScreen.classList.add("is-active");
  detailScreen.removeAttribute("aria-hidden");
}

function closeDetail() {
  detailScreen.classList.remove("is-active");
  detailScreen.setAttribute("aria-hidden", "true");
  listScreen.classList.add("is-active");
  listScreen.classList.remove("is-leaving");
  if (location.hash.startsWith("#detail")) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

function setActive(index, animate = true) {
  activeIndex = Math.max(0, Math.min(guides.length - 1, index));
  slides.style.transitionDuration = animate ? "450ms" : "0ms";
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
  const width = carousel.clientWidth;
  const resistance =
    (activeIndex === 0 && delta > 0) || (activeIndex === guides.length - 1 && delta < 0) ? 0.25 : 1;
  slides.style.transform = `translate3d(calc(${-activeIndex * 100}% + ${delta * resistance}px), 0, 0)`;
}

function pointerUp() {
  if (!dragging) return;
  dragging = false;
  const delta = currentX - startX;
  const threshold = Math.min(82, carousel.clientWidth * 0.22);

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
