import React, { useState, useEffect } from "react";
import "./Notices.css";
import scrapedData from "./scrapedData.json";

const BASE_URL = "https://www.coep.org.in";

const Notices = () => {
  const [originalData, setOriginalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearchResults, setCurrentSearchResults] = useState([]);
  const [currentFilteredResults, setCurrentFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = scrapedData.filter((item) => item.date.length==10);

        // var myHeaders = new Headers();
        // myHeaders.append('Content-Type', 'application/json');

        // var raw = JSON.stringify({
        //   pageNumber: '1',
        // });

        // var requestOptions = {
        //   method: 'POST',
        //   headers: myHeaders,
        //   body: raw,
        //   redirect: 'follow',
        // };

        // const firstPageData = await fetch(
        //   `http://localhost:5000/user/getNoticesByPageNumber`, requestOptions
        // ).then((response) => response.json()).then((result) => result.data.filter((item) => item.date.length==10));

        // setOriginalData([...firstPageData, ...data]);
        
        setOriginalData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notices:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const search = (query) => {
    const results = [];
    const regex = new RegExp(query, "i");
    originalData.forEach((item) => {
      if (
        regex.test(item.date) ||
        regex.test(item.title) ||
        (item.link && regex.test(item.link.replace("/content/", "")))
      ) {
        results.push({ ...item, link: `${item.link}` });
      }
    });
    return results;
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value.trim();
    if (query === "") {
      setCurrentSearchResults([]);
      setCurrentPage(1);
    } else {
      setCurrentSearchResults(search(query));
      setCurrentPage(1);
    }
  };

  const searchByDate = () => {
    const dateInput = document.getElementById("dateInput").value.trim();
    if (dateInput === "") {
      setCurrentSearchResults([]);
      setCurrentPage(1);
      return;
    }

    let [month, year] = dateInput.split("/");
    if (!month || isNaN(month) || month.length < 1 || month.length > 2) {
      return;
    }

    if (!year) {
      year = month;
      month = "*";
    } else if (isNaN(year) || year.length !== 4) {
      return;
    }

    setCurrentFilteredResults(
      originalData.filter((item) => {
        const [itemDay, itemMonth, itemYear] = item.date.split("/");
        return (
          (month === "*" || itemMonth === month) &&
          (year === "*" || itemYear === year)
        );
      })
    );
    setCurrentPage(1);
  };

  const renderTable = (data) => {
    return (
      <tbody>
        {data.map((notice, index) => (
          <tr key={index} className="animate">
            <td>{notice.date}</td>
            <td>
              <a
                href={`${BASE_URL}/${notice.link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {notice.title}
              </a>
            </td>
            <td>
              <a
                href={`${BASE_URL}/${notice.link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  const renderPagination = (totalPages) => {
    const pageButtons = [];
    const maxButtons = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => {
            setCurrentPage(i);
            renderPage(i);
          }}
        >
          {i}
        </button>
      );
    }
    return (
      <div>
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
            renderPage(currentPage - 1);
          }}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {pageButtons}
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            renderPage(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  const renderPage = (pageNumber) => {
    const data =
      currentSearchResults.length > 0
        ? currentSearchResults
        : currentFilteredResults.length > 0
        ? currentFilteredResults
        : originalData;

    const noticesPerPage = 10;
    const startIndex = (pageNumber - 1) * noticesPerPage;
    const endIndex = startIndex + noticesPerPage;
    const dataToShow = data.slice(startIndex, endIndex);
    return (
      <>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Link</th>
            </tr>
          </thead>
          {renderTable(dataToShow)}
        </table>
        <div className="pagination">
          {renderPagination(Math.ceil(data.length / noticesPerPage))}
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <h1>Notices</h1>
      <div className="search">
        <div>
          <input
            type="text"
            id="searchInput"
            placeholder="Search..."
            onChange={handleSearchInputChange}
          />
          <button onClick={() => setCurrentPage(1)}>Search</button>
        </div>
        <div className="date-search">
          <input
            type="text"
            id="dateInput"
            placeholder="Search by date (mm/yyyy)"
            onChange={searchByDate}
          />
          <button onClick={searchByDate}>Search</button>
        </div>
      </div>

      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        renderPage(currentPage)
      )}
    </div>
  );
};

export default Notices;
