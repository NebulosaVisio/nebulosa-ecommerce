# 🌌 Nebulosa Distribuidora — Vault do Projeto

> **Status:** Em desenvolvimento (esqueleto funcional pronto)
> **Última atualização:** 10/06/2026
> **Tipo:** Vitrine E-commerce (orçamento via WhatsApp — sem pagamento online)

---

## 📋 Dados da Empresa (Placeholder — Trocar ao Replicar)

| Campo | Valor |
|-------|-------|
| **Nome** | Nebulosa |
| **Nome Completo** | Nebulosa Distribuidora |
| **Telefone** | (11) 2141-4999 |
| **WhatsApp** | 551121414999 |
| **Email** | armando.rios@viacabos.com.br |
| **Endereço** | São Paulo, SP — Brasil |
| **Segmento** | Fios, cabos e condutores elétricos |

### 🔄 Para replicar com outra empresa:
1. Editar `data/config.json` — trocar nome, contato, categorias
2. Editar `data/products.json` — trocar produtos
3. Substituir `LOGO` por imagem real em todos os HTMLs
4. Atualizar canonical URLs (`https://www.example.com`)
5. Ativar GA4/GTM (descomentar blocos nos HTMLs)

---

## 🗂️ Estrutura de Arquivos

```
Vault - Site E-commerce/
├── index.html          → Homepage (hero + catálogo + categorias)
├── produto.html        → Página de detalhe do produto
├── sobre.html          → Sobre a empresa
├── contato.html        → Formulário de contato
├── termos.html         → Termos e Condições
├── privacidade.html    → Política de Privacidade (LGPD)
├── lgpd.html           → Conformidade LGPD
├── README.md           → Documentação do projeto
│
├── css/
│   └── style.css       → CSS unificado (~57KB, design system completo)
│
├── js/
│   └── app.js          → JS unificado (~50KB, app completo)
│
├── data/
│   ├── config.json     → Configuração da empresa + categorias
│   └── products.json   → 554 produtos catalogados
│
└── assets/
    ├── images/         → Pasta para logo e imagens do site
    └── products/       → Pasta para imagens de produtos
```

---

## 🎨 Design System

### Paleta de Cores
| Token | Hex | Uso |
|-------|-----|-----|
| `--primary` | `#0f172a` | Navy escuro — headers, textos |
| `--primary-light` | `#1e293b` | Navy claro |
| `--accent` | `#f97316` | Laranja vibrante — CTAs, destaques |
| `--accent-hover` | `#ea580c` | Hover do accent |
| `--surface` | `#ffffff` | Cards, superfícies |
| `--bg` | `#f8fafc` | Background da página |
| `--bg-alt` | `#f1f5f9` | Seções alternadas |
| `--border` | `#e2e8f0` | Bordas |
| `--text` | `#0f172a` | Texto principal |
| `--text-secondary` | `#64748b` | Texto secundário |
| `--text-muted` | `#94a3b8` | Texto apagado |
| `--whatsapp` | `#25d366` | Botões WhatsApp |

### Tipografia
- **Body:** Inter (Google Fonts)
- **Headings:** Plus Jakarta Sans (Google Fonts)

### Breakpoints Responsivos
- **Desktop:** >1024px (4 colunas)
- **Tablet:** 768-1024px (3 colunas)
- **Mobile:** <768px (2 colunas)
- **Small:** <480px (1 coluna)

---

## ⚙️ Funcionalidades

### 🛒 Carrinho de Orçamento
- Adicionar/remover produtos
- Controle de quantidade (+/-)
- Persistência via `localStorage` (chave: `nebulosa_cart`)
- Drawer lateral slide-in (direita)
- Envio completo via WhatsApp com lista de itens e quantidades

### 🔍 Busca e Filtros
- Busca em tempo real com debounce (300ms)
- Busca em: nome, tags, descrição, especificações, categoria
- Filtro por 6 categorias via pills horizontais
- Ordenação: A-Z, Z-A, Categoria
- Paginação (24 produtos/página)
- Contador de resultados

### 📱 Mobile
- Menu slide-in lateral
- Grid responsivo (4→3→2→1 colunas)
- Cart drawer full-width
- Busca no header adaptada

---

## 📦 Categorias de Produtos

| Categoria | Slug | Qtd | Ícone |
|-----------|------|-----|-------|
| Cabos de Alumínio | `cabos-aluminio` | 60 | ⚡ |
| Cabos de Comando | `cabos-comando` | 203 | 🔧 |
| Cabos Manga | `cabos-manga` | 103 | 🔌 |
| Cabos de Energia | `cabos-energia` | 26 | 🔋 |
| Cabos Especiais | `cabos-especiais` | 91 | 🛡️ |
| Cabos AF | `cabos-af` | 71 | 📡 |
| **TOTAL** | | **554** | |

