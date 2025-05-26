/**
 * Literature Review Tracker - Export and Analysis Functions
 * Handles data export, bibliography generation, and research gap analysis
 */

// Export configuration
const EXPORT_CONFIG = {
    csvDelimiter: ',',
    csvNewline: '\n',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    citationStyles: ['APA', 'MLA', 'Chicago', 'Harvard'],
    defaultCitationStyle: 'APA'
};

// Citation style templates
const CITATION_STYLES = {
    APA: {
        name: 'APA Style',
        template: '{author} ({year}). {title}. {source}.'
    },
    MLA: {
        name: 'MLA Style',
        template: '{author}. "{title}." {source}, {year}.'
    },
    Chicago: {
        name: 'Chicago Style',
        template: '{author}. "{title}." {source} ({year}).'
    },
    Harvard: {
        name: 'Harvard Style',
        template: '{author} {year}, "{title}", {source}.'
    }
};

/**
 * Export data to CSV format
 */
function exportToCSV() {
    try {
        console.log('Starting CSV export...');
        
        // Use filtered data if filters are active, otherwise use all data
        const dataToExport = filteredRows.length < allRows.length ? filteredRows : allRows;
        
        if (dataToExport.length === 0) {
            showNotification('No data to export', 'warning');
            return;
        }
        
        // Define CSV headers
        const headers = [
            'Citation',
            'Year',
            'Type',
            'Theoretical Framework',
            'Relevance',
            'Connection to Research Question',
            'Key Concepts/Findings',
            'Domain of Power (Collins)',
            'Notes & Quotes',
            'Page/Chapter References',
            'Date Added'
        ];
        
        // Convert data to CSV format
        const csvContent = generateCSVContent(dataToExport, headers);
        
        // Create and download file
        downloadFile(csvContent, 'literature_review_tracker.csv', 'text/csv');
        
        // Show success notification
        showNotification(`Exported ${dataToExport.length} entries to CSV`, 'success');
        
        // Announce to screen readers
        announceToScreenReader(`CSV export completed with ${dataToExport.length} entries`);
        
        console.log(`CSV export completed: ${dataToExport.length} rows`);
        
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        showNotification('Error exporting CSV file. Please try again.', 'error');
    }
}

/**
 * Generate CSV content from data array
 */
function generateCSVContent(data, headers) {
    const rows = [headers];
    
    data.forEach(row => {
        const csvRow = [
            escapeCsvField(row.citation || ''),
            escapeCsvField(row.year || ''),
            escapeCsvField(row.type || ''),
            escapeCsvField(Array.isArray(row.framework) ? row.framework.join('; ') : (row.framework || '')),
            escapeCsvField(row.relevance || ''),
            escapeCsvField(row.connection || ''),
            escapeCsvField(row.concepts || ''),
            escapeCsvField(row.domain || ''),
            escapeCsvField(row.notes || ''),
            escapeCsvField(row.pages || ''),
            escapeCsvField(row.dateAdded || new Date().toISOString())
        ];
        rows.push(csvRow);
    });
    
    return rows
        .map(row => row.join(EXPORT_CONFIG.csvDelimiter))
        .join(EXPORT_CONFIG.csvNewline);
}

/**
 * Escape CSV field values
 */
