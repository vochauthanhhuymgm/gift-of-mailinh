# Daily Life Suggestions - 365-Day Emotional Healing Journey

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-green)
![Vue 3](https://img.shields.io/badge/Vue-3-green)
![Nuxt 3](https://img.shields.io/badge/Nuxt-3-green)
![Accessibility: WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%20AA-green)

A gentle, emotionally supportive web application that delivers one daily life-healing suggestion over a 365-day journey. Designed with calm aesthetics and accessibility in mind for female students seeking daily encouragement and emotional support.

## ✨ Features

- **One Daily Message**: New suggestion unlocked every day at 6:00 AM
- **365-Day Journey**: Complete sequence with no replay or skipping
- **Emotional Support**: Curated messages for healing and encouragement
- **Calm Design**: Soft color palette (purples, blues, peaches) with minimal UI
- **Fully Accessible**: WCAG AA compliance with prefers-reduced-motion support
- **Offline Ready**: Works without internet after initial load
- **Privacy First**: Zero backend, no data collection
- **Mobile Responsive**: Optimized for all device sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone and setup
git clone https://github.com/yourusername/daily-suggestions.git
cd daily-suggestions
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your app!

### Configure

Edit `.env.local` to customize:

```env
VITE_START_DATE=2025-12-18          # When journey begins (YYYY-MM-DD)
VITE_APP_NAME=Daily Life Suggestions # App name
VITE_UNLOCKED_HOUR=6                 # Hour message unlocks (0-23)
VITE_UNLOCKED_MINUTE=0               # Minute message unlocks (0-59)
```

## 📦 Building & Deployment

### Static Build
```bash
npm run build      # Generate static site in dist/
npm run preview    # Preview locally
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

Or connect your repository to [Vercel Dashboard](https://vercel.com) for automatic deployments.

## 🛠️ Development

### Available Commands
```bash
npm run dev        # Dev server with hot reload
npm run build      # Build static site
npm run preview    # Preview production build
npm run test       # Run unit tests
npm run test:e2e   # Run E2E tests
npm run lint       # Check code with ESLint
npm run format     # Format code with Prettier
```

### Project Structure
```
src/
├── pages/          # Page components (index, coming-soon, completed)
├── components/     # Reusable components (MessageDisplay)
├── composables/    # Vue composables (useDateLock, useMessageIndex, useAnimation)
├── services/       # Business logic (messageService, journeyState)
├── utils/          # Utilities (dateCalculation, validateMessages)
├── assets/         # Styles & messages (messages.json)
├── types/          # TypeScript interfaces
├── layouts/        # Layout components
└── middleware/     # Route middleware (journeyState)
```

## ♿ Accessibility

WCAG 2.1 Level AA compliance:
- ✅ Text contrast ≥4.5:1
- ✅ Semantic HTML & ARIA
- ✅ Keyboard navigation
- ✅ Respects reduced-motion preference
- ✅ Font sizes ≥16px
- ✅ Readable line heights

## 🏗️ Architecture

**Tech Stack**:
- Nuxt 3 + Vue 3 Composition API
- Vite build tool
- Vuetify 3 UI components
- TypeScript for type safety
- Vitest + Playwright for testing
- ESLint + Prettier for code quality
- Vercel for deployment

**State Machine**:
- **COMING_SOON** (before journey): Shows start date
- **UNLOCKED** (days 0-364): Displays daily message
- **COMPLETED** (day 365+): Shows completion screen

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# With coverage
npm run test -- --coverage
```

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`feat/your-feature`)
3. Commit changes with conventional commits (`feat:`, `fix:`, etc.)
4. Push and create a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

MIT - See [LICENSE](LICENSE) for details

## 💬 Support

- 📧 Email: [support@dailysuggestions.app](mailto:support@dailysuggestions.app)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/daily-suggestions/issues)
- 📖 Docs: [Documentation](https://docs.dailysuggestions.app)

## 🎯 Roadmap

- [x] Phase 1: Project setup
- [x] Phase 2: Core infrastructure
- [x] Phase 3: Daily message display
- [ ] Phase 4: Enhanced UI & accessibility
- [ ] Phase 5: Full 365-day journey
- [ ] Phase 6: Polish & production deployment

---

Built with ❤️ for emotional healing and personal growth.
