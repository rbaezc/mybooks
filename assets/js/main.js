/* ==========================================================================
   HEXAGEN ECOSYSTEM - INTERACTIVE MULTI-BOOK JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  init3DBookTilt();
  initBooksCatalog();
  initChapterExplorer();
  initArchitectureLab();
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
   3. Multi-Book Dynamic Catalog & Category Filtering
   -------------------------------------------------------------------------- */
let activeCategory = 'all';
let currentActiveBookId = 'hexagenphp-guia-maestra';

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
                  <span>Descargar PDF</span>
                </a>
                <button class="btn btn-secondary btn-sm btn-select-book" data-book-id="${book.id}">
                  <span>Ver Índice</span>
                </button>
              `
                : `
                <button class="btn btn-secondary btn-sm" style="opacity: 0.8; cursor: default;" disabled>
                  <span>${book.badge}</span>
                </button>
                <button class="btn btn-secondary btn-sm btn-select-book" data-book-id="${book.id}">
                  <span>Detalles</span>
                </button>
              `
            }
          </div>
        </div>
      `;

      catalogGrid.appendChild(card);
    });

    // Attach click listeners to "Ver Índice" buttons
    catalogGrid.querySelectorAll('.btn-select-book').forEach((btn) => {
      btn.addEventListener('click', () => {
        const bookId = btn.getAttribute('data-book-id');
        selectBookForExplorer(bookId);
      });
    });
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
          const inChapters = b.parts.some((p) =>
            p.items.some(
              (it) =>
                it.title.toLowerCase().includes(query) ||
                it.summary.toLowerCase().includes(query) ||
                it.tags.some((tg) => tg.toLowerCase().includes(query))
            )
          );
          return inTitle || inSubtitle || inTags || inDesc || inChapters;
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
   4. Dynamic Chapter Explorer (Supports switching between books)
   -------------------------------------------------------------------------- */
