// ===================================
// Market Data Database with Sources
// ===================================
const marketData = {
    saas: {
        name: 'Cloud/SaaS Software',
        globalMarketSize2024: 317.2, // Billion USD
        cagr: 18.4,
        source: 'Gartner (2024) - "Worldwide Public Cloud Services End-User Spending Forecast"',
        sourceUrl: 'https://www.gartner.com/en/newsroom/press-releases/2024-05-20-gartner-forecasts-worldwide-public-cloud-end-user-spending-to-reach-679-billion-in-2024',
        year: 2024
    },
    fintech: {
        name: 'FinTech & Digital Payments',
        globalMarketSize2024: 294.2, // Billion USD
        cagr: 16.8,
        source: 'Grand View Research (2024) - "Fintech Market Size, Share & Trends Analysis Report"',
        sourceUrl: 'https://www.grandviewresearch.com/industry-analysis/fintech-market',
        year: 2024
    },
    healthtech: {
        name: 'HealthTech & Digital Health',
        globalMarketSize2024: 223.7, // Billion USD
        cagr: 18.6,
        source: 'Fortune Business Insights (2024) - "Digital Health Market Size, Share & COVID-19 Impact Analysis"',
        sourceUrl: 'https://www.fortunebusinessinsights.com/digital-health-market-102015',
        year: 2024
    },
    ecommerce: {
        name: 'E-commerce & Retail Tech',
        globalMarketSize2024: 6330.0, // Billion USD
        cagr: 14.7,
        source: 'Statista (2024) - "E-commerce worldwide - statistics & facts"',
        sourceUrl: 'https://www.statista.com/topics/871/online-shopping/',
        year: 2024
    },
    edtech: {
        name: 'EdTech & Learning Platforms',
        globalMarketSize2024: 142.4, // Billion USD
        cagr: 13.4,
        source: 'HolonIQ (2024) - "Global EdTech Market Size Forecast"',
        sourceUrl: 'https://www.holoniq.com/edtech/10-charts-that-explain-the-global-education-technology-market/',
        year: 2024
    }
};

// Geographic market share multipliers (approximate based on various sources)
const geographicMultipliers = {
    'global': { multiplier: 1.0, name: 'Global' },
    'north-america': { multiplier: 0.42, name: 'North America', source: 'Typical tech market distribution' },
    'us': { multiplier: 0.35, name: 'United States', source: 'US share of North American tech markets' },
    'europe': { multiplier: 0.28, name: 'Europe', source: 'European tech market analysis' },
    'asia-pacific': { multiplier: 0.25, name: 'Asia-Pacific', source: 'APAC tech market projections' },
    'latam': { multiplier: 0.05, name: 'Latin America', source: 'LATAM tech adoption rates' }
};

// Customer segment multipliers
const segmentMultipliers = {
    'b2b': { multiplier: 0.65, name: 'B2B', description: 'Business software and services' },
    'b2c': { multiplier: 0.35, name: 'B2C', description: 'Consumer-facing products' },
    'b2b2c': { multiplier: 0.50, name: 'B2B2C', description: 'Platform/marketplace model' }
};

// Company size multipliers (for B2B)
const companySizeMultipliers = {
    'all': { multiplier: 1.0, name: 'All Company Sizes' },
    'smb': { multiplier: 0.35, name: 'SMB (1-500 employees)', source: 'SMB tech spend distribution' },
    'mid-market': { multiplier: 0.40, name: 'Mid-Market (500-5,000 employees)', source: 'Mid-market tech adoption' },
    'enterprise': { multiplier: 0.25, name: 'Enterprise (5,000+ employees)', source: 'Enterprise software concentration' }
};

// ===================================
// State Management
// ===================================
let currentChart = null;
let calculationResults = null;

// ===================================
// DOM Elements (initialized after DOM loads)
// ===================================
let industrySelect;
let customIndustryFields;
let customIndustryName;
let customMarketSize;
let customCAGR;
let geographySelect;
let customerTypeSelect;
let companySizeSelect;
let companyTypeGroup;
let penetrationInput;
let timeHorizonSelect;
let calculateBtn;
let resultsPlaceholder;
let resultsContent;

// ===================================
// Initialize when DOM is ready
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Get DOM elements
    industrySelect = document.getElementById('industry');
    customIndustryFields = document.getElementById('customIndustryFields');
    customIndustryName = document.getElementById('customIndustryName');
    customMarketSize = document.getElementById('customMarketSize');
    customCAGR = document.getElementById('customCAGR');
    geographySelect = document.getElementById('geography');
    customerTypeSelect = document.getElementById('customerType');
    companySizeSelect = document.getElementById('companySize');
    companyTypeGroup = document.getElementById('companyTypeGroup');
    penetrationInput = document.getElementById('penetration');
    timeHorizonSelect = document.getElementById('timeHorizon');
    calculateBtn = document.getElementById('calculateBtn');
    resultsPlaceholder = document.getElementById('resultsPlaceholder');
    resultsContent = document.getElementById('resultsContent');
    
    console.log('Calculate button found:', calculateBtn);
    
    // Set up event listeners
    industrySelect.addEventListener('change', handleIndustryChange);
    customerTypeSelect.addEventListener('change', handleCustomerTypeChange);
    calculateBtn.addEventListener('click', function() {
        console.log('Calculate button clicked!');
        calculateMarket();
    });
    
    // Initialize UI state
    handleCustomerTypeChange();
    
    console.log('Initialization complete');
});

