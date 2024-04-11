const JSDOM = require('jsdom').JSDOM;

const getNotices = async (req, res) => {
  const { pageNumber } = req.body;
  const pageToFetch = `https://www.coep.org.in/node?page=${pageNumber}`;
  const pagesResponse = await fetch(pageToFetch);
  const responseHTML = await pagesResponse.text();

  const dom = new JSDOM(responseHTML);
  const document = dom.window.document;
  const tempElement = document.createElement('div');
  tempElement.innerHTML = responseHTML;
  const table = tempElement.querySelectorAll('.views-table');
  const data = [...table]
    .map((x) =>
      [...x.tBodies].map((tbody) => {
        return [...tbody.rows]
          .map((row) => {
            const data = row.children[0].firstElementChild;
            const title = row.children[0].textContent.slice(2).trim();
            const link = data.href;
            const date = row.children[1].textContent.slice(2).trim();

            return { date, link, title };
          })
          .flat();
      })
    )
    .flat(2);
  res.status(200).json({ data });
};

module.exports = { getNotices };
