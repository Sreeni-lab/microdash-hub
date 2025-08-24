const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/health-check', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }
    try {
        const response = await fetch(url, { method: 'GET' });
        res.status(200).json({ httpStatus: response.status });
    } catch (error) {
        res.status(200).json({ httpStatus: 0, error: error.message });
    }
});

app.get('/twistlock_report', async (req, res) => {
    try {
        const response = await fetch('https://screports.documentum-qe.net/latest/twistlock_report/scan_results.json');
        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Twistlock report' });
    }
});

app.get('/sysdig_report', async (req, res) => {
    try {
        const response = await fetch('https://screports.documentum-qe.net/latest/sysdig_report/scan_results.json');
        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Sysdig report' });
    }
});

app.get('/generated_date', async (req, res) => {
    try {
        const response = await fetch('https://screports.documentum-qe.net/latest/twistlock_report/mailBody.html');
        const data = await response.text();
        const $ = cheerio.load(data);
        const rawText = $('p.report-date').text().trim();
        const dateOnly = rawText.replace(/^Generated on:\s*/, "");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ generated_date: dateOnly });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Sysdig report' });
    }
});

app.listen(PORT, () => {
    console.log(`Health check server running on port ${PORT}`);
});