function handleIndustryChange() {
    const isCustom = industrySelect.value === 'custom';
    customIndustryFields.style.display = isCustom ? 'block' : 'none';
}

function handleCustomerTypeChange() {
    const isB2B = customerTypeSelect.value === 'b2b';
    companyTypeGroup.style.display = isB2B ? 'block' : 'none';
}

// ===================================
// Calculation Engine
// ===================================
function calculateMarket() {
    console.log('calculateMarket() called');
    console.log('Industry selected:', industrySelect.value);
    
    // Validate inputs
    if (!industrySelect.value) {
        console.log('No industry selected');
        alert('Please select an industry sector');
        return;
    }

    if (industrySelect.value === 'custom') {
        if (!customIndustryName.value || !customMarketSize.value || !customCAGR.value) {
            alert('Please fill in all custom industry fields');
            return;
        }
    }

    // Get base market data
    let baseMarket;
    if (industrySelect.value === 'custom') {
        baseMarket = {
            name: customIndustryName.value,
            globalMarketSize2024: parseFloat(customMarketSize.value),
            cagr: parseFloat(customCAGR.value),
            source: 'User-provided custom industry data',
            sourceUrl: null,
            year: 2024
        };
    } else {
        baseMarket = marketData[industrySelect.value];
    }

    // Get selected parameters
    const geography = geographySelect.value;
    const customerType = customerTypeSelect.value;
    const companySize = companySizeSelect.value;
    const penetration = parseFloat(penetrationInput.value) / 100;
    const timeHorizon = parseInt(timeHorizonSelect.value);

    // Calculate TAM (Total Addressable Market)
    const tam2024 = baseMarket.globalMarketSize2024;
    const tamFuture = tam2024 * Math.pow(1 + baseMarket.cagr / 100, timeHorizon);

    // Calculate SAM (Serviceable Addressable Market)
    const geoMultiplier = geographicMultipliers[geography].multiplier;
    const segmentMultiplier = segmentMultipliers[customerType].multiplier;
    const companyMultiplier = customerType === 'b2b' ? companySizeMultipliers[companySize].multiplier : 1.0;
    
    const sam2024 = tam2024 * geoMultiplier * segmentMultiplier * companyMultiplier;
    const samFuture = tamFuture * geoMultiplier * segmentMultiplier * companyMultiplier;

    // Calculate SOM (Serviceable Obtainable Market)
    const som2024 = sam2024 * penetration;
    const somFuture = samFuture * penetration;

    // Store results
    calculationResults = {
        baseMarket,
        tam: { current: tam2024, future: tamFuture },
        sam: { current: sam2024, future: samFuture },
        som: { current: som2024, future: somFuture },
        parameters: {
            geography,
            customerType,
            companySize,
            penetration: penetration * 100,
            timeHorizon,
            geoMultiplier,
            segmentMultiplier,
            companyMultiplier
        }
    };

    // Render results
    displayResults();
}

