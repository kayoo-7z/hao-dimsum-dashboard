// Konfigurasi Endpoint & State Global
const API_URL = 'https://dummyjson.com/products';
const output = document.querySelector('#api-output');
const searchInput = document.querySelector('#search-input');
const sortSelect = document.querySelector('#sort-select');

// Membuat elemen pesan status/loading di atas container menu
const message = document.createElement('p');
message.style.textAlign = 'center';
message.style.fontWeight = 'bold';
message.style.margin = '1rem 0';
output.before(message);

let allProducts = []; // Menyimpan data asli dari API

// 1. Fungsi Utama Fetch Data dengan async/await & Error Handling (Modul 7)
async function loadProducts() {
    message.textContent = 'Memuat data menu Hao Dimsum...';
    output.replaceChildren();

    try {
        const response = await fetch(API_URL);
        
        // Memeriksa response.ok sesuai standar modul & soal PTS
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        allProducts = data.products;

        message.textContent = `Berhasil memuat ${allProducts.length} menu Hao Dimsum.`;
        
        // Jalankan analisis data wajib & render menu
        renderDataAnalytics(allProducts);
        renderProducts(allProducts);

    } catch (error) {
        console.error(error);
        message.textContent = 'Gagal memuat data menu. Periksa koneksi Anda.';
        
        // Implementasi Challenge C=1: Tombol Retry saat fetch gagal
        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Coba Lagi (Retry)';
        retryBtn.style.marginLeft = '1rem';
        retryBtn.style.padding = '0.4rem 0.8rem';
        retryBtn.style.cursor = 'pointer';
        retryBtn.addEventListener('click', loadProducts);
        message.append(retryBtn);
    }
}

// 2. Fungsi Analisis Data Wajib (Dataset Products: Rata-rata harga, termahal, kategori)
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

    // Perhitungan menggunakan array methods (ES6)
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

// 3. Fungsi Render Produk ke DOM secara Aman menggunakan createElement (Modul 5)
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

        const title = document.createElement('h3');
        title.textContent = product.title;

        const info = document.createElement('p');
        info.textContent = `Kategori: ${product.category} | Harga: $${product.price}`;
        info.style.fontWeight = 'bold';
        info.style.color = 'var(--brand-orange)';

        const desc = document.createElement('p');
        desc.textContent = product.description.substring(0, 85) + '...';

        article.append(title, info, desc);
        output.append(article);
    });
}

// 4. Fitur Wajib Varian NIM Y=0: Search Real-time & Sorting
function handleFilterAndSort() {
    const keyword = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    // Filter berdasarkan search keyword pada title atau category
    let filtered = allProducts.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.category.toLowerCase().includes(keyword)
    );

    // Proses Sorting
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

// Event Listeners untuk Search dan Sorting
searchInput.addEventListener('input', handleFilterAndSort);
sortSelect.addEventListener('change', handleFilterAndSort);

// Inisialisasi pemanggilan data saat halaman dimuat
loadProducts();