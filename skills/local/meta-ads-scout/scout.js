const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

async function run() {
    const keyword = process.argv[2] || "tas wanita";
    const country = process.argv[3] || "ID";
    const url = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=${country}&q=${encodeURIComponent(keyword)}&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped`;

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(8000); 

        const adsData = await page.evaluate(() => {
            // Find all divs containing 'Library ID:'
            const cards = Array.from(document.querySelectorAll('div')).filter(el => {
                const text = el.innerText || '';
                return text.includes('Library ID:') && text.includes('Sponsored') && text.length < 5000;
            });
            
            // Deduplicate by text content
            const uniqueCards = [];
            const seenTexts = new Set();
            for(let c of cards) {
                if(!seenTexts.has(c.innerText)) {
                    uniqueCards.push(c);
                    seenTexts.add(c.innerText);
                }
            }

            return uniqueCards.slice(0, 10).map(c => {
                const lines = c.innerText.split('\n').filter(t => t.trim().length > 0 && t !== '​');
                
                // Parse Advertiser Name (Usually the line before 'Sponsored')
                let advertiser = "Unknown";
                const sponsoredIndex = lines.findIndex(l => l.includes('Sponsored'));
                if (sponsoredIndex > 0) {
                    advertiser = lines[sponsoredIndex - 1];
                }
                
                // Parse Copywriting (Everything after 'Sponsored')
                let copywriting = "";
                if (sponsoredIndex !== -1 && sponsoredIndex + 1 < lines.length) {
                    copywriting = lines.slice(sponsoredIndex + 1).join('\n\n');
                }

                // Parse Start Date
                let startDate = "Unknown";
                const libIdIndex = lines.findIndex(l => l.includes('Library ID:'));
                if (libIdIndex !== -1 && libIdIndex + 1 < lines.length) {
                    // Date is usually the next line: "Started running on X" or "X - Y"
                    startDate = lines[libIdIndex + 1].split('-')[0].trim();
                }

                return {
                    advertiser: advertiser,
                    start_date: startDate,
                    raw_copywriting: copywriting,
                    ad_url: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ID&q=${encodeURIComponent(advertiser)}&search_type=keyword_unordered&media_type=all`
                };
            }).filter(ad => ad.raw_copywriting.length > 10); // Hanya ambil yang ada copywritingnya
        });

        console.log(JSON.stringify({ 
            success: true, 
            target: keyword,
            country: country,
            count: adsData.length, 
            data: adsData 
        }, null, 2));

    } catch (error) {
        console.log(JSON.stringify({ success: false, error: error.message }, null, 2));
    } finally {
        await browser.close();
    }
}
run();
