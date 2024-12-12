// utils/scrape.js
const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk scraping informasi dari beberapa website
async function scrapeMultipleWebsites() {
  const websites = [
    'https://www.haibunda.com/moms-life/20231218112740-72-323924/10-jenis-masalah-kulit-penyebab-dan-cara-mengatasinya',
    'https://www.alodokter.com/macam-macam-penyakit-kulit-dan-cara-mengatasinya',
    'https://www.alodokter.com/skincare-terbaik-untuk-menjaga-kesehatan-kulit',
    'https://www.alodokter.com/macam-macam-penyakit-kulit-dan-cara-mengatasinya',
    'https://www.loreal-paris.co.id/beauty-magazine/12-bahan-skincare-yang-efektif-mengatasi-masalah-kulit-wajah',
    'https://editorial.femaledaily.com/blog/2021/06/07/kombinasi-kandungan-skincare-yang-ampuh-untuk-atasi-berbagai-masalah-kulit'  // Tambahkan URL lainnya sesuai kebutuhan
  ];

  
  try {
    const websiteInfo = [];

    for (const url of websites) {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Menangkap elemen-elemen dari artikel
      const title = $('h1').text().trim(); // Judul artikel
      const image = $('img').first().attr('src'); // Gambar pertama di artikel
      const link = url; // URL asli artikel

      websiteInfo.push({
        title,
        image,
        link
      });
    }

    console.log('Informasi dari berbagai website:', websiteInfo);
    return websiteInfo;
  } catch (error) {
    console.error('Error saat scraping website:', error);
    throw new Error('Terjadi kesalahan saat scraping website: ' + error.message);
  }
}

module.exports = { scrapeMultipleWebsites };
module.exports = { scrapeMultipleWebsites };