function escapeCsvField(field) {
    if (typeof field !== 'string') {
        field = String(field);
    }
    
    // If field contains delimiter, newline, or quotes, wrap in quotes and escape internal quotes
    if (field.includes(EXPORT_CONFIG.csvDelimiter) || 
        field.includes('\n') || 
        field.includes('\r') || 
        field.includes('"')) {
        return '"' + field.replace(/"/g, '""') + '"';
    }
    
    return field;
}

/**
 * Generate bibliography in specified format
 */
function generateBibliography(style = EXPORT_CONFIG.defaultCitationStyle) {
    try {
        console.log(`Generating bibliography in ${style} style...`);
        
        const dataToExport = filteredRows.length < allRows.length ? filteredRows : allRows;
        
        if (dataToExport.length === 0) {
            showNotification('No sources to include in bibliography', 'warning');
            return;
        }
        
        // Sort sources alphabetically by citation
        const sortedSources = [...dataToExport].sort((a, b) => 
            (a.citation || '').localeCompare(b.citation || '')
        );
        
        // Generate bibliography content
        const bibliographyContent = generateBibliographyContent(sortedSources, style);
        
        // Display in new window
        displayBibliography(bibliographyContent, style, sortedSources.length);
        
        // Show success notification
        showNotification(`Generated bibliography with ${sortedSources.length} sources`, 'success');
        
        // Announce to screen readers
        announceToScreenReader(`Bibliography generated with ${sortedSources.length} sources`);
        
        console.log(`Bibliography generated: ${sortedSources.length} sources in ${style} style`);
        
    } catch (error) {
        console.error('Error generating bibliography:', error);
        showNotification('Error generating bibliography. Please try again.', 'error');
    }
}

/**
 * Generate formatted bibliography content
 */
function generateBibliographyContent(sources, style) {
    const styleConfig = CITATION_STYLES[style] || CITATION_STYLES[EXPORT_CONFIG.defaultCitationStyle];
    
    const formattedSources = sources.map(source => {
        // For now, use the citation as provided since it should already be formatted
        // In a more advanced version, we could parse and reformat citations
        return source.citation || 'Unknown source';
    });
    
    return formattedSources.join('\n\n');
}

/**
 * Display bibliography in new window
 */
function displayBibliography(content, style, count) {
    const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    
    if (!newWindow) {
        // Fallback: create downloadable file
        downloadFile(content, 'bibliography.txt', 'text/plain');
        showNotification('Bibliography downloaded as file (popup blocked)', 'info');
        return;
    }
    
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bibliography - Literature Review Tracker</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    line-height: 1.6;
                    color: #333;
                }
                h1 {
                    text-align: center;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                    margin-bottom: 30px;
                }
                .meta {
                    text-align: center;
                    color: #666;
                    margin-bottom: 40px;
                    font-style: italic;
                }
                .bibliography {
                    white-space: pre-line;
                    text-align: left;
                }
                .actions {
                    text-align: center;
                    margin-top: 40px;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
                .btn {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin: 0 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                }
                .btn:hover {
                    background: #5a67d8;
                }
                @media print {
                    .actions { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Bibliography</h1>
            <div class="meta">
                ${count} sources • ${style} Style • Generated ${new Date().toLocaleDateString()}
            </div>
            <div class="bibliography">${escapeHtml(content)}</div>
            <div class="actions">
                <button class="btn" onclick="window.print()">Print</button>
                <button class="btn" onclick="copyToClipboard()">Copy to Clipboard</button>
                <button class="btn" onclick="downloadBibliography()">Download</button>
                <button class="btn" onclick="window.close()">Close</button>
            </div>
            
            <script>
                function copyToClipboard() {
                    const text = document.querySelector('.bibliography').textContent;
                    navigator.clipboard.writeText(text).then(() => {
                        alert('Bibliography copied to clipboard!');
                    }).catch(() => {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = text;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Bibliography copied to clipboard!');
                    });
                }
                
                function downloadBibliography() {
                    const text = document.querySelector('.bibliography').textContent;
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'bibliography_${style.toLowerCase()}.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            </script>
        </body>
        </html>
    `;
    
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}

/**
 * Analyze research gaps in the literature collection
 */
function analyzeGaps() {
    try {
        console.log('Starting research gap analysis...');
        
        if (allRows.length === 0) {
            showNotification('No data available for analysis', 'warning');
            return;
        }
        
        // Perform comprehensive analysis
        const analysis = performGapAnalysis(allRows);
        
        // Display analysis results
        displayGapAnalysis(analysis);
        
        // Show success notification
        showNotification('Research gap analysis completed', 'success');
        
        // Announce to screen readers
        announceToScreenReader('Research gap analysis completed and displayed');
        
        console.log('Gap analysis completed:', analysis);
        
    } catch (error) {
        console.error('Error performing gap analysis:', error);
        showNotification('Error performing gap analysis. Please try again.', 'error');
    }
}

/**
 * Perform detailed gap analysis
 */
function performGapAnalysis(data) {
    const analysis = {
        overview: {
            totalSources: data.length,
            dateRange: getDateRange(data),
            lastUpdated: new Date().toLocaleDateString()
        },
        frameworks: analyzeFrameworks(data),
        domains: analyzeDomains(data),
        types: analyzeTypes(data),
        relevance: analyzeRelevance(data),
        temporal: analyzeTemporalDistribution(data),
        gaps: identifyGaps(data),
        recommendations: generateRecommendations(data)
    };
    
    return analysis;
}

/**
 * Analyze framework distribution
 */
function analyzeFrameworks(data) {
    const frameworks = {};
    const total = data.length;
    
    data.forEach(row => {
        const rowFrameworks = Array.isArray(row.framework) ? row.framework : [row.framework];
        rowFrameworks.forEach(fw => {
            if (fw && fw.trim()) {
                frameworks[fw] = (frameworks[fw] || 0) + 1;
            }
        });
    });
    
    // Calculate percentages and identify gaps
    const frameworkAnalysis = Object.keys(frameworks).map(fw => ({
        name: fw,
        count: frameworks[fw],
        percentage: ((frameworks[fw] / total) * 100).toFixed(1),
        adequacy: getAdequacyLevel(frameworks[fw], total)
    }));
    
    // Sort by count (descending)
    frameworkAnalysis.sort((a, b) => b.count - a.count);
    
    return {
        distribution: frameworkAnalysis,
        mostUsed: frameworkAnalysis[0]?.name || 'None',
        leastUsed: frameworkAnalysis[frameworkAnalysis.length - 1]?.name || 'None',
        gaps: frameworkAnalysis.filter(fw => fw.adequacy === 'Low').map(fw => fw.name)
    };
}

/**
 * Analyze Collins' domains distribution
 */
function analyzeDomains(data) {
    const domains = {
        'Structural': 0,
        'Disciplinary': 0,
        'Cultural': 0,
        'Interpersonal': 0
    };
    
    let domainSources = 0;
    
    data.forEach(row => {
        if (row.domain && row.domain.trim() && row.domain !== 'N/A - Methodological') {
            domainSources++;
            Object.keys(domains).forEach(domain => {
                if (row.domain.toLowerCase().includes(domain.toLowerCase())) {
                    domains[domain]++;
                }
            });
        }
    });
    
    const domainAnalysis = Object.keys(domains).map(domain => ({
        name: domain,
        count: domains[domain],
        percentage: domainSources > 0 ? ((domains[domain] / domainSources) * 100).toFixed(1) : '0',
        adequacy: getAdequacyLevel(domains[domain], domainSources)
    }));
    
    return {
        distribution: domainAnalysis,
        totalWithDomains: domainSources,
        coverage: ((domainSources / data.length) * 100).toFixed(1),
        gaps: domainAnalysis.filter(d => d.adequacy === 'Low').map(d => d.name)
    };
}

/**
 * Analyze source types distribution
 */
function analyzeTypes(data) {
    const types = {};
    
    data.forEach(row => {
        const type = row.type || 'Unknown';
        types[type] = (types[type] || 0) + 1;
    });
    
    const typeAnalysis = Object.keys(types).map(type => ({
        name: type,
        count: types[type],
        percentage: ((types[type] / data.length) * 100).toFixed(1),
        adequacy: getAdequacyLevel(types[type], data.length)
    }));
    
    typeAnalysis.sort((a, b) => b.count - a.count);
    
    return {
        distribution: typeAnalysis,
        balance: calculateBalance(typeAnalysis),
        gaps: typeAnalysis.filter(t => t.adequacy === 'Low').map(t => t.name)
    };
}

/**
 * Analyze relevance distribution
 */
function analyzeRelevance(data) {
    const relevance = { 'High': 0, 'Medium': 0, 'Low': 0 };
    
    data.forEach(row => {
        const rel = row.relevance || 'Unknown';
        if (relevance.hasOwnProperty(rel)) {
            relevance[rel]++;
        }
    });
    
    const total = data.length;
    
    return {
        high: { count: relevance.High, percentage: ((relevance.High / total) * 100).toFixed(1) },
        medium: { count: relevance.Medium, percentage: ((relevance.Medium / total) * 100).toFixed(1) },
        low: { count: relevance.Low, percentage: ((relevance.Low / total) * 100).toFixed(1) },
        ratio: relevance.High > 0 ? (relevance.High / (relevance.Medium + relevance.Low)).toFixed(2) : '0'
    };
}

/**
 * Analyze temporal distribution
 */
function analyzeTemporalDistribution(data) {
    const years = {};
    const decades = {};
    
    data.forEach(row => {
        const year = parseInt(row.year);
        if (!isNaN(year)) {
            years[year] = (years[year] || 0) + 1;
            const decade = Math.floor(year / 10) * 10;
            decades[decade] = (decades[decade] || 0) + 1;
        }
    });
    
    const currentYear = new Date().getFullYear();
    const recent = Object.keys(years).filter(year => year >= currentYear - 5).length;
    const older = Object.keys(years).filter(year => year < currentYear - 10).length;
    
    return {
        yearRange: {
            earliest: Math.min(...Object.keys(years).map(Number)) || 'Unknown',
            latest: Math.max(...Object.keys(years).map(Number)) || 'Unknown'
        },
        distribution: {
            recent: { count: recent, label: `${currentYear - 5}-${currentYear}` },
            older: { count: older, label: `Before ${currentYear - 10}` }
        },
        decades: Object.keys(decades).map(decade => ({
            decade: `${decade}s`,
            count: decades[decade]
        })).sort((a, b) => b.decade.localeCompare(a.decade))
    };
}

/**
 * Identify specific research gaps
 */
function identifyGaps(data) {
    const gaps = [];
    
    // Framework gaps
    const frameworkCounts = {};
    data.forEach(row => {
        const frameworks = Array.isArray(row.framework) ? row.framework : [row.framework];
        frameworks.forEach(fw => {
            if (fw) frameworkCounts[fw] = (frameworkCounts[fw] || 0) + 1;
        });
    });
    
    if (!frameworkCounts['Collins'] || frameworkCounts['Collins'] < 3) {
        gaps.push({
            type: 'Framework',
            description: "Limited sources using Collins' Domains-of-Power framework",
            severity: 'High',
            recommendation: 'Seek more sources that explicitly use Collins\' theoretical framework'
        });
    }
    
    if (!frameworkCounts['AsianCrit'] || frameworkCounts['AsianCrit'] < 2) {
        gaps.push({
            type: 'Framework',
            description: 'Insufficient Asian American Critical Race Theory sources',
            severity: 'Medium',
            recommendation: 'Add more AsianCrit theoretical sources for comprehensive analysis'
        });
    }
    
    // Empirical vs theoretical balance
    const empirical = data.filter(row => row.type === 'Empirical').length;
    const theoretical = data.filter(row => row.type === 'Theoretical').length;
    
    if (empirical < theoretical * 0.5) {
        gaps.push({
            type: 'Source Type',
            description: 'Limited empirical studies compared to theoretical sources',
            severity: 'High',
            recommendation: 'Seek more empirical studies on model minority experiences'
        });
    }
    
    // "Solid middle" focus gap
    const solidMiddleSources = data.filter(row => 
        row.connection && (
            row.connection.toLowerCase().includes('solid middle') ||
            row.connection.toLowerCase().includes('moderate achievement') ||
            row.connection.toLowerCase().includes('average')
        )
    ).length;
    
    if (solidMiddleSources < 3) {
        gaps.push({
            type: 'Research Focus',
            description: 'Very few sources specifically address "solid middle" Asian American experiences',
            severity: 'Critical',
            recommendation: 'This is a major gap - seek sources on moderate achievement, average performance, or non-exceptional Asian American experiences'
        });
    }
    
    // Methodological gaps
    const methodological = data.filter(row => row.type === 'Methodological').length;
    if (methodological < 2) {
        gaps.push({
            type: 'Methodology',
            description: 'Limited methodological sources for autoethnographic approach',
            severity: 'Medium',
            recommendation: 'Add more sources on autoethnography, particularly critical autoethnography methods'
        });
    }
    
    return gaps;
}

/**
 * Generate specific recommendations
 */
function generateRecommendations(data) {
    const recommendations = [];
    
    // Search term suggestions
    recommendations.push({
        category: 'Search Terms',
        items: [
            '"model minority" AND "average achievement"',
            '"Asian American" AND "moderate success"',
            '"solid performance" AND workplace',
            'autoethnography AND "Asian American"',
            '"Collins domains of power" AND race',
            '"professional navigation" AND "non-exceptional"'
        ]
    });
    
    // Database suggestions
    recommendations.push({
        category: 'Databases to Search',
        items: [
            'Asian American Studies databases',
            'Education databases (for workplace parallels)',
            'Psychology databases (for identity formation)',
            'Sociology databases (for power structure analysis)',
            'Business databases (for professional experiences)'
        ]
    });
    
    // Theoretical development
    recommendations.push({
        category: 'Theoretical Development',
        items: [
            'More sources connecting Collins\' framework to Asian American contexts',
            'Sources on intersectionality and moderate achievement',
            'Power dynamics in professional "middle" positions',
            'Identity formation beyond exceptional narratives'
        ]
    });
    
    // Methodological strengthening
    recommendations.push({
        category: 'Methodological Sources',
        items: [
            'Critical autoethnography in race studies',
            'Narrative analysis methods',
            'Collaborative autoethnography approaches',
            'Arts-based research methods'
        ]
    });
    
    return recommendations;
}

/**
 * Get adequacy level based on count and total
 */
function getAdequacyLevel(count, total) {
    const percentage = (count / total) * 100;
    if (percentage >= 20) return 'High';
    if (percentage >= 10) return 'Medium';
    return 'Low';
}

/**
 * Calculate balance score for source types
 */
function calculateBalance(typeAnalysis) {
    if (typeAnalysis.length < 2) return 'Poor';
    
    const percentages = typeAnalysis.map(t => parseFloat(t.percentage));
    const max = Math.max(...percentages);
    const min = Math.min(...percentages);
    const ratio = min / max;
    
    if (ratio >= 0.5) return 'Good';
    if (ratio >= 0.25) return 'Fair';
    return 'Poor';
}

/**
 * Get date range from data
 */
function getDateRange(data) {
    const years = data.map(row => parseInt(row.year)).filter(year => !isNaN(year));
    if (years.length === 0) return 'Unknown';
    
    const earliest = Math.min(...years);
    const latest = Math.max(...years);
    
    return earliest === latest ? earliest.toString() : `${earliest}-${latest}`;
}

/**
 * Display gap analysis results
 */
function displayGapAnalysis(analysis) {
    const newWindow = window.open('', '_blank', 'width=1000,height=700,scrollbars=yes');
    
    if (!newWindow) {
        // Fallback: download as text file
        const analysisText = formatAnalysisAsText(analysis);
        downloadFile(analysisText, 'research_gap_analysis.txt', 'text/plain');
        showNotification('Analysis downloaded as file (popup blocked)', 'info');
        return;
    }
    
    const htmlContent = generateAnalysisHTML(analysis);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}

/**
 * Generate HTML content for analysis display
 */
function generateAnalysisHTML(analysis) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Research Gap Analysis - Literature Review Tracker</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f8f9fa;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 10px;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .section {
                    background: white;
                    padding: 25px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .section h2 {
                    color: #667eea;
                    margin-top: 0;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 10px;
                }
                .section h3 {
                    color: #4a5568;
                    margin-top: 25px;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin: 20px 0;
                }
                .metric {
                    background: #f7fafc;
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                    border-left: 4px solid #667eea;
                }
                .metric-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #667eea;
                }
                .metric-label {
                    font-size: 14px;
                    color: #718096;
                    margin-top: 5px;
                }
                .gap-item {
                    background: #fef5e7;
                    border-left: 4px solid #dd6b20;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 0 6px 6px 0;
                }
                .gap-critical {
                    background: #fed7d7;
                    border-left-color: #e53e3e;
                }
                .gap-high {
                    background: #fef5e7;
                    border-left-color: #dd6b20;
                }
                .gap-medium {
                    background: #f0fff4;
                    border-left-color: #38a169;
                }
                .recommendation-list {
                    background: #e6fffa;
                    padding: 20px;
                    border-radius: 6px;
                    margin: 15px 0;
                }
                .recommendation-list h4 {
                    color: #00695c;
                    margin-top: 0;
                }
                .recommendation-list ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                .recommendation-list li {
                    margin: 8px 0;
                    color: #2d3748;
                }
                .actions {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                }
                .btn {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    margin: 0 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 14px;
                    transition: background-color 0.3s;
                }
                .btn:hover {
                    background: #5a67d8;
                }
                .progress-bar {
                    background: #e2e8f0;
                    height: 20px;
                    border-radius: 10px;
                    overflow: hidden;
                    margin: 10px 0;
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    transition: width 0.3s ease;
                }
                @media print {
                    .actions { display: none; }
                    body { background: white; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Research Gap Analysis</h1>
                <p>Literature Review Tracker • Generated ${analysis.overview.lastUpdated}</p>
                <p>${analysis.overview.totalSources} sources analyzed • ${analysis.overview.dateRange}</p>
            </div>
            
            ${generateOverviewSection(analysis)}
            ${generateFrameworkSection(analysis.frameworks)}
            ${generateDomainsSection(analysis.domains)}
            ${generateTypesSection(analysis.types)}
            ${generateRelevanceSection(analysis.relevance)}
            ${generateTemporalSection(analysis.temporal)}
            ${generateGapsSection(analysis.gaps)}
            ${generateRecommendationsSection(analysis.recommendations)}
            
            <div class="actions">
                <button class="btn" onclick="window.print()">Print Report</button>
                <button class="btn" onclick="downloadAnalysis()">Download</button>
                <button class="btn" onclick="window.close()">Close</button>
            </div>
            
            <script>
                function downloadAnalysis() {
                    const content = document.body.innerText;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'research_gap_analysis_${new Date().getTime()}.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            </script>
        </body>
        </html>
    `;
}

/**
 * Generate overview section HTML
 */
function generateOverviewSection(analysis) {
    return `
        <div class="section">
            <h2>📊 Overview</h2>
            <div class="grid">
                <div class="metric">
                    <div class="metric-value">${analysis.overview.totalSources}</div>
                    <div class="metric-label">Total Sources</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${analysis.relevance.high.count}</div>
                    <div class="metric-label">High Relevance</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${analysis.frameworks.distribution.length}</div>
                    <div class="metric-label">Frameworks Used</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${analysis.gaps.filter(g => g.severity === 'Critical').length}</div>
                    <div class="metric-label">Critical Gaps</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate framework section HTML
 */
function generateFrameworkSection(frameworks) {
    const distributionHTML = frameworks.distribution.map(fw => `
        <div class="metric">
            <div class="metric-value">${fw.count}</div>
            <div class="metric-label">${fw.name} (${fw.percentage}%)</div>
        </div>
    `).join('');
    
    return `
        <div class="section">
            <h2>🧠 Theoretical Framework Analysis</h2>
            <div class="grid">
                ${distributionHTML}
            </div>
            ${frameworks.gaps.length > 0 ? `
                <h3>Framework Gaps:</h3>
                <p>Underrepresented frameworks: ${frameworks.gaps.join(', ')}</p>
            ` : '<p>✅ Good framework distribution</p>'}
        </div>
    `;
}

/**
 * Generate domains section HTML
 */
function generateDomainsSection(domains) {
    const distributionHTML = domains.distribution.map(domain => {
        const percentage = parseFloat(domain.percentage);
        return `
            <div class="metric">
                <div class="metric-value">${domain.count}</div>
                <div class="metric-label">${domain.name} (${domain.percentage}%)</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="section">
            <h2>⚡ Collins' Domains Coverage</h2>
            <p>Coverage: ${domains.coverage}% of sources address power domains</p>
            <div class="grid">
                ${distributionHTML}
            </div>
            ${domains.gaps.length > 0 ? `
                <h3>Domain Gaps:</h3>
                <p>Underrepresented domains: ${domains.gaps.join(', ')}</p>
            ` : '<p>✅ Good domain coverage</p>'}
        </div>
    `;
}

/**
 * Generate types section HTML
 */
function generateTypesSection(types) {
    const distributionHTML = types.distribution.map(type => `
        <div class="metric">
            <div class="metric-value">${type.count}</div>
            <div class="metric-label">${type.name} (${type.percentage}%)</div>
        </div>
    `).join('');
    
    return `
        <div class="section">
            <h2>📚 Source Type Distribution</h2>
            <p>Balance: ${types.balance}</p>
            <div class="grid">
                ${distributionHTML}
            </div>
        </div>
    `;
}

/**
 * Generate relevance section HTML
 */
function generateRelevanceSection(relevance) {
    return `
        <div class="section">
            <h2>🎯 Relevance Analysis</h2>
            <div class="grid">
                <div class="metric">
                    <div class="metric-value">${relevance.high.count}</div>
                    <div class="metric-label">High Relevance (${relevance.high.percentage}%)</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${relevance.medium.count}</div>
                    <div class="metric-label">Medium Relevance (${relevance.medium.percentage}%)</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${relevance.low.count}</div>
                    <div class="metric-label">Low Relevance (${relevance.low.percentage}%)</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${relevance.ratio}</div>
                    <div class="metric-label">High:Other Ratio</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate temporal section HTML
 */
function generateTemporalSection(temporal) {
    const decadesHTML = temporal.decades.map(d => `
        <div class="metric">
            <div class="metric-value">${d.count}</div>
            <div class="metric-label">${d.decade}</div>
        </div>
    `).join('');
    
    return `
        <div class="section">
            <h2>📅 Temporal Distribution</h2>
            <p>Range: ${temporal.yearRange.earliest} - ${temporal.yearRange.latest}</p>
            <div class="grid">
                <div class="metric">
                    <div class="metric-value">${temporal.distribution.recent.count}</div>
                    <div class="metric-label">Recent (${temporal.distribution.recent.label})</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${temporal.distribution.older.count}</div>
                    <div class="metric-label">Older (${temporal.distribution.older.label})</div>
                </div>
            </div>
            <h3>By Decade:</h3>
            <div class="grid">
                ${decadesHTML}
            </div>
        </div>
    `;
}

/**
 * Generate gaps section HTML
 */
function generateGapsSection(gaps) {
    const gapsHTML = gaps.map(gap => `
        <div class="gap-item gap-${gap.severity.toLowerCase()}">
            <h4>${gap.type} Gap (${gap.severity})</h4>
            <p><strong>Issue:</strong> ${gap.description}</p>
            <p><strong>Recommendation:</strong> ${gap.recommendation}</p>
        </div>
    `).join('');
    
    return `
        <div class="section">
            <h2>🚨 Identified Gaps</h2>
            ${gaps.length > 0 ? gapsHTML : '<p>✅ No significant gaps identified</p>'}
        </div>
    `;
}

/**
 * Generate recommendations section HTML
 */
function generateRecommendationsSection(recommendations) {
    const recsHTML = recommendations.map(rec => `
        <div class="recommendation-list">
            <h4>${rec.category}</h4>
            <ul>
                ${rec.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
    
    return `
        <div class="section">
            <h2>💡 Recommendations</h2>
            ${recsHTML}
        </div>
    `;
}

/**
 * Format analysis as plain text
 */
function formatAnalysisAsText(analysis) {
    return `
RESEARCH GAP ANALYSIS REPORT
Generated: ${analysis.overview.lastUpdated}
Total Sources: ${analysis.overview.totalSources}
Date Range: ${analysis.overview.dateRange}

FRAMEWORK ANALYSIS:
${analysis.frameworks.distribution.map(fw => `- ${fw.name}: ${fw.count} sources (${fw.percentage}%)`).join('\n')}

DOMAINS ANALYSIS:
${analysis.domains.distribution.map(d => `- ${d.name}: ${d.count} sources (${d.percentage}%)`).join('\n')}

IDENTIFIED GAPS:
${analysis.gaps.map(gap => `- ${gap.type} (${gap.severity}): ${gap.description}`).join('\n')}

RECOMMENDATIONS:
${analysis.recommendations.map(rec => `\n${rec.category}:\n${rec.items.map(item => `  • ${item}`).join('\n')}`).join('\n')}
    `.trim();
}

/**
 * Download file utility
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Export data in JSON format for backup/transfer
 */
function exportToJSON() {
    try {
        const exportData = {
            metadata: {
                version: '1.0',
                exported: new Date().toISOString(),
                tool: 'The Mighty Middle - Literature Review Tracker',
                researchQuestion: 'How have I experienced, internalized, navigated, and resisted the model minority myth as an Asian American professional with a \'solid\' rather than \'spectacular\' achievement record, and what does this reveal about how domains of power operate for the majority of Asian Americans in professional contexts?'
            },
            entries: allRows.map(row => ({
                id: row.id,
                citation: row.citation,
                year: row.year,
                type: row.type,
                framework: row.framework,
                relevance: row.relevance,
                connection: row.connection,
                concepts: row.concepts,
                domain: row.domain,
                notes: row.notes,
                pages: row.pages,
                dateAdded: row.dateAdded
            }))
        };
        
        const jsonContent = JSON.stringify(exportData, null, 2);
        downloadFile(jsonContent, 'literature_review_backup.json', 'application/json');
        
        showNotification(`Exported ${exportData.entries.length} entries as JSON backup`, 'success');
        
    } catch (error) {
        console.error('Error exporting JSON:', error);
        showNotification('Error creating JSON backup. Please try again.', 'error');
    }
}

/**
 * Generate citation report with statistics
 */
function generateCitationReport() {
    try {
        const dataToAnalyze = filteredRows.length < allRows.length ? filteredRows : allRows;
        
        if (dataToAnalyze.length === 0) {
            showNotification('No data available for citation report', 'warning');
            return;
        }
        
        const report = {
            overview: {
                totalSources: dataToAnalyze.length,
                generatedDate: new Date().toLocaleDateString(),
                researchQuestion: 'How have I experienced, internalized, navigated, and resisted the model minority myth as an Asian American professional with a \'solid\' rather than \'spectacular\' achievement record, and what does this reveal about how domains of power operate for the majority of Asian Americans in professional contexts?'
            },
            statistics: generateCitationStatistics(dataToAnalyze),
            sources: dataToAnalyze.sort((a, b) => (a.citation || '').localeCompare(b.citation || ''))
        };
        
        displayCitationReport(report);
        
        showNotification('Citation report generated successfully', 'success');
        
    } catch (error) {
        console.error('Error generating citation report:', error);
        showNotification('Error generating citation report. Please try again.', 'error');
    }
}

/**
 * Generate citation statistics
 */
function generateCitationStatistics(data) {
    const stats = {
        byYear: {},
        byType: {},
        byFramework: {},
        byRelevance: {},
        authorFrequency: {}
    };
    
    data.forEach(row => {
        // Year statistics
        const year = row.year || 'Unknown';
        stats.byYear[year] = (stats.byYear[year] || 0) + 1;
        
        // Type statistics
        const type = row.type || 'Unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        
        // Framework statistics
        const frameworks = Array.isArray(row.framework) ? row.framework : [row.framework];
        frameworks.forEach(fw => {
            if (fw) {
                stats.byFramework[fw] = (stats.byFramework[fw] || 0) + 1;
            }
        });
        
        // Relevance statistics
        const relevance = row.relevance || 'Unknown';
        stats.byRelevance[relevance] = (stats.byRelevance[relevance] || 0) + 1;
        
        // Author frequency (basic extraction from citation)
        const citation = row.citation || '';
        const authorMatch = citation.match(/^([^(]+)/);
        if (authorMatch) {
            const author = authorMatch[1].trim().replace(/,$/, '');
            if (author.length > 1) {
                stats.authorFrequency[author] = (stats.authorFrequency[author] || 0) + 1;
            }
        }
    });
    
    return stats;
}

/**
 * Display citation report
 */
function displayCitationReport(report) {
    const newWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    
    if (!newWindow) {
        // Fallback: download as file
        const reportText = formatCitationReportAsText(report);
        downloadFile(reportText, 'citation_report.txt', 'text/plain');
        showNotification('Citation report downloaded as file (popup blocked)', 'info');
        return;
    }
    
    const htmlContent = generateCitationReportHTML(report);
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}

/**
 * Generate citation report HTML
 */
function generateCitationReportHTML(report) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Citation Report - Literature Review Tracker</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 30px;
                    line-height: 1.6;
                    color: #333;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #333;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .research-question {
                    background: #f8f9fa;
                    padding: 20px;
                    border-left: 4px solid #667eea;
                    margin: 20px 0;
                    font-style: italic;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
                .stat-box {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    border: 1px solid #dee2e6;
                }
                .stat-box h4 {
                    margin-top: 0;
                    color: #495057;
                }
                .sources-list {
                    margin-top: 30px;
                }
                .source-item {
                    margin-bottom: 15px;
                    padding: 10px;
                    border-left: 3px solid #dee2e6;
                    background: #f8f9fa;
                }
                .source-meta {
                    font-size: 0.9em;
                    color: #6c757d;
                    margin-top: 5px;
                }
                .actions {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #dee2e6;
                }
                .btn {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin: 0 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .btn:hover {
                    background: #5a67d8;
                }
                @media print {
                    .actions { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Citation Report</h1>
                <p>Literature Review Tracker • ${report.overview.generatedDate}</p>
                <p>${report.overview.totalSources} sources</p>
            </div>
            
            <div class="research-question">
                <strong>Research Question:</strong><br>
                ${escapeHtml(report.overview.researchQuestion)}
            </div>
            
            <h2>Statistics</h2>
            <div class="stats-grid">
                <div class="stat-box">
                    <h4>By Publication Year</h4>
                    ${Object.entries(report.statistics.byYear)
                        .sort(([a], [b]) => b.localeCompare(a))
                        .slice(0, 10)
                        .map(([year, count]) => `<div>${year}: ${count}</div>`).join('')}
                </div>
                
                <div class="stat-box">
                    <h4>By Source Type</h4>
                    ${Object.entries(report.statistics.byType)
                        .sort(([,a], [,b]) => b - a)
                        .map(([type, count]) => `<div>${type}: ${count}</div>`).join('')}
                </div>
                
                <div class="stat-box">
                    <h4>By Theoretical Framework</h4>
                    ${Object.entries(report.statistics.byFramework)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 8)
                        .map(([fw, count]) => `<div>${fw}: ${count}</div>`).join('')}
                </div>
                
                <div class="stat-box">
                    <h4>By Relevance Level</h4>
                    ${Object.entries(report.statistics.byRelevance)
                        .sort(([,a], [,b]) => b - a)
                        .map(([rel, count]) => `<div>${rel}: ${count}</div>`).join('')}
                </div>
            </div>
            
            <div class="sources-list">
                <h2>Complete Source List</h2>
                ${report.sources.map((source, index) => `
                    <div class="source-item">
                        <div>${index + 1}. ${escapeHtml(source.citation || 'Unknown citation')}</div>
                        <div class="source-meta">
                            ${source.type || 'Unknown type'} • 
                            ${source.relevance || 'Unknown relevance'} relevance • 
                            ${Array.isArray(source.framework) ? source.framework.join(', ') : (source.framework || 'No framework')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="actions">
                <button class="btn" onclick="window.print()">Print Report</button>
                <button class="btn" onclick="downloadReport()">Download</button>
                <button class="btn" onclick="window.close()">Close</button>
            </div>
            
            <script>
                function downloadReport() {
                    const content = document.body.innerText;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'citation_report_${new Date().getTime()}.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            </script>
        </body>
        </html>
    `;
}

/**
 * Format citation report as plain text
 */
function formatCitationReportAsText(report) {
    const stats = report.statistics;
    
    return `
CITATION REPORT
Generated: ${report.overview.generatedDate}
Total Sources: ${report.overview.totalSources}

RESEARCH QUESTION:
${report.overview.researchQuestion}

STATISTICS:

By Publication Year:
${Object.entries(stats.byYear)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, count]) => `${year}: ${count}`)
    .join('\n')}

By Source Type:
${Object.entries(stats.byType)
    .sort(([,a], [,b]) => b - a)
    .map(([type, count]) => `${type}: ${count}`)
    .join('\n')}

By Theoretical Framework:
${Object.entries(stats.byFramework)
    .sort(([,a], [,b]) => b - a)
    .map(([fw, count]) => `${fw}: ${count}`)
    .join('\n')}

COMPLETE SOURCE LIST:
${report.sources.map((source, index) => 
    `${index + 1}. ${source.citation || 'Unknown citation'}`
).join('\n')}
    `.trim();
}

/**
 * Advanced export with custom options
 */
function showExportOptions() {
    const options = `
        <div id="exportModal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        ">
            <div style="
                background: white; padding: 30px; border-radius: 10px;
                max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;
            ">
                <h3>Export Options</h3>
                
                <div style="margin: 20px 0;">
                    <label><strong>Data to Export:</strong></label><br>
                    <label><input type="radio" name="exportData" value="all" checked> All sources</label><br>
                    <label><input type="radio" name="exportData" value="filtered"> Currently filtered sources (${filteredRows.length})</label><br>
                    <label><input type="radio" name="exportData" value="high"> High relevance only</label>
                </div>
                
                <div style="margin: 20px 0;">
                    <label><strong>Export Format:</strong></label><br>
                    <label><input type="radio" name="exportFormat" value="csv" checked> CSV (Excel compatible)</label><br>
                    <label><input type="radio" name="exportFormat" value="json"> JSON (backup format)</label><br>
                    <label><input type="radio" name="exportFormat" value="bib"> Bibliography (formatted text)</label><br>
                    <label><input type="radio" name="exportFormat" value="report"> Citation Report (detailed)</label>
                </div>
                
                <div style="margin: 20px 0;">
                    <label><strong>Include Fields:</strong></label><br>
                    <label><input type="checkbox" checked> Citation</label>
                    <label><input type="checkbox" checked> Year</label>
                    <label><input type="checkbox" checked> Type</label><br>
                    <label><input type="checkbox" checked> Framework</label>
                    <label><input type="checkbox" checked> Relevance</label>
                    <label><input type="checkbox" checked> Notes</label>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button onclick="performCustomExport()" style="
                        background: #667eea; color: white; border: none;
                        padding: 12px 24px; border-radius: 6px; margin: 0 10px;
                        cursor: pointer;
                    ">Export</button>
                    <button onclick="closeExportModal()" style="
                        background: #6c757d; color: white; border: none;
                        padding: 12px 24px; border-radius: 6px; margin: 0 10px;
                        cursor: pointer;
                    ">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', options);
}

/**
 * Perform custom export based on user selections
 */
function performCustomExport() {
    try {
        const modal = document.getElementById('exportModal');
        const dataType = modal.querySelector('input[name="exportData"]:checked').value;
        const format = modal.querySelector('input[name="exportFormat"]:checked').value;
        
        let dataToExport;
        switch (dataType) {
            case 'filtered':
                dataToExport = filteredRows;
                break;
            case 'high':
                dataToExport = allRows.filter(row => row.relevance === 'High');
                break;
            default:
                dataToExport = allRows;
        }
        
        // Perform export based on format
        switch (format) {
            case 'json':
                exportSelectedToJSON(dataToExport);
                break;
            case 'bib':
                generateSelectedBibliography(dataToExport);
                break;
            case 'report':
                generateSelectedCitationReport(dataToExport);
                break;
            default:
                exportSelectedToCSV(dataToExport);
        }
        
        closeExportModal();
        
    } catch (error) {
        console.error('Error performing custom export:', error);
        showNotification('Error performing export. Please try again.', 'error');
    }
}

/**
 * Close export modal
 */
function closeExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Export selected data to CSV
 */
function exportSelectedToCSV(data) {
    const headers = [
        'Citation', 'Year', 'Type', 'Framework', 'Relevance',
        'Connection', 'Concepts', 'Domain', 'Notes', 'Pages'
    ];
    
    const csvContent = generateCSVContent(data, headers);
    downloadFile(csvContent, `literature_export_${new Date().getTime()}.csv`, 'text/csv');
    
    showNotification(`Exported ${data.length} entries to CSV`, 'success');
}

/**
 * Export selected data to JSON
 */
function exportSelectedToJSON(data) {
    const exportData = {
        metadata: {
            version: '1.0',
            exported: new Date().toISOString(),
            tool: 'Literature Review Tracker',
            count: data.length
        },
        entries: data
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, `literature_export_${new Date().getTime()}.json`, 'application/json');
    
    showNotification(`Exported ${data.length} entries to JSON`, 'success');
}

/**
 * Generate bibliography for selected data
 */
function generateSelectedBibliography(data) {
    if (data.length === 0) {
        showNotification('No sources selected for bibliography', 'warning');
        return;
    }
    
    const sortedSources = [...data].sort((a, b) => 
        (a.citation || '').localeCompare(b.citation || '')
    );
    
    const bibliographyContent = sortedSources
        .map(source => source.citation || 'Unknown source')
        .join('\n\n');
    
    displayBibliography(bibliographyContent, 'Selected', sortedSources.length);
}

/**
 * Generate citation report for selected data
 */
function generateSelectedCitationReport(data) {
    if (data.length === 0) {
        showNotification('No sources selected for report', 'warning');
        return;
    }
    
    const report = {
        overview: {
            totalSources: data.length,
            generatedDate: new Date().toLocaleDateString(),
            researchQuestion: 'How have I experienced, internalized, navigated, and resisted the model minority myth as an Asian American professional with a \'solid\' rather than \'spectacular\' achievement record, and what does this reveal about how domains of power operate for the majority of Asian Americans in professional contexts?'
        },
        statistics: generateCitationStatistics(data),
        sources: data.sort((a, b) => (a.citation || '').localeCompare(b.citation || ''))
    };
    
    displayCitationReport(report);
}

// Global export functions
window.exportToCSV = exportToCSV;
window.generateBibliography = generateBibliography;
window.analyzeGaps = analyzeGaps;
window.exportToJSON = exportToJSON;
window.generateCitationReport = generateCitationReport;
window.showExportOptions = showExportOptions;
window.performCustomExport = performCustomExport;
window.closeExportModal = closeExportModal;
