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
                    "Cookie": "iq=ade96488b817442aac59c3e8c07063df; a=TQZ2M+15Qb/Q+kA27BBI9dFh9DwLEFckUCepv4Xp+iZVrOrpWGEhCVb+EKEK8gP/TFJMrEnXlQyiCMNQrx7psvOqEZsP6XQPcB+3j7lIb77+Vcn3HSGrVGwgFcLu4yd4eMOwKX1prKJbSoVxVk2fG+u+0FfWbeCfgP08tg3uvYaf0rN9YNygEZOzy09FFqds;" // Cookie'nin kısa halini ekledim
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

//node debe.js
//node index.js
//node server.js
