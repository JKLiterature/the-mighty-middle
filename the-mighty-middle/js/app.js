/**
 * Literature Review Tracker - Main Application Logic
 * Handles data management, UI interactions, and core functionality
 */

// Global variables
let allRows = [];
let filteredRows = [];
let currentResearchQuestion = '';

// Configuration
const CONFIG = {
    STORAGE_KEY: 'literature_tracker_data',
    QUESTION_KEY: 'literature_tracker_question',
    MAX_EXPORT_ROWS: 10000,
    AUTOSAVE_INTERVAL: 30000, // 30 seconds
};

// Sample data for initial load
const SAMPLE_DATA = [
    {
        citation: "Collins, P. H. (2017). On intellectual activism",
        year: "2017",
        type: "Theoretical",
        framework: ["Collins", "Intersectionality"],
        relevance: "High",
        connection: "Provides core theoretical framework for analyzing power domains affecting 'solid middle' Asian Americans",
        concepts: "Domains of power framework; structural, disciplinary, cultural, interpersonal dimensions",
        domain: "All domains - foundational framework",
        notes: '"How specific combinations of systems of oppression mean in reality" - directly cited in proposal',
        pages: "Ch. 2-3"
    },
    {
        citation: "Lee, S. J. (2009). Unraveling the 'model minority' stereotype",
        year: "2009",
        type: "Empirical",
        framework: ["MMM", "AsianCrit"],
        relevance: "High",
        connection: "Examines model minority impacts on Asian American students - parallel to professional contexts",
        concepts: "Academic pressure, psychological impacts, achievement expectations",
        domain: "Cultural, Interpersonal",
        notes: "Documents experiences of students who don't meet exceptional standards - directly relevant to 'solid middle'",
        pages: "pp. 45-67"
    },
    {
        citation: "Chang, H. (2008). Autoethnography as method",
        year: "2008",
        type: "Methodological",
        framework: ["Autoethnography"],
        relevance: "High",
        connection: "Provides methodological foundation for multi-modal autoethnographic approach",
        concepts: "Critical autoethnography, layered accounts, analytical rigor",
        domain: "N/A - Methodological",
        notes: "Essential for methodology chapter - addresses scholarly rigor concerns",
        pages: "Ch. 4, pp. 89-112"
    }
];

// Framework configurations
const FRAMEWORKS = {
    'Collins': { name: "Collins' Domains of Power", class: 'collins' },
    'AsianCrit': { name: 'Asian American Critical Race Theory', class: 'asiancrit' },
    'MMM': { name: 'Model Minority Myth', class: 'mmm' },
    'Autoethnography': { name: 'Autoethnography', class: 'autoethnography' },
    'Intersectionality': { name: 'Intersectionality', class: 'intersectionality' }
};

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Literature Review Tracker initializing...');
    
    try {
        initializeApplication();
        setupEventListeners();
        loadSavedData();
        setupAutosave();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showNotification('Error initializing application. Please refresh the page.', 'error');
    }
});

/**
 * Initialize core application components
 */
function initializeApplication() {
    // Load research question
    loadResearchQuestion();
    
    // Initialize data arrays
    if (allRows.length === 0) {
        loadSampleData();
    }
    
    // Render initial data
    renderTable();
    updateStats();
    
    // Set up accessibility
    setupAccessibility();
}

/**
 * Set up event listeners for UI interactions
 */
function setupEventListeners() {
    // Form submission for new entries
    const addButton = document.querySelector('[onclick="addNewEntry()"]');
    if (addButton) {
        addButton.addEventListener('click', addNewEntry);
    }
    
    // Clear new entry form
    const clearButton = document.querySelector('[onclick="clearNewEntry()"]');
    if (clearButton) {
        clearButton.addEventListener('click', clearNewEntry);
    }
    
    // Research question saving
    const saveQuestionBtn = document.querySelector('.save-question-btn');
    if (saveQuestionBtn) {
        saveQuestionBtn.addEventListener('click', saveResearchQuestion);
    }
    
    // Enter key handling for forms
    setupKeyboardNavigation();
    
    // File input for data import
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileImport);
    }
}

/**
 * Setup keyboard navigation and accessibility features
 */
