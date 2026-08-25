# 🌌 Nebulosa — E-commerce Vitrine

Catálogo online de condutores elétricos com carrinho de orçamento via WhatsApp.

## Quick Start

```bash
npx http-server -p 8080 -o
```

## Stack

- **HTML5** + **CSS3** + **JavaScript** (vanilla, zero dependências)
- **Fonts:** Inter + Plus Jakarta Sans (Google Fonts)
- **Form:** FormSubmit.co
- **Cart:** localStorage + WhatsApp API

## Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `css/style.css` | Design system completo (57KB) |
| `js/app.js` | App unificado (50KB) — carrinho, busca, filtros, paginação |
| `data/config.json` | Configuração da empresa (trocar para replicar) |
| `data/products.json` | 554 produtos catalogados |

## Para Replicar com Outra Empresa

1. Editar `data/config.json` (nome, contato, categorias)
2. Editar `data/products.json` (produtos)
3. Substituir placeholders `LOGO` nos HTMLs
4. Ativar GA4/GTM (descomentar blocos)

## Documentação Completa

Ver [VAULT.md](VAULT.md) para documentação técnica completa.
