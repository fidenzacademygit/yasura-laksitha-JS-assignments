function isPrime(number) {
    if (number <= 1 || number%1!=0) return false;

    for (let i = 2; i < number; i++)
        if (number % i == 0) return false;
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('btn-submit').addEventListener('click', () => {
        const inputNumber = document.getElementById("number-input").value;

        let result = "";

        inputNumber == "" ?
            result = "Input number is not provided" :
            result = isPrime(inputNumber) ? inputNumber + " is a prime number" :
                     inputNumber + " is not a prime number";

        document.getElementById('output').textContent = result;
    })
})