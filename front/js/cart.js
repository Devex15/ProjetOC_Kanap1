displayCommand(); 

//======================================================================================
// On crée une super fonction qui va créer les éléments du DOM de la commande client
//=======================================================================================
// Function displayCommand va chercher les infos du localStorage de l'Api et faire les affichages .

function displayCommand() {

// On crée un tableau cartClient qui va réunir les infos du local storage ( id color , qty)
let cartClient = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

// On vérifie que le cartClient n'est pas vide car s'il est vide = pas de commande.
if (cartClient.length === 0) {
  alert("Vous n'avez aucune commande à afficher. N'hésitez pas à faire votre choix.");
}


// On crée une variable cartCommand qui va réunir les infos de la commande client à afficher ( id , color , qty , imageUrl , altTxt , etc )
let cartCommand = [];

// On fait appel à l'API en sélectionnant les objets du cartClient un par un . L'objectif étant d'afficher name descript venant de l'api :
// On crée la variable fetchPromises qui va permettre d'attendre que toutes les promesses de fetch soient exécutées.

let fetchPromises = cartClient.map((cartItem) => { 
  return fetch("http://localhost:3000/api/products/"+cartItem.id)
    .then((res) => res.json())
    .then((apiProduct) => {getInfoCartClient(apiProduct, cartItem);});
  });
  
  // ================================================================================================================================
  // On utilise la Promise.all afin que toutes les promesses de réponse de l'API soient exécutées avant d'afficher  la commande client 
  //==================================================================================================================================
  // Sans elle , le carCommand s'affiche autant de fois qu'il y a de requête à l'API : Testé et a créé des problèmes d'affichage 
  // Les fonction updateTotal() et displayCartItem() vont servir à afficher les prix et les éléments du DOM.

  Promise.all(fetchPromises).then(() => {
      updateTotals();
      displayCartItem();
      });


//============================================================================================================
// On crée  la fonction getInfoCartClient qui va crée le tableau cartCommand qui va réunir les infos de la commande client
// =====================================================================================================
// cartCommand va servir à afficher les infos de la commande du client ( getInfoCartClient a été appelé dans le fetch)

function getInfoCartClient(apiProduct, cartItem) {
  cartCommand.push({
    id: apiProduct._id,
    name: apiProduct.name,
    descript: apiProduct.description,
    Img: apiProduct.imageUrl,
    altTxt: apiProduct.altTxt,
    color: cartItem.color,
    qty: cartItem.qty,
    price: apiProduct.price
      });
  }
// ============================================================================================================
// On crée updateTotals   va calculer les quantité ainsi que le prix en utilisant les infos de cartCommand
//============================================================================================================
function updateTotals() {
  let totalQty = cartCommand.reduce((accumulator, cartCommand) => {
    return accumulator + cartCommand.qty;
    }, 0);

    document.getElementById("totalQuantity").innerText = totalQty;

    let totalPrice = cartCommand.reduce((accumulators, cartCommand) => {
    return accumulators + (cartCommand.qty * cartCommand.price);
    }, 0);

    document.getElementById("totalPrice").innerText = totalPrice;
  }

//========================================================================================================
// On crée la fonction displayCartItem , appelée avec fetch afin d'afficher les éléments du DOM
//=====================================================================================================
function displayCartItem() {
  let element = document.getElementById("cart__items");

  let article = cartCommand.map((commandItem) => {
    return `
      <article class="cart__item" data-id="${commandItem.id}" data-color="${commandItem.color}">
        <div class="cart__item__img">
          <img src="${commandItem.Img}" alt="${commandItem.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>Modèle : ${commandItem.name}</h2>
            <p>Couleur: ${commandItem.color}</p>
            <p>Prix unitaire: ${commandItem.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Quantité : ${commandItem.qty}</p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${commandItem.qty}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');

  element.innerHTML += article;

  // La fonction updateCommand  va être appelé afin de prendre en compte les modifications de quantité par le client. 
  updateCommand();
}

}

//========================================================================================================
// On crée la fonction udateCommand qui va récupérer l'id , la couleur et la Qty et faire les modifications
// =====================================================================================================
// On utilisera location.reload() afin de valider les modifications .
function updateCommand() {
  // On recherche les sélecteurs qui ont comme class itemQuantity donc les input .
  // On leur met un addEventListener qui va considérer les changements. 
document.querySelectorAll('.itemQuantity').forEach((input) => {
  input.addEventListener('change', function(event) {

    // on recherche les sélecteur parent de itemQuantity et on se trouve les infos sur l'id et la color 
    let cartItem = event.target.closest('.cart__item');

    let updateId = cartItem.getAttribute('data-id');
    let updateColor = cartItem.getAttribute('data-color');
    let updateQty = event.target.value;
    console.log('id', updateId); 
    console.log('color:', updateColor);
    console.log('Qty', updateQty);
// On recharge le cart du local storage et on l'appelle cartUpdate
  let cartUpdate = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];


// on recherceh l'index qui va être concerné par la modification. 
  let indexUpdate = cartUpdate.findIndex((item) => item.id === updateId && item.color === updateColor);

  // On effectue la modification
  if (indexUpdate !== -1) {
    cartUpdate[indexUpdate].qty = parseInt(updateQty);
      }

      console.log(cartUpdate);

     localStorage.setItem('cart',JSON.stringify(cartUpdate)); 

     displayCommand();

     // On utilise location.reload() qui va recharger la page html et permettre la prise en compte des modifications. 
     location.reload();
    
     });
  });
}

function modifCommand() {


}
