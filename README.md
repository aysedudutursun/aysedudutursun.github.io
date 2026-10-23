# Ayşe Dudu Tursun — Portfolyo

## GitHub'a yükleme
Bu klasörün **içindekileri** (index.html, assets, data, .nojekyll) `aysedudutursun.github.io` deposunun ana dizinine yükleyin
(eski index.html'in üzerine yazılır). Birkaç dakika sonra site yayında olur.

## Düzenleme
- **Yazılar, projeler, deneyim, topluluk, iletişim:** `data/content.js`
  - Yeni kart eklemek için ilgili listede bir `{ ... }` bloğunu kopyalayıp yapıştırın.
  - Her yazı `{ tr:"", en:"", es:"", de:"", ar:"" }` biçimindedir; boş bırakılan dil için İngilizce/Türkçe gösterilir.
  - Bölüm sırası: `sections` satırı.
- **Fotoğraf:** `assets/img/profil.jpg` dosyasını aynı adla değiştirin (dikey, yaklaşık 3:4 oran en iyisi).
- **Görünüm:** `assets/css/style.css` (renkler en üstteki `:root` bölümünde).
- **Yeni dil eklemek:** `languages` listesine satır ekleyin ve yazılara o dilin kodunu ekleyin. Sağdan sola diller için `dir:"rtl"`.

Bilgisayarınızda test etmek için `index.html` dosyasına çift tıklamanız yeterli.
