import scaperObject from './pageScraper';

async function scrapeAll(browserInstance: any){
	let browser: any;
	try{
		browser = await browserInstance;
		await scaperObject.scraper(browser);	
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

export default (browserInstance: any) => scrapeAll(browserInstance)