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

  if (!video || !placeholder) return;

  let freezeDetected = false;
  let lastTime = 0;
  let freezeCounter = 0;
  const maxFreezes = 2; // Número máximo de intentos antes de usar fallback

  // Monitorear si el video se congela
  function checkVideoProgress() {
    if (video.currentTime === lastTime && !video.paused) {
      freezeCounter++;
      console.log("Video congelado, intento:", freezeCounter);

      if (freezeCounter >= maxFreezes) {
        console.log("Video se congela demasiado, cambiando a imagen estática");
        useFallback();
        return; // Dejar de verificar
      }

      // Intentar reiniciar el video
      video.currentTime = 0;
      video.load();
      video.play().catch((e) => {
        console.error("No se pudo reproducir el video:", e);
        useFallback();
      });
    } else {
      freezeCounter = 0; // Reiniciar contador si el video continúa
    }

    lastTime = video.currentTime;
  }

  // Función para usar fallback
  function useFallback() {
    video.style.display = "none";
    placeholder.style.opacity = "1";
    video.pause();

    // Detener el chequeo
    if (videoCheckInterval) {
      clearInterval(videoCheckInterval);
    }
  }

  // Iniciar reproducción cuando el video esté listo
  video.addEventListener("canplaythrough", function () {
    // Mostrar video gradualmente
    video.classList.remove("opacity-0");

    // Verificar si el video se está ejecutando correctamente
    let videoCheckInterval = setInterval(checkVideoProgress, 2000);

    // Detener comprobación después de 30 segundos
    setTimeout(() => {
      if (videoCheckInterval) {
        clearInterval(videoCheckInterval);
      }
    }, 30000);
  });

  // Fallar elegantemente si hay algún error
  video.addEventListener("error", function (e) {
    console.error("Error en la reproducción del video:", e);
    useFallback();
  });

  // Si el video no ha cargado en 8 segundos, usar fallback
  setTimeout(function () {
    if (video.readyState < 3) {
      // No suficientemente cargado
      console.log("El video tardó demasiado en cargar");
      useFallback();
    }
  }, 8000);

  // Añadir en la función existente Sistema mejorado de gestión de video
  window.addEventListener("scroll", function () {
    const video = document.getElementById("banner-video");
    const serviciosSection = document.getElementById("servicios-detalle");
    if (!video || !serviciosSection) return;

    // Calcular qué tan lejos ha hecho scroll el usuario
    const scrollY = window.scrollY;
    const serviciosBottom =
      serviciosSection.getBoundingClientRect().bottom + window.scrollY;

    // Solo pausar cuando hayamos pasado COMPLETAMENTE la sección de servicios
    if (scrollY > serviciosBottom) {
      if (!video.paused) {
        video.pause();
      }
    } else {
      if (video.paused && video.readyState >= 3) {
        video
          .play()
          .catch((e) => console.error("No se pudo reanudar el video:", e));
      }
    }
  });
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
