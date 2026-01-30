const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/scrape-entries", async (req, res) => {
    const { links } = req.body;
    
    // HTML Başlangıcı ve CSS (style.css dosyan varsa oradan çeker)
    let allHtml = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Okuma Listesi</title>
        <link rel='stylesheet' href='style.css'>
        <style>
            body { background: #111; color: #ccc; font-family: 'Sitka Text', serif; padding: 50px; line-height: 1.6; }
            section { margin-bottom: 50px; border-bottom: 1px dashed #444; padding-bottom: 20px; }
            h1#title { color: #17FF00; font-size: 24px; }
            .content { margin-top: 10px; display: block; }
            .entry-author { color: #555; font-size: 0.8em; text-align: right; }
            hr { border: 0; border-top: 1px solid #333; margin: 40px 0; }
            .entry-footer {
    border-top: 1px dotted #333;
    padding-top: 5px;
}
.entry-footer a {
    color: #17FF00 !important; /* Yazar isimleri yeşil görünsün */
    text-decoration: none;
}
    a.url {
  color: red;
}
a.url:visited {
  color: rgb(0, 255, 213);
}
        </style>
    </head>
    <body>`;

    console.log(`${links.length} adet başlık işleniyor...`);

    for (const url of links) {
        try {
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
                    "Cookie": "iq=ade96488b817442aac59c3e8c07063df; eksi_up=useDarkTheme=1; OptanonAlertBoxClosed=2025-04-26T20:50:33.631Z; __gfp_cap=KlGSHRXGGM5qEGomoHntQGMKSaGGKQQWMaZcms8GhaS1R5nG; __gads=ID=05aac0ad4e636e6c:T=1750675917:RT=1755897625:S=ALNI_MYztwMOZI382ejjZ2x37rY4p-nYeA; __gpi=UID=00001090f01687d2:T=1745672690:RT=1755897625:S=ALNI_MbSxSkMIwbsJf9IsYcUiwwKdGBhNA; cto_bundle=A4x8M191UnRyZHpaNWRocjZNUFdZemlMUFRnVTkzbnVhVzNnY2ZwNDg1bzNRekU1SG9OeXNJRHI1dGQwQUlyMFJvV01VNnpSbERObkVQd1JCOU1xeTFURzUzMzZGRjBjSE5HJTJCU0VVaTklMkJYVXVpYmRsR1lPaXF3WDJINlo1bzJkc0czSUlQMTR6bG9Ra0xoUXhEMUQySnFPcUZRJTNEJTNE; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQSU_AAQSU_AAEsACBTRBtFoAP_gAEPgACiQINJD7C7FbSFCyD5zaLsAMAhHRsAAQoQAAASBAmABQAKQIAQCgkAYFASABAACAAAAICRBIQIECAAAAUAAQAAAAAAEAAAAAAAIIAAAgAEAAAAIAAACAIAAEAAIAAAAEAAAmAgAAIIACAAAgAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAQNVSD2F2K2kKFkHCmwXYAYBCujYAAhQgAAAkCBMACgAUgQAgFJIAgCIEAAAAAAAAAQEiCQAAQABAAAIACgAAAAAAIAAAAAAAQQAABAAIAAAAAAAAEAQAAIAAQAAAAIAABEhAAAQQAEAAAAAAAQAAA.f_AAAAAAAAA%22%2C%222~70.89.93.108.122.149.184.196.236.259.311.313.314.323.358.415.442.486.494.495.540.574.609.723.864.981.1029.1048.1051.1095.1097.1126.1205.1276.1301.1365.1415.1449.1514.1570.1577.1598.1651.1716.1735.1753.1765.1870.1878.1889.1958.1960.2072.2253.2299.2373.2415.2506.2526.2531.2568.2571.2575.2624.2677.2778~dv.%22%2C%226021A734-B4A9-41C3-A17B-FB7D74FB0F6E%22%5D%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%2295d7f60d-ee4a-4725-924d-9eae42797f59%5C%22%2C%5B1761587162%2C106000000%5D%5D%22%5D%5D%5D; cf_clearance=MOQlisN7iQI8K6OFGTe9x06K8cnJ0GJ.z0YjrVxvwaM-1765813542-1.2.1.1-YNAxhYv.emcIhLRyiLdf4ks.p8h538gbUCQWHEO8jEZsmzUfBy_1UAu9TPdiQEc0zbNIDFVWBul_I8UDY3ieac8_fnJYdGvDULCtjxxOztCfs5TyvHlNltOQ_sJR24o0gVhhgQIiLuhEe8HvPDq5rqD48T92tSbCGOq1p.CfQrcIxWfb1kxK3WHyc6uyGu5gvROh.pbfu5khFJnf9g5wP6rxxWAVzlf7brJkldhmucU; _ga=GA1.1.1615830138.1745672691; __gfp_64b=V61qktgs9dFsSKdrZLqxLjpc1VIglPe5d55Jsqjv9uf.p7|1745672690|2|||8:1:80; led_msg=; led_evt=; a=Y5Yv3ENrHX6AcddtLg+SknUvYfCO0iADvpE4kPTae8Bi2ojfcTA/1+lmI7wMhd6FlwEbhXa7O2vwfP5iOtH3Zcb7q25VNG4tPRzTcGEH8WkMl/cTWcJjVAAkwb66Tc8jcSS0KOygJkLaqaHHPRORBMzWK7qRi4/+KLgbJZgMn/plzlGthjq2QALiDQ7jYd0m; ASP.NET_SessionId=u5fn2wriltryzsclo1ix0yrb; __RequestVerificationToken=DFmBwugZeBPPx4n7IMjHgV92XgMcdhgE95ni9FamCPXlZEhjktVlnBwjk6UgycDssOR3-ezQ_sfdLgnRklilVSOEzV_BM-hyEnTUCji-LAo1; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Jan+30+2026+05%3A08%3A46+GMT%2B0300+(GMT%2B03%3A00)&version=6.34.0&isIABGlobal=false&consentId=48da67ca-1b6f-4a91-ab63-361dc3d2e8cd&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&hosts=H32%3A1%2CH43%3A1%2CH33%3A1%2CH34%3A1%2CH35%3A1%2CH2%3A1%2CH3%3A1%2CH4%3A1%2CH5%3A1%2CH36%3A1%2CH6%3A1%2CH7%3A1%2CH9%3A1%2CH10%3A1%2CH37%3A1%2CH11%3A1%2CH12%3A1%2CH45%3A1%2CH13%3A1%2CH27%3A1%2CH14%3A1%2CH38%3A1%2CH39%3A1%2CH44%3A1%2CH16%3A1%2CH18%3A1%2CH40%3A1%2CH19%3A1%2CH20%3A1%2CH21%3A1%2CH41%3A1%2CH42%3A1%2CH22%3A1&genVendors=&AwaitingReconsent=false&geolocation=TR%3B16; led_tra=1; FCNEC=%5B%5B%22AKsRol-LpFJ1cXB0KU61pyKbQnjoqgPEEzppri3TrXsGESvIRdDoJ3XcWJbHqc4e9zViga3OWKLHVk_Tx-9MKrkVg_S9q8SQ_rnhdUANd7DDR__pq5ZREgJ8mKIZQC95T1hUfIm2VApXyg6zCD-qqQfdCg8USEUJJw%3D%3D%22%5D%5D; _ga_0SCWQ0JSDM=GS2.1.s1769737760$o1332$g1$t1769738934$j52$l0$h0" 
                }
            });

            const $ = cheerio.load(data);
            const title = $("#title").text().trim();
            
            allHtml += `<section><h1>${title}</h1><ul id="entry-item-list">`;

            // Sadece entry içeriklerini çekelim
$(".content").each((i, el) => {
    const entryBody = $(el).html(); // Entry metni
    
    // Entry'nin hemen altındaki footer'ı bulalım
    // Genellikle entry-item-list içindeki aynı li öğesinin içindedir
    const entryFooter = $(el).closest('li').find(".entry-footer-bottom").html() || "";

    allHtml += `
      <li class="entry-li" style="list-style:none; margin-bottom:30px;">
        <div class="content">${entryBody}</div>
        <div class="entry-footer" style="font-size: 0.7em; color: #888; text-align: right; margin-top: 10px;">
            ${entryFooter}
        </div>
      </li>`;
});

            allHtml += `</ul></section><hr/>`;
            console.log(`✅ Başarı: ${title}`);
        } catch (err) {
            console.error(`❌ Hata: ${url} ->`, err.message);
            allHtml += `<p style="color:red;">Hata: ${url} için veri alınamadı.</p>`;
        }
    }

    // --- SENİN ÖZEL SCRİPTİN BURADA BAŞLIYOR ---
    allHtml += `
    <script>
    var punto = 57;
    var scrl = 2;
    var artis = 12;
    var ilk_bas = false;
    var ilk_bas_tekrari = 12;
    var hiz = 0;
    var yon = 0;
    var dongu = null;

    var boyut = sessionStorage.getItem("boyut") ? parseInt(sessionStorage.getItem("boyut")) : punto;
    
    // Stil Enjeksiyonu
    var style = document.createElement('style');
    style.innerHTML = \`
        #kutu { position: fixed; top: 150px; right: 20px; background: rgba(40, 40, 40, 0.9); color: white; padding: 10px; border-radius: 10px; z-index: 9999; font-family: sans-serif; text-align: center; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 1px solid #444; width: 80px; }
        #kutu button { cursor: pointer; padding: 8px 0; border-radius: 4px; border: none; background: #555; color: white; font-weight: bold; }
        #kutu button:hover { background: #17FF00; color: black; }
        #kutuheader { font-size: 12px; color: #17FF00; margin-bottom: 5px; }
    \`;
    document.head.appendChild(style);

    var btn = document.createElement("div");
    btn.id = "kutu";
    var header = document.createElement("div");
    header.id = "kutuheader";
    header.innerHTML = "%0<br>0:00<br>hız:0";

    function createBtn(txt, id, func) {
        let b = document.createElement("button");
        b.innerHTML = txt;
        b.id = id;
        b.onclick = func;
        return b;
    }

    btn.appendChild(header);
    btn.appendChild(createBtn("+1", "up", yukari));
    btn.appendChild(createBtn("-1", "down", asagi));
    btn.appendChild(createBtn("DUR", "dur", dur));
    btn.appendChild(createBtn("<<", "sizedown", sizedown));
    btn.appendChild(createBtn(">>", "sizeup", sizeup));
    btn.appendChild(createBtn("KYDT", "save", save));
    document.body.appendChild(btn);

    function metinleriGuncelle() {
        document.querySelectorAll(".content").forEach(el => {
            el.style.fontSize = boyut + "px";
        });
    }

    function yukari() { yon -= scrl; hiz--; durdur(); git(); }
    function asagi() { 
        if (!ilk_bas) { yon += (scrl * ilk_bas_tekrari); hiz = ilk_bas_tekrari; } 
        else { yon += scrl; hiz++; }
        ilk_bas = true; durdur(); git(); 
    }
    function durdur() { clearInterval(dongu); }
    function dur() { ilk_bas = false;    if (hiz != 0) {ilk_bas_tekrari = hiz;} yon = 0; hiz = 0; durdur(); }

function git() {
    if (yon === 0) return;
    var intervlhiz = 480 / Math.abs(yon);
    dongu = setInterval(() => {
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        var currentScroll = window.scrollY;
        var miktar = Math.round((currentScroll / maxScroll) * 100);

        // kalan mesafe
        var kalanMesafe = maxScroll - currentScroll;

        // hız: her intervalde kaç px kaydırıyorsun
        var pxPerStep = Math.sign(yon); 
        var stepsNeeded = kalanMesafe / Math.abs(pxPerStep);

        // kalan süre (ms cinsinden)
        var kalanSureMs = stepsNeeded * intervlhiz;

        // dakika ve saniye
        var dakika = Math.floor(kalanSureMs / 60000);
        var saniye = Math.floor((kalanSureMs % 60000) / 1000);

        header.innerHTML = "%" + miktar + "<br>" +
            dakika + ":" + (saniye < 10 ? "0" + saniye : saniye) +
            "<br>hız:" + hiz;

        window.scrollBy(0, pxPerStep);
    }, intervlhiz);
}


    function sizedown() { boyut -= artis; metinleriGuncelle(); }
    function sizeup() { boyut += artis; metinleriGuncelle(); }
    function save() { sessionStorage.setItem("boyut", boyut); alert("Boyut kaydedildi: " + boyut); }

    // Başlangıç ayarı
    metinleriGuncelle();
    </script>
    `;

    allHtml += "</body></html>";

    fs.writeFileSync("takipentry.html", allHtml, "utf-8");
    res.send("OK");
});

app.listen(3000, () => {
    console.log("------------------------------------------");
    console.log("🚀 Server Başlatıldı: http://localhost:3000");
    console.log("📂 1. Tarayıcıda 'debe.html' dosyasını değil, http://localhost:3000/takip.html adresini açın.");
    console.log("📂 2. Başlıkları seçip 'Seçilenleri Çek' butonuna basın.");
    console.log("------------------------------------------");
});


/*


node index.js
node server.js




*/