---

## 🔌 Integrações

### FormSubmit (Formulário de Contato)
- **Endpoint:** `https://formsubmit.co/armando.rios@viacabos.com.br`
- Configurável em `data/config.json` → `formEndpoint`
- Anti-spam via honeypot

### WhatsApp
- **Número:** `551121414999`
- Configurável em `data/config.json` → `contato.whatsapp`
- Botão flutuante em todas as páginas
- Envio de orçamento do carrinho

### Google Analytics 4 (Placeholder)
- Blocos comentados em TODOS os HTMLs
- Para ativar: descomentar e substituir `G-XXXXXXXXXX`

### Google Tag Manager (Placeholder)
- Blocos head + noscript comentados em TODOS os HTMLs
- Para ativar: descomentar e substituir `GTM-XXXXXXX`

### Google Search Console (Placeholder)
- Meta tag de verificação comentada
- Para ativar: descomentar e inserir código de verificação

---

## ⚖️ Conformidade Legal (LGPD)

| Página | Conteúdo |
|--------|----------|
| `termos.html` | Termos e Condições de Uso |
| `privacidade.html` | Política de Privacidade completa |
| `lgpd.html` | Conformidade com Lei Geral de Proteção de Dados |

### Cookie Consent Banner
- Glassmorphism no rodapé
- Aceitar → salva timestamp no localStorage
- Link para Política de Privacidade
- Aparece após 1.5s na primeira visita

---

## 🚀 Como Rodar Localmente

```bash
# Opção 1 — npx
npx http-server -p 8080 -o

# Opção 2 — Live Server (VS Code)
# Instalar extensão "Live Server" e clicar "Go Live"

# Opção 3 — Python
python -m http.server 8080
```

---

## 📝 Checklist para Deploy

- [ ] Substituir `LOGO` por imagem real do logo
- [ ] Atualizar `data/config.json` com dados reais da empresa
- [ ] Atualizar URLs canônicas em todos os HTMLs
- [ ] Ativar Google Analytics 4 (descomentar + inserir ID)
- [ ] Ativar Google Tag Manager (descomentar + inserir ID)
- [ ] Ativar Google Search Console (verificação)
- [ ] Criar e enviar `sitemap.xml`
- [ ] Adicionar `favicon.ico` e `apple-touch-icon.png`
- [ ] Testar formulário de contato (FormSubmit)
- [ ] Testar envio de orçamento via WhatsApp
- [ ] Testar responsividade em mobile real
- [ ] Verificar todas as páginas legais (LGPD)
- [ ] Configurar HTTPS no servidor de produção
- [ ] Submeter no Google Search Console

---

## 🔧 Arquivos de Configuração

### `data/config.json` — Estrutura
```json
{
  "empresa": {
    "nome": "Nebulosa",
    "nomeCompleto": "Nebulosa Distribuidora",
    "descricao": "Soluções em condutores elétricos...",
    "slogan": "Qualidade e confiança em cada metro"
  },
  "contato": {
    "telefone": "(11) 2141-4999",
    "whatsapp": "551121414999",
    "email": "armando.rios@viacabos.com.br",
    "endereco": "São Paulo, SP — Brasil"
  },
  "formEndpoint": "https://formsubmit.co/armando.rios@viacabos.com.br",
  "categorias": [
    { "id": "cabos-aluminio", "nome": "Cabos de Alumínio", "icone": "⚡" },
    ...
  ]
}
```

### `data/products.json` — Estrutura de cada produto
```json
{
  "id": "cabo-slug-nome",
  "nome": "Nome do Produto 2x16mm²",
  "categoria": "cabos-aluminio",
  "subcategoria": "multiplexado-duplex",
  "descricaoCurta": "Descrição SEO curta",
  "especificacoes": {
    "Bitola": "2x16mm²",
    "Blindagem": "Fita Aluminizada"
  },
  "tags": ["automação", "instrumentação", "cabo"]
}
```

---

## 📊 SEO Implementado

- ✅ Title tags únicos por página
- ✅ Meta descriptions otimizadas
- ✅ Open Graph + Twitter Cards
- ✅ Canonical URLs (placeholder)
- ✅ Schema.org JSON-LD (Organization)
- ✅ robots meta tags
- ✅ lang="pt-BR"
- ✅ Preconnect + DNS Prefetch
- ✅ Heading hierarchy (h1 → h2 → h3)
- ✅ Semantic HTML5 (header, main, nav, footer, aside, article)
- ✅ alt text / aria-labels nos SVGs
- ✅ Print stylesheet
- ✅ prefers-reduced-motion

---

*Vault criado em 10/06/2026 via Antigravity*
