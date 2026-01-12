const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrape() {
  try {
    const url = "https://eksisozluk.com/basliklar/takip";

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
      "Cookie": "iq=ade96488b817442aac59c3e8c07063df; eksi_up=useDarkTheme=1; OptanonAlertBoxClosed=2025-04-26T20:50:33.631Z; __gads=ID=05aac0ad4e636e6c:T=1750675917:RT=1755897625:S=ALNI_MYztwMOZI382ejjZ2x37rY4p-nYeA; __gpi=UID=00001090f01687d2:T=1745672690:RT=1755897625:S=ALNI_MbSxSkMIwbsJf9IsYcUiwwKdGBhNA; cto_bundle=A4x8M191UnRyZHpaNWRocjZNUFdZemlMUFRnVTkzbnVhVzNnY2ZwNDg1bzNRekU1SG9OeXNJRHI1dGQwQUlyMFJvV01VNnpSbERObkVQd1JCOU1xeTFURzUzMzZGRjBjSE5HJTJCU0VVaTklMkJYVXVpYmRsR1lPaXF3WDJINlo1bzJkc0czSUlQMTR6bG9Ra0xoUXhEMUQySnFPcUZRJTNEJTNE; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQSU_AAQSU_AAEsACBTRBtFoAP_gAEPgACiQINJD7C7FbSFCyD5zaLsAMAhHRsAAQoQAAASBAmABQAKQIAQCgkAYFASABAACAAAAICRBIQIECAAAAUAAQAAAAAAEAAAAAAAIIAAAgAEAAAAIAAACAIAAEAAIAAAAEAAAmAgAAIIACAAAgAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAQNVSD2F2K2kKFkHCmwXYAYBCujYAAhQgAAAkCBMACgAUgQAgFJIAgCIEAAAAAAAAAQEiCQAAQABAAAIACgAAAAAAIAAAAAAAQQAABAAIAAAAAAAAEAQAAIAAQAAAAIAABEhAAAQQAEAAAAAAAQAAA.f_AAAAAAAAA%22%2C%222~70.89.93.108.122.149.184.196.236.259.311.313.314.323.358.415.442.486.494.495.540.574.609.723.864.981.1029.1048.1051.1095.1097.1126.1205.1276.1301.1365.1415.1449.1514.1570.1577.1598.1651.1716.1735.1753.1765.1870.1878.1889.1958.1960.2072.2253.2299.2373.2415.2506.2526.2531.2568.2571.2575.2624.2677.2778~dv.%22%2C%226021A734-B4A9-41C3-A17B-FB7D74FB0F6E%22%5D%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%2295d7f60d-ee4a-4725-924d-9eae42797f59%5C%22%2C%5B1761587162%2C106000000%5D%5D%22%5D%5D%5D; cf_clearance=MOQlisN7iQI8K6OFGTe9x06K8cnJ0GJ.z0YjrVxvwaM-1765813542-1.2.1.1-YNAxhYv.emcIhLRyiLdf4ks.p8h538gbUCQWHEO8jEZsmzUfBy_1UAu9TPdiQEc0zbNIDFVWBul_I8UDY3ieac8_fnJYdGvDULCtjxxOztCfs5TyvHlNltOQ_sJR24o0gVhhgQIiLuhEe8HvPDq5rqD48T92tSbCGOq1p.CfQrcIxWfb1kxK3WHyc6uyGu5gvROh.pbfu5khFJnf9g5wP6rxxWAVzlf7brJkldhmucU; _gid=GA1.2.442251475.1766553819; a=TQZ2M+15Qb/Q+kA27BBI9dFh9DwLEFckUCepv4Xp+iZVrOrpWGEhCVb+EKEK8gP/TFJMrEnXlQyiCMNQrx7psvOqEZsP6XQPcB+3j7lIb77+Vcn3HSGrVGwgFcLu4yd4eMOwKX1prKJbSoVxVk2fG+u+0FfWbeCfgP08tg3uvYaf0rN9YNygEZOzy09FFqds; _ga=GA1.1.1615830138.1745672691; __gfp_64b=RDHRqld3SiAWcJsJQnifCe7yCESn4ObqgEH_TDG9xuT.W7|1745672690|2|||8:1:80; led_msg=; led_evt=; ASP.NET_SessionId=3p3yuwbaqbo0n4o0wpuhzpzp; __RequestVerificationToken=OaPNoXYL6yf0LPptwd7nx7fGftZfnfHvbTmoy9zrZ2TfqxPEYV9Xhje4FGGJ1mt02fFkQNuce6VMUMhs6iz6n56fTCMImbwFjnI_vdfZ6JQ1; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Jan+04+2026+17%3A12%3A49+GMT%2B0300+(GMT%2B03%3A00)&version=6.34.0&isIABGlobal=false&consentId=48da67ca-1b6f-4a91-ab63-361dc3d2e8cd&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&hosts=H32%3A1%2CH43%3A1%2CH33%3A1%2CH34%3A1%2CH35%3A1%2CH2%3A1%2CH3%3A1%2CH4%3A1%2CH5%3A1%2CH36%3A1%2CH6%3A1%2CH7%3A1%2CH9%3A1%2CH10%3A1%2CH37%3A1%2CH11%3A1%2CH12%3A1%2CH45%3A1%2CH13%3A1%2CH27%3A1%2CH14%3A1%2CH38%3A1%2CH39%3A1%2CH44%3A1%2CH16%3A1%2CH18%3A1%2CH40%3A1%2CH19%3A1%2CH20%3A1%2CH21%3A1%2CH41%3A1%2CH42%3A1%2CH22%3A1&genVendors=&AwaitingReconsent=false&geolocation=TR%3B16; led_tra=1; FCNEC=%5B%5B%22AKsRol-B3RdhW4LPU6SiUkiR2hZdOZ-yUJsB_D_G1bAGTSW0F7MkEAf_gXTUiHBCQhTMuzpA3lqhvkQ52jBYqXq3JSm-btwFDxgJe7fyJh-QTNTE40yIx0DMD0tzvZzWxYjDFYOuzd_ZHTQF_kcQhrTA8JQCZ1jPfA%3D%3D%22%5D%5D; _ga_0SCWQ0JSDM=GS2.1.s1767535430$o1192$g1$t1767535970$j60$l0$h0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Referer": "https://eksisozluk.com/"
    };

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    // 🔹 Toplu Seçim Paneli HTML
    const bulkSelectorsHtml = `
    <div id="bulk-selectors" style="margin: 20px 0; padding: 15px; border: 1px dashed #222; background: #f0f0f0; font-family: sans-serif;">
      <strong>Hızlı Seçim:</strong><br><br>
      <label><input type="checkbox" id="g1"> 1-11</label> | 
      <label><input type="checkbox" id="g2"> 12-22</label> | 
      <label><input type="checkbox" id="g3"> 23-33</label> | 
      <label><input type="checkbox" id="g4"> 33+ Sonrası</label>
    </div>
    `;

    let listItemsHtml = "<ol id='list-container'>";

    $("ul.topic-list.partial li").each((i, el) => {
      const span = $(el).find("span#filter-index-channel");
      const link = $(el).find("a");

      listItemsHtml += `<li style="margin-bottom: 5px;">`;

      if (span.length > 0) {
        listItemsHtml += ` ${$.html(span)} `;
      } else if (link.length > 0) {
        listItemsHtml += ` ${$.html(link)} `;
      }

      // 🔹 Checkbox'lara 'class' ve 'data-index' ekliyoruz ki script kolayca bulsun
      listItemsHtml += `<input type="checkbox" class="entry-cb" data-index="${i}" name="check-${i}"></li>`;
    });

    listItemsHtml += "</ol>";

    const finalHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>TAKİP - Seçim Paneli</title>
  <style>
    body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
    input[type="checkbox"] { cursor: pointer; margin-left: 10px; }
    button { padding: 10px 15px; margin-right: 10px; cursor: pointer; border-radius: 5px; border: 1px solid #999; }
    #fetchEntries { background-color: #4CAF50; color: white; border: none; }
  </style>
</head>
<body>
  <h2>Takip Listesi Başlıkları</h2>
  ${bulkSelectorsHtml}
  ${listItemsHtml}
  <hr>
  <button id="fetchEntries">Seçilenleri Çek</button>
  <button id="openEntry">takipEntry Dosyasını Aç</button>

  <script>
    // 🔹 Toplu Seçim Mantığı
    const groups = [
      { id: "g1", start: 0, end: 10 },
      { id: "g2", start: 11, end: 21 },
      { id: "g3", start: 22, end: 32 },
      { id: "g4", start: 33, end: 999 }
    ];

    groups.forEach(group => {
      document.getElementById(group.id).addEventListener("change", (e) => {
        const isChecked = e.target.checked;
        const allCheckboxes = document.querySelectorAll(".entry-cb");
        allCheckboxes.forEach((cb, index) => {
          if (index >= group.start && index <= group.end) {
            cb.checked = isChecked;
          }
        });
      });
    });

    // 🔹 API'ye Gönderme Mantığı
    document.getElementById("fetchEntries").addEventListener("click", async () => {
      const checkedLinks = [];
      document.querySelectorAll(".entry-cb:checked").forEach(cb => {
        const anchor = cb.parentElement.querySelector("a");
        if (anchor) {
          const link = anchor.getAttribute("href");
          checkedLinks.push("https://eksisozluk.com" + link);
        }
      });

      if (checkedLinks.length === 0) {
        alert("Lütfen en az bir başlık seçin!");
        return;
      }

      try {
        const response = await fetch("/scrape-entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ links: checkedLinks })
        });
        alert(checkedLinks.length + " başlık gönderildi. takipentry.html güncelleniyor!");
      } catch (e) {
        alert("Sunucu hatası! Backend'in çalıştığından emin olun.");
      }
    });

    document.getElementById("openEntry").addEventListener("click", () => {
      window.open("takipentry.html", "_blank");
    });
  </script>
</body>
</html>
`;

    fs.writeFileSync("takip.html", finalHtml, "utf-8");
    console.log("✅ 'takip.html' başarıyla oluşturuldu! Toplu seçim kutuları aktif.");

  } catch (err) {
    console.error("❌ Hata:", err.message);
  }
}

scrape();