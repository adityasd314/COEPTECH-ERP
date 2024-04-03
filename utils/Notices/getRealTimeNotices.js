const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const NUMBER_OF_PAGES = 63;
async function getNotices(pagesNumber = NUMBER_OF_PAGES) {

    const pagesToFetch = new Array(pagesNumber).fill(0).map((_, i) => `https://www.coep.org.in/node?page=${i + 1}`)
    const pagesResponse = await Promise.all(pagesToFetch.map(async (page) => (await fetch(page))));
    const pagesResponseHTML = await Promise.all(pagesResponse.map(async (response) => response.text()));

    const data = pagesResponseHTML.map((responseHTML) => {
        const dom = new JSDOM(responseHTML);
        const document = dom.window.document;
        const tempElement = document.createElement('div');
        tempElement.innerHTML = responseHTML;
        const table = tempElement.querySelectorAll('.views-table');
        return [...table].map(x => [...x.tBodies].map((tbody) => {
            return [...tbody.rows].map((row) => {

                const data = row.children[0].firstElementChild
                const title = row.children[0].textContent.slice(2).trim();
                const link = data.href;
                const date = row.children[1].textContent.slice(2).trim();

                return { date, link, title }
            }).flat()
        })).flat(2)
    }).flat()

    return data;
}
(async function () {
    const jsonData = JSON.stringify(await getNotices(), null, 2);

    fs.writeFile('data.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('Data has been written to data.json');
    });
})()