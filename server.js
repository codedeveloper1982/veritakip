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
            .content { margin-top: 10px;  margin-right: 50%; display: block; }
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
                    "Cookie": "iq=ade96488b817442aac59c3e8c07063df; eksi_up=useDarkTheme=1; OptanonAlertBoxClosed=2025-04-26T20:50:33.631Z; __gfp_cap=KlGSHRXGGM5qEGomoHntQGMKSaGGKQQWMaZcms8GhaS1R5nG; __gads=ID=05aac0ad4e636e6c:T=1750675917:RT=1755897625:S=ALNI_MYztwMOZI382ejjZ2x37rY4p-nYeA; __gpi=UID=00001090f01687d2:T=1745672690:RT=1755897625:S=ALNI_MbSxSkMIwbsJf9IsYcUiwwKdGBhNA; cto_bundle=A4x8M191UnRyZHpaNWRocjZNUFdZemlMUFRnVTkzbnVhVzNnY2ZwNDg1bzNRekU1SG9OeXNJRHI1dGQwQUlyMFJvV01VNnpSbERObkVQd1JCOU1xeTFURzUzMzZGRjBjSE5HJTJCU0VVaTklMkJYVXVpYmRsR1lPaXF3WDJINlo1bzJkc0czSUlQMTR6bG9Ra0xoUXhEMUQySnFPcUZRJTNEJTNE; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQSU_AAQSU_AAEsACBTRBtFoAP_gAEPgACiQINJD7C7FbSFCyD5zaLsAMAhHRsAAQoQAAASBAmABQAKQIAQCgkAYFASABAACAAAAICRBIQIECAAAAUAAQAAAAAAEAAAAAAAIIAAAgAEAAAAIAAACAIAAEAAIAAAAEAAAmAgAAIIACAAAgAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAQNVSD2F2K2kKFkHCmwXYAYBCujYAAhQgAAAkCBMACgAUgQAgFJIAgCIEAAAAAAAAAQEiCQAAQABAAAIACgAAAAAAIAAAAAAAQQAABAAIAAAAAAAAEAQAAIAAQAAAAIAABEhAAAQQAEAAAAAAAQAAA.f_AAAAAAAAA%22%2C%222~70.89.93.108.122.149.184.196.236.259.311.313.314.323.358.415.442.486.494.495.540.574.609.723.864.981.1029.1048.1051.1095.1097.1126.1205.1276.1301.1365.1415.1449.1514.1570.1577.1598.1651.1716.1735.1753.1765.1870.1878.1889.1958.1960.2072.2253.2299.2373.2415.2506.2526.2531.2568.2571.2575.2624.2677.2778~dv.%22%2C%226021A734-B4A9-41C3-A17B-FB7D74FB0F6E%22%5D%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%2295d7f60d-ee4a-4725-924d-9eae42797f59%5C%22%2C%5B1761587162%2C106000000%5D%5D%22%5D%5D%5D; cf_clearance=936Uddh9zUGrPKOPtLIzwkydqIKtK3sdlN_pY_lcgJM-1771358206-1.2.1.1-CKJ7QFFxI5WpYcMvApf0jmo2ZV_u_G31LcWvdmwUghYmZBbLI.CNCOV61KmByza.SAuV.Aybgh0Bct6Bl997kjZJ0tEyMLtGx0jbcJXvlNQV8Isr9Z5OfxWUcsAkMAs9e89CBLY2PrB_uesrP74LjM8lMqWn7myZH38hvR7VmIQdMKAzLhb.oJbpap26zXxb0xRd_YRpww5xTihXlqR5tThPpaqgH8fwa4kqpK4ni_Q; a=WTe/1NLDehfzbcJBAIDblD6empsLZJTOoCmRkiX2LBfE17Vx06a0Xmpqj7SfKmitKihkafHDi/pRmz9z/kcRgNVAe9RyD+ax1k+4umTmHwMWfX3QVRggZ3UduF40P2Ij8hLDx3SrYGU5aa3B1cQVPbmv1V/osvnuwDnaKDu9dCgBz+LKSQ1gWQvc347C+beT; _gid=GA1.2.474645539.1771705704; __gfp_64b=b33BxXDT1JKLy5fYt4N2J_WtC0L869IFvroQuY0.Wfv.f7|1745672690|2|||8:1:80; led_msg=; led_evt=; ASP.NET_SessionId=4arij25b2afhzk1co444xzgg; __RequestVerificationToken=tZCWeUtk_DNOAuWVWXEY5Q3WGsSlTHzYFq4HyOSURXuLgiq3AgdANm85T6nykRMxcRwEG1XzDTYBkdzdcoiEpSMURSnINFQxjvPN2hTxwWc1; _ga=GA1.1.1615830138.1745672691; _ga_0SCWQ0JSDM=GS2.1.s1771769058$o1459$g1$t1771769160$j60$l0$h0; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Feb+22+2026+17%3A06%3A00+GMT%2B0300+(GMT%2B03%3A00)&version=6.34.0&isIABGlobal=false&consentId=48da67ca-1b6f-4a91-ab63-361dc3d2e8cd&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&hosts=H32%3A1%2CH43%3A1%2CH33%3A1%2CH34%3A1%2CH35%3A1%2CH2%3A1%2CH3%3A1%2CH4%3A1%2CH5%3A1%2CH36%3A1%2CH6%3A1%2CH7%3A1%2CH9%3A1%2CH10%3A1%2CH37%3A1%2CH11%3A1%2CH12%3A1%2CH45%3A1%2CH13%3A1%2CH27%3A1%2CH14%3A1%2CH38%3A1%2CH39%3A1%2CH44%3A1%2CH16%3A1%2CH18%3A1%2CH40%3A1%2CH19%3A1%2CH20%3A1%2CH21%3A1%2CH41%3A1%2CH42%3A1%2CH22%3A1&genVendors=&AwaitingReconsent=false&geolocation=TR%3B16; led_tra=1; FCNEC=%5B%5B%22AKsRol-cFndPOs5s6qIZzbhNXLna62cdfNdWYDbhv11y_HB-RUaMMKjDLJv6CTIuITIyvICo7TuUhOJeaKk8_goERmh7q8Rgmenx_qyXMHgtT1v2usl26jbcJISeYZ08cK1j5Mul_Yh0DmUs7yX0w1ZwLjWbuKpi8A%3D%3D%22%5D%5D" 
                }
            });

            const $ = cheerio.load(data);
            const titleElement = $("#title"); // Elemanı seç
const titleText = titleElement.text().trim(); // Başlık metni
const titleHref = titleElement.find("a").attr("href") || titleElement.attr("href") || "#"; // Linki bul
// Eğer link göreceli ise (örn: /baslik/...) başına domain eklemek gerekebilir:
const fullUrl = titleHref.startsWith('http') ? titleHref : `https://eksisozluk.com${titleHref}`;
            
allHtml += `<section>
                <h1><a href="${fullUrl}" target="_blank" class="url">${titleText}</a></h1>
                <ul id="entry-item-list">`;
// Sadece entry içeriklerini çekelim
$(".content").each((i, el) => {
    // .url sınıfına sahip OLMAYAN a etiketlerini seç
    $(el).find("a:not(.url)").each((j, a) => {
        let href = $(a).attr("href");
        
        // Eğer href "/" ile başlıyorsa başına domain ekle
        if (href && href.startsWith("/")) {
            $(a).attr("href", "https://eksisozluk.com" + href);
            $(a).attr("target", "_blank"); 
        }
    });

    const entryBody = $(el).html(); 
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
           console.log(`✅ Başarı: ${titleText}`);
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
