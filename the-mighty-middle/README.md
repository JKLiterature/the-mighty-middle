# The Mighty Middle
## Literature Review Tracker for Dissertation Research

A comprehensive web-based tool for organizing and tracking academic literature, specifically designed for interdisciplinary research on the model minority myth and "solid middle" Asian American experiences.

## 🎯 Research Focus

This tracker was developed to support dissertation research examining:
- **Model Minority Myth** and its impact on Asian Americans with moderate achievement levels
- **Collins' Domains-of-Power Framework** applied to Asian American contexts
- **"Solid Middle" Experiences** - those who don't fit exceptional achievement narratives
- **Autoethnographic Methodology** for examining lived experiences
- **Asian American Critical Race Theory (AsianCrit)** perspectives

## ✨ Features

### 📚 Literature Organization
- **Smart Categorization**: Organize sources by theoretical framework, research relevance, and publication type
- **Framework Integration**: Built-in support for Collins' domains (structural, disciplinary, cultural, interpersonal)
- **Research Question Linking**: Direct connection tracking to specific research questions
- **Visual Framework Tags**: Color-coded tags for quick theoretical framework identification

### 🔍 Advanced Filtering & Search
- **Multi-Filter System**: Filter by framework, relevance level, publication year, and more
- **Real-time Search**: Search across citations, concepts, notes, and connections
- **Saved Filter States**: Bookmark and share specific filter combinations
- **Quick Filter Presets**: One-click filters for common research needs

### 📊 Analysis & Export
- **Research Gap Analysis**: Automated identification of coverage gaps across frameworks and domains
- **Bibliography Generation**: Formatted reference lists in multiple citation styles
- **CSV Export**: Excel-compatible exports for external analysis
- **Citation Reports**: Detailed statistics and distribution analysis
- **JSON Backup**: Complete data backup and restore functionality

### 🎓 Research-Specific Tools
- **Domain Mapping**: Track coverage across Collins' four domains of power
- **Relevance Weighting**: Prioritize sources by connection to research questions
- **Methodological Support**: Special categorization for autoethnographic sources
- **Gap Identification**: Highlights underrepresented areas in literature coverage

## 🚀 Quick Start

