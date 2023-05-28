const books = () => {
    return fetch("https://striveschool-api.herokuapp.com/books", { method: "GET" })
        .then((response) => response.json())
        .catch((error) => {
            console.log(error);
        });
};
  
const array = [];
let cart = document.getElementById("listaCarrello");
let spanTotale = document.querySelector("span.totCarrello");
  
spanTotale.innerText = "0.00";
  
const addToCart = (title, price) => {
    let prezzo = parseFloat(price);
  
    cart.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center my-1 me-4" data-price="${prezzo}">${title}, <span class="span-price px-2 mx-2">€${price}</span> <button class="btn btn-danger me-2" onclick='removeFromCart(this)'> X </button></li>`;
  
    array.push(prezzo);
  
    calcolaPrezzoTotale();
};
  
const removeFromCart = (elemento) => {
    let listItem = elemento.parentNode;
    let prezzo = parseFloat(listItem.getAttribute("data-price"));
  
    listItem.remove();
  
    let index = array.indexOf(prezzo);
    if (index > -1) {
        array.splice(index, 1);
    }
  
    calcolaPrezzoTotale();
};
  
const calcolaPrezzoTotale = () => {
    let somma = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  
    spanTotale.innerText = somma.toFixed(2);
};
  
const trashCan = () => {
    cart.innerHTML = "";
    spanTotale.innerText = "0.00";
    array.length = 0;
};
  
let cards = [];
  
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("form[role='search']");
    const searchInput = document.querySelector("input[type='search']");
    let originalCards = [];
  
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchBooks(searchTerm);
    });
  
    const updateSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
    
        if (searchTerm.length >= 3) {
            searchBooks(searchTerm);
        } else if (searchTerm.length === 0) {
            // Il campo di ricerca è vuoto, ripristina l'elenco completo dei libri
            const sezione = document.getElementById("sezione-libri");
            sezione.innerHTML = originalCards.map((card) => card.outerHTML).join("");
        } else {
            // Il campo di ricerca contiene meno di 3 caratteri, ripristina tutte le card originali
            const sezione = document.getElementById("sezione-libri");
            sezione.innerHTML = originalCards.map((card) => card.outerHTML).join("");
        }
    };
  
    searchInput.addEventListener("input", updateSearch);
    searchInput.addEventListener("keyup", updateSearch);
  
    const searchBooks = (searchTerm) => {
        const filteredCards = originalCards.filter((card) => {
            const title = card.querySelector(".card-title").innerText.toLowerCase();
            return title.includes(searchTerm);
        });
  
        const sezione = document.getElementById("sezione-libri");
        sezione.innerHTML = filteredCards.map((card) => card.outerHTML).join("");
    };
  
    // Chiamata a books e generazione delle carte originali
    books()
    .then((data) => {
        let sezione = document.getElementById("sezione-libri");
        sezione.innerHTML = data
        .map((element) => {
            return `<div class="card col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12 col-12" id="${element.asin}" style="width: 18rem;">
                    <img src="${element.img}" class="card-img-top" alt="copertina di ${element.title}">
                        <div class="card-body d-flex flex-column justify-content-between p-0">
                            <h5 class="card-title p-0">${element.title}</h5>
                            <p class="card-text p-0">€ ${element.price}</p>
                            <button type="button" class="btn btn-primary p-0" onclick="addToCart('${element.title}', '${element.price}')">Add to cart</button>
                        </div>
                    </div>`;
        })
        .join("");
  
        originalCards = Array.from(document.querySelectorAll(".card"));
  
        searchBooks("");
    })
    .catch((error) => {
        console.log(error);
    });
});
  