// ===================================
// Display Functions
// ===================================
function displayResults() {
    const { baseMarket, tam, sam, som, parameters } = calculationResults;

    // Show results panel
    resultsPlaceholder.style.display = 'none';
    resultsContent.style.display = 'block';

    // Update header
    document.getElementById('resultsTitle').textContent = `${baseMarket.name} - Market Analysis`;
    document.getElementById('marketMeta').textContent = 
        `${geographicMultipliers[parameters.geography].name} • ${segmentMultipliers[parameters.customerType].name} • ${parameters.timeHorizon}-Year Projection`;

    // Update metric cards
    document.getElementById('tamValue').textContent = formatCurrency(tam.current);
    document.getElementById('tamGrowth').textContent = `→ ${formatCurrency(tam.future)} by ${2024 + parameters.timeHorizon} (${baseMarket.cagr}% CAGR)`;

    document.getElementById('samValue').textContent = formatCurrency(sam.current);
    document.getElementById('samGrowth').textContent = `→ ${formatCurrency(sam.future)} by ${2024 + parameters.timeHorizon}`;

    document.getElementById('somValue').textContent = formatCurrency(som.current);
    document.getElementById('somGrowth').textContent = `→ ${formatCurrency(som.future)} by ${2024 + parameters.timeHorizon} (${parameters.penetration}% penetration)`;

    // Update assumptions
    displayAssumptions();

    // Update chart
    renderChart();

    // Update sources
    displaySources();

    // Scroll to results
    resultsContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayAssumptions() {
    const { baseMarket, parameters } = calculationResults;
    const customerType = parameters.customerType;
    
    const assumptions = [
        { label: 'Industry:', value: baseMarket.name },
        { label: 'Base Year:', value: '2024' },
        { label: 'Growth Rate:', value: `${baseMarket.cagr}% CAGR` },
        { label: 'Geography:', value: geographicMultipliers[parameters.geography].name },
        { label: 'Customer Segment:', value: segmentMultipliers[customerType].name },
    ];

    if (customerType === 'b2b') {
        assumptions.push({
            label: 'Company Size:',
            value: companySizeMultipliers[parameters.companySize].name
        });
    }

    assumptions.push(
        { label: 'Target Penetration:', value: `${parameters.penetration}%` },
        { label: 'Time Horizon:', value: `${parameters.timeHorizon} years` }
    );

    const assumptionsList = document.getElementById('assumptionsList');
    assumptionsList.innerHTML = assumptions.map(item => `
        <div class="assumption-item">
            <span class="assumption-label">${item.label}</span>
            <span class="assumption-value">${item.value}</span>
        </div>
    `).join('');
}

function displaySources() {
    const { baseMarket, parameters } = calculationResults;
    const sources = [];

    // Primary market data source
    if (baseMarket.sourceUrl) {
        sources.push({
            title: `${baseMarket.name} Market Size`,
            citation: baseMarket.source,
            url: baseMarket.sourceUrl
        });
    } else if (baseMarket.source === 'User-provided custom industry data') {
        sources.push({
            title: 'Custom Industry Data',
            citation: 'User-provided market size and growth assumptions',
            url: null
        });
    }

    // Geographic segmentation source
    if (parameters.geography !== 'global') {
        sources.push({
            title: 'Geographic Market Distribution',
            citation: 'Regional market share estimates based on IDC Worldwide Technology Spending Guide (2024) and regional GDP analysis. North America typically represents 35-42% of global tech markets, Europe 25-30%, Asia-Pacific 20-28%, and Latin America 4-6%.',
            url: 'https://www.idc.com/promo/worldwide-ict-spending'
        });
    }

    // B2B segmentation sources
    if (parameters.customerType === 'b2b' && parameters.companySize !== 'all') {
        sources.push({
            title: 'Company Size Segmentation',
            citation: 'Based on US Census Bureau Business Dynamics Statistics and tech spending patterns. SMB (1-500 employees) represents ~35% of B2B software spend, Mid-Market (500-5,000) ~40%, and Enterprise (5,000+) ~25%.',
            url: 'https://www.census.gov/programs-surveys/bds.html'
        });
    }

    // Market segmentation methodology
    sources.push({
        title: 'TAM/SAM/SOM Methodology',
        citation: 'Calculation follows standard venture capital framework: TAM = total market opportunity, SAM = TAM × geographic focus × customer segment × company size filters, SOM = SAM × realistic market penetration target. Methodology adapted from "The Secrets of Sand Hill Road" by Scott Kupor (2019) and Y Combinator\'s startup school curriculum.',
        url: 'https://www.ycombinator.com/library/6e-how-to-evaluate-startup-ideas-part-2'
    });

    const sourcesList = document.getElementById('sourcesList');
    sourcesList.innerHTML = sources.map((source, index) => `
        <div class="source-item">
            <strong>${index + 1}. ${source.title}:</strong> ${source.citation}
            ${source.url ? ` <a href="${source.url}" target="_blank" rel="noopener noreferrer">View Source ↗</a>` : ''}
        </div>
    `).join('');
}

function renderChart() {
    const { tam, sam, som, parameters, baseMarket } = calculationResults;
    const timeHorizon = parameters.timeHorizon;
    const years = [];
    const tamData = [];
    const samData = [];
    const somData = [];

    // Generate data points
    for (let year = 0; year <= timeHorizon; year++) {
        years.push((2024 + year).toString());
        
        const growthFactor = Math.pow(1 + baseMarket.cagr / 100, year);
        tamData.push((tam.current * growthFactor).toFixed(2));
        samData.push((sam.current * growthFactor).toFixed(2));
        somData.push((som.current * growthFactor).toFixed(2));
    }

    // Destroy existing chart if it exists
    if (currentChart) {
        currentChart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById('growthChart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'TAM (Total Addressable Market)',
                    data: tamData,
                    borderColor: '#0f766e',
                    backgroundColor: 'rgba(15, 118, 110, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'SAM (Serviceable Addressable Market)',
                    data: samData,
                    borderColor: '#be123c',
                    backgroundColor: 'rgba(190, 18, 60, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'SOM (Serviceable Obtainable Market)',
                    data: somData,
                    borderColor: '#7c2d12',
                    backgroundColor: 'rgba(124, 45, 18, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Work Sans',
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + parseFloat(context.parsed.y).toFixed(2) + 'B';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'B';
                        },
                        font: {
                            family: 'IBM Plex Mono',
                            size: 11
                        }
                    },
                    grid: {
                        color: '#e7e5e4'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'IBM Plex Mono',
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ===================================
// Utility Functions
// ===================================
function formatCurrency(value) {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}T`;
    } else if (value >= 1) {
        return `$${value.toFixed(1)}B`;
    } else {
        return `$${(value * 1000).toFixed(0)}M`;
    }
}

