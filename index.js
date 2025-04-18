const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/:uid', async (req, res) => {
  const uid = req.params.uid;
  const url = `https://enka.network/hsr/${uid}/`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.character-card');

    const data = await page.evaluate(() => {
      const result = [];
      document.querySelectorAll('.character-card').forEach(card => {
        const name = card.querySelector('.character-name')?.innerText;
        const level = card.querySelector('.character-level')?.innerText;
        result.push({ name, level });
      });
      return result;
    });

    await browser.close();
    res.json({ uid, characters: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลได้' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
