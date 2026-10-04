# Son kontrol — 4 Ekim 2026

## Yazım ve metin denetimi — 4 Ekim 2026

- 14 ürünün açıklamaları, teknik etiketleri, model seçenekleri; menü, sektör, yazılım, SSS ve footer metinleri incelendi. Logo açıklamaları, e-posta taslakları, meta etiketleri ve yapılandırılmış SSS verileri de düzeltildi.
- RobotSepeti, UFACTORY, Lite6, ROS 1 ve ROS 2 yazımları tutarlı hale getirildi. Başlıklarda cümle düzeni ve Türkçe yazım/noktalama kuralları uygulandı; eksik cümleler tamamlandı.
- Ondalık sayılar virgülle, binlik gruplar noktayla gösterilir. Birimler sayılardan boşlukla ayrılır; kuvvet/tork birimleri N, mN, N·m ve mN·m biçimindedir. CountUp animasyonu Türkçe ondalık ve binlik biçimini korur.
- Bütün ürünler 320 px telefon ve 768 px tablet görünümünde yeniden kontrol edildi; güncellenen metinlerde taşma bulunmadı. xArm 7 masaüstünde ve animasyonlu teknik değerleriyle ayrıca doğrulandı.
- Satış bağlantıları, ürün rotaları ve medya yolları kaynak karşılaştırmasıyla doğrulandı. Yerleşim sınıfları ve SVG çizimleri korundu.
- Üretim derlemesi başarılı; lint 0 hata, mevcut 6 görsel performans önerisi. Testler Chromium ekran boyutu emülasyonu ile yapıldı.

## Doğrulanan kapsam

- 13 ürün, 4 kategori ve tüm model/paket seçimleri; 1440 px masaüstü ve 390 px telefon görünümü.
- Her ürünün galeri görselleri ve varsa video seçimi; bütün seçeneklerin satış adresi ve teklif metnindeki ürün bağlantısı.
- 31 farklı RobotSepeti ürün adresi HTTP 200 ile, yönlendirme olmadan açılıyor; başlıkları doğru model/paketle eşleşiyor. Eski URL adları, gerçek sayfa başlığı doğru olduğu için korundu.
- Sayfanın masaüstü ve mobil bölümleri, mobil menü, telefon/WhatsApp ve logo bağlantıları; kaynak dosyalarında 6212 numarası yok.
- Doğrudan `#urun=xarm7` bağlantısı, sayfa yenileme, katalog dönüşü ve tarayıcı geri/ileri.
- İki sitedeki 532 dosya/genel bağlantı birlikte denetlendi; bu deponun bütün `public` dosyaları başarılı yanıtla açılıyor.
- Üretim derlemesi ve TypeScript başarılı. ESLint: 0 hata; mevcut altı yerel `<img>` kullanımında Next.js performans önerisi var.

## Düzeltilenler

- Teknik özellik kartlarında etiket ve uzun değerlerin kesilmesi; mobil kategori göstergesinin boyutu/konumu.
- Seçili ürün açıldığında görünmez katalog düğmelerinin klavyeyle erişilebilir kalması.
- Yenileme ve geri/ileri sırasında seçili ürünün kaybolması.
- Ürün videosunun portre kutusunda kırpılması; görselin üzerinde kalan ürün başlığı. Video artık tamamını gösterir ve önizleme resmi vardır.
- Lite 6, Gripper/Vacuum Lite ve uArm aksesuarlarında görsel/özellik eşleşmesi.
- Yanlış Lite6 Pro meta açıklaması, sabit teslim süresi ve doğrulanmayan güvenlik/tarih iddiaları.
- Ekran dışındaki videoların gereksiz oynatılması; azaltılmış hareket ve veri tasarrufunda otomatik oynatma.

Kuvvet/tork sensöründeki çelişkili xArm 6/7 paket bağlantısı çıkarılmış durumda; yeniden eklenmedi.

## uArm ürün adlandırması düzeltmesi — 4 Ekim 2026

