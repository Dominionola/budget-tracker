const balance = document.getElementById("balance");
const type = document.getElementById("type");
const category = document.getElementById("category");
const amount = document.getElementById("amount");
const addTransaction = document.getElementById("add-transaction");
const transactionList = document.getElementById("transaction-list");
const clearTransactions = document.getElementById("clear-transactions");

const transactions = [];

// ✅ Update UI State (show/hide clear button, reset balance if empty)
const updateUIState = () => {
  if (transactionList.childElementCount > 0) {
    clearTransactions.classList.remove("hidden");
  } else {
    clearTransactions.classList.add("hidden");
    balance.textContent = "$0.00";
  }
};

// ✅ Render each transaction
function renderTransaction(transaction, index) {
  const li = document.createElement("li");
  li.className = "flex justify-between border-b py-4 text-sm";

  const date = new Date(transaction.id);
  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  li.innerHTML = `
    <span>${index}</span>
    <span class="${
      transaction.type === "income" ? "text-green-600" : "text-red-600"
    } font-semibold">${transaction.type}</span>
    <span class="text-gray-600">${timeString}</span>
    <span class="text-gray-600">${transaction.category}</span>
    <span class="${
      transaction.type === "income" ? "text-green-600" : "text-red-600"
    } font-semibold">$${transaction.amount.toFixed(2)}</span>
    <i class="ph ph-trash hover:text-red-600 cursor-pointer"></i>
  `;

  const deleteBtn = li.querySelector("i");
  deleteBtn.addEventListener("click", () => {
    const txnIndex = transactions.findIndex((txn) => txn.id === transaction.id);
    if (txnIndex !== -1) {
      transactions.splice(txnIndex, 1);
    }
    li.remove();

    const currentBalance = transactions.reduce((total, txn) => {
      return txn.type === "income" ? total + txn.amount : total - txn.amount;
    }, 0);

    balance.textContent = `$${currentBalance.toFixed(2)}`;
    updateUIState(); // ✅ check and hide clear button if empty
    saveTransactions();
  });

  transactionList.appendChild(li);
}

// ✅ Add Transaction Handler
addTransaction.addEventListener("click", () => {
  const transactionType = type.value;
  const transactionCategory = category.value.trim();
  const transactionAmount = parseFloat(amount.value);

  if (transactionCategory === "") {
    alert("Please enter a category.");
    return;
  }

  if (isNaN(transactionAmount) || transactionAmount <= 0) {
    alert("Please enter a valid amount greater than 0.");
    return;
  }

  const transaction = {
    id: Date.now(),
    type: transactionType,
    category: transactionCategory,
    amount: transactionAmount,
  };

  transactions.push(transaction);
  renderTransaction(transaction, transactions.length);

  const currentBalance = transactions.reduce((total, txn) => {
    return txn.type === "income" ? total + txn.amount : total - txn.amount;
  }, 0);

  balance.textContent = `$${currentBalance.toFixed(2)}`;

  category.value = "";
  amount.value = "";
  type.value = "income";
  category.focus();

  updateUIState(); // ✅ show clear button if hidden
  saveTransactions();
});

// ✅ Clear Transactions Button Handler
clearTransactions.addEventListener("click", () => {
  transactions.length = 0; // clear array
  transactionList.innerHTML = ""; // clear UI
  updateUIState(); // hide button, reset balance
  saveTransactions();
});

// Save to localStorage helper
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Load from localStorage helper
function loadTransactions() {
  const stored = localStorage.getItem("transactions");
  if (stored) {
    const parsed = JSON.parse(stored);
    transactions.push(...parsed);

    transactions.forEach((txn, idx) => {
      renderTransaction(txn, idx + 1);
    });

    const currentBalance = transactions.reduce((total, txn) => {
      return txn.type === "income" ? total + txn.amount : total - txn.amount;
    }, 0);

    balance.textContent = `$${currentBalance.toFixed(2)}`;
    updateUIState();
  }
}

loadTransactions();
