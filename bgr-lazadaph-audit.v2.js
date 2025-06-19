(async function () {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let orderData = [];

    async function scrapePage() {
        const orders = document.querySelectorAll(".order-item");
        const statuses = document.querySelectorAll(".shop-right-status");

        orders.forEach((order, i) => {
            const title = order.querySelector(".item-title")?.innerText.trim();
            const priceText = order.querySelector(".item-price.text.bold")?.innerText.trim();
            const quantityText = order.querySelector(".item-quantity")?.innerText.trim();
            const status = statuses[i]?.innerText.trim() || "Unknown";

            if (title && priceText) {
                const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
                const quantity = parseInt(quantityText.replace(/[^0-9]/g, "")) || 1;
                const total = price * quantity;

                orderData.push({
                    title,
                    quantity,
                    total,
                    status
                });
            }
        });
    }

    async function nextPageExists() {
        const nextBtn = document.querySelector(".next-pagination-item.current + .next-pagination-item");
        if (nextBtn && !nextBtn.classList.contains("disabled")) {
            nextBtn.click();
            return true;
        }
        return false;
    }

    async function runAllPages() {
        let page = 1;
        while (true) {
            console.log(`📄 Scraping Page ${page}...`);
            await delay(3000);
            await scrapePage();
            const hasNext = await nextPageExists();
            if (!hasNext) break;
            page++;
        }
        summarize();
    }

    function summarize() {
        const container = document.getElementById("mylazadatotal") || (() => {
            const div = document.createElement("div");
            div.id = "mylazadatotal";
            div.style.background = "white";
            div.style.color = "black";
            div.style.padding = "20px";
            div.style.margin = "10px";
            document.body.insertBefore(div, document.body.firstChild);
            return div;
        })();

        container.innerHTML = "";

        const header = document.createElement("h2");
        header.innerText = "📦 BGR | LazadaPH Order Audit";
        header.style.marginBottom = "20px";
        container.appendChild(header);

        let grandTotal = 0;
        const statusTotals = {};

        orderData.forEach(({ title, quantity, total, status }) => {
            const statKey = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
            grandTotal += total;
            if (!statusTotals[statKey]) statusTotals[statKey] = 0;
            statusTotals[statKey] += total;

            const line = document.createElement("p");
            line.innerText = `[ ₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                } ] — ${title} (${quantity}) [${statKey}]`;
            container.appendChild(line);
        });

        const finalTotal = document.createElement("p");
        finalTotal.innerText = `💰 Grand Total: ₱${grandTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }`;
        finalTotal.style.marginTop = "20px";
        finalTotal.style.fontWeight = "bold";
        finalTotal.style.fontSize = "16px";
        container.appendChild(finalTotal);

        const subHeader = document.createElement("h3");
        subHeader.innerText = "📌 Subtotals by Order Status:";
        subHeader.style.marginTop = "15px";
        container.appendChild(subHeader);

        Object.entries(statusTotals).forEach(([stat, total]) => {
            const line = document.createElement("p");
            line.innerText = `• ${stat}: ₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }`;
            container.appendChild(line);
        });

        // Add footer tagline
        const footer = document.createElement("p");
        footer.innerText = "🧠 Compiled by BeeGeeAr | ☕ Fueled by caffeine & 🛍️ shopping regrets 😂.";
        footer.style.marginTop = "25px";
        footer.style.fontStyle = "italic";
        footer.style.color = "#666";
        container.appendChild(footer);

        // Add clickable credit to GitHub
        const creditLink = document.createElement("p");
        creditLink.innerHTML = `🔗 Inspired by the original <a href="https://github.com/limkokhole/MyLazadaTotal" target="_blank" style="color: #0077cc; text-decoration: none;">MyLazadaTotal</a> by @limkokhole on GitHub.`;
        creditLink.style.marginTop = "5px";
        creditLink.style.fontSize = "12px";
        creditLink.style.color = "#999";
        container.appendChild(creditLink);

        // 🧾 Convert orderData to CSV and trigger download
        function exportToCSV(data) {
            const csvRows = [
                ["Title", "Quantity", "Total", "Status"]
            ];

            data.forEach(({ title, quantity, total, status }) => {
                csvRows.push([
                    `"${title}"`,
                    quantity,
                    total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    ,
                    `"${status}"`
                ]);
            });

            const csvContent = csvRows.map(row => row.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `BGR_LazadaPH_OrderAudit_${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        }
        const csvBtn = document.createElement("button");
        csvBtn.innerText = "⬇️ Download CSV";
        csvBtn.style.marginTop = "15px";
        csvBtn.style.padding = "10px";
        csvBtn.style.background = "#0077cc";
        csvBtn.style.color = "white";
        csvBtn.style.border = "none";
        csvBtn.style.cursor = "pointer";
        csvBtn.style.borderRadius = "5px";
        csvBtn.onclick = () => exportToCSV(orderData);
        container.appendChild(csvBtn);
    }
    await runAllPages();
})();

// 🆕 v2 Extension: Order Detail Extractor with Delivery Dates and Discounts

function extractOrderDetailsFromDetailPage() {
  const details = {};

  // 📅 Dates
  document.querySelectorAll(".text.desc").forEach(p => {
    const text = p.textContent.trim();
    if (text.startsWith("Placed on")) details.placedOn = text.replace("Placed on", "").trim();
    else if (text.startsWith("Paid on")) details.paidOn = text.replace("Paid on", "").trim();
    else if (text.startsWith("Delivered on")) details.deliveredOn = text.replace("Delivered on", "").trim();
    else if (text.startsWith("Completed on")) details.completedOn = text.replace("Completed on", "").trim();
  });

  // 🔢 Order number
  const orderNoEl = document.querySelector(".order-number");
  if (orderNoEl) details.orderNumber = orderNoEl.textContent.replace("Order", "").trim();

  // 💳 Payment method
  const paidByEl = document.querySelector(".payment-line");
  if (paidByEl) details.paidBy = paidByEl.textContent.trim();

  // 💰 Total Summary Section
  document.querySelectorAll(".total-summary .row").forEach(row => {
    const label = row.querySelector(".text")?.textContent.trim();
    const value = row.querySelector(".price")?.textContent.replace(/[^0-9.]/g, "").trim();
    if (!label || !value) return;

    if (label.includes("Subtotal")) details.subtotal = parseFloat(value);
    else if (label.includes("Shipping Fee")) details.shippingFee = parseFloat(value);
    else if (label.includes("Lazada Voucher")) details.lazadaVoucher = parseFloat(value);
    else if (label.includes("Free Shipping")) details.freeShippingVoucher = parseFloat(value);
    else if (label.includes("Instant Discount")) details.instantDiscount = parseFloat(value);
    else if (label.includes("Coins")) details.coins = parseFloat(value);
  });

  // 🧾 Total (VAT Incl.)
  const totalEl = document.querySelector(".total-summary .text.bold + .text.bold");
  if (totalEl) details.totalAmount = parseFloat(totalEl.textContent.replace(/[^0-9.]/g, "").trim());

  return details;
}
