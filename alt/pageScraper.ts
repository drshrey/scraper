const scraperObject = {
    url: 'https://app.alt.xyz',
    async scraper(browser: { newPage: () => any; }){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);
    }   
}

export default scraperObject;