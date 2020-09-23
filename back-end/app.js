const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// const corsOptions = {
//   origin: "http://localhost:3000"
// }

app.use(cors());

const GUARDIAN_API_KEY = "10c5b823-4470-435c-a147-100d7ba91950";
const NYT_API_KEY = "MGrmAC8GC4bNNW7LbHlNioWAhGe5hBi4";

// Common between UI and back-end
const sourceNames = {
  // external_name: internal_name
  "nyt": "NYT",
  "guardian": "GUARDIAN"
}

//Currently supported sections
const sectionNames = {
  home: "home",
  world: "world",
  technology: "technology",
  sports: "sport",
  politics: "politics",
  business: "business"
}


// Details of the currently supported sources
const srcDetails = {
  "NYT": {
    baseURL: "https://api.nytimes.com/svc/topstories/v2",
    sections: { ...sectionNames, sports: "sports"},
    searchURLBase: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
    defaultImgURL: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg"
  },
  "GUARDIAN": {
    baseURL: "https://content.guardianapis.com",
    sections: { ...sectionNames},
    searchURLBase: "https://content.guardianapis.com/search",
    defaultImgURL: "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
  }
}

// Section: Guardian URL builders
const buildGuardianURL = (sectionName) => {
  const detailsObj = srcDetails["GUARDIAN"];
  const baseUrl = detailsObj.baseURL;
  return baseUrl + (sectionName == `home` ? `/search?api-key=${GUARDIAN_API_KEY}&section=(sport|business|technology|politics)&show-blocks=all` :
    `/${detailsObj.sections[sectionName]}?api-key=${GUARDIAN_API_KEY}&show-blocks=all`)
}

const buildGuardianSearchURL = (queryPhrase) => {
  const detailsObj = srcDetails["GUARDIAN"];
  const baseUrl = detailsObj.searchURLBase;
  return baseUrl + `?q=${queryPhrase}&api-key=${GUARDIAN_API_KEY}&show-blocks=all`;
}

const buildGuardianArticleDetailURL = (articleId) => {
  const detailsObj = srcDetails["GUARDIAN"];
  const baseUrl = detailsObj.baseURL;
  return baseUrl + `/${articleId}?api-key=${GUARDIAN_API_KEY}&show-blocks=all`;
}

// End Section

// Section: NYT URL builders
const buildNYTURL = (sectionName) => {
  const detailsObj = srcDetails["NYT"];
  const baseUrl = detailsObj.baseURL;
  return baseUrl + `/${detailsObj.sections[sectionName]}.json?api-key=${NYT_API_KEY}`
}

const buildNYTSearchURL = (queryPhrase) => {
  const detailsObj = srcDetails["NYT"];
  const baseUrl = detailsObj.searchURLBase;
  return baseUrl + `?q=${queryPhrase}&api-key=${NYT_API_KEY}`;
}

const buildNYTArticleDetailURL = (articleURL) => {
  const detailsObj = srcDetails["NYT"];
  const baseUrl = detailsObj.searchURLBase;
  return baseUrl + `?fq=web_url:("${articleURL}")&api-key=${NYT_API_KEY}`;
}

// End Section

// reference to functions which build the URL for a certain source
// all the functions below accept one string argument for section name and return a string URL
const urlBuilderFns = {
  "NYT": {
    "base": buildNYTURL,
    "search": buildNYTSearchURL,
    "article": buildNYTArticleDetailURL
  },
  "GUARDIAN": {
    "base": buildGuardianURL,
    "search": buildGuardianSearchURL,
    "article": buildGuardianArticleDetailURL
  }
}

// Section: NYT mappers and related functions 
const getArticleImageNYT = (rawResult) =>{
  const bigImg = rawResult.multimedia ? rawResult.multimedia.find(img => img.width > 2000): null;
    //  send NYT default image URL
  return bigImg ?  bigImg.url: srcDetails["NYT"]["defaultImgURL"];
}

const isNYTResultComplete = (rawResult) => {
  // console.log(rawResult);
  return rawResult.url && rawResult.title && rawResult.section && rawResult.published_date && rawResult.abstract; 
}

