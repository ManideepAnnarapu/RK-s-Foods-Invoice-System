document.addEventListener('DOMContentLoaded', () => {
  const items = JSON.parse(localStorage.getItem('invoiceItems')) || [];
  const tbody = document.querySelector('#invoiceTable tbody');
  const topTotal = document.getElementById('totalAmount');
  const bottomTotal = document.getElementById('bottomTotal');
  const dateElement = document.getElementById('invoiceDate');
  const storeName = localStorage.getItem('invoiceStoreName') || "N/A";

  // Set today's date
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString();

  // Set store name
  document.getElementById('billToStore').textContent = storeName;

  let grandTotal = 0;

  // Render table rows
  items.forEach(item => {
    const total = item.quantity * item.price;
    grandTotal += total;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity} lbs</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${total.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });

  // Set totals in top and bottom locations
  topTotal.textContent = `$${grandTotal.toFixed(2)}`;
  bottomTotal.textContent = `$${grandTotal.toFixed(2)}`;

  // Bind the download button
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadInvoice);
  }
});

// Download invoice as A4 PDF
function downloadInvoice() {
  const invoice = document.getElementById('invoiceContent');

  const opt = {
    margin: [0, 0, 0, 0], // inches: top, left, bottom, right
    filename: `rkfoods_invoice_${new Date().toISOString().split("T")[0]}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0, // important for avoiding scroll-related issues
      logging: false
    },
    jsPDF: {
      unit: 'in',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  html2pdf().set(opt).from(invoice).save().then(() => {
    // Clear stored data and redirect
    localStorage.removeItem('invoiceItems');
    localStorage.removeItem('invoiceStoreName');
    window.location.href = 'admin.html';
  });
}
