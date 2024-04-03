const BASE_URL = "https://www.coep.org.in";
function search(query) {
    const results = [];
    const regex = new RegExp(query, "i"); // "i" flag for case-insensitive matching
    data.forEach(item => {
      if (regex.test(item.date) || regex.test(item.title) || (item.link && regex.test(item.link.replace('/content/', '')))) {
        results.push({...item, link: `${BASE_URL}${item.link}`});
      }
    });
    return results;
  }
  const data = require('./scrapedData.json');
  const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question("Enter search query: ", (query) => {
    const searchResults = search(query);
    console.log("Search results:", searchResults);
    rl.close();
  });