function setupAccessibility() {
    // Add ARIA live regions for dynamic updates
    if (!document.getElementById('status-announcements')) {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'status-announcements';
        statusDiv.setAttribute('aria-live', 'polite');
        statusDiv.setAttribute('aria-atomic', 'true');
        statusDiv.style.position = 'absolute';
        statusDiv.style.left = '-10000px';
        statusDiv.style.width = '1px';
        statusDiv.style.height = '1px';
        statusDiv.style.overflow = 'hidden';
        document.body.appendChild(statusDiv);
    }
    
    // Improve table accessibility
    const table = document.getElementById('literatureTable');
    if (table) {
        table.setAttribute('role', 'table');
        table.setAttribute('aria-label', 'Literature review sources');
    }
}

/**
 * Setup keyboard navigation
 */
function setupKeyboardNavigation() {
    // Enter key to add new entry
    const newEntryInputs = document.querySelectorAll('.add-row input, .add-row select, .add-row textarea');
    newEntryInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                addNewEntry();
            }
        });
    });
    
    // Escape key to clear form
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.closest('.add-row')) {
                clearNewEntry();
            }
        }
    });
}

/**
 * Load sample data for demonstration
 */
function loadSampleData() {
    console.log('Loading sample data...');
    
    allRows = SAMPLE_DATA.map((data, index) => ({
        id: `sample_${index}`,
        ...data,
        element: null // Will be created when rendering
    }));
    
    filteredRows = [...allRows];
}

/**
 * Add a new literature entry
 */
function addNewEntry() {
    try {
        const formData = getNewEntryFormData();
        
        // Validate required fields
        const validation = validateNewEntry(formData);
        if (!validation.isValid) {
            showNotification(`Please fill in required fields: ${validation.missingFields.join(', ')}`, 'error');
            focusFirstMissingField(validation.missingFields);
            return;
        }
        
        // Create new entry
        const newEntry = createNewEntry(formData);
        
        // Add to data arrays
        allRows.push(newEntry);
        filteredRows = [...allRows];
        
        // Update UI
        renderTable();
        updateStats();
        clearNewEntry();
        saveToStorage();
        
        // Announce to screen readers
        announceToScreenReader(`Added new entry: ${formData.citation}`);
        
        showNotification('Entry added successfully!', 'success');
        
        console.log('New entry added:', newEntry);
        
    } catch (error) {
        console.error('Error adding new entry:', error);
        showNotification('Error adding entry. Please try again.', 'error');
    }
}

/**
 * Get form data for new entry
 */
function getNewEntryFormData() {
    return {
        citation: document.getElementById('newCitation')?.value?.trim() || '',
        year: document.getElementById('newYear')?.value?.trim() || '',
        type: document.getElementById('newType')?.value || '',
        framework: document.getElementById('newFramework')?.value || '',
        relevance: document.getElementById('newRelevance')?.value || '',
        connection: document.getElementById('newConnection')?.value?.trim() || '',
        concepts: document.getElementById('newConcepts')?.value?.trim() || '',
        domain: document.getElementById('newDomain')?.value?.trim() || '',
        notes: document.getElementById('newNotes')?.value?.trim() || '',
        pages: document.getElementById('newPages')?.value?.trim() || ''
    };
}

/**
 * Validate new entry form data
 */
