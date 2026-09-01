/* ==========================================================================
   HEXAGEN ECOSYSTEM - INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  init3DBookTilt();
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

    // Draw connecting lines between nearby particles
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
   3. Chapter Explorer (Accordion & Real-Time Filter)
   -------------------------------------------------------------------------- */
function initChapterExplorer() {
  const searchInput = document.getElementById('chapterSearch');
  const chapterCards = document.querySelectorAll('.chapter-card');
  const partGroups = document.querySelectorAll('.chapter-part-group');

  // Accordion toggle
  chapterCards.forEach((card) => {
    const header = card.querySelector('.chapter-card-header');
    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      
      // Close other open cards in the same group optionally or leave multi-open
      card.classList.toggle('open');
    });
  });

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      partGroups.forEach((group) => {
        let hasVisibleChapters = false;
        const cards = group.querySelectorAll('.chapter-card');

        cards.forEach((card) => {
          const text = card.textContent.toLowerCase();
          if (text.includes(query)) {
            card.style.display = 'block';
            hasVisibleChapters = true;
            if (query.length > 2) {
              card.classList.add('open');
            }
          } else {
            card.style.display = 'none';
          }
        });

        group.style.display = hasVisibleChapters ? 'block' : 'none';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   4. Architecture Lab (Interactive Tabs)
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

  // Default load
  updateLab('vsa');
}

/* --------------------------------------------------------------------------
   5. PDF Preview Modal & Download Tracker
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
   6. Toast Notifications
   -------------------------------------------------------------------------- */
function initToast() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  container.id = 'toastContainer';
  document.body.appendChild(container);

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

  // Attach to copy link buttons
  document.querySelectorAll('.btn-copy-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = window.location.href.split('#')[0];
      navigator.clipboard.writeText(url).then(() => {
        showToast('¡Enlace al libro copiado al portapapeles!', '🔗');
      });
    });
  });

  // Attach to download buttons
  document.querySelectorAll('.btn-download-action').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Iniciando descarga de HexaGenPHP Guía Maestra...', '📥');
    });
  });
}

/* --------------------------------------------------------------------------
   7. Back to Top Button
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
   8. Mobile Navigation Menu
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
