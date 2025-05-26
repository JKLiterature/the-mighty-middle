/**
 * Literature Review Tracker - Filtering and Search Logic
 * Handles all filtering, searching, and sorting functionality
 */

// Filter state management
let activeFilters = {
    framework: '',
    relevance: '',
    search: '',
    type: '',
    year: '',
    domain: ''
};

// Search configuration
const SEARCH_CONFIG = {
    debounceDelay: 300,
    minSearchLength: 2,
    searchFields: ['citation', 'concepts', 'notes', 'connection', 'domain', 'pages']
};

// Debounced search function
let searchTimeout;

/**
 * Initialize filtering functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    setupFilterEventListeners();
    setupAdvancedFilters();
    loadSavedFilters();
});

/**
 * Setup event listeners for filter controls
 */
function setupFilterEventListeners() {
    // Framework filter
    const frameworkFilter = document.getElementById('frameworkFilter');
    if (frameworkFilter) {
        frameworkFilter.addEventListener('change', handleFrameworkFilter);
    }
    
    // Relevance filter
    const relevanceFilter = document.getElementById('relevanceFilter');
    if (relevanceFilter) {
        relevanceFilter.addEventListener('change', handleRelevanceFilter);
    }
    
    // Search input with debouncing
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keydown', handleSearchKeydown);
    }
    
    // Filter buttons
    const applyBtn = document.querySelector('[onclick="applyFilters()"]');
    if (applyBtn) {
        applyBtn.removeAttribute('onclick');
        applyBtn.addEventListener('click', applyFilters);
    }
    
    const clearBtn = document.querySelector('[onclick="clearFilters()"]');
    if (clearBtn) {
        clearBtn.removeAttribute('onclick');
        clearBtn.addEventListener('click', clearFilters);
    }
}

/**
 * Setup advanced filtering options
 */
function setupAdvancedFilters() {
    // Add advanced filter toggle
    const controlsSection = document.querySelector('.controls');
    if (controlsSection && !document.getElementById('advancedFilters')) {
        const advancedToggle = document.createElement('div');
        advancedToggle.className = 'advanced-filters-toggle';
        advancedToggle.innerHTML = `
            <button type="button" id="toggleAdvanced" class="secondary-btn" aria-expanded="false" aria-controls="advancedFilters">
                Advanced Filters
            </button>
        `;
        
        const advancedSection = document.createElement('div');
        advancedSection.id = 'advancedFilters';
        advancedSection.className = 'advanced-filters hidden';
        advancedSection.setAttribute('aria-hidden', 'true');
        advancedSection.innerHTML = `
            <div class="filter-row">
                <label for="typeFilter">Filter by Type:</label>
                <select id="typeFilter" aria-describedby="type-help">
                    <option value="">All Types</option>
                    <option value="Theoretical">Theoretical</option>
                    <option value="Empirical">Empirical</option>
                    <option value="Methodological">Methodological</option>
                    <option value="Literature Review">Literature Review</option>
                </select>
                <small id="type-help" class="help-text">Filter by source type</small>
            </div>
            
            <div class="filter-row">
                <label for="yearFilter">Filter by Year:</label>
                <select id="yearFilter" aria-describedby="year-help">
                    <option value="">All Years</option>
                    <option value="2020-2025">2020-2025</option>
                    <option value="2015-2019">2015-2019</option>
                    <option value="2010-2014">2010-2014</option>
                    <option value="2005-2009">2005-2009</option>
                    <option value="2000-2004">2000-2004</option>
                    <option value="before-2000">Before 2000</option>
                </select>
                <small id="year-help" class="help-text">Filter by publication year range</small>
            </div>
            
            <div class="filter-row">
                <label for="domainFilter">Filter by Domain:</label>
                <select id="domainFilter" aria-describedby="domain-help">
                    <option value="">All Domains</option>
                    <option value="Structural">Structural</option>
                    <option value="Disciplinary">Disciplinary</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Interpersonal">Interpersonal</option>
                </select>
                <small id="domain-help" class="help-text">Filter by Collins' power domains</small>
            </div>
            
            <div class="filter-actions">
                <button type="button" onclick="applyAdvancedFilters()" class="primary-btn">Apply Advanced Filters</button>
                <button type="button" onclick="clearAdvancedFilters()" class="secondary-btn">Clear Advanced</button>
            </div>
        `;
        
        controlsSection.appendChild(advancedToggle);
        controlsSection.appendChild(advancedSection);
        
        // Setup toggle functionality
        document.getElementById('toggleAdvanced').addEventListener('click', toggleAdvancedFilters);
        
        // Setup advanced filter listeners
        setup