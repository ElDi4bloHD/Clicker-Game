window.addEventListener('load', function() {
    load();
});

window.addEventListener('beforeunload', function() {
    save();
});

firstButton = document.getElementById("button-clicker");
counter = document.getElementById("counter");
objectShop = document.getElementById("shop");
rateoAlSecondo = document.getElementById("al-secondo");
buttonContainer = document.getElementById('shop');
jsonObj = [];
const moltiplicatore = 1.15;

let x = 0;
let rat = 0;
let intervalID;
let prezzo;
let rateo;

function incrementByMouse() {
    x = x + 1;
    counter.innerHTML = x.toFixed(1);
    console.log(x);
}

fetch('./object.json')
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        console.log(json)
        jsonObj = json;
        for (let i = 0; i < jsonObj["object"].length; i++) {
            console.log(jsonObj["object"][i]);
            const button = document.createElement("button");
            button.classList.add("button-shop");
            const prezzo = parseFloat(localStorage.getItem('buttonPrize' + [i])) || parseFloat(jsonObj["object"][i]["price"]);
            const level = parseFloat(localStorage.getItem('levelitem' + [i])) || parseFloat(jsonObj["object"][i]["level"]);
            console.log(jsonObj["object"][i]["name"] + prezzo.toFixed(1) + "$")
            button.textContent = jsonObj["object"][i]["name"] + " " + prezzo.toFixed(1) + " $";
            button.addEventListener('click', createCallback(i));
            buttonContainer.appendChild(button);
            buttonContainer.querySelectorAll('.button-shop')[i].style.backgroundImage = jsonObj["object"][i]["img"];
            console.log(jsonObj["object"][i]["img"]);
            $(button).after(`<p id="livello-${i}">Level: ${level}</p>`);
        }
    });

function createCallback(index) {
    return function() {
        const prezzo = parseFloat(localStorage.getItem('buttonPrize' + [index])) || parseFloat(jsonObj["object"][index]["price"]);
        const level = parseFloat(localStorage.getItem('levelitem' + [index])) || parseFloat(jsonObj["object"][index]["level"]);
        const rateo = parseFloat(jsonObj["object"][index]["rateo"]);
        if(parseInt(counter.innerHTML) >= prezzo){
            const prezzoAggiornato = aggiornaPrezzo(prezzo);
            const levelAggiornato = aggiornaLevel(level);
            console.log(prezzoAggiornato)
            for(i = 0; i < jsonObj["object"].length; i++){
                localStorage.setItem('buttonPrize' + [index], prezzoAggiornato.toFixed(1));
                localStorage.setItem('levelitem' + [index], levelAggiornato.toFixed(1));
                buttonContainer.querySelectorAll('.button-shop')[index].textContent = jsonObj["object"][index]["name"] + " " + parseFloat(localStorage.getItem('buttonPrize' + [index])).toFixed(1) + " $";
                document.getElementById(`livello-${index}`).textContent = "Level: " + parseFloat(localStorage.getItem('levelitem' + [index])).toFixed(1);
            }
            oggettoComprato(rateo);
            x = x - prezzo;
            counter.innerHTML = x.toFixed(1);
        }
    }
}

function oggettoComprato(rateo) {
    localStorage.setItem('counter', x.toFixed(1));
    rat += rateo;
    localStorage.setItem('rateo', rat.toFixed(1));
    console.log(rat)
    rateoAlSecondo.innerHTML = rat.toFixed(1);
    save();
    clearInterval(intervalID)
    intervalID = setInterval(function() {
        x = x + rat;
        counter.innerHTML = x.toFixed(1);
        localStorage.setItem('counter', x.toFixed(1));
    }, 1000)
}

function save(){
    const xValue = parseFloat(counter.innerHTML);
    const rateoValue = parseFloat(rateoAlSecondo.innerHTML)
    localStorage.setItem('counter', xValue.toFixed(1));
    localStorage.setItem('rateo', rateoValue.toFixed(1));
}
  
function load(){
    const xValue = parseFloat(localStorage.getItem('counter'));
    const rateoValue = parseFloat(localStorage.getItem('rateo'));
    if(!isNaN(xValue || !isNaN(rateoValue))) {
        x = xValue;
        rat = rateoValue
        counter.innerHTML = x.toFixed(1);
        rateoAlSecondo.innerHTML = rat.toFixed(1);
    } if (rat > 0) {
        clearInterval(intervalID);
        intervalID = setInterval(function() {
            x = x + rat;
            counter.innerHTML = x.toFixed(1);
            localStorage.setItem('counter', x.toFixed(1));
        }, 1000);
    } else {
        counter.innerHTML = 0;
        rateoAlSecondo.innerHTML = 0;
    }
    for(i = 0; i < jsonObj["object"].length; i++){
        const prezzo = parseFloat(localStorage.getItem('buttonPrize' + [i])) || parseFloat(jsonObj["object"][i]["price"]);
        buttonContainer.querySelectorAll('.button-shop').textContent = jsonObj["object"][i]["name"] + " " + prezzo.toFixed(1) + " $";
        document.getElementById(`livello-${i}`).textContent = "Level: " + parseFloat(localStorage.getItem('levelitem' + [i])).toFixed(1);
    }
}

function aggiornaPrezzo(prezzo){
    prezzoAggiornato = prezzo * moltiplicatore;
    return prezzoAggiornato;
}

function aggiornaLevel(level){
    levelAggiornato = level + 1;
    return levelAggiornato;
}

function reset(){
    localStorage.clear();
    x = 0;
    rat = 0;
    for (let i = 0; i < jsonObj["object"].length; i++) {
        buttonContainer.querySelectorAll('.button-shop').textContent = jsonObj["object"][i]["name"] + " " + jsonObj["object"][i]["price"] + " $";
        console.log(jsonObj["object"][i]["price"])
        document.getElementById(`livello-${i}`).textContent = "Level: " + jsonObj["object"][i]["level"];
    }
    counter.innerHTML = 0;
    rateoAlSecondo.innerHTML = 0;
}