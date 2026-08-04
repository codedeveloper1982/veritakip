const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrape() {
  try {
    const url = "https://eksisozluk.com/basliklar/takip";

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
      "Cookie": "iq=5481e2b2742d48aa836be99b8a8de117; OptanonAlertBoxClosed=2026-05-09T05:05:17.889Z; __gads=ID=59ec26d1952f0688:T=1778303110:RT=1778393463:S=ALNI_MbxHzgVNu2BL2X4TvSezQLL8PmI4A; __gpi=UID=00001374da328019:T=1778303110:RT=1778393463:S=ALNI_MZMrgPoKSWbAZK0-sJ_Lds_1M32Lw; __eoi=ID=2889f18227c11446:T=1778303110:RT=1778393463:S=AA-AfjaVpuAoi_7N0V1-6WkZPl3I; ecuid=Az97KRq0t5pycZIKQb9GV6mZ0Hh2qvIBhc652xJLn4vpE+aeToI0/h/Co9D0qXpxFVWaPEn0wLnvxyD/JfIonA==; ecs=ccDnLycx5aw8iRpi2uo7c2te8JmLZjKULVY0eEq2TBFoCGyKNSGtXTus2X/z0AxU+p+3usG5JkAijA22HqsSIA==; __gfp_cap=KlGrlMXGGM5qnxlG6ehsGRGKSaGGKnm7RMZa1loHGxsSYvrQsG..; eksi_up=useDarkTheme=1; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQnSakAQnSakAEsACBTRCnFoAP_gAEPgACiQMGoB_C7EbCFCiDJ3IKMEMAhHABBAYsAwAAYAAgAADBIQIAQCgkEYBASAFCACCAAAKASBAAAgCAAAAUAAIAAFAABAAAwAIBAIIAAAgAAAAEAAAAAACIAAEQCAAAAEAEAAkAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAABAEAAQAAQAAAAAAAiAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgAAAAAAAAAAAAAAAAAAEAAAAAAIMGoB_C7EbCFCiDBXIKMEMAhXABAAYsAwAAYAAgAADBIQIAQCkkESBACAECAACAAAIAQBAAAoAAgAAEAAAAAVAABAAAwAIBAIAEAAgAAAQEAAAAAACIAAEQCAAAAEAEAAgAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAAAAEAACAAwAAAAAAAiAAAAAAAABAIEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAEAAAAAAAAAAAAAAAEAAAAAAIAA.IMGoB_C7EbCFCiDJ3IKMEMAhXABBAYsAwAAYAAgAADBIQIAQCkkEaBASAFCACCAAAKASBAAAoCAgAAUAAIAAVAABAAAwAIBAIIEAAgAAAQEAAAAAACIAAEQCAAAAEAEAAkAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAABAEAASAAwAAAAAAAiAAAAAAAABAIEAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgAAEAAAAAAAAAAAAAAAEAAAAAAIA.f_AAAAAAAAA%22%2C%222~61.89.122.161.184.196.230.314.340.442.445.494.550.576.827.1025.1029.1033.1046.1047.1051.1097.1126.1166.1301.1342.1415.1725.1942.1958.1987.2068.2072.2074.2107.2213.2219.2223.2224.2328.2331.2416.2501.2567.2568.2575.2657.2778.2869.2878.2908.2920.2963.3005.3023.3126.3235.3253.3309.3731.6931.8931.13731.15731.33931~dv.%22%2C%224F65948E-A8D3-41B3-8F0D-31A619F77FAC%22%5D%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22c34b5857-231c-400e-8279-2c89340abc64%5C%22%2C%5B1780744489%2C608000000%5D%5D%22%5D%5D%5D; _gid=GA1.2.3161505.1784494111; a=/9wdCi1WnHyU1VdxAfjK/wjaRTGtYykvKY40VqoCKHkXVhv0mIbcLcZNoDAuXAekl3zcYoM1zgu4Y2DL4Q/ypeQn1e8ztJ3MTuikJAwIHsR9tgLRUm+GCYxg3pkjPoeQ12E7bVWvpmyFDGC+SnLVJ1hjuDuBTs+5kzWqEF0McBGwg6tTJZY8hENDgz3CmnJ9; __gfp_64b=H0WL7hO_KEU8dSU4HTDoX2tLu1pPM7UWvU9q.fW5dcz.o7|1778303110|2|||8:1:80; led_msg=; led_evt=; ASP.NET_SessionId=kowwuipkzus5hkskgh5epfr5; __RequestVerificationToken=tC4mIuEbcx899ZgbroDrV3vtq2m40f_j7PC2FCjNebn5gxUDuaVGVJVJl65FpEDQ92GXOgvjNgIe_YNkaFMQBppl-rKsbxDHfClMDxlnpJ41; _ga=GA1.1.1041604729.1778303113; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Aug+04+2026+23%3A51%3A47+GMT%2B0300+(T%C3%BCrkiye+Standart+Saati)&version=6.34.0&isIABGlobal=false&consentId=02ab7f77-a1b4-4920-ba0c-cd4a06605cd0&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&hosts=H32%3A1%2CH43%3A1%2CH33%3A1%2CH34%3A1%2CH35%3A1%2CH2%3A1%2CH3%3A1%2CH4%3A1%2CH5%3A1%2CH36%3A1%2CH6%3A1%2CH7%3A1%2CH9%3A1%2CH10%3A1%2CH37%3A1%2CH11%3A1%2CH12%3A1%2CH45%3A1%2CH13%3A1%2CH27%3A1%2CH14%3A1%2CH38%3A1%2CH39%3A1%2CH44%3A1%2CH16%3A1%2CH18%3A1%2CH40%3A1%2CH19%3A1%2CH20%3A1%2CH21%3A1%2CH41%3A1%2CH42%3A1%2CH22%3A1&genVendors=&AwaitingReconsent=false&geolocation=TR%3B16; _ga_0SCWQ0JSDM=GS2.1.s1785876653$o287$g1$t1785876707$j60$l0$h0; led_tra=1; FCNEC=%5B%5B%22AKsRol843fSpL6qMOCyCGsKR_xKIMwE6dd3OJ7oAPbHMK98SSqnM5fRodYfjpxEhMJBuCr5oDYrT4mMkfDAo_6pJBs9xF_VKxBWNbyIia26MduS0_gTsObuaWXCDUqQ7Hwu6TmAl4y-nSr7xQg3l9PZJYD0LRkYb6Q%3D%3D%22%5D%5D",
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