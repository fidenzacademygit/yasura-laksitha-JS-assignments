function alphabetSoup(str) {
    if (!str) return "Invalid input"

    let charArray = str.toLowerCase().split("");

    for (let i = 0; i < str.length; i++) {
        for (let j = 0; j < str.length - 1; j++) {
            if (charArray[j] > charArray[j + 1]) {
                const temp = charArray[j];
                charArray[j] = charArray[j + 1];
                charArray[j + 1] = temp;
            }
        }
    }

    return charArray.join("");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('submit-btn').addEventListener('click', () => {
        const input = document.getElementById('str-input').value;
        document.getElementById('output').textContent = alphabetSoup(input);
    })
})


