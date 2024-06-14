//On récupère le tableau des différents modèles. On le compare ensuite avec le cart du local storage
fetch("http://localhost:3000/api/products")
.then((res)=>res.json())
.then((listProducts)=>compareProducts(listProducts));

//===============================================================================================
//On va créer un tableau cartCommand qui va réunir les différentes infos qu'on va afficher
//=============================================================================================

function compareProducts(listProducts) {
// On récupère le cart du local storage qu'on appelle cartClient :
    let cartClient =  localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    
// On définie un tableau qui va réunir les infos (id , nom , color , qté , etc .. ) commandés par le client.
        let cartCommand = []

// On teste ensuite un par un les id de cartClient avec  la listProducts.
        cartClient.forEach((cartClientItem) =>{ 
//On applique la méthode .find() sur la tableau listProducts afin de trouver les correspondances avec les id du cartClient. 
        let correspondingItem = listProducts.find(listProductsItem => cartClientItem.id === listProductsItem._id);
        
        if (correspondingItem) {
// On compile les infos dans le tableau cartCommand
                cartCommand.push({
                        id: correspondingItem._id,
                        nom: correspondingItem.name,
                        descript: correspondingItem.description,
                        Img: correspondingItem.imageUrl,
                        altTxt: correspondingItem.altTxt,
                        color: cartClientItem.color,
                        qty: cartClientItem.qty,
                        })
               }
        });

        console.log(cartCommand)
}

