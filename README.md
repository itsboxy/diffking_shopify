# Diff King — Shopify theme

Custom Shopify theme for [diffking.com.au](https://www.diffking.com.au). Differential repairs, servicing, 9″ conversions, custom axles and fabrication, shipped Australia wide.

Built from scratch following Shopify's current theme architecture (JSON templates, sections, blocks, snippets). No framework dependencies. Vanilla Liquid, CSS and JS.

## Structure

| Directory | Contents |
|-----------|----------|
| `layout/` | `theme.liquid`, `password.liquid` |
| `sections/` | Header/footer groups, homepage sections (`hero`, `services`, `featured-collection`, `why-choose-us`, `image-with-text`, `rich-text`, `contact-form`, `newsletter`) and page mains (`main-product`, `main-collection`, `main-cart`, …) |
| `blocks/` | Reusable editor blocks (`text`, `button`, `heading`, `image`) |
| `snippets/` | `css-variables`, `meta-tags`, `icon`, `price`, `product-card`, `image` |
| `templates/` | JSON page templates + `gift_card.liquid` |
| `config/` | Theme settings schema + data |
| `locales/` | `en.default.json`, `en.default.schema.json` |
| `assets/` | `base.css`, `global.js`, logo |

## Local development

```bash
shopify theme dev --store diffking-2
```

## Checks

```bash
shopify theme check
```

## Theme settings

Brand colours, fonts, page width, business contact details (phone `(03) 9792 4834`, email, Dandenong workshop address) and social links are all editable under **Theme settings** in the editor. Menus use the standard `main-menu` and `footer` link lists.
