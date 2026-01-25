# Contributing to STX DeFi Protocol

Thank you for your interest in contributing to STX DeFi Protocol! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Install Clarinet: Follow [Clarinet installation guide](https://github.com/hirosystems/clarinet)

## Development Workflow

### Smart Contracts

1. Make changes to contracts in `contracts/`
2. Check syntax: `clarinet check`
3. Run tests: `clarinet test`
4. Test in console: `clarinet console`

### Frontend

1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Build for production: `npm run build`

## Testing

All changes must include tests. Run the test suite before submitting:

```bash
# Run all contract tests
clarinet test

# Run specific test file
clarinet test tests/yield-vault_test.ts

# Run frontend tests
cd frontend && npm test
```

## Code Style

### Clarity Smart Contracts

- Use descriptive constant and variable names
- Document all public functions with comments
- Use proper error handling with `(asserts!)`
- Follow the existing code structure

### TypeScript/React

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use meaningful variable and function names

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes with clear commit messages
3. Run all tests and ensure they pass
4. Update documentation if needed
5. Submit a pull request with:
   - Clear title describing the change
   - Description of what was changed and why
   - Any breaking changes noted
   - Reference to related issues

## Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email the maintainers directly
3. Include detailed steps to reproduce
4. Allow time for a fix before public disclosure

### Smart Contract Security Guidelines

- Always capture `tx-sender` before `as-contract` context switches
- Test all fund transfer operations verify correct recipient
- Include balance verification tests for deposit/withdraw functions
- Review for reentrancy and other common vulnerabilities

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
