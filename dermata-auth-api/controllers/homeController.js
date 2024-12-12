const { scrapeMultipleWebsites } = require('../utils/scrape');

// Fungsi untuk menangani permintaan GET /home/:username
async function homePage(req, res) {
  const username = req.params.username || 'Guest';
  try {
    // Mendapatkan informasi dari beberapa website
    const websites = await scrapeMultipleWebsites();
    res.json({
      message: `Selamat datang, ${username}!`,
      websites: websites  // Menampilkan data dari beberapa website
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data website.' });
  }
}

module.exports = { homePage };