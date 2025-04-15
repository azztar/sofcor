// Variable global para controlar la animación
let animationId = null;
let waveAnimationId = null;

document.addEventListener("DOMContentLoaded", function () {
  // Mostrar contenido principal de inmediato
  document.body.classList.add("loaded");

  // Eliminar todas las inicializaciones relacionadas con partículas
  // Solo mantener las funcionalidades esenciales

  // Funcionalidad Menú Móvil
  initMobileMenu();

  // Otras inicializaciones...
  initFloatingMenu();

  // Añadir esto al final
  setupVideoTransition();
});

// Extraer la inicialización del menú móvil
function initMobileMenu() {
  const mobileMenuButton = document.getElementById("hamburger-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    // Mejorar área táctil
    mobileMenuButton.style.minHeight = "44px";
    mobileMenuButton.style.minWidth = "44px";

    // Resto del código igual...
    mobileMenuButton.addEventListener("click", function () {
      const isExpanded =
        mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("is-open");
    });

    const mobileMenuLinks = mobileMenu.querySelectorAll("a");
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("is-open");
      });
    });

    // Cerrar menú al tocar fuera
    document.addEventListener("click", function (event) {
      const isOutside =
        !mobileMenu.contains(event.target) &&
        !mobileMenuButton.contains(event.target);

      if (isOutside && !mobileMenu.classList.contains("hidden")) {
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("is-open");
      }
    });
  }
}

// Mejoras para animaciones de scroll
document.addEventListener("DOMContentLoaded", function () {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            if (entry.target.classList.contains("parallax-element")) {
              const speed = entry.target.dataset.speed || 0.15;
              const y =
                (window.innerHeight - entry.boundingClientRect.top) * speed;
              entry.target.style.transform = `translateY(${y}px)`;
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // Efecto parallax en scroll
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    document.querySelectorAll(".parallax-element").forEach((element) => {
      const speed = element.dataset.speed || 0.15;
      element.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
});

// Sistema mejorado de gestión de video
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("banner-video");
  const placeholder = document.querySelector(".video-placeholder");
  const videoContainer = document.querySelector(".video-container");

  if (!video || !placeholder) return;

  // 1. Sistema de carga con prioridad
  let videoLoaded = false;
  let videoTimeout = setTimeout(function () {
    if (!videoLoaded) {
      console.log("Usando fallback: video tardó demasiado");
      placeholder.style.opacity = "1";
    }
  }, 3000);

  // 2. Detectar cuando el video está listo
  video.addEventListener("canplaythrough", function () {
    videoLoaded = true;
    clearTimeout(videoTimeout);
    video.classList.remove("opacity-0");
    placeholder.style.opacity = "0";
  });

  // 3. Gestión de scroll simplificada
  let lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;
    const serviciosSection = document.getElementById("servicios-detalle");
    if (!serviciosSection) return;

    // Solo hacer una comprobación: ¿hemos pasado completamente la sección de servicios?
    const serviciosSectionBottom =
      serviciosSection.getBoundingClientRect().bottom + window.scrollY;

    if (scrollY > serviciosSectionBottom) {
      // Pasamos servicios - ocultar video y pausar
      videoContainer.style.opacity = "0";
      if (!video.paused) video.pause();
    } else {
      // Mostrar y reproducir video
      videoContainer.style.opacity = "1";
      if (videoLoaded && video.paused) video.play().catch((e) => {});
    }
  });

  // 4. Manejo de errores
  video.addEventListener("error", function () {
    console.error("Error en el video, usando imagen estática");
    placeholder.style.opacity = "1";
    video.style.display = "none";
  });
});

// Mejora para video en dispositivos móviles
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("banner-video");
  const placeholder = document.querySelector(".video-placeholder");
  const isMobile = window.innerWidth <= 768;

  if (video && placeholder) {
    // Ajustes específicos para móviles
    if (isMobile) {
      // Forzar la carga del video móvil si estamos en dispositivo móvil
      const sourceMobile = video.querySelector(
        'source[media="(max-width: 768px)"]'
      );
      if (sourceMobile) {
        video.src = sourceMobile.src;
      }

      // Ampliar el tiempo de espera en móviles ya que pueden cargar más lento
      videoTimeout = setTimeout(function () {
        if (!videoLoaded) {
          console.log("Usando fallback: video tardó demasiado en móvil");
          placeholder.style.opacity = "1";
        }
      }, 5000); // 5 segundos en lugar de 3
    }
  }

  // ...resto del código existente...
});

// Añadir esta función en el evento DOMContentLoaded

// Detectar la altura de la pantalla para gestionar la transición del video
function setupVideoTransition() {
  const videoContainer = document.querySelector(".video-container");
  const serviciosSection = document.getElementById("servicios-detalle");

  if (!videoContainer || !serviciosSection) return;

  function updateVideoVisibility() {
    // Comprobar si la sección de servicios ha salido completamente de la pantalla
    const serviciosSectionRect = serviciosSection.getBoundingClientRect();
    const isServicesSectionVisible =
      serviciosSectionRect.bottom > 0 &&
      serviciosSectionRect.top < window.innerHeight;

    // Video visible mientras la sección de servicios esté visible
    if (isServicesSectionVisible) {
      videoContainer.style.opacity = "1";
    } else if (serviciosSectionRect.top > window.innerHeight) {
      // Mantener visible cuando estamos arriba de servicios
      videoContainer.style.opacity = "1";
    } else {
      // Ocultar cuando hayamos pasado la sección de servicios
      videoContainer.style.opacity = "0";
    }
  }

  // Aplicar transición suave
  videoContainer.style.transition = "opacity 0.5s ease-out";

  // Escuchar scroll
  window.addEventListener("scroll", updateVideoVisibility);

  // Verificar estado inicial
  updateVideoVisibility();
}

// Añadir al final del archivo scripts.js
function initFloatingMenu() {
  const header = document.querySelector("header.site-header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // En móviles, ocultar al hacer scroll hacia abajo, mostrar al hacer scroll hacia arriba
    if (window.innerWidth < 768) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }
    }

    lastScrollTop = scrollTop;
  });
}

window.addEventListener("scroll", function () {
  if (window.scrollY > 100) {
    document.body.classList.add("scroll-active");
  } else {
    document.body.classList.remove("scroll-active");
  }
});
