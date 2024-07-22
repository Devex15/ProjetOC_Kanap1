//===========================================================================================================
// On crée les fonctions displayCartItem, updateTotals, updateCommand et modifCommand en dehors de displayCommand
//===========================================================================================================
// La fonction displayCartItem va afficher les éléments du DOM :

function displayCartItem(cartCommand) {
  let element = document.getElementById("cart__items");
  element.innerHTML = '';  // Réinitialise l'affichage précédent . 

  let article = cartCommand.map((commandItem) => {
    let price = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(commandItem.price);
    return `
      <article class="cart__item" data-id="${commandItem.id}" data-color="${commandItem.color}">
        <div class="cart__item__img">
          <img src="${commandItem.Img}" alt="${commandItem.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>Modèle : ${commandItem.name}</h2>
            <p>Couleur: ${commandItem.color}</p>
            <p>Prix unitaire: ${price} </p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Quantité :</p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${commandItem.qty}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');

  element.innerHTML = article;

  // Appel des fonctions updateCommand et modifCommand : Ces deux fonctions vont permettre de modifier la quantité ou desupprimer un item.
  updateCommand();
  modifCommand();
}

// La fonction updatetotals calcule les quantités d'articles ainsi que le prix à payer . 
function updateTotals(cartCommand) {
  let totalQty = cartCommand.reduce((accumulator, cartCommand) => {
    return accumulator + cartCommand.qty;
  }, 0);

  document.getElementById("totalQuantity").innerText = totalQty;

  let totalPrice = cartCommand.reduce((accumulators, cartCommand) => {
    return accumulators + (cartCommand.qty * cartCommand.price);
  }, 0);

  // On utilise new Intl.NumberFormat() qui permet de séparer les milliers ainsi que d'afficher la currency. 
  let totalPriceToPay = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPrice);
  document.getElementById("totalPrice").innerText = totalPriceToPay;
}

// ==========================================================================================================
// On crée la fonction update command qui va permettre de modifier la quantité si le client le souhaite 
// ===================================================================================================
// La fonction update command va être appelé dans la fonction displayCarItem  : 

function updateCommand() {
  document.querySelectorAll('.itemQuantity').forEach((input) => {
    input.addEventListener('change', function(event) {
      let cartItem = event.target.closest('.cart__item');
      let updateId = cartItem.getAttribute('data-id');
      let updateColor = cartItem.getAttribute('data-color');
      let updateQty = event.target.value;

      if (updateQty > 100) {
        alert('Veuillez choisir une quantité comprise entre 0 et 100');
        return;
      }

      let cartUpdate = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
      let indexUpdate = cartUpdate.findIndex((item) => item.id === updateId && item.color === updateColor);

      if (indexUpdate !== -1) {
        cartUpdate[indexUpdate].qty = parseInt(updateQty);
      }

      localStorage.setItem('cart', JSON.stringify(cartUpdate));

      // On met à jour l'affichage de la page sans la recharger. :
      displayCommand();
    });
  });
}

//======================================================================================
//La fonction modiCommand va permettre la modification la suppression d'un article par un client .
//===================================================================================
// La fonction modifCommand va être appelé dans  la fonction diplsayCartItem 

function modifCommand() {
  document.querySelectorAll('.deleteItem').forEach((delet) => {
    delet.addEventListener(('click'), function(events) {
      let deletItem = events.target.closest('.cart__item');
      let deletId = deletItem.getAttribute('data-id');
      let deletColor = deletItem.getAttribute('data-color');

      let cartModified = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
      let indexDelete = cartModified.findIndex((itemModified) => itemModified.id === deletId && itemModified.color === deletColor);

      if (indexDelete !== -1) {
        cartModified.splice(indexDelete, 1);
        localStorage.setItem('cart', JSON.stringify(cartModified));
        // Mettre à jour l'affichage sans recharger la page
        displayCommand();
      }
    });
  });
}

//===========================================================================================================
// La fonction displayCommand va chercher les infos du localStorage de l'Api et faire les affichages .
//===========================================================================================================
// C'est la super fonction qui va appeler les autres fonction (displayCartItem et updateTotals)
function displayCommand() {
  let cartClient = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

  if (cartClient.length === 0) {
    alert("Vous n'avez aucune commande à afficher. N'hésitez pas à faire votre choix.");
    return;
  }

  let cartCommand = [];
  let fetchPromises = cartClient.map((cartItem) => {
    return fetch("http://localhost:3000/api/products/" + cartItem.id)
      .then((res) => res.json())
      .then((apiProduct) => { getInfoCartClient(apiProduct, cartItem); });
  });

  // On attend que les promesses du fetch soient réalisées . 
  Promise.all(fetchPromises).then(() => {
    updateTotals(cartCommand);
    displayCartItem(cartCommand);
  });

  function getInfoCartClient(apiProduct, cartItem) {
    cartCommand.push({
      id: apiProduct._id,
      name: apiProduct.name,
      Img: apiProduct.imageUrl,
      altTxt: apiProduct.altTxt,
      color: cartItem.color,
      qty: cartItem.qty,
      price: apiProduct.price
    });
  }
}


//========================================================================================
// Function validateForm va tester la saisie des formulaires par le client : nom, prenom etc 
//=============================================================================================
// Elle est appelées ensuite 

function validateForm() {
  // ========================================================
  // Validation des formulaires avec des régex 
  //=======================================================
  // On définit les masques de régex en vue de validation
  const patterns = {
    firstName: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,30}$/, // Prénom : lettres (y compris les accents), espaces, tirets et apostrophes, de 2 à 30 caractères.
    lastName: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,30}$/, // Nom : mêmes règles que pour le prénom.
    address: /^[A-Za-z0-9À-ÖØ-öø-ÿ\s,'-]{5,100}$/, // Adresse : lettres, chiffres, accents, espaces, virgules, tirets, apostrophes, de 5 à 100 caractères.
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // Email : format standard des adresses e-mail.
  };
  
  // Function to validate a field
  function validateField(field, regex, errorMsg) {
    // Teste si la valeur du champ ne correspond pas à l'expression régulière (regex)
    if (!regex.test(field.value)) {
        errorMsg.textContent = 'Saisie incorrecte , veuillez recommencer SVP'; // Affiche un message d'erreur si invalide.
        return false; // Retourne false si la validation échoue.
    } else {
        errorMsg.textContent = ''; // Efface le message d'erreur si valide.
        return true; // Retourne true si la validation réussit.
    }
  }
  
  // On récupère les éléments form et input
  const form = document.querySelector('form.cart__order__form'); // Récupère l'élément du formulaire par son ID.
  const firstName = document.getElementById('firstName'); // Récupère l'élément de l'input prénom par son ID.
  const lastName = document.getElementById('lastName'); // Récupère l'élément de l'input nom par son ID.
  const address = document.getElementById('address'); // Récupère l'élément de l'input adresse par son ID.
  const email = document.getElementById('email'); // Récupère l'élément de l'input email par son ID.
  
  // On récupère les éléments d'affichage d'erreur
  const firstNameErrorMsg = document.getElementById('firstNameErrorMsg'); // Récupère l'élément de message d'erreur pour le prénom par son ID.
  const lastNameErrorMsg = document.getElementById('lastNameErrorMsg'); // Récupère l'élément de message d'erreur pour le nom par son ID.
  const addressErrorMsg = document.getElementById('addressErrorMsg'); // Récupère l'élément de message d'erreur pour l'adresse par son ID.
  const emailErrorMsg = document.getElementById('emailErrorMsg'); // Récupère l'élément de message d'erreur pour l'email par son ID.
  
  // On ajoute les addEventListener en vue de validation :
  firstName.addEventListener('input', () => validateField(firstName, patterns.firstName, firstNameErrorMsg)); // Ajoute un écouteur d'événement 'input' pour valider le prénom en temps réel.
  lastName.addEventListener('input', () => validateField(lastName, patterns.lastName, lastNameErrorMsg)); // Ajoute un écouteur d'événement 'input' pour valider le nom en temps réel.
  address.addEventListener('input', () => validateField(address, patterns.address, addressErrorMsg)); // Ajoute un écouteur d'événement 'input' pour valider l'adresse en temps réel.
  email.addEventListener('input', () => validateField(email, patterns.email, emailErrorMsg)); // Ajoute un écouteur d'événement 'input' pour valider l'email en temps réel.
  
  // Validate on form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Valide chaque champ du formulaire lors de la soumission
    const isValidFirstName = validateField(firstName, patterns.firstName, firstNameErrorMsg);
    const isValidLastName = validateField(lastName, patterns.lastName, lastNameErrorMsg);
    const isValidAddress = validateField(address, patterns.address, addressErrorMsg);
    const isValidEmail = validateField(email, patterns.email, emailErrorMsg);
  
    // Si l'un des champs n'est pas valide, empêche la soumission du formulaire
    if (isValidFirstName && isValidLastName && isValidAddress && isValidEmail) {
      // On appelle la fonction afin de générer et afficher le numéro de commande
      let orderCode = generateOrderNumber();
      window.location.href = "./confirmation.html?orderCode="+orderCode;
    }
    
  });
  }

  function generateOrderNumber() {
    // On générer un nombre à 6 chiffres aléatoires
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    // On obtient le timestamp en secondes
    const timestamp = Math.floor(Date.now() / 1000);

    // On concaténe les deux valeurs avec un tiret
    const orderNumber = `${randomNumber}-${timestamp}`;
    return orderNumber;

  }


// Appel initial de displayCommand
displayCommand();

// Appel de la fonction de validation des saisies du client :
validateForm()

