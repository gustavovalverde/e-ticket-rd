# Dominican Republic E-Ticket System Modernization

## 🇩🇴 Modernizing the Dominican Republic's E-Ticket system for migration control

[![Code Quality](https://github.com/gustavovalverde/e-ticket-rd/actions/workflows/code-quality.yml/badge.svg?branch=main)](https://github.com/gustavovalverde/e-ticket-rd/actions/workflows/code-quality.yml)
[![Security Analysis](https://github.com/gustavovalverde/e-ticket-rd/actions/workflows/security-analysis.yml/badge.svg?branch=main)](https://github.com/gustavovalverde/e-ticket-rd/actions/workflows/security-analysis.yml)

### 🎯 What We're Building

This project modernizes the Dominican Republic's current e-ticket system for migration control ([eticket.migracion.gob.do](https://eticket.migracion.gob.do/)). We're building a **modern, secure, and easy-to-use** digital platform for travelers.

**Our mission**: Transform a system that serves **millions of users annually** into something that actually works well and feels good to use.

### 📊 Key Improvements We're Targeting

| Current Problems                          | What We're Fixing                     |
| ----------------------------------------- | ------------------------------------- |
| 🐛 Browser crashes, lost forms            | Works in all browsers, saves drafts   |
| 📱 No mobile app, manual entry only       | Mobile app with passport scanning     |
| 📝 Long forms, repeat data entry          | Smart forms, auto-fill flight details |
| ❓ QR codes work sometimes, sometimes not | Consistent QR code system             |
| 🔒 Data gets lost, system breaks          | Reliable system that keeps data safe  |

> **Read the full context**: [Executive Summary](docs/product/executive-summary.md) 📄

## 🌟 Benchmark Systems

We're learning from the best migration systems in the world:

- **🇳🇿 New Zealand Traveller Declaration (NZTD)** - Mobile-first with passport scanning
- **🇸🇬 Singapore Arrival Card (SGAC)** - Fast and clear

## 🛠 Technology Stack

### Frontend

- ⚡ **Next.js 15** (App Router) - React framework
- 🎨 **Shadcn/ui** - Component library
- 📝 **TanStack Form** - Form handling ([why we chose it](docs/decisions/core/001-form-library-selection.md))
- ✅ **Zod** - Validation
- 🌍 **next-intl** - Multiple languages

### Development & Quality

- 🔷 **TypeScript** - Type safety
- 💅 **Tailwind CSS** - Styling
- 🧪 **ESLint + Prettier** - Code quality
- 🔒 **Security Analysis** - Vulnerability scanning
- ♿ **Accessibility Testing** - WCAG 2.1/2.2 AA

## 🚀 Quick Start

### Prerequisites

- **Node.js 24+** and **pnpm 10+**
- Git

### Development Setup

```bash
# Clone the repository
git clone https://github.com/gustavovalverde/e-ticket-rd.git
cd e-ticket-rd

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint with fixes
pnpm lint:strict  # Run ESLint with zero warnings
pnpm type-check   # TypeScript type checking
pnpm format       # Format code with Prettier
pnpm check-all    # Run all quality checks
```

## 📁 Project Structure & Documentation

### 🏗 Current System Analysis

- [`docs/product/official-web/`](docs/product/official-web/) - Analysis of the existing system
  - [README.md](docs/product/official-web/README.md) - Field inventory and screen flow
  - [Entity Relationship Diagram](docs/product/official-web/diagram-entity-relationship.md)
  - [User Flow Analysis](docs/product/official-web/diagram-user-flow.md)

### 🔮 Proposed Improvements

- [`docs/product/new-web/`](docs/product/new-web/) - Our improvement plan
  - [Data Simplification Opportunities](docs/product/new-web/data-simplification-opportunities.md) - How we'll reduce user input by ~60%
  - [Quick Reference Guide](docs/product/new-web/simplification-quick-reference.md) - Key improvements

### 🏛 Architectural Decisions

- [`docs/decisions/`](docs/decisions/) - [Architectural Decision Records (ADRs)](docs/decisions/README.md)
  - [001: Form Library Selection](docs/decisions/core/001-form-library-selection.md) - Why we chose TanStack Form

### 📋 Project Planning

- [Development Plan](docs/product/development-plan.md) - 4-phase implementation plan
- [Project Management Guide](docs/project/github-project-management.md) - How we organize work

## 🤝 Contributing

We welcome contributions from **developers, designers, UX researchers, and domain experts**! This project serves millions of travelers, so your help matters.

### 🎯 Ways to Contribute

- **🐛 Report bugs** or usability issues
- **💡 Suggest features** or improvements
- **👩‍💻 Submit code** improvements
- **🎨 Improve design** and user experience
- **📝 Enhance documentation**
- **🌍 Add translations**
- **♿ Improve accessibility**

### 📖 Essential Reading

1. **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute
2. **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines
3. **[Security Policy](SECURITY.md)** - How to report security issues

### 🎯 Find Issues to Work On

Visit our **[GitHub Project Board](https://github.com/users/gustavovalverde/projects/5)** to see:

- 🟢 **Good First Issues** - Perfect for new contributors
- 🔴 **High Priority** - Critical features and fixes
- 📋 **Ready for Development** - Well-defined tasks

**Project Management**: We use a [7-stage workflow](docs/project/github-project-management.md) with themes instead of sprints. Easy to contribute at any skill level.

## 🔒 Quality & Security

### Automated Quality Checks

Every pull request runs:

- ✅ **TypeScript Compilation** - Type safety checking
- 🧹 **ESLint + Prettier** - Code quality and formatting
- 🔒 **Security Analysis** - Vulnerability scanning with zizmor
- 📦 **Dependency Audit** - Package security checking
- 🌐 **Multi-language Linting** - Code review

### Security First

- **🛡 Government-grade security** standards
- **🔐 HTTPS everywhere** - No exceptions
- **📝 Input validation** at all levels
- **🚫 Zero sensitive data logging**
- **⚡ Regular security audits**

**Report Security Issues**: Use our [Security Policy](SECURITY.md) for responsible disclosure.

## 🌍 Accessibility & Internationalization

- **♿ WCAG 2.1/2.2 AA Compliance** - Works for all users
- **🌐 Multilingual Support** - Spanish, English, and more
- **📱 Mobile-First Design** - Works on all devices
- **🔄 Progressive Web App** features for offline access

## 📊 Project Status

**Current Phase**: Foundation & Planning ⚡
**Next Milestone**: Working prototype with core form features

**Track Progress**:

- [GitHub Project Board](https://github.com/users/gustavovalverde/projects/5)
- [Development Milestones](docs/product/development-plan.md#5-prototype-development-plan)

## 📞 Getting Help

- **💬 GitHub Discussions** - Ask questions and share ideas
- **🐛 Issues** - Report bugs or request features
- **📖 Documentation** - Guides in `/docs`
- **🔗 Project Board** - See what's being worked on

## 🙏 Acknowledgments

We're learning from:

- **🇳🇿 New Zealand** - Traveller Declaration system
- **🇸🇬 Singapore** - Digital arrival processes
- **🇪🇺 EU Guidelines** - Once-Only Technical System UX principles

## 📄 License

[MIT License](LICENSE) - Built for the public good 🌍

---

**🚀 Ready to contribute?** Check out our [Contributing Guide](CONTRIBUTING.md) and find your first issue on our [Project Board](https://github.com/users/gustavovalverde/projects/5)!

**🔍 Want to understand the full context?** Start with our [Executive Summary](docs/product/executive-summary.md) to learn why this project matters.
