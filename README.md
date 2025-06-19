# 📦 BGR | LazadaPH Order Audit

**Compiled by BeeGeeAr | Powered by caffeine and shopping regrets.**

This tool audits your Lazada PH order history — tallying every visible item, subtotaling by order status, and exporting to CSV.  
Inspired by [`MyLazadaTotal`](https://github.com/limkokhole/MyLazadaTotal) by [@limkokhole](https://github.com/limkokhole).

---

## 🚀 Features

- 🧾 Calculates total spent based on visible Lazada orders
- 📌 Subtotals by order status (Delivered, Received, etc.)
- 📦 Shows item name, quantity, and cost per item
- 🧃 CSV export for budgeting or shame journaling
- 🛠️ Works across **multiple pages**
- 👁️ No login credentials needed — runs entirely in browser
- 💻 No install needed — just use the bookmarklet

---

## 🔖 How to Use (Bookmarklet)

1. Visit your Lazada order history:  
   👉 [`https://my.lazada.com.ph/customer/order/index/`](https://my.lazada.com.ph/customer/order/index/)

2. **Create a new bookmark manually**:
   - Right-click your bookmarks bar → "Add page" / "Add bookmark"
   - Name: `BGR LazadaPH Order Audit`
   - Paste the following code as the URL:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://beegeear.github.io/bgr-lazadaph-audit/bgr-lazadaph-audit.min.js';document.body.appendChild(s);})()
```

3. Click the bookmark while you're on the Lazada orders page.
4. Wait for the tool to scan all your order pages.
5. Review the grand total, subtotals by status, and click **Download CSV** if needed.

---

## 📁 Files

| File                            | Description                         |
|---------------------------------|-------------------------------------|
| `bgr-lazadaph-audit.js`         | Full readable version (dev/debug)   |
| `bgr-lazadaph-audit.min.js`     | Minified version (for bookmarklet)  |
| `README.md`                     | You're reading this                 |

---

## 🙌 Credits

- 📌 Inspired by [`MyLazadaTotal`](https://github.com/limkokhole/MyLazadaTotal) by [@limkokhole](https://github.com/limkokhole)
- 🛠️ Refactored & PH-customized by [@BeeGeeAr](https://github.com/BeeGeeAr)

---

## 🧠 Future Plans

- Add delivery dates by crawling per order page
- Add filters (date range, total per month)
- Add dashboard to track spending per shop
- Package as Chrome extension

---

**📬 Questions, issues, or feature requests?**  
Create a GitHub Issue or message BeeGeeAr (Bonna Gajo Reñosa) directly.

---
