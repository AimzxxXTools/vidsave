const express = require('express');
const cors = require('cors');
const path = require('path');
const scraper = require('./scraper');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Kata kunci pencarian (q) wajib diisi.' });
    }
    try {
        const results = await scraper.searchMedia(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat memproses pencarian.' });
    }
});

app.get('/api/download', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL tautan wajib diisi.' });
    }
    try {
        const downloadData = await scraper.getDownloadLink(url);
        res.json(downloadData);
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses tautan unduhan.' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;
