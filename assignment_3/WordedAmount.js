function wordedAmount(amount) {
    if (!isValidAmount(amount))
        return "Invalid amount";

    const onceWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tensWords = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    function calculateCents(n) {
        const cents = Math.round((n - Math.floor(n)) * 100);
        return convertTens(cents);
    }

    function convertOnce(n) {
        return onceWords[Math.floor(n)];
    }

    function convertTens(n) {
        let words = "";

        if (n < 20) {
            return convertOnce(n);
        }

        const tens = Math.floor(n / 10);
        const remainder = n % 10;

        if (tens > 0) {
            words += tensWords[tens];
        }

        if (remainder > 0) {
            words += " " + convertOnce(remainder);
        }

        return words;
    }

    function convertHundreds(n) {
        let words = "";

        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;

        if (hundreds > 0) {
            words += onceWords[Math.floor(hundreds)] + " hundred ";
        }

        if (remainder > 0) {
            words += convertTens(remainder);
        }

        return words;
    }

    function convertThousands(n) {
        let words = "";

        const thousands = Math.floor(n / 1000);
        const remainder = n % 1000;

        if (thousands > 0) {
            words += convertHundreds(thousands) + " thousand, ";
        }

        if (remainder > 0) {
            words += convertHundreds(remainder);
        }

        return words;
    }

    const dollers = convertThousands(amount);
    const cents = calculateCents(amount);
    const dollerString = dollers + (dollers === 'one' ? " doller " : " dollers ");
    const centString = cents + (cents != '' ? cents === 'one' ? " cent " : " cents " : "");

    const text = dollerString + (centString != "" ? " and " + centString : "");

    return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

function isValidAmount(amount) {
    const value = parseFloat(amount);

    if (isNaN(amount) || typeof amount != 'number')
        return false;

    return value > 0 && value <= 999_999.00;
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-submit').addEventListener('click', () => {
        const input = Number(document.getElementById('input-amount').value);
        const result = wordedAmount(input);

        document.getElementById('output').textContent = result;
    })
})