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
                    "Cookie": "iq=5481e2b2742d48aa836be99b8a8de117; OptanonAlertBoxClosed=2026-05-09T05:05:17.889Z; __gads=ID=59ec26d1952f0688:T=1778303110:RT=1778393463:S=ALNI_MbxHzgVNu2BL2X4TvSezQLL8PmI4A; __gpi=UID=00001374da328019:T=1778303110:RT=1778393463:S=ALNI_MZMrgPoKSWbAZK0-sJ_Lds_1M32Lw; __eoi=ID=2889f18227c11446:T=1778303110:RT=1778393463:S=AA-AfjaVpuAoi_7N0V1-6WkZPl3I; ecuid=Az97KRq0t5pycZIKQb9GV6mZ0Hh2qvIBhc652xJLn4vpE+aeToI0/h/Co9D0qXpxFVWaPEn0wLnvxyD/JfIonA==; ecs=ccDnLycx5aw8iRpi2uo7c2te8JmLZjKULVY0eEq2TBFoCGyKNSGtXTus2X/z0AxU+p+3usG5JkAijA22HqsSIA==; __gfp_cap=KlGrlMXGGM5qnxlG6ehsGRGKSaGGKnm7RMZa1loHGxsSYvrQsG..; eksi_up=useDarkTheme=1; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQnSakAQnSakAEsACBTRCnFoAP_gAEPgACiQMGoB_C7EbCFCiDJ3IKMEMAhHABBAYsAwAAYAAgAADBIQIAQCgkEYBASAFCACCAAAKASBAAAgCAAAAUAAIAAFAABAAAwAIBAIIAAAgAAAAEAAAAAACIAAEQCAAAAEAEAAkAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAABAEAAQAAQAAAAAAAiAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgAAAAAAAAAAAAAAAAAAEAAAAAAIMGoB_C7EbCFCiDBXIKMEMAhXABAAYsAwAAYAAgAADBIQIAQCkkESBACAECAACAAAIAQBAAAoAAgAAEAAAAAVAABAAAwAIBAIAEAAgAAAQEAAAAAACIAAEQCAAAAEAEAAgAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAAAAEAACAAwAAAAAAAiAAAAAAAABAIEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAEAAAAAAAAAAAAAAAEAAAAAAIAA.IMGoB_C7EbCFCiDJ3IKMEMAhXABBAYsAwAAYAAgAADBIQIAQCkkEaBASAFCACCAAAKASBAAAoCAgAAUAAIAAVAABAAAwAIBAIIEAAgAAAQEAAAAAACIAAEQCAAAAEAEAAkAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAABAEAASAAwAAAAAAAiAAAAAAAABAIEAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgAAEAAAAAAAAAAAAAAAEAAAAAAIA.f_AAAAAAAAA%22%2C%222~61.89.122.161.184.196.230.314.340.442.445.494.550.576.827.1025.1029.1033.1046.1047.1051.1097.1126.1166.1301.1342.1415.1725.1942.1958.1987.2068.2072.2074.2107.2213.2219.2223.2224.2328.2331.2416.2501.2567.2568.2575.2657.2778.2869.2878.2908.2920.2963.3005.3023.3126.3235.3253.3309.3731.6931.8931.13731.15731.33931~dv.%22%2C%224F65948E-A8D3-41B3-8F0D-31A619F77FAC%22%5D%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22c34b5857-231c-400e-8279-2c89340abc64%5C%22%2C%5B1780744489%2C608000000%5D%5D%22%5D%5D%5D; _gid=GA1.2.3161505.1784494111; a=FlbnLriNebCvzHdVBtxNmx2tFB6/bB1EP/1Vh4inuxCTkDilWtHMRBgL9KOQeb3wv4h2lFasEPxSOmkgT5T4+rjT3LPnSBytbyQVh1y6EQA2bsz/BIv2juN/M/OwCjsSxsestZ6YbyAKRpx3xVTL039X71BAPNNO/z/aA+dkNgnbeFMd2184kKxHjS1xLOuk; __gfp_64b=2MZla_xDjNiVEzuPDujWL9PHWdmujG.r4czcvA1dgej.27|1778303110|2|||8:1:80; led_msg=; led_evt=; ASP.NET_SessionId=qjurkytut05ynh5m0mnkc3bc; __RequestVerificationToken=YUjhOgr7kgrLpGnlzEWOeMc0EMEyuYpwBIJfg_fU0EwzSRzILw2kCM1hoAwK99r6QK4YsmRYuH2UikWbrKYpOBXFmMToRND9SL3jVpRdqhc1; _ga=GA1.1.1041604729.1778303113; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Jul+22+2026+13%3A19%3A27+GMT%2B0300+(T%C3%BCrkiye+Standart+Saati)&version=6.34.0&isIABGlobal=false&consentId=02ab7f77-a1b4-4920-ba0c-cd4a06605cd0&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&hosts=H32%3A1%2CH43%3A1%2CH33%3A1%2CH34%3A1%2CH35%3A1%2CH2%3A1%2CH3%3A1%2CH4%3A1%2CH5%3A1%2CH36%3A1%2CH6%3A1%2CH7%3A1%2CH9%3A1%2CH10%3A1%2CH37%3A1%2CH11%3A1%2CH12%3A1%2CH45%3A1%2CH13%3A1%2CH27%3A1%2CH14%3A1%2CH38%3A1%2CH39%3A1%2CH44%3A1%2CH16%3A1%2CH18%3A1%2CH40%3A1%2CH19%3A1%2CH20%3A1%2CH21%3A1%2CH41%3A1%2CH42%3A1%2CH22%3A1&genVendors=&AwaitingReconsent=false&geolocation=TR%3B16; led_tra=1; FCNEC=%5B%5B%22AKsRol-JfU7fg3517FxQ6JCwrSps-vm8yciICpAIVRu1XOu544WpG05pBdILMtEtQeeXb1QAircPzPcOQpeGdmadqI9-GSmFWWGkr72rJR0GPVb6ZrvAyg4SAc2ffTgr_mwf9m7dC8SbbKEDf6pAYiApLgLJx0PpHA%3D%3D%22%5D%5D; _ga_0SCWQ0JSDM=GS2.1.s1784723021$o202$g1$t1784723021$j60$l0$h0" 
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