- Birleştirilmiş “Robotik Eğitim Kiti” kaydı kaldırıldı. Konveyör bant sistemi ve Slider kızak sistemi, ayrı açıklama/teknik özellik/galeri ve RobotSepeti satış bağlantılarıyla iki ürün olarak sunuluyor. Katalog artık 14 ürün içeriyor; farklı satış adreslerinin sayısı 31 olarak kaldı.
- Konveyör açıklaması, nesnelerin taşıyıcı bantla robotun çalışma alanına beslenmesini anlatıyor. Slider açıklaması, robot kolunun ray üzerinde yatay hareketini anlatıyor. Robot kollarının paketlere dahil olmadığı ikisinde de belirtiliyor.
- Kategori “uArm Aksesuarları” olarak adlandırıldı; ürün ailesi anlatımı düzeltildi. Doğrulanmayan Python/Blockly, görüntü işleme ve STEM paket iddiaları kaldırıldı.
- Kaynaklar yeniden okundu: [Konveyör](https://www.robotsepeti.com/uarm-robotik-egitim-kiti-conveyor-konveyor), [Slider](https://www.robotsepeti.com/uarm-egitim-kiti-slider-conveyor). Mevcut `#urun=conveyor-kit` adresi korunuyor; Slider'ın adresi `#urun=uarm-slider`.
- İki ürün 1440 px masaüstü, 320 px telefon ve 768 px tablette kontrol edildi. Dokuz galeri seçimi, katalog dönüşü, doğrudan ürün açılışı, konveyör rotasında yenileme, satış ve teklif bağlantıları doğrulandı; teknik metinlerde taşma ve tarayıcı konsol hatası görülmedi. Üretim derlemesi ve lint tekrar başarılı (0 hata, mevcut 6 görsel performans önerisi).

## Ek mobil denetim — 4 Ekim 2026

- 13 ürünün tamamı 320 px küçük telefon ve 768 px tablet genişliklerinde yeniden denetlendi. 360, 390, 414, 844 ve 1024 px genişliklerde temsilci ürünler; 844 × 390 yatay telefon görünümü ayrıca kontrol edildi.
- Telefon menüsü, dört kategori, ürün seçimi/katalog dönüşü, galeri ve özellik alanlarında yatay taşma veya kırık medya bulunmadı.
- Avantaj bölümündeki uzun başlık 320/360 px ekranlarda taşmayacak boyuta getirildi; gerektiğinde sözcük sarma eklendi.
- Ürün ailelerinin görünme animasyonu yalnızca opaklık, hareket ve gölgeyi etkiler. Ekran yönü değişirken kart genişliği/iç boşlukları doğrudan yeni yerleşime geçer; dar geçici kutular oluşmaz.
- Testler Chromium ekran boyutu emülasyonu ile yürütüldü; fiziksel Safari/Firefox cihaz testi yapılmadı.

## Bağımlılıklar

Next.js ve eslint-config-next 16.3.8'e yükseltildi; güvenli aralıkta kalan geçişli güncellemeler uygulandı. Üretim bağımlılıkları: `npm audit --omit=dev` — **0 açık**.

Tam `npm audit` çıktısında `braces@3.0.3` → micromatch → fast-glob → Next ESLint araçları zincirinde **5 ilişkili yüksek önem uyarısı** kalıyor. 4 Ekim 2026'daki son kontrolde npm kayıt defterinin güncel kararlı sürümleri `braces@3.0.3` ve `eslint-config-next@16.3.8`; [ilgili güvenlik duyurusunda](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) yamalı sürüm henüz bulunmuyor. Üretim bağımlılıkları ayrıca yeniden denetlendi: **0 açık**. Zorla önerilen eski/uyumsuz ESLint sürümüne geçilmedi.

Kaynak kod incelemesinde Next ESLint'in `fast-glob` kullanımı, geliştiricinin `settings.next.rootDir` ayarını çözümleyen yardımcıda bulunuyor. Bu projede o ayar yok; ziyaretçi verisi bu araca aktarılmıyor. Uyarı geliştirme bağımlılıklarında kayıtlı kalıyor. Kararlı bir üretici yaması çıktığında bağımlılık güncellemesi ve lint/derleme kontrolü gerekir.

## Tekrar doğrulama

```sh
npm ci
npm run build
npm run lint
npm audit --omit=dev
node check-product-links.mjs --titles
```

Tarayıcı testleri Chromium ile yapıldı; fiziksel Safari/Firefox testi yapılmadı. E-posta, telefon ve WhatsApp hedefleri denetlendi; arama veya müşteri mesajı gönderilmedi.
