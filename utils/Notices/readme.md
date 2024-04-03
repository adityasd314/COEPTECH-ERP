College Website Notices Search
==============================

This project provides a search functionality for accessing notices on our college website.

Getting Real-Time Notices
-------------------------

To fetch real-time notices from the college website, you can use the following command:

cssCopy code

`node getRealTimeNotices.js`

Replace `[NUMBER_OF_PAGES]` at top of file  with the number of pages you want to fetch notices from. This command will fetch notices from the specified number of pages and store them locally for searching.

Searching Notices
-----------------

To search notices, you can use the following command:

Copy code

`node searchNotices.js`

This command initiates the search functionality. You will be prompted to enter a search query, and the script will display the search results based on the entered query.