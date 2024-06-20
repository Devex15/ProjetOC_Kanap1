//On récupère le tableau des différents modèles. On le compare ensuite avec le cart du local storage
fetch("http://localhost:3000/api/products")
.then((res)=>res.json())
.then((listProducts)=>compareProducts(listProducts));

//===============================================================================================
//On va créer un tableau cartCommand qui va réunir les différentes infos qu'on va afficher
//=============================================================================================

// On définie un tableau qui va réunir les infos (id , nom , color , qté , etc .. ) commandés par le client.
let cartCommand = [];

function compareProducts(listProducts) {
// On récupère le cart du local storage qu'on appelle cartClient :
    let cartClient =  localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

// On teste ensuite un par un les id de cartClient avec  la listProducts.
        cartClient.forEach((cartClientItem) =>{ 
//On applique la méthode .find() sur la tableau listProducts afin de trouver les correspondances avec les id du cartClient. 
        let correspondingItem = listProducts.find(listProductsItem => cartClientItem.id === listProductsItem._id);
        
        if (correspondingItem) {
// On compile les infos dans le tableau cartCommand
                cartCommand.push({
                        id: correspondingItem._id,
                        name: correspondingItem.name,
                        descript: correspondingItem.description,
                        Img: correspondingItem.imageUrl,
                        altTxt: correspondingItem.altTxt,
                        color: cartClientItem.color,
                        qty: cartClientItem.qty,
                        price: correspondingItem.price
                        })
               }
        });
}
        
console.log(cartCommand);

// tentative d'affichage de cartcommand avec une interpolation ; 

let element = document.getElementById("cart__items")
        
let article = cartCommand.map((commandItem) => {
              return ` 
                <article class="cart__item" data-id="${commandItem.id}" data-color="${commandItem.color}">
                <div class="cart__item__img">
                  <img src="../images/${commandItem.Img}" alt= ${commandItem.altTxt}>
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${commandItem.name}</h2>
                    <p>${commandItem.color}</p>
                    <p>${commandItem.price}</p>
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
              </article>       
`;

}).join(``);

element.innerHTML += article;






