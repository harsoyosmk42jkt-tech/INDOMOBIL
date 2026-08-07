// ===== DATA DUMMY 6 MOBIL LISTRIK =====
const mobilListrik = [
    {
        id: 1,
        nama: "Tesla Model 3",
        merek: "Tesla",
        harga: 1500000000,
        jarakTempuh: 513,
        gambar: "🚗⚡",
        warna: ["Putih", "Hitam", "Biru"]
    },
    {
        id: 2,
        nama: "Hyundai Ioniq 5",
        merek: "Hyundai",
        harga: 750000000,
        jarakTempuh: 481,
        gambar: "🚙⚡",
        warna: ["Silver", "Putih", "Hitam"]
    },
    {
        id: 3,
        nama: "Wuling Air EV",
        merek: "Wuling",
        harga: 250000000,
        jarakTempuh: 300,
        gambar: "🚐⚡",
        warna: ["Kuning", "Putih", "Hijau"]
    },
    {
        id: 4,
        nama: "BMW i4",
        merek: "BMW",
        harga: 2100000000,
        jarakTempuh: 590,
        gambar: "🚘⚡",
        warna: ["Abu-abu", "Hitam"]
    },
    {
        id: 5,
        nama: "Tesla Model Y",
        merek: "Tesla",
        harga: 1200000000,
        jarakTempuh: 505,
        gambar: "🚙⚡",
        warna: ["Merah", "Putih", "Biru"]
    },
    {
        id: 6,
        nama: "Hyundai Kona Electric",
        merek: "Hyundai",
        harga: 650000000,
        jarakTempuh: 484,
        gambar: "🚗⚡",
        warna: ["Putih", "Abu-abu", "Hijau"]
    }
];

// Format harga ke Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
}

// Render kartu mobil di halaman beranda (featured) dan katalog
function renderCard(mobil) {
    return `
        <div class="card">
            <div class="card__img">${mobil.gambar}</div>
            <div class="card__body">
                <h3 class="card__title">${mobil.nama}</h3>
                <p class="card__spec">🔋 ${mobil.jarakTempuh} km</p>
                <p class="card__spec">🏷️ ${mobil.merek}</p>
                <p class="card__price">${formatRupiah(mobil.harga)}</p>
                <a href="detail.html?id=${mobil.id}" class="btn btn--primary" style="margin-top:0.8rem; padding:0.5rem 1.5rem;">Booking</a>
            </div>
        </div>
    `;
}

// ===== HALAMAN BERANDA =====
if (document.getElementById('featuredGrid')) {
    const featured = mobilListrik.slice(0, 3);
    document.getElementById('featuredGrid').innerHTML = featured.map(m => renderCard(m)).join('');
}

// ===== HALAMAN KATALOG + FILTER =====
const catalogGrid = document.getElementById('catalogGrid');
if (catalogGrid) {
    function tampilkanKatalog(filterMerek = 'semua', filterHarga = 'semua') {
        let hasil = mobilListrik;

        if (filterMerek !== 'semua') {
            hasil = hasil.filter(m => m.merek === filterMerek);
        }

        if (filterHarga !== 'semua') {
            const batas = parseInt(filterHarga);
            if (batas === 500) {
                hasil = hasil.filter(m => m.harga < 500000000);
            } else if (batas === 1000) {
                hasil = hasil.filter(m => m.harga >= 500000000 && m.harga <= 1000000000);
            } else if (batas === 2000) {
                hasil = hasil.filter(m => m.harga > 1000000000);
            }
        }

        catalogGrid.innerHTML = hasil.map(m => renderCard(m)).join('');
    }

    // Event listener filter
    document.getElementById('filterMerek').addEventListener('change', function() {
        tampilkanKatalog(this.value, document.getElementById('filterHarga').value);
    });

    document.getElementById('filterHarga').addEventListener('change', function() {
        tampilkanKatalog(document.getElementById('filterMerek').value, this.value);
    });

    tampilkanKatalog();
}

// ===== HALAMAN DETAIL & BOOKING =====
const detailContainer = document.getElementById('detailContainer');
if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const idMobil = parseInt(params.get('id')) || 1;
    const mobil = mobilListrik.find(m => m.id === idMobil) || mobilListrik[0];

    // Tampilkan galeri + spesifikasi
    detailContainer.innerHTML = `
        <div class="gallery">
            <div class="gallery__main">${mobil.gambar}</div>
            <div class="gallery__thumbs">
                <div class="gallery__thumb">⚡</div>
                <div class="gallery__thumb">🔋</div>
                <div class="gallery__thumb">🌿</div>
            </div>
        </div>
        <div class="specs">
            <h2>${mobil.nama}</h2>
            <table>
                <tr><td>Merek</td><td>${mobil.merek}</td></tr>
                <tr><td>Harga</td><td>${formatRupiah(mobil.harga)}</td></tr>
                <tr><td>Jarak Tempuh</td><td>${mobil.jarakTempuh} km</td></tr>
                <tr><td>Warna Tersedia</td><td>${mobil.warna.join(', ')}</td></tr>
            </table>
            <a href="#bookingForm" class="btn btn--primary" style="margin-top:1.5rem;">Booking Test Drive</a>
        </div>
    `;

    // Isi dropdown model
    const selectModel = document.getElementById('model');
    mobilListrik.forEach(m => {
        const option = document.createElement('option');
        option.value = m.nama;
        option.textContent = m.nama;
        if (m.id === mobil.id) option.selected = true;
        selectModel.appendChild(option);
    });

    // Validasi & submit form
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const nama = document.getElementById('nama').value.trim();
        const email = document.getElementById('email').value.trim();
        const model = document.getElementById('model').value;
        const tanggal = document.getElementById('tanggal').value;

        if (!nama || !email || !model || !tanggal) {
            alert('Harap lengkapi semua field.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            alert('Format email tidak valid.');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (tanggal < today) {
            alert('Tanggal test drive tidak boleh di masa lalu.');
            return;
        }

        alert(`✅ Booking berhasil!\n\nNama: ${nama}\nModel: ${model}\nTanggal: ${tanggal}\n\nTim kami akan menghubungi Anda melalui email ${email}.`);
        this.reset();
    });
}

// ===== HAMBURGER MENU TOGGLE =====
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');
if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        hamburgerBtn.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
    });
}
