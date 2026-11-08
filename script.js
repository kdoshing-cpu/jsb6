(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /* -----------------------------------------------------------------------
     Año y pequeños estados globales
     ----------------------------------------------------------------------- */
  $$("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* -----------------------------------------------------------------------
     Header, progreso de lectura, navegación activa y botón flotante
     ----------------------------------------------------------------------- */
  const header = $("[data-header]");
  const progressBar = $(".scroll-progress span");
  const navLinks = $$("[data-nav]");
  const contactSection = $("#contacto");
  const locationSection = $("#ubicacion");
  const waFab = $("[data-wa-fab]");
  const navSections = $$("main section[id]");
  const navMap = {
    servicios: "servicios",
    problemas: "problemas",
    solucion: "solucion",
    galeria: "galeria",
    transformacion: "transformacion",
    proceso: "proceso",
    contacto: "contacto",
  };

  let ticking = false;
  let reelInView = false;

  const updateScrollUI = () => {
    const y = window.scrollY || window.pageYOffset;
    const docHeight = root.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;

    if (header) header.classList.toggle("is-scrolled", y > 28);
    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

    const scrollPoint = y + window.innerHeight * 0.38;
    let currentSection = null;
    navSections.forEach((section) => {
      if (section.offsetTop <= scrollPoint) currentSection = section;
    });
    const activeId = currentSection ? navMap[currentSection.id] ?? "" : "";
    navLinks.forEach((link) => {
      if (link.dataset.nav === activeId) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    if (waFab && contactSection) {
      const rect = contactSection.getBoundingClientRect();
      const locationRect = locationSection ? locationSection.getBoundingClientRect() : null;
      const inContact = rect.top < window.innerHeight * 0.82 && rect.bottom > window.innerHeight * 0.2;
      const inLocation = locationRect
        ? locationRect.top < window.innerHeight * 0.82 && locationRect.bottom > window.innerHeight * 0.2
        : false;
      const nearTop = y < window.innerHeight * 0.62;
      const shouldHide = inContact || inLocation || nearTop || reelInView;
      if (waFab.classList.contains("is-hidden") !== shouldHide) {
        if (shouldHide && document.activeElement === waFab) waFab.blur();
        waFab.classList.toggle("is-hidden", shouldHide);
        waFab.setAttribute("aria-hidden", String(shouldHide));
        waFab.toggleAttribute("inert", shouldHide);
        const waDock = waFab.closest(".whatsapp-dock");
        if (waDock) waDock.setAttribute("aria-hidden", String(shouldHide));
      }
    }

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollUI);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateScrollUI();

  /* -----------------------------------------------------------------------
     Menú móvil accesible
     ----------------------------------------------------------------------- */
  const menuToggle = $(".menu-toggle");
  const siteNav = $("#site-nav");
  const inertTargets = $$("main, .site-footer, .whatsapp-fab");
  let lastFocused = null;
  let menuFocusTimer = 0;

  const focusableInHeader = () =>
    $$("a[href], button:not([disabled])", header).filter(
      (el) => el.offsetParent !== null && getComputedStyle(el).visibility !== "hidden"
    );

  const setMenu = (open, restoreFocus = true) => {
    if (!menuToggle || !siteNav) return;
    window.clearTimeout(menuFocusTimer);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    siteNav.classList.toggle("is-open", open);
    body.classList.toggle("menu-open", open);
    inertTargets.forEach((el) => {
      if (open) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });

    if (open) {
      lastFocused = document.activeElement;
      menuFocusTimer = window.setTimeout(() => {
        const firstLink = $(".site-nav__link", siteNav);
        if (firstLink) firstLink.focus({ preventScroll: true });
      }, 120);
    } else if (restoreFocus) {
      const returnTarget =
        lastFocused instanceof HTMLElement && lastFocused !== body ? lastFocused : menuToggle;
      returnTarget.focus({ preventScroll: true });
    }
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    $$(".site-nav a", siteNav).forEach((link) => {
      link.addEventListener("click", (event) => {
        const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";
        if (!wasOpen) return;
        const hash = link.getAttribute("href");
        if (!hash || !hash.startsWith("#")) {
          setMenu(false);
          return;
        }

        event.preventDefault();
        setMenu(false, false);
        const target = document.querySelector(hash);
        if (!target) return;
        const heading = target.querySelector("h1, h2, h3") || target;
        heading.setAttribute("tabindex", "-1");
        history.pushState(null, "", hash);
        window.requestAnimationFrame(() => {
          target.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start",
          });
          heading.focus({ preventScroll: true });
        });
      });
    });

    document.addEventListener("keydown", (event) => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setMenu(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusables = focusableInHeader();
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const handleBreakpoint = (event) => {
      if (event.matches && menuToggle.getAttribute("aria-expanded") === "true") setMenu(false);
    };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", handleBreakpoint);
    else desktopQuery.addListener(handleBreakpoint);
  }

  /* -----------------------------------------------------------------------
     Reveals al hacer scroll
     ----------------------------------------------------------------------- */
  const revealElements = $$("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-inview"));
  } else {
    body.classList.add("reveal-ready");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* -----------------------------------------------------------------------
     Acordeón de servicios
     ----------------------------------------------------------------------- */
  const services = $$(".service");
  const serviceTriggers = services
    .map((service) => $(".service__trigger", service))
    .filter(Boolean);

  const setServiceState = (service, open) => {
    const trigger = $(".service__trigger", service);
    const panel = $(".service__panel", service);
    if (!trigger || !panel) return;
    service.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    if (open) panel.removeAttribute("inert");
    else panel.setAttribute("inert", "");
  };

  services.forEach((service) => {
    setServiceState(service, service.classList.contains("is-open"));
  });

  serviceTriggers.forEach((trigger, index) => {
    const service = trigger.closest(".service");
    trigger.addEventListener("click", () => {
      const willOpen = !service.classList.contains("is-open");
      services.forEach((item) => setServiceState(item, false));
      if (willOpen) setServiceState(service, true);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (index + direction + serviceTriggers.length) % serviceTriggers.length;
      serviceTriggers[nextIndex].focus();
    });
  });

  /* -----------------------------------------------------------------------
     Comparador antes / después
     ----------------------------------------------------------------------- */
  const compare = $("[data-compare]");
  if (compare) {
    const range = $(".compare__range", compare);
    const updateCompare = () => {
      if (!range) return;
      const value = Number(range.value);
      compare.style.setProperty("--compare", `${value}%`);
      range.setAttribute(
        "aria-valuetext",
        `${value} por ciento después a la izquierda, ${100 - value} por ciento antes a la derecha`
      );
    };
    if (range) {
      range.addEventListener("input", updateCompare);
      updateCompare();
    }
  }

  /* -----------------------------------------------------------------------
     Solicitud de evaluación en terreno
     ----------------------------------------------------------------------- */
  const diagnosticForm = $("[data-diagnostic]");
  if (diagnosticForm) {
    diagnosticForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(diagnosticForm);
      const nombre = String(data.get("nombre") || "").trim();
      const comuna = String(data.get("comuna") || "").trim();
      const necesidad = String(data.get("necesidad") || "").trim();
      const error = $("[data-diag-error]", diagnosticForm);
      const invalid = !nombre ? "nombre" : !comuna ? "comuna" : !necesidad ? "necesidad" : "";
      if (invalid) {
        if (error) {
          error.textContent = "Completa nombre, comuna y tipo de trabajo para coordinar la visita.";
          error.hidden = false;
        }
        const field = diagnosticForm.elements[invalid];
        if (field && typeof field.focus === "function") field.focus();
        return;
      }
      if (error) {
        error.hidden = true;
        error.textContent = "";
      }
      const message =
        `Hola JSB, soy ${nombre}. Necesito ${necesidad.toLowerCase()} en ${comuna}. ` +
        "Quiero coordinar una evaluación en terreno.";
      window.open(
        `https://wa.me/56966753502?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener"
      );
    });
  }

  /* -----------------------------------------------------------------------
     Constructor de mensaje de WhatsApp
     ----------------------------------------------------------------------- */
  const quoteBuilder = $("[data-quote]");
  if (quoteBuilder) {
    const quoteLink = $("#quote-link", quoteBuilder);
    const quoteLabel = $("#quote-link-label", quoteBuilder);
    const checkboxes = $$('input[name="servicio"]', quoteBuilder);
    const comuna = $("#quote-comuna", quoteBuilder);
    const idea = $("#quote-idea", quoteBuilder);

    const buildQuoteUrl = () => {
      const selected = checkboxes.filter((input) => input.checked).map((input) => input.value);
      const parts = ["Hola JSB, quiero cotizar un proyecto."];

      if (selected.length) {
        parts.push(`Me interesa: ${selected.join(", ")}.`);
      }
      if (comuna && comuna.value.trim()) {
        parts.push(`Comuna: ${comuna.value.trim()}.`);
      }
      if (idea && idea.value.trim()) {
        parts.push(`Mi idea: ${idea.value.trim()}.`);
      }
      if (!selected.length && !(comuna && comuna.value.trim()) && !(idea && idea.value.trim())) {
        parts.push("¿Me pueden orientar?");
      }

      if (quoteLink) {
        quoteLink.href = `https://wa.me/56966753502?text=${encodeURIComponent(parts.join(" "))}`;
      }
      if (quoteLabel) {
        if (selected.length === 1) quoteLabel.textContent = "Abrir WhatsApp · 1 servicio";
        else if (selected.length > 1) quoteLabel.textContent = `Abrir WhatsApp · ${selected.length} servicios`;
        else quoteLabel.textContent = "Abrir WhatsApp";
      }
    };

    checkboxes.forEach((input) => input.addEventListener("change", buildQuoteUrl));
    [comuna, idea].forEach((input) => {
      if (input) input.addEventListener("input", buildQuoteUrl);
    });
    buildQuoteUrl();
  }

  /* -----------------------------------------------------------------------
     Asistente guiado de cotización
     ----------------------------------------------------------------------- */
  const assistant = $("[data-assistant]");
  const assistantTrigger = $("[data-assistant-open]");
  if (assistant && assistantTrigger && typeof assistant.showModal === "function") {
    const assistantClose = $("[data-assistant-close]", assistant);
    const assistantLog = $("[data-assistant-log]", assistant);
    const assistantStep = $("[data-assistant-step]", assistant);
    const assistantStepLabel = $("[data-assistant-step-label]", assistant);
    const waBase = "https://wa.me/56966753502?text=";
    const greeting =
      "Hola. Soy el asistente de JSB. Te hago tres preguntas y armamos el mensaje para WhatsApp. No guardo tus datos.";
    const serviceOptions = [
      "Remodelación",
      "Ventanas y puertas",
      "Pintura y terminaciones",
      "Muebles a medida",
      "Hojalatería",
      "Otra idea",
    ];
    const state = { service: "", comuna: "", detail: "", step: "service" };

    const appendMessage = (role, text) => {
      const message = document.createElement("div");
      message.className = `assistant__msg assistant__msg--${role}`;

      const meta = document.createElement("span");
      meta.className = "assistant__msg-meta";
      meta.textContent = role === "assistant" ? "Asistente" : "Tú";

      const copy = document.createElement("p");
      copy.textContent = text;
      message.append(meta, copy);
      assistantLog.append(message);
      assistantLog.scrollTo({
        top: assistantLog.scrollHeight,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    };

    const setStepLabel = (step) => {
      assistantStepLabel.textContent = `${String(step).padStart(2, "0")} / 03`;
    };

    const focusStep = () => {
      if (!assistant.open) return;
      requestAnimationFrame(() => {
        const target = assistantStep.querySelector("button, input, textarea, a");
        if (target) target.focus({ preventScroll: true });
      });
    };

    const buildMessage = () => {
      const lines = [
        "Hola JSB, quiero cotizar un proyecto.",
        `Servicio: ${state.service}`,
        `Comuna: ${state.comuna}`,
      ];
      lines.push(
        `Idea: ${state.detail || "Aún estoy definiendo los detalles, me gustaría orientarme."}`
      );
      return lines.join("\n");
    };

    const showServiceStep = () => {
      state.step = "service";
      setStepLabel(1);

      const fieldset = document.createElement("fieldset");
      fieldset.className = "assistant__choices";
      const legend = document.createElement("legend");
      legend.className = "assistant__question";
      legend.textContent = "¿Qué necesitas?";
      fieldset.append(legend);

      const options = document.createElement("div");
      options.className = "assistant__options";
      serviceOptions.forEach((service) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "assistant__option";
        button.textContent = service;
        button.addEventListener("click", () => {
          state.service = service;
          appendMessage("user", service);
          appendMessage(
            "assistant",
            `Perfecto: ${service}. ¿En qué comuna está el espacio?`
          );
          showComunaStep();
        });
        options.append(button);
      });
      fieldset.append(options);
      assistantStep.replaceChildren(fieldset);
      focusStep();
    };

    const showComunaStep = () => {
      state.step = "comuna";
      setStepLabel(2);

      const form = document.createElement("form");
      form.className = "assistant__form";
      form.noValidate = true;
      form.innerHTML = `
        <label class="assistant__label" for="assistant-comuna">Comuna</label>
        <div class="assistant__field-row">
          <input class="assistant__input" id="assistant-comuna" name="comuna" type="text" autocomplete="address-level2" maxlength="60" placeholder="Ej: Temuco" required>
          <button class="assistant__send" type="submit">
            Continuar
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"></use></svg>
          </button>
        </div>
        <p class="assistant__error" data-assistant-error role="alert"></p>
      `;

      const input = $("#assistant-comuna", form);
      const error = $("[data-assistant-error]", form);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = input ? input.value.trim() : "";
        if (!value) {
          if (error) error.textContent = "Escribe tu comuna para continuar.";
          if (input) input.focus();
          return;
        }
        state.comuna = value;
        appendMessage("user", value);
        appendMessage(
          "assistant",
          "Gracias. Cuéntame brevemente qué tienes en mente: piezas, medidas o una idea general."
        );
        showDetailStep();
      });

      assistantStep.replaceChildren(form);
      focusStep();
    };

    const showDetailStep = () => {
      state.step = "detail";
      setStepLabel(3);

      const form = document.createElement("form");
      form.className = "assistant__form";
      form.noValidate = true;
      form.innerHTML = `
        <label class="assistant__label" for="assistant-detail">¿Qué tienes en mente?</label>
        <textarea class="assistant__textarea" id="assistant-detail" name="detail" maxlength="500" placeholder="Ej: cambiar tres ventanas del living por termopanel..."></textarea>
        <div class="assistant__actions">
          <button class="assistant__send" type="submit">
            Preparar mensaje
            <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"></use></svg>
          </button>
          <button class="assistant__skip" type="button" data-assistant-skip>Todavía no lo sé</button>
        </div>
        <p class="assistant__hint">Puedes escribir medidas, cantidad de piezas o una idea general.</p>
        <p class="assistant__error" data-assistant-error role="alert"></p>
      `;

      const detail = $("#assistant-detail", form);
      const error = $("[data-assistant-error]", form);
      const skip = $("[data-assistant-skip]", form);

      const completeDetail = (value) => {
        state.detail = value;
        appendMessage("user", value || "Todavía no lo sé");
        appendMessage(
          "assistant",
          "Listo. Revisa el mensaje y ábrelo en WhatsApp. Puedes editarlo antes de enviarlo."
        );
        showSummaryStep();
      };

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = detail ? detail.value.trim() : "";
        if (value.length > 500) {
          if (error) error.textContent = "El mensaje es demasiado largo.";
          return;
        }
        completeDetail(value);
      });
      if (skip) {
        skip.addEventListener("click", () => {
          if (detail) detail.value = "";
          completeDetail("");
        });
      }

      assistantStep.replaceChildren(form);
      focusStep();
    };

    const showSummaryStep = () => {
      state.step = "summary";
      setStepLabel(3);

      const message = buildMessage();
      assistantStep.innerHTML = `
        <div class="assistant__summary">
          <span class="assistant__summary-label">Mensaje para WhatsApp</span>
          <p data-assistant-preview></p>
        </div>
        <a class="assistant__wa" data-assistant-wa target="_blank" rel="noopener">
          Abrir WhatsApp
          <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow-up"></use></svg>
        </a>
        <button class="assistant__restart" type="button" data-assistant-restart>Empezar de nuevo</button>
      `;

      const preview = $("[data-assistant-preview]", assistantStep);
      const link = $("[data-assistant-wa]", assistantStep);
      const restart = $("[data-assistant-restart]", assistantStep);
      if (preview) preview.textContent = message;
      if (link) link.href = `${waBase}${encodeURIComponent(message)}`;
      if (restart) restart.addEventListener("click", resetAssistant);
      focusStep();
    };

    const resetAssistant = () => {
      state.service = "";
      state.comuna = "";
      state.detail = "";
      assistantLog.replaceChildren();
      appendMessage("assistant", greeting);
      showServiceStep();
    };

    const initAssistant = () => {
      if (assistantLog.children.length) return;
      appendMessage("assistant", greeting);
      showServiceStep();
    };

    const openAssistant = () => {
      if (assistant.open) {
        focusStep();
        return;
      }
      assistant.showModal();
      body.classList.add("assistant-open");
      assistantTrigger.setAttribute("aria-expanded", "true");
      initAssistant();
      focusStep();
    };

    assistantTrigger.addEventListener("click", openAssistant);
    if (assistantClose) {
      assistantClose.addEventListener("click", () => assistant.close());
    }
    assistant.addEventListener("click", (event) => {
      if (event.target === assistant) assistant.close();
    });
    assistant.addEventListener("close", () => {
      body.classList.remove("assistant-open");
      assistantTrigger.setAttribute("aria-expanded", "false");
      window.setTimeout(() => {
        if (
          !assistantTrigger.hasAttribute("inert") &&
          !assistantTrigger.classList.contains("is-hidden")
        ) {
          assistantTrigger.focus({ preventScroll: true });
        }
      }, 0);
    });
  }

  /* -----------------------------------------------------------------------
     Reel de obra (Remotion)
     ----------------------------------------------------------------------- */
  const reel = $("[data-reel]");
  if (reel) {
    const video = $("[data-reel-video]", reel);
    const toggle = $("[data-reel-toggle]", reel);
    let userPaused = false;
    let reelObserver = null;

    const setReelState = (playing) => {
      reel.classList.toggle("is-playing", playing);
      if (toggle) {
        toggle.setAttribute("aria-pressed", String(playing));
        toggle.setAttribute("aria-label", playing ? "Pausar reel" : "Reproducir reel");
      }
    };

    const playReel = () => {
      if (!video) return;
      video
        .play()
        .then(() => setReelState(true))
        .catch(() => setReelState(false));
    };

    const pauseReel = () => {
      if (!video) return;
      video.pause();
      setReelState(false);
    };

    if (video) {
      video.addEventListener("play", () => setReelState(true));
      video.addEventListener("pause", () => setReelState(false));
      video.addEventListener("click", () => {
        if (video.paused) {
          userPaused = false;
          playReel();
        } else {
          userPaused = true;
          pauseReel();
        }
      });
    }

    if (toggle) {
      toggle.addEventListener("click", () => {
        if (!video) return;
        if (video.paused) {
          userPaused = false;
          playReel();
        } else {
          userPaused = true;
          pauseReel();
        }
      });
    }

    if (reduceMotion) {
      setReelState(false);
    }

    if (video && "IntersectionObserver" in window) {
      reelObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            reelInView = entry.isIntersecting;
            if (entry.isIntersecting && !userPaused && !reduceMotion) playReel();
            else if (!entry.isIntersecting) video.pause();
            onScroll();
          });
        },
        { threshold: 0.35 }
      );
      reelObserver.observe(reel);
    }

    window.addEventListener("pagehide", () => {
      if (reelObserver) reelObserver.disconnect();
      if (video) video.pause();
    });
  }

  /* -----------------------------------------------------------------------
     Control de pausa del marquee
     ----------------------------------------------------------------------- */
  const marquee = $("[data-marquee]");
  const marqueeToggle = marquee ? $(".marquee__toggle", marquee) : null;
  if (marquee && marqueeToggle) {
    marqueeToggle.addEventListener("click", () => {
      const paused = marquee.classList.toggle("is-paused");
      marqueeToggle.setAttribute("aria-pressed", String(paused));
      marqueeToggle.setAttribute(
        "aria-label",
        paused
          ? "Reanudar el desplazamiento de especialidades"
          : "Pausar el desplazamiento de especialidades"
      );
    });
  }

  /* -----------------------------------------------------------------------
     Galería horizontal
     ----------------------------------------------------------------------- */
  const rail = $("[data-rail]");
  if (rail) {
    const viewport = $("[data-rail-viewport]", rail);
    const track = $("[data-rail-track]", rail);
    const prevButton = $("[data-rail-prev]", rail);
    const nextButton = $("[data-rail-next]", rail);
    const count = $("[data-rail-count]", rail);
    const cards = $$(".work", track);
    let currentIndex = 0;
    let railFrame = 0;

    const cardOffset = (card) =>
      viewport.scrollLeft + (card.getBoundingClientRect().left - viewport.getBoundingClientRect().left);

    const goToCard = (index) => {
      if (!cards.length) return;
      const safeIndex = Math.max(0, Math.min(cards.length - 1, index));
      viewport.scrollTo({
        left: cardOffset(cards[safeIndex]),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    };

    const updateRailState = () => {
      if (!cards.length) return;
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      let nearest = 0;
      let nearestDistance = Infinity;
      const viewportLeft = viewport.getBoundingClientRect().left;
      cards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - viewportLeft);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });
      currentIndex = nearest;
      if (maxScroll > 0 && viewport.scrollLeft >= maxScroll - 2) {
        currentIndex = cards.length - 1;
      }
      if (count) {
        const label = `${String(currentIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
        if (count.textContent !== label) count.textContent = label;
      }
      if (prevButton) prevButton.disabled = viewport.scrollLeft <= 2;
      if (nextButton) nextButton.disabled = viewport.scrollLeft >= maxScroll - 2;
      railFrame = 0;
    };

    if (prevButton) prevButton.addEventListener("click", () => goToCard(currentIndex - 1));
    if (nextButton) nextButton.addEventListener("click", () => goToCard(currentIndex + 1));
    viewport.addEventListener(
      "scroll",
      () => {
        if (!railFrame) railFrame = window.requestAnimationFrame(updateRailState);
      },
      { passive: true }
    );
    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      goToCard(currentIndex + (event.key === "ArrowRight" ? 1 : -1));
    });
    window.addEventListener("resize", updateRailState, { passive: true });
    updateRailState();
  }

  /* -----------------------------------------------------------------------
     Botones magnéticos
     ----------------------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    $$(".btn.magnetic").forEach((el) => {
      let frame = 0;
      let targetX = 0;
      let targetY = 0;

      const render = () => {
        el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
        frame = 0;
      };

      el.addEventListener("pointermove", (event) => {
        const rect = el.getBoundingClientRect();
        targetX = (event.clientX - rect.left - rect.width / 2) * 0.12;
        targetY = (event.clientY - rect.top - rect.height / 2) * 0.18;
        if (!frame) frame = window.requestAnimationFrame(render);
      });

      el.addEventListener("pointerleave", () => {
        targetX = 0;
        targetY = 0;
        if (!frame) frame = window.requestAnimationFrame(render);
      });
    });
  }

  /* -----------------------------------------------------------------------
     Parallax suave de la fotografía del hero
     ----------------------------------------------------------------------- */
  if (finePointer && !reduceMotion) {
    const visual = $(".hero__visual");
    const frame = $(".hero__frame");
    if (visual && frame) {
      let frameId = 0;
      let px = 0;
      let py = 0;

      const render = () => {
        frame.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        frameId = 0;
      };

      visual.addEventListener("pointermove", (event) => {
        const rect = visual.getBoundingClientRect();
        px = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        py = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
        if (!frameId) frameId = window.requestAnimationFrame(render);
      });

      visual.addEventListener("pointerleave", () => {
        px = 0;
        py = 0;
        if (!frameId) frameId = window.requestAnimationFrame(render);
      });
    }
  }
})();
