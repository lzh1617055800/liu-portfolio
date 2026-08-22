const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");

if (menuToggle && mobileNav) {
  const closeMenu = () => {
    mobileNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileNav.classList.contains("is-open");
    mobileNav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const foldTitle = document.querySelector(".fold-title");
if (foldTitle) {
  foldTitle.querySelectorAll(".fold-piece").forEach((piece) => {
    const text = piece.textContent || "";
    piece.textContent = "";
    [...text].forEach((character, index) => {
      const char = document.createElement("span");
      char.className = "fold-char";
      char.textContent = character === " " ? "\u00a0" : character;
      char.style.setProperty("--fold-delay", `${index * 32}ms`);
      piece.appendChild(char);
    });
  });
  window.setTimeout(() => foldTitle.classList.add("is-folded"), prefersReducedMotion ? 0 : 180);
}

const gooeyNav = document.querySelector(".gooey-nav");
if (gooeyNav) {
  const gooeyLinks = [...gooeyNav.querySelectorAll("a:not(.nav-cta)")];
  const gooeyHighlight = gooeyNav.querySelector(".gooey-highlight");

  const moveGooeyHighlight = (link, immediate = false) => {
    if (!link || !gooeyHighlight) return;
    const navRect = gooeyNav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    gooeyHighlight.style.left = `${linkRect.left - navRect.left - 10}px`;
    gooeyHighlight.style.width = `${linkRect.width + 20}px`;
    gooeyHighlight.style.opacity = "1";
    if (immediate) gooeyHighlight.style.transition = "none";
    window.requestAnimationFrame(() => {
      if (immediate) gooeyHighlight.style.transition = "";
    });
    gooeyLinks.forEach((item) => item.classList.toggle("is-current", item === link));
  };

  const burstGooey = (link) => {
    if (prefersReducedMotion) return;
    const navRect = gooeyNav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const startX = linkRect.left - navRect.left + linkRect.width / 2;
    const startY = linkRect.top - navRect.top + linkRect.height / 2;

    for (let index = 0; index < 10; index += 1) {
      const spark = document.createElement("span");
      const angle = (Math.PI * 2 * index) / 10;
      const distance = 18 + Math.random() * 24;
      spark.className = "gooey-spark";
      spark.style.setProperty("--spark-x", `${startX}px`);
      spark.style.setProperty("--spark-y", `${startY}px`);
      spark.style.setProperty("--spark-dx", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--spark-dy", `${Math.sin(angle) * distance}px`);
      gooeyNav.appendChild(spark);
      window.setTimeout(() => spark.remove(), 760);
    }
  };

  const activateFromHash = () => {
    const hash = window.location.hash;
    const link = gooeyLinks.find((item) => item.getAttribute("href") === hash) || gooeyLinks[0];
    moveGooeyHighlight(link, true);
  };

  gooeyLinks.forEach((link) => {
    link.addEventListener("click", () => {
      moveGooeyHighlight(link);
      burstGooey(link);
    });
  });
  window.addEventListener("hashchange", activateFromHash);
  window.addEventListener("resize", activateFromHash);
  window.setTimeout(activateFromHash, 80);
}

const filterButtons = [...document.querySelectorAll(".filter-chip")];
const projectRows = [...document.querySelectorAll(".project-row")];

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));

  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    projectRows.forEach((project) => {
      const shouldHide = filter !== "all" && project.dataset.category !== filter;
      project.classList.toggle("is-hidden", shouldHide);
    });
  });
});

const loopSteps = [...document.querySelectorAll(".loop-step")];
if (loopSteps.length > 1) {
  let loopIndex = 0;
  const advanceLoop = () => {
    loopSteps.forEach((step, index) => step.classList.toggle("is-active", index === loopIndex));
    loopIndex = (loopIndex + 1) % loopSteps.length;
  };

  advanceLoop();
  if (!prefersReducedMotion) window.setInterval(advanceLoop, 1600);
}

// The toolchain is a real marquee rather than a CSS snapshot: the track moves
// on every frame, loops at exactly one sequence width, and pauses for inspection.
const stackMarquee = document.querySelector(".stack-marquee");
const stackMarqueeTrack = stackMarquee?.querySelector(".stack-marquee-track");
if (stackMarquee && stackMarqueeTrack) {
  let marqueeOffset = 0;
  let marqueeLast = null;
  let marqueeSequenceWidth = 0;
  let marqueePaused = false;

  const measureMarquee = () => {
    marqueeSequenceWidth = Math.max(1, stackMarqueeTrack.scrollWidth / 2);
    marqueeOffset %= marqueeSequenceWidth;
    if (prefersReducedMotion) stackMarqueeTrack.style.transform = "translate3d(0, 0, 0)";
  };

  const tickMarquee = (timestamp) => {
    if (marqueeLast === null) marqueeLast = timestamp;
    const delta = Math.min(64, timestamp - marqueeLast) / 1000;
    marqueeLast = timestamp;

    if (!prefersReducedMotion && !marqueePaused && marqueeSequenceWidth > 1) {
      marqueeOffset = (marqueeOffset + 58 * delta) % marqueeSequenceWidth;
      stackMarqueeTrack.style.transform = `translate3d(${-marqueeOffset}px, 0, 0)`;
    }
    window.requestAnimationFrame(tickMarquee);
  };

  stackMarquee.addEventListener("mouseenter", () => { marqueePaused = true; });
  stackMarquee.addEventListener("mouseleave", () => { marqueePaused = false; });
  stackMarquee.addEventListener("touchstart", () => { marqueePaused = true; }, { passive: true });
  stackMarquee.addEventListener("touchend", () => { marqueePaused = false; }, { passive: true });
  window.addEventListener("resize", measureMarquee);
  window.requestAnimationFrame(() => {
    measureMarquee();
    window.requestAnimationFrame(tickMarquee);
  });
}

const copyButtons = [...document.querySelectorAll(".copy-email")];
const copyEmailToClipboard = async (email) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
      return true;
    }
  } catch {
    // Use the legacy fallback below for local/file previews and older browsers.
  }

  const input = document.createElement("textarea");
  input.value = email;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  input.remove();
  return copied;
};

copyButtons.forEach((button) => {
  const original = button.innerHTML;

  button.addEventListener("click", async () => {
    const email = button.dataset.email || "";
    const copied = await copyEmailToClipboard(email);
    button.textContent = copied ? "邮箱已复制 ✓" : email;
    window.setTimeout(() => {
      button.innerHTML = original;
    }, 2200);
  });
});

const emailStatus = document.querySelector(".email-status");
document.querySelectorAll(".email-link").forEach((link) => {
  link.addEventListener("click", () => {
    const email = link.dataset.email || "liuzhuo_hao@163.com";
    copyEmailToClipboard(email).then((copied) => {
      if (!emailStatus) return;
      emailStatus.textContent = copied
        ? "已尝试打开邮件客户端；邮箱地址也已复制。"
        : "未检测到邮件客户端，请手动使用邮箱：" + email;
      emailStatus.classList.add("is-visible");
      window.setTimeout(() => emailStatus.classList.remove("is-visible"), 3200);
    });
  });
});
