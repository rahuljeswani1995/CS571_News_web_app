# About this app
This is a React & Node.js powered web-app to browse news articles from Guardian & NYT.
React serves as the front-end of the app, makes requests to the Node backend, which proxies requests to the NYT and Guardian news APIs.

# Features
1. Browse top headlines.
2. Check out latest news from various sections like World, Business, Politics, Sports & Technology.
3. Search for a news article.
4. Bookmark the articles which you'd like to read offline.

# Adding news sources
Additional news sources can be easily configured in the back-end code by providing functions for building URL and mapping API response to the format accepted by the UI. Please see the response mapper functions for NYT and Guardian for more details.
The ```source-switch``` component in the front-end must be modified to allow for selection between more than 2 sources. Currently, it is a radio button (powered by [react-switch](https://www.npmjs.com/package/react-switch))
