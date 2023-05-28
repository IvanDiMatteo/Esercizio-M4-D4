/* Chiamata api */
const books = () => {
    return fetch("https://striveschool-api.herokuapp.com/books", { method: "GET" })
    .then((response) => response.json())
    .catch((error) => {
        console.log(error);
    });
};

const array = []; // Questo array serve solo come contenitore nel quale aggiungere i vari prezzi dalla funzione addToCart
let cart = document.getElementById("listaCarrello");
let spanTotale = document.querySelector("span.totCarrello");
spanTotale.innerText = "0.00"; // Questo resetta il prezzo del carrello a €0.00

/* Funzione per aggiungere al carrello i vari libri, viene richiamata
all'intero della card che viene creata dalla funzione books() (riga 107) */
const addToCart = (title, price) => {
    /* Dal file JSON il prezzo viene preso come stringa, il pasreFload lo trasforma in numero */
    let prezzo = parseFloat(price);
    
    /* Questo è l'elemento che verrà effettivamente aggiunto alla lista nel carrello quando verrà premuto il pulsante "Add to cart" all'interno di una card libro */
    cart.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center my-1 me-4" data-price="${prezzo}">${title}, <span class="span-price px-2 mx-2">€${price}</span> <button class="btn btn-danger me-2" onclick='removeFromCart(this)'> X </button></li>`;
  
    array.push(prezzo);
    
    calcolaPrezzoTotale();// Funzione dichiarata a riga 51
};

/* Questa funzione serve a rimuovere un elemento dal carrello alla pressione della "X" */
const removeFromCart = (elemento) => {

    /* A riga 22 viene creato un "li" all'interno del carrello, esso contiene un bottone con atributo onclick che fa partire questa funzione, ha come argomento "this", ovvero proprio il bottone stesso.
    Questa variabile serve a prendere tutto l'elemento "li" tramite parentNode */
    let listItem = elemento.parentNode;

    /* All'interno del "li" creato sempre a riga 22 c'è un attributo "data-price" che contiene il prezzo del libro, questa variabile serve a catturarlo */
    let prezzo = parseFloat(listItem.getAttribute("data-price"));
  
    listItem.remove();
    
    /* Questa parte serve a rimuovere dall'array che contiene tutti i prezzi il prezzo dell'elemento che viene rimosso alla pressione della "X". indexOf serve a prendere l'indice del prezzo inerente all'elemento da rimuovere, grazie al quale viene effettivamente rimosso tramite splice() */
    let index = array.indexOf(prezzo);
    if (index > -1) {
        array.splice(index, 1);
    }
  
    calcolaPrezzoTotale();
};

/* Questa funzione viene richiamata dalle funzioni addToCart() e removeFromCart() rispettivamente alle righe 26 e 47. Serve ad aghgiornare il prezzo del carrello ogni volta che un elemento viene aggiunto o rimosso */
const calcolaPrezzoTotale = () => {
    let somma = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  
    spanTotale.innerText = somma.toFixed(2);
};

/* Questa funzione serve a resettare il prezzo alla pressione del bottone col cestino */
const trashCan = () => {
    cart.innerHTML = "";
    spanTotale.innerText = "0.00";
    array.length = 0;
};
  
let cards = [];

/* Questa funzione viene avviata al caricamento della pagina (grazie a "DOMContentLoaded") e serve per effettuare la ricerca */
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector("input[type='search']");
    let originalCards = [];
    
    /* Questa funzione serve a fare un update della ricerca ogni volta che viene aggiunto o rimosso un carattere all'intenro del campo di ricerca */
    const updateSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase(); // .trim() elemina gli spazi all'inizio ed alla fine di una stringa
        
        /* Questo if fa in modo che la ricerca venga effettuata in automatico non appena ci sono 3 o più caratteri all'interno del campo di ricerca */
        if (searchTerm.length >= 3) {
            searchBooks(searchTerm); // Dichiarata a riga 89
        } else {
            /* Se il campo di ricerca contiene meno di 3 caratteri, ripristina tutte le card originali. la parte nel .map, grazie ad .outerHTML fa in modo che l'anchestor delle cards, ovvero tuttla la unordered list contenente le cards, venga riaggiunta alla sezione dei libri */
            const sezione = document.getElementById("sezione-libri");
            sezione.innerHTML = originalCards.map((card) => card.outerHTML).join("");
        }
    };
    
    /* Questo addEventListener fa in modo che la funzione updateSearch() venga eseguita ogni volta che un tasto viene premuto all'interno del campo di ricerca */
    searchInput.addEventListener("keyup", updateSearch);
    
    /* Questa è la funzione di ricerca effettiva e viene richiamata a riga 77 e riga 120 */
    const searchBooks = (searchTerm) => {
        /* Questa funziona utilizza .filter() per filtrare le cards in base ai titoli dei libri */
        const filteredCards = originalCards.filter((card) => {
            const title = card.querySelector(".card-title").innerText.toLowerCase();
            return title.includes(searchTerm);
        });
        
        const sezione = document.getElementById("sezione-libri");
        sezione.innerHTML = filteredCards.map((card) => card.outerHTML).join("");
    };
  
    /* Chiamata a books e generazione delle carte originali */
    books()
    .then((data) => {
        let sezione = document.getElementById("sezione-libri");
        sezione.innerHTML = data
        .map((element) => {
            /* Questa funzione ritorna le cards prese da Bootstrap che contengono, grazie ai literals (${}), i vari elementi del JSON */
            return `<div class="card col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 col-12" id="${element.asin}" style="width: 18rem;">
                    <img src="${element.img}" class="card-img-top" alt="copertina di ${element.title}">
                        <div class="card-body d-flex flex-column justify-content-between p-0">
                            <h5 class="card-title p-0">${element.title}</h5>
                            <p class="card-text p-0">€ ${element.price}</p>
                            <button type="button" class="btn btn-primary p-0" onclick="addToCart('${element.title}', '${element.price}')">Add to cart</button>
                        </div>
                    </div>`;
        })
        .join(""); // il .join serve a rimuovere le virgole tra ogni elemento di un array, così da ottenere tutti i vari "li" separati da solo spazi
        
        /* Questo array creato unendo tutte le cards si rende utile alle righe 91 ed 81 per filtrare le varie cards nelle funzioni */
        originalCards = Array.from(document.querySelectorAll(".card"));
  
        searchBooks("");
    })
    .catch((error) => {
        console.log(error);
    });
});
  