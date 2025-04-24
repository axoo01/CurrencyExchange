document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('#converterForm');
    const fromCurrencySelect = document.querySelector('#fromCurrency');
    const toCurrencySelect = document.querySelector('#toCurrency');
    const amountInput = document.querySelector('#amount');
    const resultDiv = document.querySelector('#result');
    const loadingDiv = document.querySelector('#loading');
    const errorDiv = document.querySelector('#error');

    fetch('https://v6.exchangerate-api.com/v6/e8083ae6debe9e008a32d123/latest/USD')
        .then(response => response.json())
        .then(data => {
            if (data.result === "success") {
                const currencies = Object.keys(data.conversion_rates).sort();
                currencies.forEach(currency => {
                    const option1 = document.createElement('option');
                    const option2 = document.createElement('option');
                    option1.value = currency;
                    option1.textContent = currency;
                    option2.value = currency;
                    option2.textContent = currency;
                    fromCurrencySelect.appendChild(option1);
                    toCurrencySelect.appendChild(option2);
                });
            } else {
                errorDiv.textContent = 'Failed to load currencies or API quota limit reached.';
                errorDiv.style.display = 'block';
            }
        })
        .catch(error => {
            errorDiv.textContent = 'Error fetching currencies. Please try again.';
            errorDiv.style.display = 'block';
        });

    form.onsubmit = function (e) {
        e.preventDefault();
        const fromCurrency = fromCurrencySelect.value.toUpperCase();
        const toCurrency = toCurrencySelect.value.toUpperCase();
        const amount = parseFloat(amountInput.value);

        resultDiv.textContent = '';
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
        loadingDiv.style.display = 'block';

        if (!fromCurrency || !toCurrency || isNaN(amount) || amount <= 0) {
            loadingDiv.style.display = 'none';
            errorDiv.textContent = 'Please enter a valid amount and select both currencies.';
            errorDiv.style.display = 'block';
            return;
        }

        fetch(`https://v6.exchangerate-api.com/v6/e8083ae6debe9e008a32d123/pair/${fromCurrency}/${toCurrency}/${amount}`)
            .then(response => response.json())
            .then(data => {
                loadingDiv.style.display = 'none';
                if (data.result === "success") {
                    const convertedAmount = data.conversion_result;
                    resultDiv.textContent = `${amount.toFixed(2)} ${fromCurrency} = ${convertedAmount.toFixed(3)} ${toCurrency}`;
                } else {
                    errorDiv.textContent = 'Invalid currency or API limit reached.';
                    errorDiv.style.display = 'block';
                }
            })
            .catch(error => {
                loadingDiv.style.display = 'none';
                errorDiv.textContent = 'Error fetching exchange rates. Please try again.';
                errorDiv.style.display = 'block';
            });

        return false;
    };
});