/* =====================================================
   K-ACTORS FESTIVAL 2026 — script.js
===================================================== */

(function () {
  "use strict";

  /* ===== 페스티벌 시작일 (2026-10-09 10:00 KST) ===== */
  var FESTIVAL_DATE = new Date("2026-10-09T10:00:00+09:00").getTime();

  /* =====================================================
     헤더 스크롤 상태
  ===================================================== */
  var header = document.getElementById("header");

  function onScrollHeader() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* =====================================================
     모바일 내비게이션
  ===================================================== */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", function () {
    var isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  });

  navMenu.addEventListener("click", function (e) {
    if (e.target.classList.contains("nav-link")) {
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
    }
  });

  /* =====================================================
     스크롤 등장 애니메이션 (IntersectionObserver)
  ===================================================== */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* =====================================================
     카운트다운
  ===================================================== */
  var cd = {
    d: document.getElementById("cdDays"),
    h: document.getElementById("cdHours"),
    m: document.getElementById("cdMinutes"),
    s: document.getElementById("cdSeconds"),
  };

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function updateCountdown() {
    var now = Date.now();
    var diff = FESTIVAL_DATE - now;

    if (diff <= 0) {
      cd.d.textContent = "00";
      cd.h.textContent = "00";
      cd.m.textContent = "00";
      cd.s.textContent = "00";
      return;
    }

    cd.d.textContent = pad(Math.floor(diff / 86400000));
    cd.h.textContent = pad(Math.floor((diff / 3600000) % 24));
    cd.m.textContent = pad(Math.floor((diff / 60000) % 60));
    cd.s.textContent = pad(Math.floor((diff / 1000) % 60));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* =====================================================
     통계 숫자 카운트업
  ===================================================== */
  var statNums = document.querySelectorAll(".stat-num[data-count]");

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var statIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNums.forEach(function (el) { statIO.observe(el); });
  } else {
    statNums.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  /* =====================================================
     일정 탭 & 타임라인 렌더링
  ===================================================== */
  var scheduleData = {
    1: [
      { time: "10:00", title: "개막식 & 축하 무대", desc: "페스티벌 개막 선언과 개막 축하 공연", place: "메인 스테이지" },
      { time: "11:00", title: "배우 마스터클래스 — 최민식", desc: "30년 연기 인생을 관객과 나누는 시간", place: "컨퍼런스홀 A" },
      { time: "14:00", title: "토크 콘서트 — 송강호", desc: "스크린 밖 이야기, 진솔한 Q&A", place: "메인 스테이지" },
      { time: "17:00", title: "개막 레드카펫", desc: "배우들의 화려한 레드카펫 워킹 & 포토존", place: "코엑스 동문 광장" },
      { time: "19:00", title: "사인회 — 전도연", desc: "선착순 200명 응모, 당일 배부", place: "팬존 B" },
    ],
    2: [
      { time: "10:30", title: "연기 워크숍", desc: "현역 연기 코치와 함께하는 몰입 훈련", place: "워크숍룸 1" },
      { time: "13:00", title: "토크 콘서트 — 이병헌", desc: "한류에서 할리우드까지, 배우의 길", place: "메인 스테이지" },
      { time: "15:00", title: "마스터클래스 — 김혜수", desc: "캐릭터를 만드는 나만의 방법론", place: "컨퍼런스홀 A" },
      { time: "17:30", title: "팬미팅 — 박서준", desc: "팬과 함께하는 게임 & 토크 라이브", place: "메인 스테이지" },
      { time: "19:30", title: "영화 상영회", desc: "참여 배우 대표작 야외 상영", place: "야외 스크린" },
    ],
    3: [
      { time: "11:00", title: "토크 콘서트 — 한소희", desc: "차세대 배우의 성장 이야기", place: "컨퍼런스홀 A" },
      { time: "13:30", title: "배우 장내전", desc: "배우 팀 대항 게임 대결!", place: "메인 스테이지" },
      { time: "16:00", title: "폐막 팬미팅 — 유해진", desc: "마지막 날을 장식하는 스페셜 팬미팅", place: "메인 스테이지" },
      { time: "17:30", title: "🎤 스페셜 노래 타임 — 조정석", desc: "라이브 밴드와 함께하는 배우의 노래 무대, 레퍼토리 공개!", place: "메인 스테이지" },
      { time: "19:00", title: "폐막식 & K-Actors 어워즈", desc: "3일간의 여정을 빛낸 순간들의 시상식", place: "메인 스테이지" },
    ],
  };

  var timelineEl = document.getElementById("timeline");
  var dayTabs = document.querySelectorAll(".day-tab");

  function renderDay(day) {
    var items = scheduleData[day] || [];
    timelineEl.innerHTML = items
      .map(function (item) {
        return (
          '<li class="schedule-item">' +
          '<span class="schedule-time">' + item.time + "</span>" +
          '<div class="schedule-body">' +
          "<h4>" + item.title + "</h4>" +
          "<p>" + item.desc + "</p>" +
          '<span class="schedule-place">📍 ' + item.place + "</span>" +
          "</div></li>"
        );
      })
      .join("");
  }

  dayTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      dayTabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      renderDay(tab.getAttribute("data-day"));
    });
  });

  renderDay("1");

  /* =====================================================
     뉴스레터 (데모)
  ===================================================== */
  var form = document.getElementById("newsletterForm");
  var msg = document.getElementById("newsletterMsg");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = form.querySelector("input[type='email']");
    if (!input.value) return;
    msg.textContent = "🎉 구독해 주셔서 감사합니다! 2차 라인업 소식을 기다려 주세요.";
    input.value = "";
    input.blur();
  });

  /* =====================================================
     능동적 내비 링크 하이라이트
  ===================================================== */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window) {
    var sectionIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + id
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { sectionIO.observe(s); });
  }

  /* =====================================================
     댓글 (Express 백엔드 API)
  ===================================================== */
  var API_BASE = (function () {
    if (window.location.protocol.indexOf("http") !== 0) return "https://k-actors-api.onrender.com";
    if (window.location.hostname.indexOf("github.io") !== -1) return "https://k-actors-api.onrender.com";
    return "";
  })();

  var commentForm = document.getElementById("commentForm");
  var commentNick = document.getElementById("commentNick");
  var commentMsg = document.getElementById("commentMsg");
  var commentList = document.getElementById("commentList");
  var commentStatus = document.getElementById("commentStatus");
  var commentSubmit = document.getElementById("commentSubmit");

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function timeAgo(iso) {
    var diff = Date.now() - new Date(iso).getTime();
    var min = Math.floor(diff / 60000);
    if (min < 1) return "방금 전";
    if (min < 60) return min + "분 전";
    var hr = Math.floor(min / 60);
    if (hr < 24) return hr + "시간 전";
    var day = Math.floor(hr / 24);
    if (day < 7) return day + "일 전";
    var d = new Date(iso);
    return d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
  }

  function setStatus(text, isError) {
    commentStatus.textContent = text || "";
    commentStatus.classList.toggle("error", !!isError);
  }

  function renderComments(rows) {
    if (!rows.length) {
      commentList.innerHTML =
        '<li class="comment-empty">아직 댓글이 없습니다. 첫 응원 메시지를 남겨보세요! ✨</li>';
      return;
    }
    commentList.innerHTML = rows
      .map(function (row) {
        var nick = escapeHtml(row.nickname);
        var ch = row.nickname.trim().charAt(0).toUpperCase() || "?";
        return (
          '<li class="comment-item">' +
          '<div class="comment-avatar">' + escapeHtml(ch) + "</div>" +
          '<div class="comment-body">' +
          '<div class="comment-head">' +
          '<span class="comment-nick">' + nick + "</span>" +
          '<span class="comment-time">' + timeAgo(row.created_at) + "</span>" +
          "</div>" +
          '<p class="comment-text">' + escapeHtml(row.message) + "</p>" +
          "</div></li>"
        );
      })
      .join("");
  }

  function loadComments() {
    commentList.innerHTML =
      '<li class="comment-loading">댓글을 불러오는 중...</li>';

    fetch(API_BASE + "/api/comments")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.ok) {
          commentList.innerHTML =
            '<li class="comment-empty">댓글 로딩 실패: ' +
            escapeHtml(data.error || "알 수 없는 오류") + "</li>";
          return;
        }
        renderComments(data.comments || []);
      })
      .catch(function (err) {
        commentList.innerHTML =
          '<li class="comment-empty">서버에 연결할 수 없습니다: ' +
          escapeHtml(err.message) + "</li>";
      });
  }

  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var nick = commentNick.value.trim();
    var msg = commentMsg.value.trim();

    if (!nick || !msg) {
      setStatus("닉네임과 내용을 모두 입력해 주세요.", true);
      return;
    }

    commentSubmit.disabled = true;
    setStatus("등록 중...", false);

    fetch(API_BASE + "/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: nick, message: msg }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        commentSubmit.disabled = false;
        if (!data.ok) {
          setStatus("등록 실패: " + (data.error || "알 수 없는 오류"), true);
          return;
        }
        commentMsg.value = "";
        setStatus("댓글이 등록되었습니다. 감사합니다! 🎬", false);
        loadComments();
      })
      .catch(function (err) {
        commentSubmit.disabled = false;
        setStatus("서버에 연결할 수 없습니다: " + err.message, true);
      });
  });

  if (commentForm) {
    loadComments();
  }
})();
