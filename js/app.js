// Konfigurasi Endpoint & State Global
const API_URL = 'https://dummyjson.com/products';
const output = document.querySelector('#api-output');
const searchInput = document.querySelector('#search-input');
const sortSelect = document.querySelector('#sort-select');

// Daftar Menu Asli Hao Dimsum (Sesuai Pricelist)
const haoDimsumMenus = [
    { id: 101, title: 'Hakao Udang', category: 'Dimsum Basah', price: 19, description: 'Isian udang segar dipotong kecil dimix dengan minyak wijen dan parutan wortel. Juicy didalam, kenyal diluar.' },
    { id: 102, title: 'Udang Rambutan', category: 'Dimsum Goreng', price: 19, description: 'Campuran ayam giling dan irisan udang segar dibalut dengan kulit yang kriuk.' },
    { id: 103, title: 'Shumai Ayam', category: 'Dimsum Kukus', price: 17, description: 'Dimsum populer dengan isian daging ayam giling dibungkus dengan kulit pansit tipis.' },
    { id: 104, title: 'Dimsum Nori', category: 'Dimsum Spesial', price: 19, description: 'Perpaduan unik dan lezat antara nori dan isian adonan ayam giling.' },
    { id: 105, title: 'Dimsum Mentai', category: 'Dimsum Mentai', price: 19, description: 'Dimsum dengan isian ayam giling yang diberi topping saus mentai pedas.' },
    { id: 106, title: 'Dimsum Keju', category: 'Dimsum Keju', price: 19, description: 'Dimsum keju dengan isian daging ayam giling, diberi sedikit keju yang lumer didalam.' }
];

// Membuat elemen pesan status/loading di atas container menu
const message = document.createElement('p');
message.style.textAlign = 'center';
message.style.fontWeight = 'bold';
message.style.margin = '1rem 0';
output.before(message);

let allProducts = []; // Menyimpan gabungan data API dan menu lokal

// 1. Fungsi Utama Fetch Data dengan async/await & Error Handling (Modul 7)
async function loadProducts() {
    message.textContent = 'Memuat data menu Hao Dimsum...';
    output.replaceChildren();

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Menggabungkan menu asli Hao Dimsum di awal array agar tampil pertama kali
        allProducts = [...haoDimsumMenus, ...data.products];

        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        message.textContent = `Berhasil memuat menu Hao Dimsum & katalog. (Terakhir diperbarui: ${timeString})`;
        
        renderDataAnalytics(allProducts);
        renderProducts(allProducts);

    } catch (error) {
        console.error(error);
        message.textContent = 'Gagal memuat data katalog API. Menggunakan menu lokal Hao Dimsum.';
        
        // Fallback jika API gagal: tetap tampilkan menu asli Hao Dimsum
        allProducts = haoDimsumMenus;
        renderDataAnalytics(allProducts);
        renderProducts(allProducts);
        
        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Coba Lagi (Retry)';
        retryBtn.style.marginLeft = '1rem';
        retryBtn.style.padding = '0.4rem 0.8rem';
        retryBtn.style.cursor = 'pointer';
        retryBtn.addEventListener('click', loadProducts);
        message.append(retryBtn);
    }
}

// 2. Fungsi Analisis Data Wajib
function renderDataAnalytics(products) {
    let analyticsBox = document.querySelector('#analytics-summary');
    if (!analyticsBox) {
        analyticsBox = document.createElement('div');
        analyticsBox.id = 'analytics-summary';
        analyticsBox.style.cssText = 'background: #fff; padding: 1rem; border-radius: 0.75rem; border: 2px solid #f0ded3; margin-bottom: 1.5rem;';
        output.before(analyticsBox);
    }

    if (products.length === 0) {
        analyticsBox.innerHTML = '<p>Tidak ada data untuk dianalisis.</p>';
        return;
    }

    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = (totalPrice / products.length).toFixed(2);
    const mostExpensive = products.reduce((prev, current) => (prev.price > current.price) ? prev : current);
    const uniqueCategories = [...new Set(products.map(p => p.category))];

    analyticsBox.innerHTML = `
        <h3 style="margin-top: 0; color: var(--brand-orange); font-size: 1.2rem;">📊 Ringkasan Analisis Menu Hao Dimsum</h3>
        <p style="margin: 0.3rem 0; font-size: 0.95rem;">• Rata-rata Harga Menu: <strong>$${avgPrice}</strong></p>
        <p style="margin: 0.3rem 0; font-size: 0.95rem;">• Menu Tertinggi/Termahal: <strong>${mostExpensive.title} ($${mostExpensive.price})</strong></p>
        <p style="margin: 0.3rem 0; font-size: 0.95rem;">• Total Kategori Menu: <strong>${uniqueCategories.length} Kategori</strong></p>
    `;
}

