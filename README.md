# HeyGoldfish – Banyuwangi Goldfish Center

Website edukasi perawatan Goldfish (mobile-first). Situs statis, tanpa build step.

## Struktur
```
index.html            Halaman utama (root)
css/style.css         Gaya kustom + tema terang/gelap
js/tailwind-config.js Konfigurasi Tailwind (warna, font)
js/data.js            Konten: kategori, artikel, kamus
js/app.js             Logika tampilan
assets/images/        Foto (taruh di sini)
assets/videos/        Video (taruh di sini)
assets/favicon.svg    Ikon situs
```

## Menjalankan
Buka `index.html` di browser, atau jalankan server lokal: `python3 -m http.server`.

## Deploy ke GitHub Pages
1. Upload seluruh isi folder ini ke repository (index.html di root).
2. Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.
3. Situs aktif di `https://<username>.github.io/<repo>/`.

## Menambah konten
- Artikel: tambah objek di array `A` pada `js/data.js`.
- Istilah kamus: tambah baris di array `K` pada `js/data.js`.

## Catatan
- Tailwind dimuat via CDN (praktis untuk pengembangan). Untuk produksi, pertimbangkan build Tailwind agar lebih ringan.
- Disclaimer: konten bersifat edukasi dan tidak menggantikan dokter hewan ikan.