function validateNewEntry(formData) {
    const requiredFields = ['citation', 'year', 'type', 'framework', 'relevance'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    return {
        isValid: missingFields.length === 0,
        missingFields: missingFields
    };
}

/**
 * Focus the first missing required field
 */
function focusFirstMissingField(missingFields) {
    const fieldMapping = {
        citation: 'newCitation',
        year: 'newYear',
        type: 'newType',
        framework: 'newFramework',
        relevance: 'newRelevance'
    };
    
    const firstMissingField = missingFields[0];
    const elementId = fieldMapping[firstMissingField];
    const element = document.getElementById(elementId);
    
    if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Create new entry object
 */
function createNewEntry(formData) {
    const id = `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
        id: id,
        citation: formData.citation,
        year: formData.year,
        type: formData.type,
        framework: Array.isArray(formData.framework) ? formData.framework : [formData.framework],
        relevance: formData.relevance,
        connection: formData.connection,
        concepts: formData.concepts,
        domain: formData.domain,
        notes: formData.notes,
        pages: formData.pages,
        dateAdded: new Date().toISOString(),
        element: null
    };
}

/**
 * Clear the new entry form
 */
function clearNewEntry() {
    const formFields = [
        'newCitation', 'newYear', 'newType', 'newFramework', 'newRelevance',
        'newConnection', 'newConcepts', 'newDomain', 'newNotes', 'newPages'
    ];
    
    formFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = '';
        }
    });
    
    // Focus first field for better UX
    const firstField = document.getElementById('newCitation');
    if (firstField) {
        firstField.focus();
    }
    
    announceToScreenReader('Form cleared');
}

/**
 * Render the literature table
 */
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }
    
    // Store the add row
    const addRow = tableBody.querySelector('.add-row');
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    // Render filtered rows
    filteredRows.forEach((row, index) => {
        const rowElement = createTableRow(row, index);
        tableBody.appendChild(rowElement);
        
        // Update the row's element reference
        row.element = rowElement;
    });
    
    // Re-add the add row
    if (addRow) {
        tableBody.appendChild(addRow);
    }
    
    // Update accessibility
    updateTableAccessibility();
}

/**
 * Create a table row element
 */
function createTableRow(data, index) {
    const row = document.createElement('tr');
    row.setAttribute('role', 'row');
    row.setAttribute('data-entry-id', data.id);
    
    // Add animation class
    row.classList.add('fade-in');
    
    const frameworkTags = createFrameworkTags(data.framework);
    const relevanceClass = `relevance-${data.relevance.toLowerCase()}`;
    
    row.innerHTML = `
        <td class="citation" role="gridcell">${escapeHtml(data.citation)}</td>
        <td role="gridcell">${escapeHtml(data.year)}</td>
        <td role="gridcell">${escapeHtml(data.type)}</td>
        <td role="gridcell">${frameworkTags}</td>
        <td class="${relevanceClass}" role="gridcell">${escapeHtml(data.relevance)}</td>
        <td role="gridcell">${escapeHtml(data.connection)}</td>
        <td role="gridcell">${escapeHtml(data.concepts)}</td>
        <td role="gridcell">${escapeHtml(data.domain)}</td>
        <td class="notes-cell" role="gridcell" title="${escapeHtml(data.notes)}">${escapeHtml(data.notes)}</td>
        <td role="gridcell">${escapeHtml(data.pages)}</td>
    `;
    
    // Add click handler for row actions
    row.addEventListener('dblclick', () => editEntry(data.id));
    
    return row;
}

/**
 * Create framework tags HTML
 */
function createFrameworkTags(frameworks) {
    if (!Array.isArray(frameworks)) {
        frameworks = [frameworks];
    }
    
    return frameworks.map(framework => {
        const config = FRAMEWORKS[framework] || { name: framework, class: 'default' };
        return `<span class="framework-tag ${config.class}" title="${config.name}">${framework}</span>`;
    }).join('');
}

/**
 * Update table accessibility attributes
 */
function updateTableAccessibility() {
    const table = document.getElementById('literatureTable');
    if (table) {
        const rowCount = filteredRows.length;
        table.setAttribute('aria-rowcount', rowCount + 1); // +1 for header
        
        // Update row indices
        const rows = table.querySelectorAll('tbody tr:not(.add-row)');
        rows.forEach((row, index) => {
            row.setAttribute('aria-rowindex', index + 2); // +2 because header is row 1
        });
    }
}

/**
 * Update statistics display
 */
function updateStats() {
    const stats = {
        total: allRows.length,
        highRelevance: allRows.filter(row => row.relevance === 'High').length,
        theoretical: allRows.filter(row => row.type === 'Theoretical').length,
        empirical: allRows.filter(row => row.type === 'Empirical').length
    };
    
    // Update DOM elements
    const elements = {
        totalSources: document.getElementById('totalSources'),
        highRelevance: document.getElementById('highRelevance'),
        theoreticalSources: document.getElementById('theoreticalSources'),
        empiricalSources: document.getElementById('empiricalSources')
    };
    
    Object.keys(elements).forEach(key => {
        const element = elements[key];
        const statKey = key.replace('Sources', '').replace(/([A-Z])/g, (match, letter) => 
            letter === 'H' ? 'highRelevance' : letter.toLowerCase()
        );
        
        if (element && stats[statKey] !== undefined) {
            element.textContent = stats[statKey];
            element.setAttribute('aria-label', `${stats[statKey]} ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        }
    });
    
    console.log('Statistics updated:', stats);
}

/**
 * Edit an existing entry
 */
