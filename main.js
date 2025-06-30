const balance = document.getElementById("balance");
const type = document.getElementById("type");
const category = document.getElementById("category");
const amount = document.getElementById("amount");
const addTransaction = document.getElementById("add-transaction");
const transactionList = document.getElementById("transaction-list");

if ((category.value.trim() === "")) {
  return
}

const amountValue = parseFloat(amount.value)
if (isNaN(amountValue) || amountValue <= 0) {
    return
}

addTransaction.addEventListener("click", ()=> {
    type = type.value
    
})