### Online Version (Recommended)
Visit the live application: **[https://yourusername.github.io/the-mighty-middle/](https://yourusername.github.io/the-mighty-middle/)**

### Local Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/the-mighty-middle.git
   cd the-mighty-middle
   ```

2. **Open the application**:
   ```bash
   # Simply open index.html in your web browser
   open index.html
   # Or start a local server
   python -m http.server 8000
   ```

3. **Start tracking your literature**:
   - Add your research question
   - Begin adding sources using the form
   - Use filters to organize and analyze your collection

## 📁 Repository Structure

```
the-mighty-middle/
├── README.md                 # This file
├── LICENSE                   # MIT License
├── index.html               # Main application file
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── app.js              # Main application logic
│   ├── filters.js          # Filtering functionality
│   └── export.js           # Export and analysis features
├── docs/
│   ├── user-guide.md       # Detailed user guide
│   └── screenshots/        # Application screenshots
├── .github/
│   └── workflows/
│       └── deploy.yml      # Automated deployment
└── sw.js                   # Service worker for offline use
```

## 🛠️ Customization for Different Research Areas

While designed for model minority myth research, the tracker can be adapted for other interdisciplinary studies:

### Adding New Theoretical Frameworks
Edit the framework options in `js/app.js`:
```javascript
const FRAMEWORKS = {
    'YourFramework': { name: 'Your Custom Framework', class: 'your-framework' },
    'Collins': { name: "Collins' Domains of Power", class: 'collins' }
};
```

### Modifying Research Domains
Update domain categories to match your theoretical framework:
```javascript
const researchDomains = [
    'Your Custom Domain 1',
    'Your Custom Domain 2',
    'Structural',
    'Cultural'
];
```

### Styling Customization
Modify colors and themes in `css/styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #38a169;
}
```

## 📊 Specialized Features for Asian American Studies

### Model Minority Myth Research
- **Achievement Level Tracking**: Categorize sources by focus on exceptional vs. moderate achievement
- **Stereotype Impact Analysis**: Track psychological and professional impacts
- **Navigation Strategy Documentation**: Record strategies for professional advancement

### Collins' Domains-of-Power Integration
- **Structural Domain**: Economic and political institutions
- **Disciplinary Domain**: Bureaucratic controls and surveillance
- **Cultural Domain**: Ideology and representation
- **Interpersonal Domain**: Daily interactions and relationships

### Autoethnographic Method Support
- **Methodological Sources**: Special category for autoethnographic methodology
- **Reflexivity Tracking**: Space for researcher positionality notes
- **Narrative Integration**: Connect personal experiences to theoretical frameworks

## 📈 Data Management & Analysis

### Export Options
- **CSV Export**: Full database export for statistical analysis
- **Bibliography Generation**: APA, MLA, Chicago, and Harvard styles
- **Gap Analysis Reports**: Automated identification of literature gaps
- **Citation Statistics**: Distribution analysis across frameworks and years

### Data Persistence
- **Browser Storage**: Automatic saving with localStorage
- **JSON Backup**: Export/import for data portability
- **Offline Functionality**: Works without internet connection
- **Cross-Device Sync**: Manual export/import between devices

## 🎓 Academic Use Cases

### Dissertation Research
- **Literature Review Organization**: Systematic tracking of all sources
- **Theoretical Framework Integration**: Connect sources to specific frameworks
- **Gap Analysis**: Identify areas needing more sources
- **Citation Management**: Generate properly formatted bibliographies

### Grant Applications
- **Coverage Demonstration**: Show comprehensive literature review
- **Theoretical Grounding**: Document framework integration
- **Research Justification**: Highlight gaps your research addresses

### Collaborative Research
- **Team Coordination**: Share organized literature databases
- **Standard Categorization**: Consistent framework application
- **Progress Tracking**: Monitor literature review completion

## 🤝 Contributing

We welcome contributions from the academic community! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/the-mighty-middle.git

# No build process required - pure HTML/CSS/JS
# Simply edit files and refresh browser to see changes
```

### Reporting Issues
- Use GitHub Issues for bug reports
- Include browser information and steps to reproduce
- Suggest improvements for academic workflows

### Feature Requests
We're particularly interested in features that support:
- Additional theoretical frameworks
- New export formats
- Enhanced analysis capabilities
- Accessibility improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inspired by**: The need for better literature organization tools in interdisciplinary research
- **Theoretical Foundation**: Patricia Hill Collins' domains-of-power framework
- **Research Context**: Asian American Studies and Critical Race Theory
- **Methodological Approach**: Autoethnographic research methods
- **Academic Community**: Graduate students and researchers in interdisciplinary fields

## 📞 Support & Documentation

- **User Guide**: [docs/user-guide.md](docs/user-guide.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/the-mighty-middle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/the-mighty-middle/discussions)

## 🌟 Research Impact

This tool supports research that:
- **Centers Underrepresented Experiences**: Focuses on "solid middle" rather than exceptional narratives
- **Applies Intersectional Analysis**: Uses Collins' domains-of-power framework
- **Challenges Dominant Narratives**: Questions model minority myth assumptions
- **Employs Critical Methodologies**: Supports autoethnographic approaches
- **Advances Social Justice**: Contributes to more nuanced understanding of Asian American experiences

---

**Citation**: If you use this tool in your research, please cite:
```
[Your Name]. (2025). The Mighty Middle: Literature Review Tracker for Model Minority Myth Research. 
GitHub. https://github.com/yourusername/the-mighty-middle
```

**Note**: This tool stores data locally in your browser. For long-term storage and collaboration, regularly export your data using the backup features.
