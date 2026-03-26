# Saucebase Documentation

This repository contains the comprehensive documentation for [Saucebase](https://github.com/saucebase-dev/saucebase) - a modular Laravel SaaS starter kit built on the VILT stack.

## 🌐 Live Documentation

**→ https://saucebase-dev.github.io/docs/**

## 🚀 Development

This documentation is built with [Docusaurus](https://docusaurus.io/).

### Prerequisites

- Node.js 18+
- npm 8+

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

This starts the development server at `http://localhost:3000/docs/`. Changes are reflected live without restarting the server.

### Build

```bash
# Build for production
npm run build
```

This generates static content into the `build` directory.

### Deployment

Documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

## 📝 Contributing

Contributions to improve the documentation are welcome!

### Documentation Structure

```
docs/
├── index.md                    # Landing page
├── getting-started/            # Installation, configuration, basics
├── architecture/               # System architecture deep dives
├── fundamentals/               # Core features and concepts
├── development/                # Development guides
├── advanced/                   # Advanced topics
└── reference/                  # Quick reference materials
```

### Writing Guidelines

1. **Use clear, concise language** - Assume reader has Laravel/Vue knowledge
2. **Include code examples** - Show practical, runnable code
3. **Add cross-references** - Link to related documentation
4. **Use callouts** - Highlight important information with `:::tip`, `:::warning`, etc.
5. **Test code examples** - Ensure all code snippets work

### Markdown Features

Docusaurus supports enhanced markdown:

- **Admonitions**: `:::tip`, `:::note`, `:::warning`, `:::danger`
- **Code blocks with highlighting**: ` ```php title="app/Providers/AppServiceProvider.php" `
- **Mermaid diagrams**: ` ```mermaid ` for flowcharts and diagrams
- **Tabs**: Group related content in tabs

See [Docusaurus markdown features](https://docusaurus.io/docs/markdown-features) for more.

### Syncing with Main Repository

When code changes in the [main repository](https://github.com/saucebase-dev/saucebase) affect documentation:

1. Create an issue in this repository using the `sync-needed` label
2. Link to the relevant commit/PR in the main repository
3. Update affected documentation pages
4. Test code examples still work
5. Submit a pull request

## 🔗 Related Repositories

- **Main Repository**: [saucebase-dev/saucebase](https://github.com/saucebase-dev/saucebase)
- **Auth Module**: [saucebase-dev/auth](https://github.com/saucebase-dev/auth)
- **Settings Module**: [saucebase-dev/settings](https://github.com/saucebase-dev/settings)

## 📄 License

Documentation is licensed under [MIT](LICENSE).

---

For questions or issues, please use [GitHub Issues](https://github.com/saucebase-dev/docs/issues).
