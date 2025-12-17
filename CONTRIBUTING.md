# Contributing to Daily Life Suggestions

Thank you for your interest in contributing! We welcome contributions of all kinds: bug reports, feature requests, documentation improvements, and code changes.

## Code of Conduct

Be respectful and supportive of other contributors. This project is focused on emotional healing and support—let that principle guide our interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/daily-suggestions.git
   cd daily-suggestions
   ```
3. **Create a branch** from `develop` or `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

## Development Workflow

### Branch Naming Convention

- **Features**: `feat/descriptive-name`
- **Bug fixes**: `fix/descriptive-name`
- **Documentation**: `docs/descriptive-name`
- **Tests**: `test/descriptive-name`
- **Refactoring**: `refactor/descriptive-name`

Example: `feat/add-dark-mode-support`

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`  
**Scope**: Optional, e.g., `(messaging)`, `(accessibility)`, `(testing)`

Examples:
```
feat(messaging): add 365 message generation script
fix(composables): correct dayIndex calculation for UTC times
docs(readme): update setup instructions
test(e2e): add user journey simulation tests
```

### Code Style

This project uses ESLint and Prettier for code quality.

```bash
# Check code quality
npm run lint

# Format code automatically
npm run format

# Check formatting without modifying
npm run format -- --check
```

**Key rules**:
- Use TypeScript for type safety
- Prefer Composition API over Options API
- Keep components small and focused
- Use Vue 3 `<script setup>` syntax
- Add JSDoc comments to public functions
- Write semantic HTML for accessibility

### Testing

All code should be tested:

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run test -- --coverage
```

**Test Guidelines**:
- Write tests alongside the code
- Aim for >80% coverage
- Use descriptive test names
- Mock external dependencies
- Test both happy paths and edge cases

## Making Changes

### For Bug Fixes

1. Create an issue describing the bug (if one doesn't exist)
2. Reference the issue in your branch: `fix/issue-123-description`
3. Add a test that reproduces the bug
4. Fix the bug
5. Verify the test now passes

### For Features

1. Discuss the feature in an issue first (for larger changes)
2. Create a branch from `develop`: `feat/feature-name`
3. Implement the feature with tests
4. Update documentation if needed
5. Create a Pull Request

### For Documentation

1. Create a branch: `docs/what-you-are-documenting`
2. Make changes to markdown files
3. Ensure formatting is clear and consistent
4. Submit a Pull Request

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**:
   ```bash
   npm run test
   npm run test:e2e
   ```

2. **Check code quality**:
   ```bash
   npm run lint
   npm run format
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Update CHANGELOG** if making user-facing changes

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Fixes #123

## Changes Made
- Change 1
- Change 2

## Testing
Describe tests added or manually verified

## Checklist
- [ ] Tests pass locally
- [ ] ESLint/Prettier checks pass
- [ ] Documentation updated
- [ ] Conventional commit messages used
```

### Review Process

1. At least one maintainer reviews your PR
2. Address feedback and make requested changes
3. Minor patches (fixes): 1 approval needed
4. Features: 2 approvals needed
5. Once approved, PR will be merged by maintainer

## Project Structure

```
daily-suggestions/
├── src/
│   ├── pages/              # Page components
│   ├── components/         # Reusable Vue components
│   ├── composables/        # Reusable composition functions
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── middleware/         # Route middleware
│   ├── layouts/            # Layout components
│   └── assets/             # Styles, images, data
├── tests/
│   ├── unit/               # Unit tests (Vitest)
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests (Playwright)
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── public/                 # Static files
├── nuxt.config.ts          # Nuxt configuration
├── package.json
└── README.md
```

## Key Files

- **Messaging**: `src/composables/useMessageIndex.ts`, `src/services/messageService.ts`
- **Date Calculation**: `src/utils/dateCalculation.ts`
- **State Management**: `src/composables/useMessageIndex.ts`, `src/services/journeyState.ts`
- **Styling**: `src/assets/styles/global.css`
- **Configuration**: `src/config.ts`, `nuxt.config.ts`

## Common Tasks

### Adding a New Message
Messages are in `public/messages.json` and generated by `scripts/generateMessages.js`.

### Modifying Styling
- Global styles: `src/assets/styles/global.css`
- Component styles: Scoped `<style>` in `.vue` files
- Keep accessibility in mind (contrast ratios, readability)

### Adding a New Page
1. Create component in `src/pages/`
2. Use auto-routing (Nuxt will recognize it)
3. Add middleware if needed
4. Test navigation

### Fixing Accessibility Issues
1. Check contrast ratios with WebAIM tool
2. Test keyboard navigation
3. Verify ARIA labels
4. Check with screen reader (NVDA/JAWS)
5. Test with `prefers-reduced-motion`

## Performance Considerations

- Keep bundle size small (aim for <200KB gzipped)
- Lazy-load non-critical components
- Optimize images and assets
- Use CSS custom properties for theming
- Avoid heavy computations in render
- Cache API responses where appropriate

## Accessibility Guidelines

We aim for WCAG 2.1 Level AA compliance:

- Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- Provide text alternatives for images
- Ensure keyboard accessibility
- Use sufficient color contrast (≥4.5:1 for text)
- Respect `prefers-reduced-motion` media query
- Use ARIA labels for dynamic content
- Test with screen readers

## Release Process

Releases follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes (0.0.X → 1.0.0)
- **MINOR**: New features (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (1.0.0 → 1.0.1)

Maintainers handle releases via GitHub Releases.

## Questions or Need Help?

- 💬 Ask in [GitHub Discussions](https://github.com/yourusername/daily-suggestions/discussions)
- 📧 Email: [support@dailysuggestions.app](mailto:support@dailysuggestions.app)
- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/daily-suggestions/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making Daily Life Suggestions better! ❤️