const mapNYTResponse = (rawResponse) => {
  const resultsArr = rawResponse.results;
  // console.log(JSON.stringify(resultsArr));
  const mappedResults = resultsArr.reduce((interimResults, rawResult) => {
    if(isNYTResultComplete(rawResult)){
      // data assignment logic
      // TODO: check spec for what more is needed to be stored
      interimResults.push({
        "id": rawResult.url,
        "title": rawResult.title,
        "section": rawResult.section, // may want subsection as well (politics)
        "image": getArticleImageNYT(rawResult),
        "date": rawResult.published_date.split("T")[0],
        "description": rawResult.abstract,
        "webUrl": rawResult.url
      });
    }
    return interimResults;
  }, []);
  return mappedResults;
}

const getArticleImageNYTSearch = (rawResult) =>{
  const bigImg = rawResult.multimedia ? rawResult.multimedia.find(img => img.width > 2000): null;
    //  send NYT default image URL
  return bigImg ?  `https://www.nytimes.com/${bigImg.url}`: srcDetails["NYT"]["defaultImgURL"];
}

const isNYTSearchResultComplete = (rawResult) => {
  // console.log(rawResult);
  return rawResult.web_url && rawResult.headline && rawResult.headline.main && 
  rawResult.news_desk && rawResult.pub_date;
}

const mapNYTSearchResponse = (rawResponse)=>{
  const resultsArr = rawResponse.response.docs;
  // console.log(JSON.stringify(resultsArr));
  const mappedResults = resultsArr.reduce((interimResults, rawResult) => {
    if(isNYTSearchResultComplete(rawResult)){
      // data assignment logic
      // TODO: check spec for what more is needed to be stored
      interimResults.push({
        "id": rawResult.web_url,
        "title": rawResult.headline.main,
        "section": rawResult.news_desk, // may want subsection as well (politics)
        "image": getArticleImageNYTSearch(rawResult),
        "date": rawResult.pub_date.split("T")[0],
        "webUrl": rawResult.web_url
      });
    }
    return interimResults;
  }, []);
  return mappedResults;
}

const isNYTArticleResultComplete = (rawResult) => {
  // console.log(rawResult);
  return rawResult.web_url && rawResult.headline && rawResult.headline.main && 
  rawResult.abstract && rawResult.pub_date && rawResult.news_desk;
}


const mapNYTArticleDetailResponse = (rawResponse)=>{
  const rawResult = rawResponse.response.docs[0];
  const mappedResult = isNYTArticleResultComplete(rawResult) ? {
    "id": rawResult.web_url,
    "title": rawResult.headline.main,
    "description": rawResult.abstract,
    "section": rawResult.news_desk,
    "image": getArticleImageNYTSearch(rawResult),
    "date": rawResult.pub_date.split("T")[0],
    "webUrl": rawResult.web_url
  } : null;
  return mappedResult;
}
// End Section

// Section: Guardian mappers and related functions 
const getArticleImageGuardian = (rawResult) =>{
  return rawResult.blocks.main && rawResult.blocks.main.elements && rawResult.blocks.main.elements[0]
     && rawResult.blocks.main.elements[0].assets && rawResult.blocks.main.elements[0].assets[rawResult.blocks.main.elements[0].assets.length-1] &&
     rawResult.blocks.main.elements[0].assets[rawResult.blocks.main.elements[0].assets.length-1].file ? 
     rawResult.blocks.main.elements[0].assets[rawResult.blocks.main.elements[0].assets.length-1].file : 
     //  send guardian default image URL
     srcDetails["GUARDIAN"]["defaultImgURL"];
}

const isGuardianResultComplete = (rawResult) => {
  // console.log(rawResult);
  return rawResult.id && rawResult.webTitle && rawResult.webUrl && rawResult.sectionId && rawResult.webPublicationDate
   && rawResult.blocks
   && (rawResult.blocks.body && rawResult.blocks.body[0] && rawResult.blocks.body[0].bodyTextSummary)
}

const mapGuardianResponse = (rawResponse) => {
  const resultsArr = rawResponse.response.results;
  // console.log(JSON.stringify(resultsArr));
  const mappedResults = resultsArr.reduce((interimResults, rawResult) => {
    if(isGuardianResultComplete(rawResult)){
      // data assignment logic
      interimResults.push({
        "id": rawResult.id,
        "title": rawResult.webTitle,
        "section": rawResult.sectionId,
        "image": getArticleImageGuardian(rawResult),
        "date": rawResult.webPublicationDate.split("T")[0],
        "description": rawResult.blocks.body[0].bodyTextSummary,
        "webUrl": rawResult.webUrl
      });
    }
    return interimResults;
  }, []);
  return mappedResults;
}

