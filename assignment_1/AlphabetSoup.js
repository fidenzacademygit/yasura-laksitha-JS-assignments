function alphabetSoup(str) {
    const regex = /^\S+$/;
    if (!str || !regex.test(str)) return "Invalid input";

    str = str.trim();
    let charArray = str.toLowerCase().split("");
    charArray.sort();

    return charArray.join("");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('submit-btn').addEventListener('click', () => {
        const input = document.getElementById('str-input').value;
        document.getElementById('output').textContent = alphabetSoup(input);
    })
})


