# Contributing to Finna

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

### Commit Message Format
```
<type>(<scope>): <subject>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Scopes

- **dashboard**: Dashboard-related changes
- **expenses**: Expense tracking features
- **accounts**: Account management
- **filters**: Filtering functionality
- **storage**: Local storage/data management
- **ui**: UI components and styling
- **config**: Configuration files

### Examples
```bash
feat(expenses): add category filtering
fix(accounts): correct balance calculation
docs(readme): update installation instructions
style(ui): improve button spacing
refactor(storage): simplify data retrieval logic
```

## Making Commits

Use the interactive commit tool:
```bash
npm run commit
```

This will guide you through creating a properly formatted commit message.

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Commit using `npm run commit`
4. Push your branch
5. Open a Pull Request using the provided template
6. Wait for review

## Release Process

Releases are automated using semantic-release based on commit messages:

- `fix` commits trigger a patch release (1.0.x)
- `feat` commits trigger a minor release (1.x.0)
- `BREAKING CHANGE` in commit body triggers a major release (x.0.0)

The CHANGELOG.md is automatically generated and updated.