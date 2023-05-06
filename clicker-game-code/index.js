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
        for(i = 0; i < jsonObj.length; i++){
            console.log(jsonObj[i]);
            const button = document.createElement("button");
            const prezzo = parseFloat(localStorage.getItem('buttonPrize' + [i])) || parseFloat(jsonObj[i]["price"]);
            console.log(jsonObj[i]["name"] + prezzo.toFixed(1) + "$")
            button.textContent = jsonObj[i]["name"] + " " + prezzo.toFixed(1) + " $";
            button.addEventListener('click', createCallback(i));
            buttonContainer.appendChild(button);
        }
    });

function createCallback(index) {
    return function() {
        const prezzo = parseFloat(localStorage.getItem('buttonPrize' + [index])) || parseFloat(jsonObj[index]["price"]);
        const rateo = parseFloat(jsonObj[index]["rateo"]);
        if(parseInt(counter.innerHTML) >= prezzo){
            const prezzoAggiornato = aggiornaPrezzo(prezzo);
            console.log(prezzoAggiornato)
            for(i = 0; i < jsonObj.length; i++){
                localStorage.setItem('buttonPrize' + [index], prezzoAggiornato.toFixed(1));
                buttonContainer.children[index].textContent = jsonObj[index]["name"] + " " + parseFloat(localStorage.getItem('buttonPrize' + [index])).toFixed(1) + " $";
            }
            oggettoComprato(prezzoAggiornato, rateo);
            x = x - prezzo;
            counter.innerHTML = x.toFixed(1);
        }
    }
}

function oggettoComprato(prezzo, rateo) {
    localStorage.setItem('counter', x.toFixed(1));
    rat += rateo;
    localStorage.setItem('rateo', rat.toFixed(1));
    console.log(x, prezzo)
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
    for(i = 0; i < jsonObj.length; i++){
        const prezzo = parseFloat(localStorage.getItem('buttonPrize' + [i])) || parseFloat(jsonObj[i]["price"]);
        buttonContainer.children[i].textContent = jsonObj[i]["name"] + " " + prezzo.toFixed(1) + " $";
    }
}

function aggiornaPrezzo(prezzo){
    prezzoAggiornato = prezzo * moltiplicatore;
    return prezzoAggiornato;
}

function reset(){
    localStorage.clear();
    x = 0;
    rat = 0;
    for (let i = 0; i < jsonObj.length; i++) {
        buttonContainer.children[i].textContent = jsonObj[i]["name"] + " " + jsonObj[i]["price"] + " $";
    }
    counter.innerHTML = 0;
    rateoAlSecondo.innerHTML = 0;
}
