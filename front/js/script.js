fetch("http://localhost:3000/api/products")
.then((res)=>res.json())
.then((products)=>displayProducts(products));

function displayProducts(products) {
//créer une boucle sur les éléments du tableau de produits
    for (let i = 0; i < products.length; i++)  {
        console.log(products[i])
        //créer les éléments qui vont contenir les infos
        let productSofa = document.createElement("a")
        productSofa.setAttribute("href", "./product.html?id="+products[i]._id)
        
        let productSofaArticle = document.createElement("article") 


        let productSofaImage = document.createElement("img")
        productSofaImage.setAttribute("src", products[i].imageUrl)
        productSofaImage.setAttribute("alt", products[i].altTxt)


        let productSofaTitle = document.createElement("h3")
        productSofaTitle.textContent=products[i].name
        productSofaTitle.classList.add("productName")


        let productSofaDescription = document.createElement("p")
    
        productSofaDescription.textContent = products[i].description
        //On ajoute une class à la nouvelle qui devrait se présenter avec <div class = DisplaySofa>
        productSofaDescription.classList.add("productDescription")
        //Déterminer l'élement parent ( hic : il y a 4 pages: Comment indentifier la page index ?)
    
        productSofaArticle.appendChild(productSofaImage)
        productSofaArticle.appendChild(productSofaTitle)
        productSofaArticle.appendChild(productSofaDescription)
        productSofa.appendChild(productSofaArticle)
        document.getElementById("items").appendChild(productSofa)
    }
}