function editEntry(entryId) {
    const entry = allRows.find(row => row.id === entryId);
    if (!entry) {
        console.error('Entry not found:', entryId);
        return;
    }
    
    // Fill form with existing data
    document.getElementById('newCitation').value = entry.citation;
    document.getElementById('newYear').value = entry.year;
    document.getElementById('newType').value = entry.type;
    document.getElementById('newFramework').value = Array.isArray(entry.framework) ? entry.framework[0] : entry.framework;
    document.getElementById('newRelevance').value = entry.relevance;
    document.getElementById('newConnection').value = entry.connection;
    document.getElementById('newConcepts').value = entry.concepts;
    document.getElementById('newDomain').value = entry.domain;
    document.getElementById('newNotes').value = entry.notes;
    document.getElementById('newPages').value = entry.pages;
    
    // Remove the existing entry
    deleteEntry(entryId);
    
    // Scroll to form
    document.querySelector('.add-row').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('newCitation').focus();
    
    showNotification('Entry loaded for editing. Make changes and click "Add New Entry" to save.', 'info');
}

/**
 * Delete an entry
 */
function deleteEntry(entryId) {
    allRows = allRows.filter(row => row.id !== entryId);
    filteredRows = filteredRows.filter(row => row.id !== entryId);
    
    renderTable();
    updateStats();
    saveToStorage();
    
    announceToScreenReader('Entry deleted');
}

/**
 * Save and load research question
 */
function saveResearchQuestion() {
    const questionElement = document.querySelector('.editable-question');
    if (questionElement) {
        currentResearchQuestion = questionElement.textContent.trim();
        localStorage.setItem(CONFIG.QUESTION_KEY, currentResearchQuestion);
        showNotification('Research question saved!', 'success');
        announceToScreenReader('Research question saved');
    }
}

function loadResearchQuestion() {
    const saved = localStorage.getItem(CONFIG.QUESTION_KEY);
    if (saved) {
        currentResearchQuestion = saved;
        const questionElement = document.querySelector('.editable-question');
        if (questionElement) {
            questionElement.textContent = saved;
        }
    }
}

/**
 * Data persistence functions
 */
function saveToStorage() {
    try {
        const dataToSave = {
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
            })),
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('Data saved to storage');
        
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Error saving data. Storage may be full.', 'error');
    }
}

function loadSavedData() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            if (data.entries && Array.isArray(data.entries)) {
                allRows = data.entries.map(entry => ({
                    ...entry,
                    element: null
                }));
                filteredRows = [...allRows];
                
                renderTable();
                updateStats();
                
                console.log(`Loaded ${allRows.length} entries from storage`);
                showNotification(`Loaded ${allRows.length} saved entries`, 'success');
            }
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
        showNotification('Error loading saved data. Using sample data.', 'warning');
        loadSampleData();
    }
}

/**
 * Manual save/load functions
 */
function saveData() {
    saveToStorage();
    showNotification('Data saved successfully!', 'success');
}

function loadData() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.click();
    }
}

/**
 * Handle file import
 */
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.entries && Array.isArray(data.entries)) {
                allRows = data.entries.map(entry => ({
                    ...entry,
                    element: null
                }));
                filteredRows = [...allRows];
                
                renderTable();
                updateStats();
                saveToStorage();
                
                showNotification(`Imported ${allRows.length} entries successfully!`, 'success');
            } else {
                throw new Error('Invalid file format');
            }
            
        } catch (error) {
            console.error('Error importing file:', error);
            showNotification('Error importing file. Please check the file format.', 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Clear the input
    event.target.value = '';
}

/**
 * Setup autosave functionality
 */
function setupAutosave() {
    setInterval(() => {
        if (allRows.length > 0) {
            saveToStorage();
        }
    }, CONFIG.AUTOSAVE_INTERVAL);
    
    // Save on page unload
    window.addEventListener('beforeunload', saveToStorage);
}

/**
 * Utility functions
 */
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        return '';
    }
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'error' ? '#fee' : type === 'success' ? '#efe' : type === 'warning' ? '#ffe' : '#eef'};
        border: 1px solid ${type === 'error' ? '#fcc' : type === 'success' ? '#cfc' : type === 'warning' ? '#ffc' : '#ccf'};
        border-radius: 4px;
        color: ${type === 'error' ? '#c00' : type === 'success' ? '#060' : type === 'warning' ? '#c60' : '#006'};
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function announceToScreenReader(message) {
    const statusElement = document.getElementById('status-announcements');
    if (statusElement) {
        statusElement.textContent = message;
        // Clear after announcement
        setTimeout(() => {
            statusElement.textContent = '';
        }, 1000);
    }
}

// Export functions for global access
window.addNewEntry = addNewEntry;
window.clearNewEntry = clearNewEntry;
window.saveResearchQuestion = saveResearchQuestion;
window.saveData = saveData;
window.loadData = loadData;