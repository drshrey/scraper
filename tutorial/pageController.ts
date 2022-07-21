import scraperObject from './pageScraper';
const fs = require('fs');

async function scrapeAll(browserInstance: any){
	let browser: any;
	try{
		browser = await browserInstance;
		let scrapedData: {[key: string]: any} = {};
		// Call the scraper for different set of books to be scraped
		scrapedData['Travel'] = await scraperObject.scraper(browser, 'Travel');
		scrapedData['HistoricalFiction'] = await scraperObject.scraper(browser, 'Historical Fiction');
		scrapedData['Mystery'] = await scraperObject.scraper(browser, 'Mystery');
		await browser.close();
		fs.writeFile("data.json", JSON.stringify(scrapedData), 'utf8', function(err: any) {
      if(err) {
          return console.log(err);
      }
      console.log("The data has been scraped and saved successfully! View it at './data.json'");
    });
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

export default (browserInstance: any) => scrapeAll(browserInstance)