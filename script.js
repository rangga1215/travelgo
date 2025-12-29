// --- STATE MANAGEMENT ---
let cart = []; // Array untuk menyimpan belanjaan

// --- 1. NAVBAR SCROLL EFFECT ---
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// --- 2. MENU TOGGLE FUNCTIONS ---

// Toggle Menu Mobile (Hamburger)
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("active");
}

// Toggle Modal Login
function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}
function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

// Toggle Modal Keranjang (Cart)
function toggleCart() {
  const modal = document.getElementById("cartModal");
  if (modal.style.display === "flex") {
    modal.style.display = "none";
  } else {
    modal.style.display = "flex";
    renderCart(); // Render ulang list saat dibuka
  }
}

// Tutup modal jika klik di luar kotak
window.onclick = function (event) {
  const cartModal = document.getElementById("cartModal");
  const loginModal = document.getElementById("loginModal");
  if (event.target == cartModal) cartModal.style.display = "none";
  if (event.target == loginModal) loginModal.style.display = "none";
};

// --- 3. LOGIKA KERANJANG (CART LOGIC) ---

// Helper: Format Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

// Helper: Parse Harga dari String (misal "Rp 1.000.000" jadi 1000000)
function parsePrice(priceString) {
  return parseInt(priceString.replace(/[^0-9]/g, ""));
}

// FUNGSI UTAMA: Tambah ke Keranjang
function addToCart(name, details, priceString, image) {
  const product = {
    id: Date.now(), // ID unik
    name: name,
    details: details,
    price: parsePrice(priceString),
    image: image,
  };

  cart.push(product);
  updateCartCount();

  // Feedback Visual
  alert(`✅ "${name}" berhasil masuk keranjang!`);
}

// Update Angka Merah di Navbar
function updateCartCount() {
  document.getElementById("cartCount").innerText = cart.length;
}

// Hapus Item dari Keranjang
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
  updateCartCount();
}

// Render Tampilan List di Modal Keranjang
function renderCart() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  container.innerHTML = ""; // Reset isi HTML

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-basket"></i>
                <p>Keranjang masih kosong</p>
            </div>`;
    totalEl.innerText = formatRupiah(0);
    return;
  }

  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.price;

    const itemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.details}</p>
                    <div class="price">${formatRupiah(item.price)}</div>
                </div>
                <button class="btn-delete" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    container.innerHTML += itemHTML;
  });

  totalEl.innerText = formatRupiah(totalPrice);
}

// Fungsi Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Keranjang kosong, pilih liburanmu dulu!");
  } else {
    alert("Mengarahkan ke halaman pembayaran...");
    cart = []; // Kosongkan
    updateCartCount();
    toggleCart();
  }
}

// --- 4. CATEGORY SWITCHER ---
let currentService = "flight"; // Default

function setService(serviceType) {
  currentService = serviceType;

  // Update UI Icons
  const icons = document.querySelectorAll(".icon-item");
  icons.forEach((icon) => icon.classList.remove("active"));

  if (serviceType === "flight") icons[0].classList.add("active");
  if (serviceType === "hotel") icons[1].classList.add("active");
  if (serviceType === "train") icons[2].classList.add("active");
  if (serviceType === "event") icons[3].classList.add("active");

  // Ubah Placeholder Input
  const inputFrom = document.getElementById("inputFrom");
  const inputTo = document.getElementById("inputTo");

  if (serviceType === "flight") {
    inputFrom.parentElement.parentElement.style.display = "block";
    inputFrom.placeholder = "Asal (mis. Jakarta)";
    inputTo.placeholder = "Tujuan (mis. Bali)";
  } else if (serviceType === "hotel") {
    inputFrom.parentElement.parentElement.style.display = "none";
    inputTo.placeholder = "Nama Kota / Hotel Tujuan";
  } else if (serviceType === "train") {
    inputFrom.parentElement.parentElement.style.display = "block";
    inputFrom.placeholder = "Stasiun Asal";
    inputTo.placeholder = "Stasiun Tujuan";
  }
}

// --- 5. SEARCH FUNCTIONALITY ---
const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const resultsArea = document.getElementById("searchResults");
  const resultTitle = document.getElementById("resultTitle");
  const resultCards = document.getElementById("resultCards");
  const loader = document.getElementById("loader");

  resultsArea.style.display = "block";
  resultsArea.scrollIntoView({ behavior: "smooth" });

  loader.style.display = "block";
  resultCards.innerHTML = "";

  setTimeout(() => {
    loader.style.display = "none";

    // Generate Content & Pasang Tombol AddToCart
    if (currentService === "flight") {
      resultTitle.innerText = "Penerbangan Tersedia";
      resultCards.innerHTML = `
                ${createCard(
                  "Garuda Indonesia",
                  "08:00 - 10:50 • Langsung",
                  "Rp 1.450.000",
                  "https://images.unsplash.com/photo-1559066650-6dc4c8a42537?q=80"
                )}
                ${createCard(
                  "Citilink",
                  "13:00 - 15:50 • Langsung",
                  "Rp 950.000",
                  "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?q=80"
                )}
                ${createCard(
                  "Lion Air",
                  "19:00 - 21:50 • Langsung",
                  "Rp 850.000",
                  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80"
                )}
            `;
    } else if (currentService === "hotel") {
      resultTitle.innerText = "Hotel Terbaik Ditemukan";
      resultCards.innerHTML = `
                ${createCard(
                  "The Ritz Carlton",
                  "Jakarta • Bintang 5",
                  "Rp 3.500.000",
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80"
                )}
                ${createCard(
                  "Artotel Suites",
                  "Jakarta • Bintang 4",
                  "Rp 1.100.000",
                  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80"
                )}
            `;
    } else if (currentService === "train") {
      resultTitle.innerText = "Jadwal Kereta Api";
      resultCards.innerHTML = `
                ${createCard(
                  "Argo Bromo Anggrek",
                  "Eksekutif • 08:00",
                  "Rp 650.000",
                  "https://images.unsplash.com/photo-1474487548417-781cb714d225?q=80"
                )}
                ${createCard(
                  "Jayabaya",
                  "Ekonomi • 14:00",
                  "Rp 320.000",
                  "https://images.unsplash.com/photo-1515165592879-1849b88c43e9?q=80"
                )}
            `;
    }
  }, 1000);
});

// --- HELPER UNTUK MEMBUAT KARTU ---
// Catatan: Tombol "Pilih" sekarang memanggil addToCart()
function createCard(name, details, price, img) {
  return `
    <div class="result-card">
        <img src="${img}" class="result-img">
        <div class="result-info">
            <h3>${name}</h3>
            <p style="color:#666; font-size:0.9rem;">${details}</p>
        </div>
        <div class="result-price">
            <h3 style="color:var(--secondary);">${price}</h3>
            <button class="btn-select" onclick="addToCart('${name}', '${details}', '${price}', '${img}')">
                <i class="fas fa-plus"></i> Pilih
            </button>
        </div>
    </div>`;
}