const isGuardianSearchResultComplete = (rawResult) => {
  return rawResult.id && rawResult.webTitle && rawResult.webUrl && rawResult.sectionId && rawResult.webPublicationDate;
}

const mapGuardianSearchResponse = (rawResponse) => {
  const resultsArr = rawResponse.response.results;
  // console.log(JSON.stringify(resultsArr));
  const mappedResults = resultsArr.reduce((interimResults, rawResult) => {
    if(isGuardianSearchResultComplete(rawResult)){
      // data assignment logic
      interimResults.push({
        "id": rawResult.id,
        "title": rawResult.webTitle,
        "section": rawResult.sectionId,
        "image": getArticleImageGuardian(rawResult),
        "date": rawResult.webPublicationDate.split("T")[0],
        "webUrl": rawResult.webUrl
      });
    }
    return interimResults;
  }, []);
  return mappedResults;
}

const mapGuardianArticleDetailResponse = (rawResponse) => {
  const rawResult = rawResponse.response.content;
  // console.log(JSON.stringify(resultsArr));
  const mappedResult = isGuardianResultComplete(rawResult) ? {
    "id": rawResult.id,
    "title": rawResult.webTitle,
    "image": getArticleImageGuardian(rawResult),
    "section": rawResult.sectionId,
    "date": rawResult.webPublicationDate.split("T")[0],
    "description": rawResult.blocks.body[0].bodyTextSummary,
    "webUrl": rawResult.webUrl
  } : null;
  return mappedResult;
}
// End Section

const responseMappers = {
  "GUARDIAN": {
    "base": mapGuardianResponse,
    "search": mapGuardianSearchResponse,
    "article": mapGuardianArticleDetailResponse
  },
  "NYT": {
    "base": mapNYTResponse,
    "search": mapNYTSearchResponse,
    "article": mapNYTArticleDetailResponse
  }
}

// Top Articles end point
app.get('/top_articles', (req, res) => {
  const src = req.query.source;
  const section = req.query.section;

  // if src not in sourceNames || section not in sectionNames, return 403

  console.log(`Requested top articles from: ${src}'s ${section} section.`);

  const url =  urlBuilderFns[sourceNames[src]]["base"].call(null, section);
  console.log("News Source URL: "+url);

  axios.get(url)
    .then(response => {
      const rawResponse = response.data;
      const mappedResponse = {
         "src": src, "results": responseMappers[sourceNames[src]]["base"].call(null, rawResponse) 
      }
      // console.log(mappedResponse);
      res.json(mappedResponse);
    })
    .catch(error => {
      console.log(error);
      res.json("ERROR");
    });
  


});


// SEARCH ENDPOINT
app.get('/searched_articles', (req, res) => {
  const src = req.query.source;
  const searchPhrase = req.query.phrase;

  // if src not in sourceNames || section not in sectionNames, return 403

  console.log(`Requested articles from: ${src} and search phrase: ${searchPhrase}`);

  const url =  urlBuilderFns[sourceNames[src]]["search"].call(null, searchPhrase);
  console.log("Built URL: "+url);

  axios.get(url)
    .then(response => {
      const rawResponse = response.data;
      // console.log(rawResponse);
      const mappedResponse = {
         "src": src, "results": responseMappers[sourceNames[src]]["search"].call(null, rawResponse) 
      }
      // console.log(mappedResponse);
      res.json(mappedResponse);
    })
    .catch(error => {
      console.log(error);
      res.json("ERROR");
    });
});


// Detailed Article Endpoint
app.get('/article', (req, res) => {
  const src = req.query.source;
  const articleId = req.query.articleId;

  // if src not in sourceNames || section not in sectionNames, return 403

  console.log(`Requested article from: ${src} with ID: ${articleId}`);

  const url =  urlBuilderFns[sourceNames[src]]["article"].call(null, articleId);
  console.log("Built URL: "+url);

  axios.get(url)
    .then(response => {
      const rawResponse = response.data;
      // console.log(rawResponse);
      const mappedResponse = {
         "src": src, "result": responseMappers[sourceNames[src]]["article"].call(null, rawResponse) 
      }
      // console.log(mappedResponse);
      res.json(mappedResponse);
    })
    .catch(error => {
      console.log(error);
      res.json("ERROR");
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));