function isPrime(number) {
    number = Number(number);

    if (isNaN(number)) return false;
    if (number < 2 || number % 1 !== 0) return false;

    if (number === 2) return true;

    const limit = Math.floor(Math.sqrt(number));
    for (let i = 2; i <= limit; i++)
        if (number % i === 0) return false;
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('btn-submit').addEventListener('click', () => {
        const inputNumber = document.getElementById("number-input").value.trim();

        let result = "";

        inputNumber === "" ?
            result = "Input number is not provided" :
            result = isPrime(inputNumber) ? inputNumber + " is a prime number" :
                inputNumber + " is not a prime number";

        document.getElementById('output').textContent = result;
    })
})