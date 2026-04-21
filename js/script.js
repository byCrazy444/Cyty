// Функция мобильного меню: открывает и закрывает навигацию на малых экранах.
function mobileMenu() {
    var nav = document.getElementById("siteNav");
    var burger = document.getElementById("hamburger");
    if (!nav || !burger) {
        return;
    }

    nav.classList.toggle("mobile");
    var expanded = nav.classList.contains("mobile");
    burger.setAttribute("aria-expanded", expanded ? "true" : "false");
}

// Подсвечивает ссылку текущей страницы в меню.
function highlightCurrentNav() {
    var nav = document.getElementById("siteNav");
    if (!nav) {
        return;
    }

    var currentPath = window.location.pathname.toLowerCase();
    var links = nav.querySelectorAll("a");

    for (var i = 0; i < links.length; i++) {
        var linkPath = new URL(links[i].href, window.location.href).pathname.toLowerCase();
        if (linkPath === currentPath) {
            links[i].classList.add("current");
            links[i].setAttribute("aria-current", "page");
        }
    }
}

// Заполняет текущий год во всех элементах .year.
function setCurrentYear() {
    var yearNodes = document.querySelectorAll(".year");
    var year = new Date().getFullYear();

    for (var i = 0; i < yearNodes.length; i++) {
        yearNodes[i].textContent = year;
    }
}

// Показывает локальное время в hero-блоке.
function setupCurrentTime() {
    var timeNode = document.querySelector("[data-current-time]");
    if (!timeNode) {
        return;
    }

    function render() {
        var now = new Date();
        var hh = String(now.getHours()).padStart(2, "0");
        var mm = String(now.getMinutes()).padStart(2, "0");
        timeNode.textContent = hh + ":" + mm;
    }

    render();
    setInterval(render, 60000);
}

// Простой счетчик локальных посещений на базе localStorage.
function setupVisitCounter() {
    var nodes = document.querySelectorAll("[data-visit-counter]");
    if (!nodes.length) {
        return;
    }

    var key = "balti_visit_counter";
    var prev = Number(localStorage.getItem(key) || "0");
    var next = prev + 1;
    localStorage.setItem(key, String(next));

    for (var i = 0; i < nodes.length; i++) {
        nodes[i].textContent = String(next);
    }
}

// Показывает случайный факт о городе на страницах, где есть кнопка.
function setupRandomFact() {
    var button = document.querySelector("[data-random-fact]");
    var output = document.getElementById("fact-output");
    if (!button || !output) {
        return;
    }

    var facts = [
        "Бельцы считаются ключевым городским центром на севере Республики Молдова.",
        "В городе есть маршруты, подходящие для учебного туризма и групповых посещений.",
        "Автомобильные и железнодорожные связи делают Бельцы доступными из разных направлений.",
        "Общественные пространства Бельц часто используются для культурных и городских мероприятий.",
        "В этом проекте контент организован в семантически связанные страницы."
    ];

    button.addEventListener("click", function () {
        var index = Math.floor(Math.random() * facts.length);
        output.textContent = facts[index];
    });
}

// Обрабатывает форму: валидация, статус и динамический список заявок.
function setupContactForm() {
    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");
    var list = document.getElementById("request-list");

    if (!form || !status || !list) {
        return;
    }

    var storageKey = "balti_contact_requests";

    function renderSavedRequests() {
        var saved = localStorage.getItem(storageKey);
        if (!saved) {
            return;
        }

        var rows;
        try {
            rows = JSON.parse(saved);
        } catch (err) {
            rows = [];
        }

        if (!Array.isArray(rows) || !rows.length) {
            return;
        }

        list.innerHTML = "";
        for (var i = 0; i < rows.length; i++) {
            var li = document.createElement("li");
            li.textContent = rows[i];
            list.appendChild(li);
        }
    }

    function saveRequestRow(rowText) {
        var saved = localStorage.getItem(storageKey);
        var rows;

        try {
            rows = saved ? JSON.parse(saved) : [];
        } catch (err) {
            rows = [];
        }

        if (!Array.isArray(rows)) {
            rows = [];
        }

        rows.push(rowText);

        if (rows.length > 8) {
            rows = rows.slice(rows.length - 8);
        }

        localStorage.setItem(storageKey, JSON.stringify(rows));
    }

    renderSavedRequests();

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var name = form.elements.name.value.trim();
        var email = form.elements.email.value.trim();
        var phone = form.elements.phone.value.trim();
        var date = form.elements.visit_date.value;
        var topic = form.elements.topic.value;
        var message = form.elements.message.value.trim();
        var privacy = form.elements.privacy.checked;

        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        var phoneOk = /^\+?[0-9\s()-]{7,}$/.test(phone);

        if (name.length < 2 || !emailOk || !phoneOk || !date || !topic || message.length < 8 || !privacy) {
            status.textContent = "Проверьте данные: заполните все поля и подтвердите локальную обработку.";
            status.className = "status error";
            return;
        }

        var rowText = name + " | " + topic + " | " + date;

        if (list.children.length === 1 && list.children[0].textContent.indexOf("Пока заявок") === 0) {
            list.innerHTML = "";
        }

        var li = document.createElement("li");
        li.textContent = rowText;
        list.appendChild(li);

        saveRequestRow(rowText);

        status.textContent = "Сообщение успешно сохранено локально. Спасибо, " + name + "!";
        status.className = "status ok";
        form.reset();
    });
}

// Анимация появления при прокрутке для блоков .reveal.
function setupRevealAnimation() {
    var blocks = document.querySelectorAll(".reveal");
    if (!blocks.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        for (var i = 0; i < blocks.length; i++) {
            blocks[i].classList.add("show");
        }
        return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    for (var j = 0; j < blocks.length; j++) {
        observer.observe(blocks[j]);
    }
}

// Настраивает мобильную навигацию: клик по бургеру и автозакрытие меню.
function setupMobileNavigation() {
    var nav = document.getElementById("siteNav");
    var burger = document.getElementById("hamburger");

    if (!nav || !burger) {
        return;
    }

    burger.addEventListener("click", mobileMenu);

    var links = nav.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function () {
            if (window.innerWidth <= 820) {
                nav.classList.remove("mobile");
                burger.setAttribute("aria-expanded", "false");
            }
        });
    }

    window.addEventListener("resize", function () {
        if (window.innerWidth > 820) {
            nav.classList.remove("mobile");
            burger.setAttribute("aria-expanded", "false");
        }
    });
}

// Точка входа: запускаем все модули после готовности DOM.
document.addEventListener("DOMContentLoaded", function () {
    setupMobileNavigation();
    highlightCurrentNav();
    setCurrentYear();
    setupCurrentTime();
    setupVisitCounter();
    setupRandomFact();
    setupContactForm();
    setupRevealAnimation();
});
