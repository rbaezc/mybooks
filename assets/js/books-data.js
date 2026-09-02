/* ==========================================================================
   HEXAGEN ECOSYSTEM - BOOKS DATA REGISTRY
   Centralized database for all present and future books in the ecosystem.
   To add a new book, simply add a new object to the HEXAGEN_BOOKS array!
   ========================================================================== */

const HEXAGEN_BOOKS = [
  {
    id: "hexagenphp-guia-maestra",
    title: "Construyendo Software Escalable con HexaGenPHP",
    subtitle: "Vertical Slice Architecture, Hexagonal Design y Reactividad Moderna sin SPAs",
    author: "Raul Alejandro Baez Camarillo",
    status: "available", // "available" | "in-development" | "planned"
    category: "php-architecture",
    categoryLabel: "PHP & Arquitectura",
    badge: "🔥 Disponible Ahora",
    cover: "assets/images/hexagenphp-cover.jpg",
    pdfUrl: "PDFs/hexagenphp-guia-maestra.pdf",
    pdfFilename: "hexagenphp-guia-maestra.pdf",
    pdfSize: "1.13 MB",
    pages: "14 Capítulos Completos",
    year: "2026",
    language: "Español",
    isFeatured: true,
    tags: ["PHP 8.3+", "Vertical Slices", "Arquitectura Hexagonal", "HTMX Live Slices", "AES-256-GCM", "CQRS & Events", "Docker CI/CD"],
    description: "La guía definitiva de ingeniería de software para construir aplicaciones web escalables y listas para producción. Descubre cómo combinar Vertical Slice Architecture con Arquitectura Hexagonal y Live Slices reactivos con HTMX y estado cifrado.",
    highlights: [
      "Eliminación de la deuda técnica de los Fat Models y MVC horizontal",
      "Live Slices con HTMX: interactividad reactiva sin sobrecarga SPA",
      "Seguridad Zero-Trust con blindaje criptográfico AES-256-GCM en el cliente",
      "Caso real completo de SaaS transaccional de extremo a extremo"
    ],
    parts: [
      {
        part: "Parte I: Fundamentos y Filosofía Arquitectónica",
        badge: "Parte I",
        items: [
          {
            num: "Cap. 01",
            title: "La Crisis del Monolito Horizontal y la Promesa de VSA",
            summary: "Análisis profundo de la deuda técnica generada por el patrón MVC horizontal clásico: Fat Models, controladores inmanejables y dispersión de lógica. Introducción formal a Vertical Slice Architecture (VSA) y el principio de cambio aislado.",
            tags: ["MVC Tradicional vs VSA", "Baja Cohesión", "Alto Acoplamiento", "Cambio Aislado"]
          },
          {
            num: "Cap. 02",
            title: "Arquitectura Hexagonal Pragmática en PHP 8.3+",
            summary: "Implementación limpia de Puertos y Adaptadores adaptada a PHP moderno. Cómo aislar el núcleo de dominio de la infraestructura sin caer en la sobre-ingeniería ni crear capas innecesarias.",
            tags: ["Puertos y Adaptadores", "Inversión de Dependencias", "Dominio Puro", "PHP 8.3 Types"]
          },
          {
            num: "Cap. 03",
            title: "Anatomía del Framework HexaGenPHP",
            summary: "Diseño interno del motor de HexaGenPHP: Service Container compilado, pipeline de middleware PSR-15 ultrarrápido, enrutador automático de slices por atributos nativos de PHP y ciclo de vida HTTP.",
            tags: ["Core Engine", "Middleware Pipeline", "Atributos Nativos PHP", "Container DI"]
          }
        ]
      },
      {
        part: "Parte II: Desarrollo Core y Vertical Slices",
        badge: "Parte II",
        items: [
          {
            num: "Cap. 04",
            title: "Instalación, Tooling y el CLI Generador",
            summary: "Configuración del entorno de desarrollo, uso del potente CLI hexagen para generar slices automáticos, entidades, migraciones y tests con scaffolding instantáneo de alta productividad.",
            tags: ["HexaGen CLI", "Scaffolding Automático", "Composer Tooling", "Entorno Dev"]
          },
          {
            num: "Cap. 05",
            title: "Modelado del Dominio: Entities, Value Objects e Inmutabilidad",
            summary: "Patrones avanzados de Domain-Driven Design (DDD): Value Objects autocontenidos con validación intrínseca, propiedades readonly, entidades ricas con invariantes de negocio y manejo tipado.",
            tags: ["DDD", "Value Objects", "Readonly Properties", "Invariantes de Dominio"]
          },
          {
            num: "Cap. 06",
            title: "El Ciclo de Vida de un Slice: DTOs, Validadores y Handlers",
            summary: "Desglose del flujo de ejecución en una rebanada vertical: mapeo de Request a DTO tipado, validación declarativa con atributos, Handlers de responsabilidad única y respuestas estructuradas.",
            tags: ["Command / Query DTOs", "Single Responsibility", "Validation Attributes", "Handler Pattern"]
          },
          {
            num: "Cap. 07",
            title: "Persistencia Desacoplada, Repositorios y Transaccionalidad",
            summary: "Estrategias de persistencia desacoplada utilizando interfaces de repositorio en el dominio e implementaciones optimizadas con PDO nativo o Doctrine. Gestión de transacciones ACID y Unit of Work.",
            tags: ["Repository Pattern", "Transacciones ACID", "Unit of Work", "PDO / SQL Optimizado"]
          }
        ]
      },
      {
        part: "Parte III: Reactividad, Seguridad y Eventos Avanzados",
        badge: "Parte III",
        items: [
          {
            num: "Cap. 08",
            title: "Live Slices y UI Reactiva con HTMX",
            summary: "Creación de interfaces dinámicas y en tiempo real sin salir de PHP. Uso de Live Slices impulsadas por HTMX, swaps parciales del DOM, eventos en cliente y eliminación de dependencias complejas.",
            tags: ["HTMX", "Live Slices", "DOM Swapping", "Zero-SPA Overhead"]
          },
          {
            num: "Cap. 09",
            title: "Criptografía en el Cliente: Blindaje AES-256-GCM del Estado",
            summary: "Seguridad de nivel militar en el cliente: cómo HexaGenPHP cifra y firma criptográficamente el estado del componente mediante AES-256-GCM y OpenSSL, impidiendo la alteración de parámetros.",
            tags: ["AES-256-GCM", "OpenSSL", "Zero-Trust State", "Anti-Tampering"]
          },
          {
            num: "Cap. 10",
            title: "Arquitectura Guiada por Eventos (Domain Events y Event Bus)",
            summary: "Desacoplamiento total de efectos secundarios mediante Eventos de Dominio. Publicación sincrónica y asincrónica con Event Bus, integración con colas y mensajería en segundo plano.",
            tags: ["Domain Events", "Event Bus", "Colas Asíncronas", "Event-Driven Architecture"]
          },
          {
            num: "Cap. 11",
            title: "APIs Híbridas: Unificando Web y Mobile en un solo Slice",
            summary: "Cómo un mismo Vertical Slice responde automáticamente con fragmentos HTML enriquecidos para la web o con JSON tipado para aplicaciones móviles (Flutter/iOS/Android) y servicios de integración.",
            tags: ["Content Negotiation", "Hybrid Slices", "Mobile JSON APIs", "Single Codebase"]
          }
        ]
      },
      {
        part: "Parte IV: Producción, Escala y Proyecto Enterprise",
        badge: "Parte IV",
        items: [
          {
            num: "Cap. 12",
            title: "Multi-Tenancy y Seguridad Avanzada (RBAC y Permisos)",
            summary: "Implementación de multi-inquilino seguro a nivel de base de datos y esquema, control de acceso basado en roles (RBAC) granular, políticas de autorización dinámicas y protección contra brechas.",
            tags: ["Multi-Tenancy", "RBAC", "Aislamiento de Inquilinos", "Auditoría de Seguridad"]
          },
          {
            num: "Cap. 13",
            title: "Proyecto Completo de Extremo a Extremo (SaaS Transaccional)",
            summary: "Construcción paso a paso de un SaaS real en producción: suscripciones transaccionales, panel de control en tiempo real, facturación con pasarelas de pago y gestión de eventos de extremo a extremo.",
            tags: ["SaaS Enterprise", "Pasarelas de Pago", "Flujos Transaccionales", "End-to-End Real"]
          },
          {
            num: "Cap. 14",
            title: "Testing Automatizado, Dockerización, CI/CD y Rendimiento",
            summary: "Estrategias de pruebas unitarias y de integración para slices con Pest y PHPUnit, contenedor Docker multi-stage optimizado para producción, pipeline de CI/CD en GitHub Actions y afinamiento de OPcache/JIT.",
            tags: ["Pest / PHPUnit", "Docker Multi-Stage", "GitHub Actions CI/CD", "OPcache & JIT Tuning"]
          }
        ]
      }
    ]
  },
  {
    id: "hexagen-microservicios-es",
    title: "HexaGen: Microservicios y Slices Distribuidos",
    subtitle: "Event-Driven Architecture, CQRS a Escala y Consistencia Eventual",
    author: "Raul Alejandro Baez Camarillo",
    status: "available",
    category: "distributed",
    categoryLabel: "Sistemas Distribuidos",
    badge: "🔥 Disponible Ahora",
    cover: "assets/images/hexagen-microservicios-cover.jpg",
    pdfUrl: "PDFs/hexagen-microservicios-es.pdf",
    pdfFilename: "hexagen-microservicios-es.pdf",
    epubUrl: "Epubs/hexagen-microservicios-es.epub",
    pdfSize: "1.00 MB",
    pages: "12 Capítulos Completos",
    year: "2026",
    language: "Español",
    isFeatured: false,
    tags: ["Sistemas Distribuidos", "Event-Driven", "Kafka", "RabbitMQ", "CQRS a Escala", "Outbox Pattern", "Sagas", "gRPC", "Zero-Trust"],
    description: "La guía definitiva para transformar monolitos VSA en microservicios autónomos y resilientes basados en eventos. Domina CQRS a escala, el patrón Transactional Outbox, Sagas orquestadas, gRPC, Event Sourcing y observabilidad distribuida con OpenTelemetry.",
    highlights: [
      "Transición controlada de Slices locales a Slices asíncronos distribuidos",
      "Garantía de entrega y consistencia con Transactional Outbox Pattern",
      "Orquestación y Coreografía de Sagas transaccionales con compensación",
      "Observabilidad distribuida con OpenTelemetry, Jaeger y Prometheus"
    ],
    parts: []
  },
  {
    id: "hexagen-microservices-en",
    title: "HexaGen: Microservices and Distributed Slices",
    subtitle: "Event-Driven Architecture, CQRS at Scale, and Eventual Consistency",
    author: "Raul Alejandro Baez Camarillo",
    status: "available",
    category: "distributed",
    categoryLabel: "Distributed Systems",
    badge: "🔥 Available Now",
    cover: "assets/images/hexagen-microservices-en-cover.jpg",
    pdfUrl: "PDFs/hexagen-microservices-en.pdf",
    pdfFilename: "hexagen-microservices-en.pdf",
    epubUrl: "Epubs/hexagen-microservices-en.epub",
    pdfSize: "1.00 MB",
    pages: "12 Complete Chapters",
    year: "2026",
    language: "English",
    isFeatured: false,
    tags: ["Distributed Systems", "Event-Driven", "Apache Kafka", "RabbitMQ", "CQRS at Scale", "Outbox Pattern", "Sagas", "gRPC", "Zero-Trust"],
    description: "The authoritative guide to decomposing VSA monoliths into autonomous, event-driven microservices. Master CQRS at scale, the Transactional Outbox pattern, orchestrated Sagas, gRPC, Event Sourcing, and distributed observability with OpenTelemetry.",
    highlights: [
      "Controlled transition from monolithic Vertical Slices to asynchronous distributed slices",
      "Guaranteed At-Least-Once delivery with the Transactional Outbox Pattern",
      "Distributed transaction orchestration and choreography with compensating Sagas",
      "End-to-end distributed observability with OpenTelemetry, Jaeger, and Prometheus"
    ],
    parts: []
  },
  {
    id: "hexagen-htmx-reactive",
    title: "Live Slices & HTMX Reactivo Avanzado",
    subtitle: "Patrones de Reactividad Server-Driven, Streaming y Tiempo Real",
    author: "Raul Alejandro Baez Camarillo",
    status: "in-development",
    category: "reactive",
    categoryLabel: "Reactividad & HTMX",
    badge: "✨ Próximamente",
    cover: "assets/images/favicon.svg",
    pdfUrl: null,
    pdfFilename: null,
    pdfSize: "Próximamente",
    pages: "10 Capítulos",
    year: "2026",
    language: "Español",
    isFeatured: false,
    tags: ["HTMX 2.0", "Server-Sent Events (SSE)", "WebSockets", "Optimistic UI", "Zero-Node Tooling"],
    description: "Aprende a construir interfaces web altamente dinámicas, dashboards en tiempo real, validaciones instantáneas y micro-interacciones fluidas sin escribir una sola línea de frameworks JavaScript pesados.",
    highlights: [
      "Streaming de datos en tiempo real con SSE nativo y PHP",
      "Patrones de interfaz optimista (Optimistic UI) impulsados por el servidor",
      "Manejo de caché parcial del DOM e invalidaciones inteligentes",
      "Eliminación de la sobrecarga de dependencias Node.js"
    ],
    parts: []
  },
  {
    id: "hexagen-crypto-security",
    title: "Criptografía de Estado & Seguridad Zero-Trust",
    subtitle: "Blindaje Criptográfico de Componentes Web y Arquitectura Defensiva",
    author: "Raul Alejandro Baez Camarillo",
    status: "planned",
    category: "security",
    categoryLabel: "Seguridad & Cripto",
    badge: "🛡️ Planificado",
    cover: "assets/images/favicon.svg",
    pdfUrl: null,
    pdfFilename: null,
    pdfSize: "Planificado",
    pages: "8 Capítulos",
    year: "2026",
    language: "Español",
    isFeatured: false,
    tags: ["AES-256-GCM", "ED25519", "Zero-Trust", "Anti-Tampering", "Rotación de Claves", "AppSec"],
    description: "Manual de ingeniería sobre seguridad profunda y criptografía aplicada en aplicaciones web modernas: protección contra manipulación de estado en cliente, firmas asimétricas y rotación segura de secretos.",
    highlights: [
      "Cifrado autenticado AES-256-GCM con vectores de inicialización dinámicos",
      "Firmas digitales ED25519 para intercambio de mensajes entre micro-slices",
      "Prevención avanzada contra Parameter Tampering y replay attacks",
      "Arquitectura de claves rotativas con OpenSSL y HSMs"
    ],
    parts: []
  }
];
