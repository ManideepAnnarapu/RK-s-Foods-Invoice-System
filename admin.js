let tempItems = [];

document.addEventListener('DOMContentLoaded', () => {
  renderItems();
});

// Add Item Form Submission
document.getElementById('itemForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const itemName = document.getElementById('itemName').value.trim();
  const itemQty = parseFloat(document.getElementById('itemQty').value);
  const itemPrice = parseFloat(document.getElementById('itemPrice').value);

  if (!itemName || isNaN(itemQty) || isNaN(itemPrice) || itemQty <= 0 || itemPrice <= 0) {
    alert("Please fill out all fields correctly.");
    return;
  }

  tempItems.push({
    name: itemName,
    quantity: itemQty,
    price: itemPrice
  });

  renderItems();
  this.reset();
});

// Render Items in Editable Table
function renderItems() {
  const tbody = document.querySelector('#itemTable tbody');
  tbody.innerHTML = '';

  tempItems.forEach((item, index) => {
    const total = item.quantity * item.price;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" /></td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${total.toFixed(2)}</td>
      <td><button onclick="deleteItem(${index})" class="delete-btn">🗑️</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Update Quantity
function updateQuantity(index, newQty) {
  const qty = parseFloat(newQty);
  if (!isNaN(qty) && qty > 0) {
    tempItems[index].quantity = qty;
    renderItems();
  }
}

// Delete Item
function deleteItem(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    tempItems.splice(index, 1);
    renderItems();
  }
}

// Finalize and redirect
document.getElementById('finalizeInvoice').addEventListener('click', () => {
  const storeName = document.getElementById('storeName').value.trim();
  if (!storeName) {
    alert("Please enter the store name.");
    return;
  }

  const finalizedItems = tempItems.map(item => ({
    ...item,
    total: +(item.quantity * item.price).toFixed(2)
  }));

  localStorage.setItem('invoiceItems', JSON.stringify(finalizedItems));
  localStorage.setItem('invoiceStoreName', storeName);

  alert("Items added to invoice successfully!");

  // ✅ Redirect to invoice view
  window.location.href = './invoice.html';
});
