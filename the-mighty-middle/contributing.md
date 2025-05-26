# Contributing to Literature Review Tracker

Thank you for your interest in contributing to the Literature Review Tracker! This document provides guidelines for contributing to the project.

## 🎯 Ways to Contribute

- **Bug Reports**: Report bugs through GitHub Issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit pull requests for bug fixes or new features
- **Documentation**: Improve documentation, guides, or examples
- **Testing**: Help test new features and report issues
- **Design**: Contribute to UI/UX improvements

## 🚀 Getting Started

### Prerequisites
- A web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE
- Basic knowledge of HTML, CSS, and JavaScript
- Git for version control

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/yourusername/literature-review-tracker.git
   cd literature-review-tracker
   ```

2. **Create a development branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Edit files using your preferred editor
   - Test changes by opening `index.html` in your browser
   - No build process required!

4. **Test your changes**
   ```bash
   # Start a local server to test
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 📋 Contribution Guidelines

### Code Style

**JavaScript**
- Use `const` and `let` instead of `var`
- Use semicolons consistently
- Use camelCase for variable names
- Add comments for complex logic
- Keep functions focused and small

```javascript
// Good
const userInput = document.getElementById('searchInput');
const filteredResults = filterByFramework(data, framework);

// Avoid
var user_input = document.getElementById('searchInput');
var filtered_results = filter_by_framework(data, framework);
```

**CSS**
- Use kebab-case for class names
- Organize properties logically
- Use CSS custom properties for theming
- Maintain responsive design principles

```css
/* Good */
.literature-table {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-medium);
}

/* Avoid */
.literatureTable {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}
```

**HTML**
- Use semantic HTML elements
- Include proper accessibility attributes
- Maintain consistent indentation
- Use descriptive IDs and classes

### Git Commit Messages

Use clear, descriptive commit messages following this format:

```
type(scope): brief description

Longer description if needed

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(filters): add date range filtering capability
fix(export): resolve CSV export encoding issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Before submitting:**
   - Test your changes thoroughly
   - Update documentation if needed
   - Ensure code follows style guidelines
   - Check for accessibility compliance

2. **Pull Request Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring

   ## Testing
   - [ ] Tested in Chrome
   - [ ] Tested in Firefox
   - [ ] Tested on mobile devices
   - [ ] Verified accessibility

   ## Screenshots
   (If applicable)

   ## Related Issues
   Fixes #(issue number)
   ```

3. **Review Process:**
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, your PR will be merged

## 🐛 Bug Reports

When reporting bugs, please include:

- **Browser and version**
- **Operating system**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Console errors** (if any)

**Bug Report Template:**
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 91.0
- OS: Windows 10
- Screen size: 1920x1080

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

For feature requests, please provide:

- **Clear description** of the proposed feature
- **Use case** explaining why it's needed
- **Proposed implementation** (if you have ideas)
- **Alternatives considered**

## 🎨 Design Contributions

We welcome design improvements! Please consider:

- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive design**: Mobile-first approach
- **Usability**: Clear, intuitive interfaces
- **Consistency**: Follow existing design patterns

## 📚 Documentation

Help improve our documentation:

- **User guides**: Step-by-step instructions
- **Code comments**: Explain complex logic
- **API documentation**: Function and method descriptions
- **Examples**: Real-world usage scenarios

## 🧪 Testing

Help us test new features:

- **Manual testing**: Try new features and report issues
- **Cross-browser testing**: Test on different browsers
- **Accessibility testing**: Use screen readers, keyboard navigation
- **Performance testing**: Large datasets, slow connections

## 📞 Getting Help

- **GitHub Discussions**: Ask questions and discuss ideas
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check the docs/ folder
- **Code Comments**: Review inline documentation

## 🏆 Recognition

Contributors will be recognized in:
- **README.md**: Contributors section
- **Release notes**: Major contribution acknowledgments
- **GitHub**: Contributor listings

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Literature Review Tracker! Your efforts help make academic research more organized and efficient. 🎓