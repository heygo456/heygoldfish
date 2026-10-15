# HeyGoldfish – Banyuwangi Goldfish Center

Website edukasi perawatan Goldfish (mobile-first). Situs statis; artikel ditulis dalam **Markdown** dan bisa diedit lewat panel admin `/admin`.

## Struktur
```
index.html                 Halaman utama (root)
css/style.css              Gaya + tema terang/gelap
js/tailwind-config.js      Warna & font
js/config.js               Kategori, topik "segera hadir"
js/app.js                  Logika tampilan & render Markdown
content/artikel/*.md       Satu file = satu artikel
content/kamus.json         Istilah kamus
content/index.json         (otomatis) gabungan artikel; dibuat oleh scripts/build-index.js
content/CONTOH-BLOK.txt    Contoh sintaks gambar/video/galeri/kotak catatan
admin/                     Panel admin (Sveltia CMS)
assets/images, videos      Foto & video
scripts/build-index.js     Pembuat index.json
.github/workflows/         Deploy otomatis ke GitHub Pages
```

## Pengembangan lokal
```
npm install
npm start        # buat index.json + server di http://localhost:8000
```
Setelah menambah/mengubah artikel secara manual, jalankan `npm run build`.

## Deploy ke GitHub Pages
1. Upload semua isi folder ke repository GitHub (branch `main`).
2. **Settings → Pages → Source: GitHub Actions.**
3. Setiap push ke `main` otomatis membuat `index.json` lalu mempublikasikan situs.

## Panel admin
1. Buka `admin/config.yml`, ganti `USERNAME/REPO` dengan repository Anda, lalu push.
2. Buka `https://<username>.github.io/<repo>/admin/`.
3. Masuk dengan GitHub (bisa memakai *Personal Access Token*; buat di GitHub → Settings → Developer settings → Fine-grained token, izin **Contents: Read and write** untuk repository ini).
4. Tulis atau edit artikel, kamus, unggah gambar/video, lalu **Publish**. Perubahan tersimpan ke GitHub dan situs terbarui sekitar 1–2 menit.

Di editor tersedia blok khusus: **Kotak catatan, Video (file), Video YouTube, Galeri foto**. Gambar biasa lewat tombol gambar. Heading 2 (`##`) menjadi daftar isi otomatis.

## Catatan
- Batas file GitHub: 100 MB per file. Video panjang sebaiknya lewat YouTube.
- Hanya orang dengan akses tulis ke repository yang bisa menyunting lewat admin.
- Tailwind dimuat via CDN; untuk produksi pertimbangkan build Tailwind.
- Konten bersifat edukasi dan tidak menggantikan dokter hewan ikan.
