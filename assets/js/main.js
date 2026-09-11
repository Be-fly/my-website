/* =========================================================
   B.fly (비플리) 원페이지 — 인터랙션 스크립트 (순수 JS, 의존성 없음)
   ========================================================= */
(function () {
  "use strict";

  /* 1) 스크롤 진입 애니메이션 (IntersectionObserver) */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 2) 상단 고정 내비 - 히어로를 벗어나면 배경 표시 */
  var topnav = document.querySelector(".topnav");
  var hero = document.querySelector(".hero");
  if (topnav && hero) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          topnav.classList.toggle("is-scrolled", !entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" }
    );
    navObserver.observe(hero);
  }

  /* 3) 제품 캐러셀 - 좌우 버튼 + 스와이프(네이티브 스크롤) + 점 인디케이터 */
  var track = document.querySelector("[data-carousel]");
  if (track) {
    var prevBtn = document.querySelector("[data-carousel-prev]");
    var nextBtn = document.querySelector("[data-carousel-next]");
    var dotsWrap = document.querySelector("[data-carousel-dots]");
    var cards = Array.prototype.slice.call(track.children);

    if (dotsWrap) {
      cards.forEach(function (_, i) {
        var dot = document.createElement("span");
        if (i === 0) dot.classList.add("is-active");
        dot.addEventListener("click", function () {
          cards[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        });
        dotsWrap.appendChild(dot);
      });
    }

    function cardStep() {
      var card = cards[0];
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || "0");
      return card.getBoundingClientRect().width + gap;
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        track.scrollBy({ left: cardStep(), behavior: "smooth" });
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        track.scrollBy({ left: -cardStep(), behavior: "smooth" });
      });
    }

    var dotEls = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];
    var scrollTimer;
    track.addEventListener("scroll", function () {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        var closestIdx = 0;
        var closestDist = Infinity;
        cards.forEach(function (card, i) {
          var dist = Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left);
          if (dist < closestDist) { closestDist = dist; closestIdx = i; }
        });
        dotEls.forEach(function (d, i) { d.classList.toggle("is-active", i === closestIdx); });
      }, 80);
    });
  }

  /* 4) 히어로 스크롤 유도 버튼 - 다음 섹션으로 부드럽게 이동 */
  var scrollCue = document.querySelector(".hero__scroll");
  if (scrollCue) {
    scrollCue.addEventListener("click", function (e) {
      var target = document.querySelector(scrollCue.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
})();
