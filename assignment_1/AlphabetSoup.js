function alphabetSoup(str) {
    let charArray = str.split("");
    //const sortedArray = charArray.sort();

    for (let i = 0; i < str.length ; i++){
        for (let j = 0; j < str.length; j++){
            if (charArray[j] > charArray[j+1]){
                const temp = charArray[j];
                charArray[j] = charArray[j+1];
                charArray[j+1] = temp
            }
        }
    }

    document.getElementById('output').textContent = "Sorted: "+ charArray.join("");
}

document.addEventListener("DOMContentLoaded", ()=> {
    document.getElementById('submit-btn').addEventListener('click', ()=> {
        const input = document.getElementById('str-input').value;
        alphabetSoup(input);
    })
})


