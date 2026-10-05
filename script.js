/* Империя Чистоты — VERSION 03 interactions */
(function () {
  'use strict';

  /* ---------- header fixed on scroll ---------- */
  var header = document.querySelector('.header');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var t = hero ? hero.offsetHeight - 100 : 300;
    header.classList.toggle('is-fixed', window.scrollY > t);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  var closeBtn = document.getElementById('mmenu-close');

  function openMenu() {
    menu.hidden = false;
    void menu.offsetHeight;
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!menu.classList.contains('is-open')) menu.hidden = true;
    }, 320);
  }
  if (burger && menu) {
    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- about tabs (Квартира / Дом / Офис) ---------- */
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-on');
      t.setAttribute('aria-selected', 'true');
      var obj = t.getAttribute('data-obj');
      var calcObj = document.querySelector('.chip[data-obj="' + obj + '"]');
      if (calcObj) calcObj.click();
    });
  });

  /* ---------- services rail ---------- */
  var rail = document.getElementById('rail');
  var prev = document.getElementById('rail-prev');
  var next = document.getElementById('rail-next');
  if (rail && prev && next) {
    function railStep() {
      var card = rail.querySelector('.svc');
      return card ? card.getBoundingClientRect().width + 22 : 340;
    }
    function syncRail() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    }
    prev.addEventListener('click', function () {
      rail.scrollBy({ left: -railStep(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      rail.scrollBy({ left: railStep(), behavior: 'smooth' });
    });
    rail.addEventListener('scroll', syncRail, { passive: true });
    window.addEventListener('resize', syncRail);
    syncRail();
  }

  /* ---------- lead popup ---------- */
  var popup = document.getElementById('popup');
  var lastFocus = null;

  function openPopup() {
    if (!popup) return;
    lastFocus = document.activeElement;
    popup.hidden = false;
    void popup.offsetHeight;
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var first = popup.querySelector('input, button');
    if (first) first.focus();
  }
  function closePopup() {
    if (!popup || popup.hidden) return;
    popup.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      if (!popup.classList.contains('is-open')) popup.hidden = true;
    }, 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (popup) {
    document.querySelectorAll('[data-popup]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenuIfOpen();
        openPopup();
      });
    });
    popup.querySelectorAll('[data-popup-close]').forEach(function (el) {
      el.addEventListener('click', closePopup);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePopup();
    });

    var popupForm = document.getElementById('popup-form');
    if (popupForm) {
      popupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var done = document.getElementById('popup-done');
        if (done) {
          done.hidden = false;
          popupForm.querySelectorAll('input, button[type="submit"]').forEach(function (f) { f.disabled = true; });
        }
      });
    }
  }

  function closeMenuIfOpen() {
    if (menu && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      window.setTimeout(function () {
        if (!menu.classList.contains('is-open')) menu.hidden = true;
      }, 320);
    }
  }

  /* ---------- calculator ---------- */
  var form = document.getElementById('calc-form');
  if (form) {
    var area = document.getElementById('area');
    var areaOut = document.getElementById('area-out');
    var sumEl = document.getElementById('calc-sum');
    var noteEl = document.getElementById('calc-note');
    var doneEl = document.getElementById('calc-done');
    var objBtns = form.querySelectorAll('[data-obj]');
    var cleanBtns = form.querySelectorAll('[data-clean]');
    var obj = 'flat';
    var rate = 5000;
    var fixed = true;

    function fmt(n) {
      return n.toLocaleString('ru-RU') + ' ₽';
    }
    function calc() {
      var a = parseInt(area.value, 10);
      areaOut.textContent = a;
      var sum, note;
      if (fixed) {
        sumEl.textContent = 'от ' + fmt(rate);
        note = 'Ориентировочно, от ' + fmt(rate) + '. Точная стоимость зависит от площади и объёма работ.';
      } else {
        var mul = obj === 'office' ? 1.1 : 1;
        sum = Math.round(rate * a * mul / 10) * 10;
        sumEl.textContent = fmt(sum);
        note = 'Ориентировочно, по тарифу ' + rate + ' ₽/м² × ' + a + ' м²';
      }
      noteEl.textContent = note;
    }

    objBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        objBtns.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-checked', 'false'); });
        b.classList.add('is-on');
        b.setAttribute('aria-checked', 'true');
        obj = b.getAttribute('data-obj');
        calc();
      });
    });
    cleanBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        cleanBtns.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-checked', 'false'); });
        b.classList.add('is-on');
        b.setAttribute('aria-checked', 'true');
        rate = parseInt(b.getAttribute('data-clean'), 10);
        fixed = b.hasAttribute('data-fixed');
        calc();
      });
    });
    area.addEventListener('input', calc);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      doneEl.hidden = false;
    });
    calc();
  }
})();
