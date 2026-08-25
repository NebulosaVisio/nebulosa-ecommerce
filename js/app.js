/* ============================================================
   NEBULOSA E-COMMERCE — Application Engine
   Version: 3.0.0
   Pure vanilla JS · No dependencies · JSON-driven
   ============================================================ */
;(function () {
  'use strict';

  // ============================================================
  // === STATE ===
  // ============================================================
  const state = {
    config: null,
    products: [],
    filtered: [],
    currentCategory: 'all',
    currentSubcategory: null,
    currentPage: 1,
    perPage: 24,
    searchQuery: '',
    sortBy: 'az',
    cart: [],
    isCartOpen: false,
    isMobileMenuOpen: false,
  };

  // Known non-category hashes (used for scroll anchors, not filtering)
  const RESERVED_HASHES = ['catalogo', 'hero', 'contato', 'sobre', ''];

  // ============================================================
  // === UTILS ===
  // ============================================================
  const Utils = {
    escapeHtml(str) {
      const el = document.createElement('span');
      el.textContent = str;
      return el.innerHTML;
    },
    slugify(str) {
      return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    },
    debounce(fn, ms) {
      let t;
      return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); };
    },
    getUrlParam(key) {
      return new URLSearchParams(window.location.search).get(key);
    },
    getCategoryName(id) {
      if (!state.config || !state.config.categorias) return id;
      const cat = state.config.categorias.find(c => c.id === id);
      return cat ? cat.nome : id;
    },
    getCategoryIcon(id) {
      if (!state.config || !state.config.categorias) return '';
      const cat = state.config.categorias.find(c => c.id === id);
      return cat ? cat.icone : '';
    },
    formatSubcategory(sub) {
      return sub.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
  };

  // ============================================================
  // === SVG ICON LIBRARY ===
  // ============================================================
  const Icons = {
    _map: {
      zap: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
      cable: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><polyline points="17 7 12 2 7 7"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
      battery: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>',
      shield: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      radio: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>',
      truck: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
      'credit-card': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      headphones: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
      list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
      phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      'map-pin': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    },
    get(name) {
      return this._map[name] || '';
    },
  };

  // ============================================================
  // === TOAST ===
  // ============================================================
  const Toast = {
    show(message, type = 'info', duration = 3000) {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'toast toast--' + type;
      toast.textContent = message;
      container.appendChild(toast);
      requestAnimationFrame(() => { requestAnimationFrame(() => { toast.classList.add('show'); }); });
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, duration);
    },
  };

  // ============================================================
  // === CONFIG LOADER ===
  // ============================================================
  const ConfigLoader = {
    async load() {
      try {
        const res = await fetch('data/config.json');
        if (!res.ok) throw new Error('config.json not found');
        state.config = await res.json();
      } catch (e) {
        console.warn('[Config] Failed to load config.json:', e);
        state.config = {};
      }
    },

    apply() {
      const cfg = state.config;
      if (!cfg) return;

      // Apply branding CSS vars
      if (cfg.branding) {
        const r = document.documentElement.style;
        if (cfg.branding.corPrimaria) r.setProperty('--primary', cfg.branding.corPrimaria);
        if (cfg.branding.corAcento) r.setProperty('--accent', cfg.branding.corAcento);
        if (cfg.branding.corAcentoHover) r.setProperty('--accent-hover', cfg.branding.corAcentoHover);
      }

      // Logo text
      if (cfg.empresa) {
        const logos = document.querySelectorAll('.site-header__logo, .site-footer__logo');
        logos.forEach(el => {
          if (el.tagName === 'A') {
            el.innerHTML = Utils.escapeHtml(cfg.empresa.nome) + '<span class="logo-dot"></span>';
          } else {
            el.innerHTML = Utils.escapeHtml(cfg.empresa.nome) + '<span class="logo-dot"></span>';
          }
        });
      }

      // Trust bar
      this._renderTrustBar();

      // Hero stats
      this._renderHeroStats();

      // About stats
      this._renderAboutStats();

      // Footer
      this._renderFooter();

      // WhatsApp links
      this._applyWhatsAppLinks();

      // Footer year
      const yearEl = document.getElementById('footer-year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    },

    _renderTrustBar() {
      const container = document.getElementById('trust-bar-items');
      if (!container || !state.config.trust) return;
      container.innerHTML = state.config.trust.map(item =>
        '<div class="trust-bar__item">' +
          Icons.get(item.icone) +
          '<span><strong>' + Utils.escapeHtml(item.destaque) + '</strong> — ' + Utils.escapeHtml(item.texto) + '</span>' +
        '</div>'
      ).join('');
    },

    _renderHeroStats() {
      const container = document.getElementById('hero-stats');
      if (!container || !state.config.stats) return;
      container.innerHTML = state.config.stats.map(s =>
        '<div class="hero__stat">' +
          '<div class="hero__stat-value">' + Utils.escapeHtml(s.valor) + '</div>' +
          '<div class="hero__stat-label">' + Utils.escapeHtml(s.label) + '</div>' +
        '</div>'
      ).join('');
    },

    _renderAboutStats() {
      const container = document.getElementById('about-stats');
      if (!container || !state.config.stats) return;
      container.innerHTML = state.config.stats.map(s =>
        '<div class="about-stat reveal">' +
          '<div class="about-stat__value">' + Utils.escapeHtml(s.valor) + '</div>' +
          '<div class="about-stat__label">' + Utils.escapeHtml(s.label) + '</div>' +
        '</div>'
      ).join('');
    },

    _renderFooter() {
      const cfg = state.config;

      // Footer desc
      const descEl = document.getElementById('footer-desc');
      if (descEl && cfg.empresa) descEl.textContent = cfg.empresa.descricao || cfg.empresa.descricaoCurta || '';

      // Footer categories
      const catEl = document.getElementById('footer-categories');
      if (catEl && cfg.categorias) {
        catEl.innerHTML = cfg.categorias.map(c =>
          '<li><a href="produtos.html?cat=' + encodeURIComponent(c.id) + '">' + Utils.escapeHtml(c.nome) + '</a></li>'
        ).join('');
      }

      // Footer contact
      const contactEl = document.getElementById('footer-contact');
      if (contactEl && cfg.contato) {
        let html = '';
        if (cfg.contato.telefone) {
          html += '<div class="site-footer__contact-item">' + Icons.get('phone') + '<a href="tel:' + cfg.contato.telefone.replace(/\D/g,'') + '">' + Utils.escapeHtml(cfg.contato.telefone) + '</a></div>';
        }
        if (cfg.contato.email) {
          html += '<div class="site-footer__contact-item">' + Icons.get('mail') + '<a href="mailto:' + Utils.escapeHtml(cfg.contato.email) + '">' + Utils.escapeHtml(cfg.contato.email) + '</a></div>';
        }
        if (cfg.contato.endereco) {
          html += '<div class="site-footer__contact-item">' + Icons.get('map-pin') + '<span>' + Utils.escapeHtml(cfg.contato.endereco) + '</span></div>';
        }
        contactEl.innerHTML = html;
      }
    },

    _applyWhatsAppLinks() {
      const cfg = state.config;
      if (!cfg.contato || !cfg.contato.whatsapp) return;
      const wa = cfg.contato.whatsapp;
      const msg = cfg.whatsappMensagem || 'Olá! Gostaria de mais informações.';

      const selectors = ['#whatsapp-float', '#cta-whatsapp', '#contact-whatsapp', '#mobile-whatsapp'];
      selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg);
      });
    },
  };

  // ============================================================
  // === PRODUCT RENDERER ===
  // ============================================================
  const ProductRenderer = {
    placeholderSVG: '<svg viewBox="0 0 80 80" fill="none" style="width:64px;height:64px"><rect x="14" y="62" width="52" height="6" rx="3" fill="#94a3b8"/><path d="M24 62V28c0-1.5 1.2-2.7 2.7-2.7h26.6c1.5 0 2.7 1.2 2.7 2.7v34" stroke="#94a3b8" stroke-width="2"/><circle cx="40" cy="18" r="6" stroke="#FF6B2C" stroke-width="2" fill="none"/><line x1="40" y1="24" x2="40" y2="28" stroke="#FF6B2C" stroke-width="2"/><line x1="28" y1="38" x2="52" y2="38" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/><line x1="28" y1="46" x2="48" y2="46" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/><line x1="28" y1="54" x2="50" y2="54" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round"/></svg>',

    cardHTML(product) {
      const catName = Utils.getCategoryName(product.categoria);
      return (
        '<article class="product-card" data-product-id="' + Utils.escapeHtml(product.id) + '">' +
          '<div class="product-card__image">' +
            '<div class="product-card__placeholder">' + this.placeholderSVG + '</div>' +
            '<span class="product-card__badge">' + Utils.escapeHtml(catName) + '</span>' +
          '</div>' +
          '<div class="product-card__body">' +
            '<h3 class="product-card__title">' + Utils.escapeHtml(product.nome) + '</h3>' +
            '<p class="product-card__desc">' + Utils.escapeHtml(product.descricaoCurta || '') + '</p>' +
          '</div>' +
          '<div class="product-card__footer">' +
            '<a href="produto.html?id=' + encodeURIComponent(product.id) + '" class="product-card__link">Ver detalhes →</a>' +
            '<button class="product-card__add-btn" data-id="' + Utils.escapeHtml(product.id) + '" aria-label="Adicionar ' + Utils.escapeHtml(product.nome) + ' ao orçamento">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
              'Adicionar' +
            '</button>' +
          '</div>' +
        '</article>'
      );
    },

    renderGrid(products) {
      const grid = document.getElementById('product-grid');
      if (!grid) return;

      if (products.length === 0) {
        grid.innerHTML =
          '<div class="empty-state">' +
            '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
            '<h3>Nenhum produto encontrado</h3>' +
            '<p>Tente buscar com outros termos ou limpe os filtros.</p>' +
          '</div>';
        return;
      }

      grid.innerHTML = products.map(p => this.cardHTML(p)).join('');
    },
  };

  // ============================================================
  // === SEARCH & FILTER ===
  // ============================================================
  const SearchFilter = {
    init() {
      // Desktop search
      const searchInput = document.getElementById('header-search');
      const clearBtn = document.getElementById('search-clear');
      if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce(() => {
          state.searchQuery = searchInput.value.trim().toLowerCase();
          state.currentPage = 1;
          if (clearBtn) clearBtn.classList.toggle('hidden', !state.searchQuery);
          this.filterAndRender();
        }, 250));
      }
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          state.searchQuery = '';
          state.currentPage = 1;
          clearBtn.classList.add('hidden');
          this.filterAndRender();
        });
      }

      // Mobile search
      const mobileSearch = document.getElementById('mobile-search');
      if (mobileSearch) {
        mobileSearch.addEventListener('input', Utils.debounce(() => {
          state.searchQuery = mobileSearch.value.trim().toLowerCase();
          state.currentPage = 1;
          if (searchInput) searchInput.value = mobileSearch.value;
          this.filterAndRender();
        }, 250));
      }

      // Sort
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', () => {
          state.sortBy = sortSelect.value;
          state.currentPage = 1;
          this.filterAndRender();
        });
      }

      // Product grid click delegation
      const grid = document.getElementById('product-grid');
      if (grid) {
        grid.addEventListener('click', e => {
          const btn = e.target.closest('.product-card__add-btn');
          if (btn) {
            e.preventDefault();
            Cart.add(btn.getAttribute('data-id'));
          }
        });
      }
    },

    filterAndRender() {
      let results = state.products;

      // Category filter
      if (state.currentCategory && state.currentCategory !== 'all') {
        results = results.filter(p => p.categoria === state.currentCategory);
      }

      // Subcategory filter
      if (state.currentSubcategory) {
        results = results.filter(p => p.subcategoria === state.currentSubcategory);
      }

      // Search filter
      if (state.searchQuery) {
        const q = state.searchQuery;
        results = results.filter(p => {
          const haystack = [
            p.nome,
            p.descricaoCurta || '',
            p.categoria || '',
            p.subcategoria || '',
            ...(p.tags || []),
          ].join(' ').toLowerCase();
          return haystack.includes(q);
        });
      }

      // Sort
      results = [...results];
      switch (state.sortBy) {
        case 'az':
          results.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
          break;
        case 'za':
          results.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));
          break;
        case 'categoria':
          results.sort((a, b) => (a.categoria || '').localeCompare(b.categoria || '', 'pt-BR'));
          break;
      }

      state.filtered = results;

      // Paginate
      const total = results.length;
      const totalPages = Math.max(1, Math.ceil(total / state.perPage));
      if (state.currentPage > totalPages) state.currentPage = totalPages;
      const start = (state.currentPage - 1) * state.perPage;
      const page = results.slice(start, start + state.perPage);

      // Render
      ProductRenderer.renderGrid(page);
      this._renderResultsCount(total);
      this._renderPagination(totalPages);
      CategoryBar.updateActivePill();
      SubcategoryBar.render();
    },

    _renderResultsCount(total) {
      const el = document.getElementById('results-count');
      if (!el) return;
      const catName = state.currentCategory === 'all' ? 'todos os produtos' : Utils.getCategoryName(state.currentCategory);
      el.textContent = total + ' produto' + (total !== 1 ? 's' : '') + ' em ' + catName;
    },

    _renderPagination(totalPages) {
      const container = document.getElementById('pagination');
      if (!container) return;
      if (totalPages <= 1) { container.innerHTML = ''; return; }

      let html = '';
      // Prev
      html += '<button class="pagination__btn" data-page="' + (state.currentPage - 1) + '"' + (state.currentPage <= 1 ? ' disabled' : '') + '>‹</button>';

      // Pages
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= state.currentPage - 1 && i <= state.currentPage + 1)) {
          html += '<button class="pagination__btn' + (i === state.currentPage ? ' pagination__btn--active' : '') + '" data-page="' + i + '">' + i + '</button>';
        } else if (i === state.currentPage - 2 || i === state.currentPage + 2) {
          html += '<span class="pagination__ellipsis">…</span>';
        }
      }

      // Next
      html += '<button class="pagination__btn" data-page="' + (state.currentPage + 1) + '"' + (state.currentPage >= totalPages ? ' disabled' : '') + '>›</button>';

      container.innerHTML = html;

      // Click handler
      container.addEventListener('click', e => {
        const btn = e.target.closest('.pagination__btn');
        if (!btn || btn.disabled) return;
        const page = parseInt(btn.getAttribute('data-page'));
        if (page >= 1 && page <= totalPages) {
          state.currentPage = page;
          this.filterAndRender();
          document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },
  };

  // ============================================================
  // === CART ===
  // ============================================================
  const Cart = {
    STORAGE_KEY: 'nebulosa_cart',

    load() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        state.cart = saved ? JSON.parse(saved) : [];
      } catch { state.cart = []; }
      this._updateBadge();
      this._render();
    },

    save() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state.cart));
    },

    add(productId) {
      const existing = state.cart.find(i => i.id === productId);
      if (existing) {
        existing.qty++;
      } else {
        state.cart.push({ id: productId, qty: 1 });
      }
      this.save();
      this._updateBadge(true);
      this._render();
      Toast.show('Produto adicionado ao orçamento!', 'success');
    },

    remove(productId) {
      state.cart = state.cart.filter(i => i.id !== productId);
      this.save();
      this._updateBadge();
      this._render();
    },

    updateQuantity(productId, delta) {
      const item = state.cart.find(i => i.id === productId);
      if (!item) return;
      item.qty = Math.max(1, item.qty + delta);
      this.save();
      this._render();
    },

    toggle() {
      state.isCartOpen ? this.close() : this.open();
    },

    open() {
      state.isCartOpen = true;
      document.getElementById('cart-overlay')?.classList.add('open');
      document.getElementById('cart-drawer')?.classList.add('open');
      document.body.style.overflow = 'hidden';
      this._render();
    },

    close() {
      state.isCartOpen = false;
      document.getElementById('cart-overlay')?.classList.remove('open');
      document.getElementById('cart-drawer')?.classList.remove('open');
      document.body.style.overflow = '';
    },

    _updateBadge(animate) {
      const badge = document.getElementById('cart-badge');
      if (!badge) return;
      const count = state.cart.reduce((sum, i) => sum + i.qty, 0);
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
      if (animate && count > 0) {
        badge.classList.remove('bump');
        void badge.offsetWidth;
        badge.classList.add('bump');
      }
    },

    _render() {
      const body = document.getElementById('cart-items');
      const totalEl = document.getElementById('cart-total-count');
      const sendBtn = document.getElementById('cart-send-btn');
      if (!body) return;

      if (state.cart.length === 0) {
        body.innerHTML =
          '<div class="cart-empty">' +
            '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
            '<p>Seu orçamento está vazio</p>' +
            '<span>Adicione produtos para solicitar um orçamento.</span>' +
          '</div>';
        if (totalEl) totalEl.textContent = '0 itens';
        if (sendBtn) sendBtn.disabled = true;
        return;
      }

      body.innerHTML = state.cart.map(item => {
        const product = state.products.find(p => p.id === item.id);
        if (!product) return '';
        const catName = Utils.getCategoryName(product.categoria);
        return (
          '<div class="cart-item">' +
            '<div class="cart-item__info">' +
              '<div class="cart-item__name">' + Utils.escapeHtml(product.nome) + '</div>' +
              '<div class="cart-item__category">' + Utils.escapeHtml(catName) + '</div>' +
            '</div>' +
            '<div class="cart-item__controls">' +
              '<button class="cart-item__qty-btn" data-id="' + Utils.escapeHtml(item.id) + '" data-action="decrease" aria-label="Diminuir quantidade">−</button>' +
              '<span class="cart-item__qty">' + item.qty + '</span>' +
              '<button class="cart-item__qty-btn" data-id="' + Utils.escapeHtml(item.id) + '" data-action="increase" aria-label="Aumentar quantidade">+</button>' +
            '</div>' +
            '<button class="cart-item__remove" data-id="' + Utils.escapeHtml(item.id) + '" aria-label="Remover item">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>'
        );
      }).join('');

      const totalCount = state.cart.reduce((s, i) => s + i.qty, 0);
      if (totalEl) totalEl.textContent = totalCount + ' ite' + (totalCount === 1 ? 'm' : 'ns');
      if (sendBtn) sendBtn.disabled = false;
    },

    initDrawer() {
      // Create overlay
      if (!document.getElementById('cart-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'cart-overlay';
        overlay.className = 'cart-overlay';
        overlay.addEventListener('click', () => this.close());
        document.body.appendChild(overlay);
      }

      // Create drawer
      if (!document.getElementById('cart-drawer')) {
        const drawer = document.createElement('div');
        drawer.id = 'cart-drawer';
        drawer.className = 'cart-drawer';
        drawer.innerHTML =
          '<div class="cart-drawer__header">' +
            '<h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Orçamento</h3>' +
            '<button class="cart-drawer__close" id="cart-close-btn" aria-label="Fechar carrinho">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="cart-drawer__body" id="cart-items"></div>' +
          '<div class="cart-drawer__footer">' +
            '<div class="cart-drawer__total"><span>Total:</span><strong id="cart-total-count">0 itens</strong></div>' +
            '<button class="btn btn-whatsapp btn-full btn-lg" id="cart-send-btn" disabled>' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.111.553 4.093 1.516 5.814L0 24l6.335-1.652A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>' +
              'Enviar Orçamento via WhatsApp' +
            '</button>' +
          '</div>';
        document.body.appendChild(drawer);

        // Bind close
        document.getElementById('cart-close-btn').addEventListener('click', () => this.close());

        // Bind send
        document.getElementById('cart-send-btn').addEventListener('click', () => this.sendWhatsApp());

        // Bind item actions
        document.getElementById('cart-items').addEventListener('click', e => {
          const qtyBtn = e.target.closest('.cart-item__qty-btn');
          if (qtyBtn) {
            const id = qtyBtn.getAttribute('data-id');
            const action = qtyBtn.getAttribute('data-action');
            if (action === 'increase') this.updateQuantity(id, 1);
            else if (action === 'decrease') this.updateQuantity(id, -1);
            return;
          }
          const removeBtn = e.target.closest('.cart-item__remove');
          if (removeBtn) this.remove(removeBtn.getAttribute('data-id'));
        });
      }
    },

    sendWhatsApp() {
      if (state.cart.length === 0) return;
      const cfg = state.config || {};
      const wa = (cfg.contato && cfg.contato.whatsapp) || '551121414999';
      let msg = cfg.whatsappMensagem || 'Olá! Gostaria de solicitar um orçamento:\n\n';

      state.cart.forEach(item => {
        const product = state.products.find(p => p.id === item.id);
        if (product) {
          msg += '• ' + product.nome + ' (x' + item.qty + ')\n';
        }
      });

      msg += '\nAguardo retorno. Obrigado!';
      window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(msg), '_blank');
    },
  };

  // ============================================================
  // === CATEGORY BAR ===
  // ============================================================
  const CategoryBar = {
    init() {
      const container = document.getElementById('category-pills');
      if (!container || !state.config || !state.config.categorias) return;

      // Count products per category
      const counts = { all: state.products.length };
      state.config.categorias.forEach(c => {
        counts[c.id] = state.products.filter(p => p.categoria === c.id).length;
      });

      let html =
        '<button class="category-pill active" data-category="all">' +
          Icons.get('list') + ' Todos <span class="category-pill__count">' + counts.all + '</span>' +
        '</button>';

      state.config.categorias.forEach(cat => {
        html +=
          '<button class="category-pill" data-category="' + Utils.escapeHtml(cat.id) + '">' +
            Icons.get(cat.icone) + ' ' + Utils.escapeHtml(cat.nome) +
            ' <span class="category-pill__count">' + (counts[cat.id] || 0) + '</span>' +
          '</button>';
      });

      container.innerHTML = html;

      // Click handler
      container.addEventListener('click', e => {
        const pill = e.target.closest('.category-pill');
        if (!pill) return;
        state.currentCategory = pill.getAttribute('data-category');
        state.currentSubcategory = null;
        state.currentPage = 1;
        if (state.currentCategory === 'all') {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } else {
          history.replaceState(null, '', window.location.pathname + window.location.search + '#' + state.currentCategory);
        }
        SearchFilter.filterAndRender();
      });
    },

    updateActivePill() {
      const pills = document.querySelectorAll('.category-pill');
      pills.forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-category') === state.currentCategory);
      });
    },
  };

  // ============================================================
  // === SUBCATEGORY BAR ===
  // ============================================================
  const SubcategoryBar = {
    render() {
      let container = document.getElementById('subcategory-bar');

      // If no category selected or 'all', hide subcategories
      if (!state.currentCategory || state.currentCategory === 'all' || !state.config || !state.config.categorias) {
        if (container) container.classList.add('hidden');
        return;
      }

      // Find the active category config
      const catConfig = state.config.categorias.find(c => c.id === state.currentCategory);
      if (!catConfig || !catConfig.subcategorias || catConfig.subcategorias.length === 0) {
        if (container) container.classList.add('hidden');
        return;
      }

      // Create container if it doesn't exist
      if (!container) {
        container = document.createElement('div');
        container.id = 'subcategory-bar';
        container.className = 'subcategory-bar';
        const categoryBar = document.getElementById('category-bar');
        if (categoryBar) {
          categoryBar.after(container);
        }
      }

      // Count products per subcategory within current category
      const catProducts = state.products.filter(p => p.categoria === state.currentCategory);

      let html = '<div class="container"><div class="subcategory-bar__scroll">';
      html += '<button class="subcategory-pill' + (!state.currentSubcategory ? ' active' : '') + '" data-subcategory="">Todas</button>';

      catConfig.subcategorias.forEach(sub => {
        const count = catProducts.filter(p => p.subcategoria === sub.id).length;
        if (count === 0) return; // Hide empty subcategories
        const isActive = state.currentSubcategory === sub.id;
        html += '<button class="subcategory-pill' + (isActive ? ' active' : '') + '" data-subcategory="' + Utils.escapeHtml(sub.id) + '">' +
          Utils.escapeHtml(sub.nome) + ' <span class="subcategory-pill__count">' + count + '</span></button>';
      });

      html += '</div></div>';
      container.innerHTML = html;
      container.classList.remove('hidden');

      // Click handler (re-bind each render since innerHTML replaces content)
      container.addEventListener('click', e => {
        const pill = e.target.closest('.subcategory-pill');
        if (!pill) return;
        const sub = pill.getAttribute('data-subcategory');
        state.currentSubcategory = sub || null;
        state.currentPage = 1;
        SearchFilter.filterAndRender();
      });
    },
  };

  // ============================================================
  // === HEADER ===
  // ============================================================
  const Header = {
    init() {
      const header = document.getElementById('site-header');
      if (header) {
        let ticking = false;
        window.addEventListener('scroll', () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              header.classList.toggle('scrolled', window.scrollY > 30);
              ticking = false;
            });
            ticking = true;
          }
        }, { passive: true });
        header.classList.toggle('scrolled', window.scrollY > 30);
      }

      // Cart toggle
      const cartToggle = document.getElementById('cart-toggle');
      if (cartToggle) {
        cartToggle.addEventListener('click', e => { e.preventDefault(); Cart.toggle(); });
      }

      // Mobile menu
      const menuToggle = document.getElementById('mobile-menu-toggle');
      if (menuToggle) {
        menuToggle.addEventListener('click', e => { e.preventDefault(); MobileMenu.toggle(); });
      }
    },
  };

  // ============================================================
  // === MOBILE MENU ===
  // ============================================================
  const MobileMenu = {
    init() {
      const overlay = document.getElementById('mobile-overlay');
      if (overlay) overlay.addEventListener('click', () => this.close());

      const closeBtn = document.getElementById('mobile-menu-close');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      // Close on link click
      const menu = document.getElementById('mobile-menu');
      if (menu) {
        menu.addEventListener('click', e => {
          if (e.target.tagName === 'A' && !e.target.classList.contains('btn')) this.close();
        });
      }
    },

    toggle() {
      state.isMobileMenuOpen ? this.close() : this.open();
    },

    open() {
      state.isMobileMenuOpen = true;
      document.getElementById('mobile-menu')?.classList.add('open');
      document.getElementById('mobile-overlay')?.classList.add('open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      state.isMobileMenuOpen = false;
      document.getElementById('mobile-menu')?.classList.remove('open');
      document.getElementById('mobile-overlay')?.classList.remove('open');
      document.body.style.overflow = '';
    },
  };

  // ============================================================
  // === SCROLL REVEAL ===
  // ============================================================
  const ScrollReveal = {
    init() {
      const elements = document.querySelectorAll('.reveal');
      if (elements.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      elements.forEach(el => observer.observe(el));
    },
  };

  // ============================================================
  // === COOKIE CONSENT ===
  // ============================================================
  const CookieConsent = {
    STORAGE_KEY: 'nebulosa_cookie_consent',

    init() {
      if (localStorage.getItem(this.STORAGE_KEY)) return;
      setTimeout(() => this._create(), 1500);
    },

    _create() {
      if (document.getElementById('cookie-banner')) return;

      const banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.className = 'cookie-banner';
      banner.innerHTML =
        '<div class="cookie-banner__content">' +
          '<p><strong>🍪 Cookies</strong> — Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa <a href="privacidade.html">Política de Privacidade</a>.</p>' +
          '<div class="cookie-banner__actions">' +
            '<a href="privacidade.html" class="btn btn-outline-light btn-sm">Saiba Mais</a>' +
            '<button class="btn btn-primary btn-sm" id="cookie-accept-btn">Aceitar</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(banner);

      requestAnimationFrame(() => { requestAnimationFrame(() => { banner.classList.add('visible'); }); });

      document.getElementById('cookie-accept-btn').addEventListener('click', () => {
        localStorage.setItem(this.STORAGE_KEY, new Date().toISOString());
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 500);
      });
    },
  };

  // ============================================================
  // === CONTACT FORM ===
  // ============================================================
  const ContactForm = {
    init() {
      const form = document.getElementById('contact-form');
      if (!form) return;

      // Apply endpoint from config
      if (state.config && state.config.formEndpoint) {
        form.action = state.config.formEndpoint;
      }

      // Apply contact info from config
      if (state.config && state.config.contato) {
        const c = state.config.contato;
        const phoneEl = document.getElementById('contact-phone');
        if (phoneEl && c.telefone) phoneEl.textContent = c.telefone;
        const emailEl = document.getElementById('contact-email');
        if (emailEl && c.email) { emailEl.textContent = c.email; emailEl.href = 'mailto:' + c.email; }
        const addrEl = document.getElementById('contact-address');
        if (addrEl && c.endereco) addrEl.textContent = c.endereco;
        const hoursEl = document.getElementById('contact-hours');
        if (hoursEl && c.horario) hoursEl.textContent = c.horario;
      }

      form.addEventListener('submit', e => {
        if (!this._validate(form)) {
          e.preventDefault();
          return;
        }
        Toast.show('Mensagem enviada com sucesso!', 'success');
      });
    },

    _validate(form) {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('input-error');
        if (!field.value.trim()) {
          field.classList.add('input-error');
          valid = false;
        }
        if (field.type === 'email' && field.value.trim()) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
            field.classList.add('input-error');
            valid = false;
          }
        }
      });
      if (!valid) Toast.show('Preencha todos os campos obrigatórios.', 'error');
      return valid;
    },
  };

  // ============================================================
  // === PRODUCT DETAIL PAGE ===
  // ============================================================
  const ProductDetail = {
    init() {
      const productId = Utils.getUrlParam('id');
      if (!productId) { this._showNotFound(); return; }

      const product = state.products.find(p => p.id === productId);
      if (!product) { this._showNotFound(); return; }

      this._render(product);
      this._renderRelated(product);
    },

    _render(product) {
      const catName = Utils.getCategoryName(product.categoria);

      // Title
      document.title = product.nome + ' — Nebulosa Distribuidora';

      // Meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = product.descricaoCurta || product.nome;

      // OG
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.content = product.nome + ' — Nebulosa Distribuidora';

      // Breadcrumb
      const breadcrumb = document.getElementById('product-breadcrumb');
      if (breadcrumb) {
        breadcrumb.innerHTML =
          '<a href="index.html">Início</a>' +
          '<span class="breadcrumb__sep">›</span>' +
          '<a href="produtos.html?cat=' + encodeURIComponent(product.categoria) + '">' + Utils.escapeHtml(catName) + '</a>' +
          '<span class="breadcrumb__sep">›</span>' +
          '<span class="breadcrumb__current">' + Utils.escapeHtml(product.nome) + '</span>';
      }

      // Badge
      const badge = document.getElementById('product-badge');
      if (badge) badge.textContent = catName;

      // Name
      const nameEl = document.getElementById('product-name');
      if (nameEl) nameEl.textContent = product.nome;

      // Description
      const descEl = document.getElementById('product-desc');
      if (descEl) descEl.textContent = product.descricaoCurta || '';

      // Specs
      const specsEl = document.getElementById('product-specs');
      if (specsEl && product.especificacoes) {
        const entries = Object.entries(product.especificacoes);
        if (entries.length > 0) {
          let html = '<table class="specs-table"><tbody>';
          entries.forEach(([key, val]) => {
            html += '<tr><th>' + Utils.escapeHtml(key) + '</th><td>' + Utils.escapeHtml(String(val)) + '</td></tr>';
          });
          html += '</tbody></table>';
          specsEl.innerHTML = html;
        }
      }

      // Tags
      const tagsEl = document.getElementById('product-tags');
      if (tagsEl && product.tags && product.tags.length > 0) {
        tagsEl.innerHTML = product.tags.map(t => '<span class="product-tag">' + Utils.escapeHtml(t) + '</span>').join('');
      }

      // Add to cart button
      const addBtn = document.getElementById('product-add-btn');
      if (addBtn) {
        addBtn.setAttribute('data-id', product.id);
        addBtn.addEventListener('click', e => { e.preventDefault(); Cart.add(product.id); });
      }

      // WhatsApp button
      const waBtn = document.getElementById('product-whatsapp');
      if (waBtn) {
        const wa = (state.config && state.config.contato && state.config.contato.whatsapp) || '551121414999';
        const msg = 'Olá! Tenho interesse no produto: *' + product.nome + '*. Poderia me enviar mais informações?';
        waBtn.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg);
      }

      // Schema.org Product
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.nome,
        description: product.descricaoCurta || '',
        category: catName,
        brand: { '@type': 'Brand', name: (state.config && state.config.empresa) ? state.config.empresa.nomeCompleto : 'Nebulosa' },
      };
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);

      // BreadcrumbList Schema
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.example.com/' },
          { '@type': 'ListItem', position: 2, name: catName, item: 'https://www.example.com/produtos.html?cat=' + product.categoria },
          { '@type': 'ListItem', position: 3, name: product.nome },
        ],
      };
      const bcScript = document.createElement('script');
      bcScript.type = 'application/ld+json';
      bcScript.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(bcScript);
    },

    _renderRelated(product) {
      const container = document.getElementById('related-products');
      const section = document.getElementById('related-section');
      if (!container) return;

      const related = state.products
        .filter(p => p.categoria === product.categoria && p.id !== product.id)
        .slice(0, 4);

      if (related.length === 0) {
        if (section) section.style.display = 'none';
        return;
      }

      container.innerHTML = related.map(p => ProductRenderer.cardHTML(p)).join('');

      // Bind add-to-cart
      container.addEventListener('click', e => {
        const btn = e.target.closest('.product-card__add-btn');
        if (btn) { e.preventDefault(); Cart.add(btn.getAttribute('data-id')); }
      });
    },

    _showNotFound() {
      const main = document.getElementById('product-detail-main');
      if (main) {
        main.innerHTML =
          '<div class="container" style="text-align:center;padding:80px 20px;">' +
            '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
            '<h2 style="margin-top:20px;color:var(--text);">Produto não encontrado</h2>' +
            '<p style="color:var(--text-muted);margin-top:8px;">O produto que você procura não existe ou foi removido.</p>' +
            '<a href="produtos.html" class="btn btn-primary" style="margin-top:24px;">Voltar ao Catálogo</a>' +
          '</div>';
      }
    },
  };

  // ============================================================
  // === CATEGORIES SHOWCASE (Homepage) ===
  // ============================================================
  const CategoriesShowcase = {
    init() {
      const grid = document.getElementById('categories-grid');
      if (!grid || !state.config || !state.config.categorias) return;

      // Count products per category
      const counts = {};
      state.config.categorias.forEach(c => {
        counts[c.id] = state.products.filter(p => p.categoria === c.id).length;
      });

      grid.innerHTML = state.config.categorias.map(cat => {
        const count = counts[cat.id] || 0;
        return (
          '<a href="produtos.html?cat=' + encodeURIComponent(cat.id) + '" class="category-card reveal">' +
            '<div class="category-card__icon">' + Icons.get(cat.icone) + '</div>' +
            '<div class="category-card__body">' +
              '<h3 class="category-card__name">' + Utils.escapeHtml(cat.nome) + '</h3>' +
              '<p class="category-card__desc">' + Utils.escapeHtml(cat.descricao || '') + '</p>' +
            '</div>' +
            '<div class="category-card__footer">' +
              '<span class="category-card__count">' + count + ' produtos</span>' +
              '<span class="category-card__arrow">→</span>' +
            '</div>' +
          '</a>'
        );
      }).join('');
    },
  };

  // ============================================================
  // === PAGE DETECTION ===
  // ============================================================
  function detectPage() {
    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop() || 'index.html';
    // Order matters: 'produtos' before 'produto'
    if (filename.includes('produtos')) return 'produtos';
    if (filename.includes('produto')) return 'produto';
    if (filename.includes('contato')) return 'contato';
    if (filename.includes('sobre')) return 'sobre';
    if (filename.includes('privacidade') || filename.includes('termos') || filename.includes('lgpd')) return 'legal';
    return 'index';
  }

  // ============================================================
  // === INIT ===
  // ============================================================
  async function init() {
    try {
      // Load config
      await ConfigLoader.load();
      ConfigLoader.apply();

      // Load products
      try {
        const res = await fetch('data/products.json');
        if (!res.ok) throw new Error('products.json not found');
        state.products = await res.json();
        if (!Array.isArray(state.products)) state.products = [];
      } catch (err) {
        console.warn('[Init] Failed to load products:', err);
        state.products = [];
      }

      // Cart (always)
      Cart.initDrawer();
      Cart.load();

      // Header (always)
      Header.init();
      MobileMenu.init();

      // Page-specific
      const page = detectPage();

      switch (page) {
        case 'index':
          // Homepage — render category showcase cards
          CategoriesShowcase.init();
          break;

        case 'produtos':
          // Products page — full catalog with filters
          // Check ?cat= param for pre-selected category
          const catParam = Utils.getUrlParam('cat');
          if (catParam) {
            const isValidCat = state.config && state.config.categorias && state.config.categorias.some(c => c.id === catParam);
            if (isValidCat) state.currentCategory = catParam;
          }
          // Update breadcrumb if a category is pre-selected
          if (state.currentCategory !== 'all') {
            const bcCurrent = document.getElementById('breadcrumb-current');
            if (bcCurrent) bcCurrent.textContent = Utils.getCategoryName(state.currentCategory);
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) pageTitle.textContent = Utils.getCategoryName(state.currentCategory);
          }
          CategoryBar.init();
          SearchFilter.init();
          SearchFilter.filterAndRender();

          // Handle ?q= param
          const q = Utils.getUrlParam('q');
          if (q) {
            state.searchQuery = q.toLowerCase();
            const searchInput = document.getElementById('header-search');
            if (searchInput) searchInput.value = q;
            const clearBtn = document.getElementById('search-clear');
            if (clearBtn) clearBtn.classList.remove('hidden');
            SearchFilter.filterAndRender();
          }
          break;

        case 'produto':
          ProductDetail.init();
          break;

        case 'contato':
          ContactForm.init();
          break;

        case 'sobre':
          break;

        case 'legal':
          break;
      }

      // Scroll Reveal (all pages)
      ScrollReveal.init();

      // Cookie Consent (all pages)
      CookieConsent.init();

      // Hash changes (only relevant on produtos page)
      if (page === 'produtos') {
        window.addEventListener('hashchange', () => {
          const h = window.location.hash.replace('#', '');
          if (!RESERVED_HASHES.includes(h)) {
            const isValidCat = state.config && state.config.categorias && state.config.categorias.some(c => c.id === h);
            if (isValidCat) {
              state.currentCategory = h;
            } else if (!h) {
              state.currentCategory = 'all';
            }
            state.currentSubcategory = null;
            state.currentPage = 1;
            SearchFilter.filterAndRender();
          }
        });
      }

      // Search redirect from non-catalog pages
      if (page !== 'produtos') {
        const searchInput = document.getElementById('header-search');
        if (searchInput) {
          searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
              window.location.href = 'produtos.html?q=' + encodeURIComponent(searchInput.value.trim());
            }
          });
        }
      }

    } catch (err) {
      console.error('[Init] Critical error:', err);
    }
  }

  // ============================================================
  // === BOOTSTRAP ===
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
