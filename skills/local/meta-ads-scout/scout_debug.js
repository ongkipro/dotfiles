const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
chromium.use(stealth);

async function run() {
    const keyword = process.argv[2] || "tas";
    const url = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ID&q=${encodeURIComponent(keyword)}&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped`;
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(8000); 
        
        // Coba cari elemen yang spesifik memuat teks iklan
        const html = await page.content();
        fs.writeFileSync('debug.html', html);
        
        const adsData = await page.evaluate(() => {
            // Meta sering pakai tag <style> atau obfuscated class.
            // Coba cari semua div yang memiliki teks "Library ID" atau "Ad Details"
            const cards = Array.from(document.querySelectorAll('div')).filter(el => {
                const text = el.innerText || '';
                return text.includes('Library ID:') && text.length > 50 && text.length < 5000;
            });
            
            // Karena nested div, ambil yang terluar tapi spesifik
            const uniqueCards = [];
            const seenTexts = new Set();
            
            for(let c of cards) {
                if(!seenTexts.has(c.innerText)) {
                    uniqueCards.push(c);
                    seenTexts.add(c.innerText);
                }
            }

            return uniqueCards.slice(0, 5).map(c => {
                const lines = c.innerText.split('\n').filter(t => t.trim().length > 0);
                return {
                    advertiser: lines[0] || "Unknown",
                    raw_copywriting: lines.join(' | ')
                };
            });
        });
        console.log(JSON.stringify({ success: true, count: adsData.length, data: adsData }, null, 2));
    } catch (e) {
        console.log(JSON.stringify({ success: false, error: e.message }));
    } finally {
        await browser.close();
    }
}
run();
