document.addEventListener("DOMContentLoaded", () => {
    function generateOrderNumber() {
      // On géénérer un nombre à 6 chiffres aléatoires
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
  
      // On obtient le timestamp en secondes
      const timestamp = Math.floor(Date.now() / 1000);
  
      // On concaténe les deux valeurs avec un tiret
      const orderNumber = `${randomNumber}-${timestamp}`;
  
      // On afffiche le numéro de commande dans l'élément <span id="orderId">
      document.getElementById("orderId").textContent = orderNumber;
    }
  
    // On appelle la fonction afin de générer et afficher le numéro de commande
    generateOrderNumber();
  });
  