function selectBookForExplorer(bookId) {
  const book = HEXAGEN_BOOKS.find((b) => b.id === bookId);
  if (!book) return;

  currentActiveBookId = bookId;

  const selector = document.getElementById('bookExplorerSelect');
  if (selector) selector.value = bookId;

  renderActiveBookChapters(book);

  const explorerSection = document.getElementById('capitulos');
  if (explorerSection) {
    explorerSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function renderActiveBookChapters(book) {
  const container = document.getElementById('dynamicChaptersContainer');
  const activeBookTitle = document.getElementById('activeBookExplorerTitle');
  const activeBookDesc = document.getElementById('activeBookExplorerDesc');
  const searchInput = document.getElementById('chapterSearch');

  if (activeBookTitle) activeBookTitle.textContent = book.title;
  if (activeBookDesc) activeBookDesc.textContent = book.subtitle;
  if (searchInput) searchInput.value = '';

  if (!container) return;

  if (!book.parts || !book.parts.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed rgba(148, 163, 184, 0.3);">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 1rem;">✍️</span>
        <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem; color: #ffffff;">Temario en Proceso de Redacción</h3>
        <p style="color: var(--text-secondary); max-width: 550px; margin: 0 auto 1.5rem;">
          Este libro se encuentra actualmente en desarrollo dentro del <strong>Hexagen Ecosystem</strong>. Los capítulos detallados se publicarán próximamente.
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;">
          ${book.highlights.map((h) => `<span class="topic-pill">✨ ${h}</span>`).join('')}
        </div>
      </div>
    `;
    return;
  }

  let html = '';
  book.parts.forEach((group) => {
    html += `
      <div class="chapter-part-group">
        <div class="part-header">
          <span class="part-badge">${group.badge}</span>
          <h3 class="part-title">${group.part}</h3>
        </div>
        <div class="chapters-list">
    `;

    group.items.forEach((item) => {
      const tagsHtml = item.tags.map((t) => `<span class="topic-pill">${t}</span>`).join('');
      html += `
        <div class="chapter-card">
          <div class="chapter-card-header">
            <div class="chapter-header-left">
              <span class="chapter-number">${item.num}</span>
              <span class="chapter-title-text">${item.title}</span>
            </div>
            <span class="chapter-toggle-icon">▼</span>
          </div>
          <div class="chapter-card-body">
            <p class="chapter-summary">${item.summary}</p>
            <div class="chapter-topics-list">
              ${tagsHtml}
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Attach accordion handlers
  container.querySelectorAll('.chapter-card').forEach((card) => {
    const header = card.querySelector('.chapter-card-header');
    header.addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });
}

function initChapterExplorer() {
  const selector = document.getElementById('bookExplorerSelect');
  const searchInput = document.getElementById('chapterSearch');

  if (selector && typeof HEXAGEN_BOOKS !== 'undefined') {
    selector.innerHTML = HEXAGEN_BOOKS.map(
      (b) => `<option value="${b.id}">${b.title} (${b.badge})</option>`
    ).join('');

    selector.addEventListener('change', (e) => {
      selectBookForExplorer(e.target.value);
    });
  }

  const defaultBook = HEXAGEN_BOOKS.find((b) => b.id === currentActiveBookId) || HEXAGEN_BOOKS[0];
  if (defaultBook) {
    renderActiveBookChapters(defaultBook);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const container = document.getElementById('dynamicChaptersContainer');
      if (!container) return;

      const partGroups = container.querySelectorAll('.chapter-part-group');

      partGroups.forEach((group) => {
        let hasVisible = false;
        const cards = group.querySelectorAll('.chapter-card');

        cards.forEach((card) => {
          const text = card.textContent.toLowerCase();
          if (text.includes(query)) {
            card.style.display = 'block';
            hasVisible = true;
            if (query.length > 2) card.classList.add('open');
          } else {
            card.style.display = 'none';
          }
        });

        group.style.display = hasVisible ? 'block' : 'none';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. Architecture Lab (Interactive Tabs)
   -------------------------------------------------------------------------- */
const architectureData = {
  vsa: {
    title: 'HexaGenPHP / Vertical Slice Architecture',
    file: 'app/Slices/Orders/CreateOrder/CreateOrderHandler.php',
    code: `namespace App\\Slices\\Orders\\CreateOrder;

use HexaGen\\Core\\Attributes\\AsSlice;
use HexaGen\\Core\\Attributes\\EncryptedState;
use HexaGen\\Core\\Events\\DomainEventPublisher;

#[AsSlice(route: '/orders/create', method: 'POST')]
final class CreateOrderHandler
{
    public function __construct(
        private OrderRepositoryInterface $orders,
        private PaymentGatewayPort $payments,
        private DomainEventPublisher $events
    ) {}

    public function handle(CreateOrderDto $dto): OrderResponse
    {
        // 1. Dominio aislado & invariantes seguras
        $order = Order::create($dto->customerId, $dto->items);
        
        // 2. Transaccionalidad & Puertos
        $this->orders->save($order);
        $this->events->publish(new OrderCreatedEvent($order->id));

        return OrderResponse::fromEntity($order);
    }
}`,
    steps: [
      { num: '1', text: '<strong>Vertical Slice:</strong> Cada caso de uso (Command/Query) vive en un directorio autocontenido con su DTO, Handler y Template.' },
      { num: '2', text: '<strong>Puertos & Adaptadores:</strong> El dominio no depende de bases de datos ni frameworks externos.' },
      { num: '3', text: '<strong>Cero Acoplamiento:</strong> Modificar "CreateOrder" jamás romperá "CancelOrder" o "ListOrders".' },
      { num: '4', text: '<strong>Live Slices HTMX:</strong> UI reactiva server-rendered con estado cifrado AES-256-GCM.' }
    ]
  },
  mvc: {
    title: 'Monolito Horizontal Clásico (MVC Tradicional)',
    file: 'app/Http/Controllers/OrderController.php (Fat Controller)',
    code: `namespace App\\Http\\Controllers;

use App\\Models\\Order;
use App\\Models\\OrderItem;
use App\\Services\\PaymentService;
use App\\Mail\\OrderPlacedMail;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class OrderController extends Controller
{
    // FAT CONTROLLER: 1,200+ líneas mezclando todas las operaciones
    public function store(Request $request)
    {
        $request->validate([...]); // Validación inline
        
        DB::beginTransaction();
        try {
            $order = Order::create([...]); // Fat Model con 40 relaciones
            // Lógica de pagos acoplada a proveedor específico
            // Envío de correo directo sin bus de eventos
            DB::commit();
            return redirect()->route('orders.show', $order->id);
        } catch (\\Exception $e) {
            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }
}`,
    steps: [
      { num: '1', text: '<strong>Capas Horizontales:</strong> Modelos y controladores gigantes con miles de responsabilidades compartidas.' },
      { num: '2', text: '<strong>Efectos Secundarios Ocultos:</strong> Modificar un método en Order.php rompe reportes y APIs en otros módulos.' },
      { num: '3', text: '<strong>Fricción Operativa:</strong> Para un solo cambio hay que editar 6 carpetas distantes en el árbol de archivos.' },
      { num: '4', text: '<strong>Sobrecarga SPA:</strong> Necesidad obligatoria de duplicar modelos en TypeScript y APIs REST intermedias.' }
    ]
  }
};

function initArchitectureLab() {
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const codeTitle = document.getElementById('labCodeTitle');
  const codeContent = document.getElementById('labCodeContent');
  const diagramFlow = document.getElementById('labDiagramFlow');

  if (!tabBtns.length || !codeContent) return;

  function updateLab(type) {
    const data = architectureData[type];
    if (!data) return;

    if (codeTitle) codeTitle.textContent = data.file;
    codeContent.textContent = data.code;

    if (diagramFlow) {
      diagramFlow.innerHTML = data.steps
        .map(
          (s) => `
          <div class="diagram-flow-step">
            <span class="step-num">${s.num}</span>
            <div>${s.text}</div>
          </div>
        `
        )
        .join('');
    }
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      updateLab(btn.dataset.tab);
    });
  });

  updateLab('vsa');
}

/* --------------------------------------------------------------------------
   6. PDF Preview Modal & Download Tracker
   -------------------------------------------------------------------------- */
function initPdfModal() {
  const modal = document.getElementById('pdfModal');
  const openBtns = document.querySelectorAll('.btn-open-preview');
  const closeBtn = document.getElementById('closeModalBtn');
  const pdfFrame = document.getElementById('pdfPreviewFrame');

  if (!modal) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pdfUrl = btn.getAttribute('data-pdf-url') || 'PDFs/hexagenphp-guia-maestra.pdf';
      if (pdfFrame) {
        pdfFrame.src = pdfUrl + '#toolbar=1&navpanes=1';
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (pdfFrame) pdfFrame.src = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. Toast Notifications
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
   8. Back to Top Button
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
   9. Mobile Navigation Menu
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
