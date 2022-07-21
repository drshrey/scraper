const scraperObject = {
  url: 'http://books.toscrape.com',
  async scraper(browser: { newPage: () => any; }, category: string){
      let page = await browser.newPage();
      console.log(`Navigating to ${this.url}...`);
      // Navigate to the selected page
      await page.goto(this.url);
      // Select the category of book to be displayed
  let selectedCategory = await page.$$eval('.side_categories > ul > li > ul > li > a', (links: any[], _category: any) => {

    // Search for the element that has the matching text
    links = links.map((a: { textContent: string; }) => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category ? a : null);
    let link = links.filter((tx: null) => tx !== null)[0];
    return link.href;
  }, category);
  // Navigate to the selected category
  await page.goto(selectedCategory);
      let scrapedData: any[] = [];
      // Wait for the required DOM to be rendered
      async function scrapeCurrentPage(): Promise<any> {
          await page.waitForSelector('.page_inner');
          // Get the link to all the required books
          let urls = await page.$$eval('section ol > li', (links: any[]) => {
              // Make sure the book to be scraped is in stock
              links = links.filter((link: { querySelector: (arg0: string) => { (): any; new(): any; textContent: string; }; }) => link.querySelector('.instock.availability > i').textContent !== "In stock")
              // Extract the links from the data
              links = links.map((el: { querySelector: (arg0: string) => { (): any; new(): any; href: any; }; }) => el.querySelector('h3 > a').href)
              return links;
          });
          // Loop through each of those links, open a new page instance and get the relevant data from them
          let pagePromise = (link: any) => new Promise(async(resolve, reject) => {
              let dataObj: {[key: string]: any } = {};
              let newPage = await browser.newPage();
              await newPage.goto(link);
              dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', (text: { textContent: any; }) => text.textContent);
              dataObj['bookPrice'] = await newPage.$eval('.price_color', (text: { textContent: any; }) => text.textContent);
              dataObj['noAvailable'] = await newPage.$eval('.instock.availability', (text: any) => {
                  // Strip new line and tab spaces
                  text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                  // Get the number of stock available
                  let regexp = /^.*\((.*)\).*$/i;
                  const result = regexp.exec(text);
                  if(result === null) {
                    return;
                  }

                  let stockAvailable = result[1].split(' ')[0];
                  return stockAvailable;
              });
              dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', (img: { src: any; }) => img.src);
              dataObj['bookDescription'] = await newPage.$eval('#product_description', (div: { nextSibling: { nextSibling: { textContent: any; }; }; }) => div.nextSibling.nextSibling.textContent);
              dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', (table: { textContent: any; }) => table.textContent);
              resolve(dataObj);
              await newPage.close();
          });

          for(let idx = 0; idx < urls.length; idx++){
            const link = urls[idx];
            let currentPageData = await pagePromise(link);
            scrapedData.push(currentPageData);
            console.log(currentPageData);
          }
          // When all the data on this page is done, click the next button and start the scraping of the next page
          // You are going to check if this button exist first, so you know if there really is a next page.
          let nextButtonExist = false;
          try{
              const nextButton = await page.$eval('.next > a', (a: { textContent: any; }) => a.textContent);
              nextButtonExist = true;
          }
          catch(err){
              nextButtonExist = false;
          }
          if(nextButtonExist){
              await page.click('.next > a');   
              return scrapeCurrentPage(); // Call this function recursively
          }
          await page.close();
          return scrapedData;
      }
      let data = await scrapeCurrentPage();
      console.log(data);
      return data;
  }
}

export default scraperObject;