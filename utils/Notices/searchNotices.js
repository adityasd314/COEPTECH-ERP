const BASE_URL = "https://www.coep.org.in";
const { writeNotices } =  require('./getRealTimeNotices');
async function search(query, data) {
    const results = [];
    const regex = new RegExp(query, "i"); // "i" flag for case-insensitive matching
    data.forEach(item => {
      if (regex.test(item.date) || regex.test(item.title) || (item.link && regex.test(item.link.replace('/content/', '')))) {
        results.push({...item, link: `${BASE_URL}${item.link}`});
      }
    });
    return results;
  }
  (async function (){
  const dt = await writeNotices(1);
  let data = require('./scrapedData.json');
  data = Object.values(Object.fromEntries([...dt,...data].map((x)=>[x.link, x])))
  const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question("Enter search query: ", (query) => {
    const searchResults = search(query, data);
    console.log("Search results:", searchResults);
    rl.close();
  });
})()