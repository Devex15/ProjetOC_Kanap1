const urlString = window.location.search;
const urlParam = new URLSearchParams(urlString);

const orderCode= urlParam.get("orderCode");  

if (orderCode) {
  document.getElementById("orderId").innerText = orderCode;
} else {
  window.location.href = "./index.html"
}