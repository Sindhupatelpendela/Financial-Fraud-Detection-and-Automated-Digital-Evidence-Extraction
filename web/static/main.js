document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predict-form');
    const resultDiv = document.getElementById('result');
    const spinner = document.getElementById('spinner');

    function showSpinner() {
        spinner.style.display = 'block';
        resultDiv.classList.remove('show');
        resultDiv.innerHTML = '';
    }
    function hideSpinner() {
        spinner.style.display = 'none';
    }
    function showResult(prediction, probability) {
        let icon = prediction === 'Fraudulent'
            ? '<i data-feather="alert-triangle" style="color:#fff700;width:2em;height:2em;vertical-align:middle;"></i>'
            : '<i data-feather="check-circle" style="color:#00e676;width:2em;height:2em;vertical-align:middle;"></i>';
        resultDiv.innerHTML = `${icon}<br><strong>Prediction:</strong> ${prediction}<br><strong>Probability of fraud:</strong> ${probability}%`;
        resultDiv.classList.add('show');
        if(window.feather) feather.replace();
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        showSpinner();
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'gender') {
                data[key] = value;
            } else if (key === 'amount') {
                data[key] = parseFloat(value);
            } else {
                data[key] = parseInt(value);
            }
        });
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const res = await response.json();
            hideSpinner();
            showResult(res.prediction, res.probability);
        } catch (err) {
            hideSpinner();
            resultDiv.innerHTML = '<span style="color:#ef4444;font-weight:bold;">Error: Could not get prediction.</span>';
            resultDiv.classList.add('show');
        }
    });
}); 