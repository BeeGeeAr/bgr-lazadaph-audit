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
            line.innerText = `[ ₱${total.toFixed(2)} ] — ${title} (${quantity}) [${statKey}]`;
            container.appendChild(line);
        });

        const finalTotal = document.createElement("p");
        finalTotal.innerText = `💰 Grand Total: ₱${grandTotal.toFixed(2)}`;
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
            line.innerText = `• ${stat}: ₱${total.toFixed(2)}`;
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
                    total.toFixed(2),
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
