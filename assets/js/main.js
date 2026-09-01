/* ==========================================================================
   HEXAGEN ECOSYSTEM - INTERACTIVE MULTI-BOOK JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  init3DBookTilt();
  initBooksCatalog();
  initPdfModal();
  initBackToTop();
  initMobileMenu();
  initToast();
});

/* --------------------------------------------------------------------------
   1. Interactive Hexagonal Ambient Canvas Background
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 55);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#6366f1' : '#06b6d4';
      this.isHexagon = Math.random() > 0.6;
      this.hexSize = Math.random() * 8 + 6;
      this.rotation = Math.random() * Math.PI;
      this.rotSpeed = (Math.random() - 0.5) * 0.01;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotSpeed;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.isHexagon) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = this.hexSize * Math.cos(angle);
          const hy = this.hexSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.25;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.4;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#6366f1';
          ctx.globalAlpha = (1 - dist / 130) * 0.15;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* --------------------------------------------------------------------------
   2. 3D Interactive Book Tilt Physics
   -------------------------------------------------------------------------- */
function init3DBookTilt() {
  const wrapper = document.querySelector('.book-3d-wrapper');
  const book = document.querySelector('.book-3d');
  if (!wrapper || !book) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 18;
    const rotateY = ((x - centerX) / centerX) * 22;

    book.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    book.style.transform = 'rotateY(-22deg) rotateX(10deg) scale(1)';
  });
}

/* --------------------------------------------------------------------------
   3. Multi-Book Dynamic Catalog & Filtering
   -------------------------------------------------------------------------- */
let activeCategory = 'all';

function initBooksCatalog() {
  const catalogGrid = document.getElementById('catalogGrid');
  const filterBtns = document.querySelectorAll('.catalog-filter-btn');
  const globalSearchInput = document.getElementById('globalBookSearch');

  if (!catalogGrid || typeof HEXAGEN_BOOKS === 'undefined') return;

  function renderCatalog(booksToRender) {
    catalogGrid.innerHTML = '';

    if (!booksToRender.length) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">🔍 No se encontraron libros con ese criterio.</p>
          <p style="font-size: 0.9rem;">Prueba con otro término de búsqueda o selecciona otra categoría.</p>
        </div>
      `;
      return;
    }

    booksToRender.forEach((book) => {
      const isAvailable = book.status === 'available';
      const statusClass = isAvailable
        ? 'status-available'
        : book.status === 'in-development'
        ? 'status-development'
        : 'status-planned';

      const card = document.createElement('div');
      card.className = 'book-card';
      card.setAttribute('data-book-id', book.id);

      const tagsHtml = book.tags.slice(0, 4).map((t) => `<span class="tag-chip">${t}</span>`).join('');

      card.innerHTML = `
        <div class="book-card-header">
          <img src="${book.cover}" alt="Portada de ${book.title}" class="book-card-cover-img" loading="lazy">
          <span class="book-status-pill ${statusClass}">${book.badge}</span>
        </div>
        <div class="book-card-body">
          <span class="book-category-tag">${book.categoryLabel}</span>
          <h3 class="book-card-title">${book.title}</h3>
          <p class="book-card-subtitle">${book.subtitle}</p>

          <div class="book-card-specs">
            <span class="spec-badge">📄 ${book.pages}</span>
            <span class="spec-badge">💾 ${book.pdfSize}</span>
            <span class="spec-badge">🌐 ${book.language}</span>
          </div>

          <div class="book-card-tags">
            ${tagsHtml}
          </div>

          <div class="book-card-actions">
            ${
              isAvailable
                ? `
                <a href="${book.pdfUrl}" download="${book.pdfFilename}" class="btn btn-primary btn-sm btn-download-action">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Descargar</span>
                </a>
                <a href="#" class="btn btn-secondary btn-sm btn-open-preview" data-pdf-url="${book.pdfUrl}" data-pdf-title="${book.title}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>Vista Previa</span>
                </a>
              `
                : `
                <button class="btn btn-secondary btn-sm" style="opacity: 0.8; cursor: default; width: 100%;" disabled>
                  <span>${book.badge}</span>
                </button>
              `
            }
          </div>
        </div>
      `;

      catalogGrid.appendChild(card);
    });

    // Reattach PDF modal listeners for dynamic preview buttons
    initPdfModal();
  }

  function filterBooks() {
    let filtered = HEXAGEN_BOOKS;

    if (activeCategory !== 'all') {
      filtered = filtered.filter((b) => b.category === activeCategory);
    }

    if (globalSearchInput) {
      const query = globalSearchInput.value.toLowerCase().trim();
      if (query) {
        filtered = filtered.filter((b) => {
          const inTitle = b.title.toLowerCase().includes(query);
          const inSubtitle = b.subtitle.toLowerCase().includes(query);
          const inTags = b.tags.some((t) => t.toLowerCase().includes(query));
          const inDesc = b.description.toLowerCase().includes(query);
          return inTitle || inSubtitle || inTags || inDesc;
        });
      }
    }

    renderCatalog(filtered);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterBooks();
    });
  });

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', filterBooks);
  }

  renderCatalog(HEXAGEN_BOOKS);
}

/* --------------------------------------------------------------------------
   4. PDF Preview Modal & Download Tracker
   -------------------------------------------------------------------------- */
function initPdfModal() {
  const modal = document.getElementById('pdfModal');
  const openBtns = document.querySelectorAll('.btn-open-preview');
  const closeBtn = document.getElementById('closeModalBtn');
  const pdfFrame = document.getElementById('pdfPreviewFrame');
  const modalTitle = document.getElementById('modalPdfTitle');

  if (!modal) return;

  openBtns.forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      const pdfUrl = btn.getAttribute('data-pdf-url') || 'PDFs/hexagenphp-guia-maestra.pdf';
      const title = btn.getAttribute('data-pdf-title') || 'HexaGenPHP Guía Maestra';
      if (modalTitle) modalTitle.textContent = `Lector PDF: ${title}`;
      if (pdfFrame) {
        pdfFrame.src = pdfUrl + '#toolbar=1&navpanes=1';
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (pdfFrame) pdfFrame.src = '';
  }

  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }

  modal.onclick = (e) => {
    if (e.target === modal) {
      closeModal();
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Toast Notifications
   -------------------------------------------------------------------------- */
function initToast() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }

  window.showToast = function (message, icon = '✓') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  document.querySelectorAll('.btn-copy-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = window.location.href.split('#')[0];
      navigator.clipboard.writeText(url).then(() => {
        showToast('¡Enlace a la biblioteca copiado al portapapeles!', '🔗');
      });
    });
  });

  document.querySelectorAll('.btn-download-action').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Iniciando descarga del libro en PDF...', '📥');
    });
  });
}

/* --------------------------------------------------------------------------
   6. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   7. Mobile Navigation Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}
