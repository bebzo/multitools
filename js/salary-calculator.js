document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputs = {
        amount: document.getElementById('amount'),
        period: document.getElementById('period'),
        status: document.getElementById('status'),
        time: document.getElementById('time')
    };

    const outputs = {
        gross: document.querySelectorAll('.val-gross'),
        net: document.querySelectorAll('.val-net'),
        netTax: document.querySelectorAll('.val-net-tax'),
        cost: document.querySelectorAll('.val-cost')
    };

    // French Social Contribution Rates (Approximate 2025)
    const RATES = {
        nonCadre: {
            social: 0.22, // 22% charges salariales
            employer: 0.42 // 42% charges patronales
        },
        cadre: {
            social: 0.25, // 25% charges salariales
            employer: 0.45 // 45% charges patronales
        },
        tax: 0.05 // Prélèvement à la source moyen (estimé)
    };

    function calculate() {
        // Get Input Values
        let baseAmount = parseFloat(inputs.amount.value);
        if (isNaN(baseAmount) || baseAmount < 0) baseAmount = 0;

        const period = inputs.period.value; // 'month' or 'year'
        const isCadre = inputs.status.value === 'cadre';
        
        // Normalize to Monthly Gross
        let monthlyGross = period === 'year' ? baseAmount / 12 : baseAmount;

        // Select Rates
        const currentRates = isCadre ? RATES.cadre : RATES.nonCadre;

        // Calculate
        const monthlyNetBeforeTax = monthlyGross * (1 - currentRates.social);
        const monthlyNetAfterTax = monthlyNetBeforeTax * (1 - RATES.tax);
        const monthlyTotalCost = monthlyGross * (1 + currentRates.employer);

        // Update UI
        updateDisplay(monthlyGross, monthlyNetBeforeTax, monthlyNetAfterTax, monthlyTotalCost);
    }

    function updateDisplay(gross, net, netTax, cost) {
        // Formatter currency
        const format = (val) => {
            return new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'EUR',
                maximumFractionDigits: 0 
            }).format(val);
        };

        // Update all fields (Month / Year columns if we had them, simple view for now)
        // Here we just show Monthly and derived Annual in text if needed, 
        // but let's assume the UI shows "Mensuel" values primarily.
        
        // Let's create a helper to update per period
        const updateField = (nodelist, monthlyVal) => {
            nodelist.forEach(el => {
                if(el.dataset.period === 'year') {
                    el.textContent = format(monthlyVal * 12);
                } else {
                    el.textContent = format(monthlyVal);
                }
            });
        };

        updateField(outputs.gross, gross);
        updateField(outputs.net, net);
        updateField(outputs.netTax, netTax);
        updateField(outputs.cost, cost);
    }

    // Event Listeners
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', calculate);
        input.addEventListener('change', calculate);
    });

    // Initial Calculation
    calculate();
});