// 3. Fungsi Render Produk ke DOM secara Aman dengan Tombol Detail (Modul 5)
function renderProducts(products) {
    output.replaceChildren();

    if (products.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Menu yang dicari tidak ditemukan.';
        emptyMsg.style.gridColumn = '1 / -1';
        emptyMsg.style.textAlign = 'center';
        output.append(emptyMsg);
        return;
    }

    products.forEach(product => {
        const article = document.createElement('article');
        article.className = 'card';
        article.style.display = 'flex';
        article.style.flexDirection = 'column';
        article.style.justifyContent = 'space-between';

        const contentDiv = document.createElement('div');

        const title = document.createElement('h3');
        title.textContent = product.title;

        const info = document.createElement('p');
        info.textContent = `Kategori: ${product.category} | Harga: $${product.price}`;
        info.style.fontWeight = 'bold';
        info.style.color = 'var(--brand-orange)';

        const desc = document.createElement('p');
        // Menampilkan potongan teks deskripsi agar rapi di kartu
        const fullDesc = product.description || 'Menu spesial lezat dari Hao Dimsum.';
        desc.textContent = fullDesc.length > 70 ? fullDesc.substring(0, 70) + '...' : fullDesc;
        desc.style.fontSize = '0.9rem';
        desc.style.color = '#555';

        contentDiv.append(title, info, desc);

        // Tombol Detail untuk melihat deskripsi lengkap
        const detailBtn = document.createElement('button');
        detailBtn.textContent = 'Lihat Detail';
        detailBtn.style.cssText = 'background-color: var(--brand-orange); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.4rem; cursor: pointer; font-size: 0.85rem; font-weight: bold; margin-top: 0.8rem; width: 100%; transition: background 0.2s;';
        
        detailBtn.addEventListener('click', () => {
            alert(`📝 Detail Menu: ${product.title}\n\nKategori: ${product.category}\nHarga: $${product.price}\n\nDeskripsi Lengkap:\n${fullDesc}`);
        });

        article.append(contentDiv, detailBtn);
        output.append(article);
    });
}

// 4. Fitur Search Real-time & Sorting
function handleFilterAndSort() {
    const keyword = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    let filtered = allProducts.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.category.toLowerCase().includes(keyword)
    );

    if (sortValue === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'za') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortValue === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
}

searchInput.addEventListener('input', handleFilterAndSort);
sortSelect.addEventListener('change', handleFilterAndSort);

// --- LOGIKA VALIDASI FORM PEMESANAN (Validasi Barang Tidak Tersedia & Z = 9) ---
const formOrder = document.querySelector('#form-order');
const formStatus = document.querySelector('#form-status');

if (formOrder) {
    formOrder.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(formOrder);
        const pemesan = String(formData.get('pemesan') ?? '').trim();
        const namaMenu = String(formData.get('namaMenu') ?? '').trim();
        const jumlah = Number(formData.get('jumlah'));
        const konfirmasiJumlah = Number(formData.get('konfirmasiJumlah'));

        let errors = {};

        if (pemesan.length < 3) {
            errors.pemesan = 'Nama pemesan minimal harus 3 karakter.';
        }

        // Pengecekan Ketersediaan Barang (Apakah nama menu ada di daftar allProducts)
        if (namaMenu.length === 0) {
            errors.menu = 'Nama menu wajib diisi.';
        } else {
            const isAvailable = allProducts.some(p => p.title.toLowerCase() === namaMenu.toLowerCase());
            if (!isAvailable) {
                errors.menu = 'Maaf, barang/menu tersebut tidak tersedia di daftar!';
            }
        }

        if (!Number.isInteger(jumlah) || jumlah < 1) {
            errors.jumlah = 'Jumlah porsi minimal adalah 1.';
        }

        if (jumlah !== konfirmasiJumlah) {
            errors.konfirmasi = 'Jumlah porsi dan konfirmasi jumlah tidak sama!';
        }

        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        document.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));

        if (Object.keys(errors).length > 0) {
            for (const [field, messageText] of Object.entries(errors)) {
                if (field === 'pemesan') document.querySelector('#error-pemesan').textContent = messageText;
                if (field === 'menu') document.querySelector('#error-menu').textContent = messageText;
                if (field === 'jumlah') document.querySelector('#error-jumlah').textContent = messageText;
                if (field === 'konfirmasi') document.querySelector('#error-konfirmasi').textContent = messageText;
                
                let targetInput = field;
                if (field === 'menu') targetInput = 'namaMenu';
                if (field === 'konfirmasi') targetInput = 'konfirmasiJumlah';
                formOrder.elements[targetInput]?.setAttribute('aria-invalid', 'true');
            }
            formStatus.textContent = 'Periksa kembali data pesanan yang belum valid.';
            formStatus.style.color = '#dc2626';
            return;
        }

        formStatus.textContent = `Pesanan ${namaMenu} (${jumlah} porsi) atas nama ${pemesan} berhasil divalidasi dan tersedia!`;
        formStatus.style.color = '#16a34a';
        formOrder.reset();
    });
}

// Inisialisasi pemanggilan data saat halaman dimuat
loadProducts();