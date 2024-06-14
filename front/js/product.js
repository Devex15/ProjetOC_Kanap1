//===================================================================
//On récupère l'id du sofa à l'aide de la page que visite le client
//===================================================================
const urlString = window.location.search;
const urlParam = new URLSearchParams(urlString);

const productId = urlParam.get("id");
// On récupère les infos du sofa que le cient visite le client avec une fonction getProductInfo()
// On ajoute au local storage une clef "card" et comme valeur l'id , la couleur et la qty choisi par le client avec une fonction addToCart()

getProductInfo();
addToCart();

function getProductInfo() {
fetch("http://localhost:3000/api/products/"+productId)
.then((res)=>res.json())
.then((product)=>insertProductInfo(product))}

function insertProductInfo(product) {
      document.getElementById("title").innerText = product.name;

    document.getElementById("price").innerText = product.price;

    document.getElementById("description").innerText = product.description;

   product.colors.forEach((color)=>{
    let option = document.createElement("option");
    option.setAttribute("value", color);
    option.innerText = color;
    document.getElementById("colors").appendChild(option);
      });
   }

function addToCart() {
   document.getElementById("addToCart").addEventListener("click", (event) => {event.preventDefault();
   //récupérer la couleur du sofa 
   // Balise <select> avec une div qui fait office de <form> 
   // donc selon cours , si <select> on utilise la méthode value 
    
   const colorSofa = document.getElementById("colors").value;
   if (colorSofa === "") {
   // On vérifie si le client a bien saisi une couleur: 
   //Si pas ,  affiche un message d'alerte à cliquer par l'utilisateur et on recommence: affiche un message d'alerte à cliquer par l'utilisateur , message d'erreur et on recommence
   alert("Veuillez choisir une couleur de sofa svp."); 
      return; }
   
   //récupérer la quantité
   const choixQte = parseInt(document.getElementById("quantity").value);
   
   //vérifier si la quantité sélectionnée est correcte car l'utilisateur peut la saisir 
   if (choixQte < 0 || choixQte > 100 || choixQte === "") {
       alert("Veuillez saisir une quantité comprise entre 0 et 100 inclus.");
   return }

   // On récupère le cart enregistré dans le local storage et on l'appelle "cart"
   let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
   
// =====================================================================================================
// On va effectuer les vérif sur cette variable "cart" avec les propriétés :  Id , color , qty .
//====================================================================================================

// On regarde déjà si l'id saisi par le client existe dans le "cart". L'id saisi par le client correspond à la variable productId
// Comme il ne peut y avoir qu'une seule combo ID d'un sofa , une couleur de ce sofa et la qté qui correspond
// On utilise la méthode cart.some() afin de vérifier la présence ou non de l'id saisi par le client

let productidPresent = cart.some((elements) => elements.id === productId) ;

if (!productidPresent) {
//Si pas présent , on push une ligne id: color: qty: dans cart et on remplace le cart enregistré dans le local storage par le "nouveau" cart. 

cart.push({id: productId, color: colorSofa, qty: choixQte});
localStorage.setItem('cart',JSON.stringify(cart));

	} else {
	// On continue les vérifications
	// On utilise la méthode .find() qui verifie si la combo id: color: saisi  par le client se trouve dans le tableau cart. 

		let colorPresent = cart.find((elements) => elements.id === productId && elements.color === colorSofa )
	
		if (!colorPresent) {
		cart.push({id: productId, color: colorSofa, qty: choixQte});
		localStorage.setItem('cart',JSON.stringify(cart));
	
		} else {
			// On continue les vérifications : on va chercher la quantité 
			// On utilise la méthode .findIndex() afin de récupérer l'index de l'objet avec la qty qui nous intéresse. 

			let index = cart.findIndex((elements) => elements.id === productId && elements.color === colorSofa )
			// if (index!== -1 ) : veut dire qty existe et normalement il existe dans le tableau "cart" même s'il est nulle.
			
			if (index !== -1 ) {
				
			let currentQty = parseInt(cart[index].qty);  // On récupère la valeur de qty associé à l'index trouvé
			let additionalQty = choixQte; // on récupère la valeur saisie par le client.
			let newQty = currentQty + additionalQty; // On fait attention que newQty ne dépasse pas 100.
         
         if (newQty > 100 ){
            let rest = 100 - currentQty;
            alert ( ` Vous ne pouvez pas choisir plus de 100 sofas. Vous pouvez choisir encore ${rest} sofas.`)
            return;
         } 
         
         cart[index].qty = newQty;   // On ajoute les deux valeurs et la somme est mise à jour la valeur qty ajouté dans le tableau cart      
         localStorage.setItem('cart',JSON.stringify(cart));
         }
      }
   }   
});
}
