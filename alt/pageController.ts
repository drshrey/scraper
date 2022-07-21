const fs = require('fs');

async function scrapeAll(browserInstance: any){
	let browser: any;
	try{
		browser = await browserInstance;
		let scrapedData: {[key: string]: any} = {};
		console.log(scrapedData);
		await browser.close();
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

export default (browserInstance: any) => scrapeAll(browserInstance)