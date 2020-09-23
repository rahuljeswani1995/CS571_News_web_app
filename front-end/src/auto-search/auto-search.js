import React from 'react'
import AsyncSelect from 'react-select/async';
import { withRouter } from 'react-router-dom';

const BING_KEY = "cb8e4d1c582944c08b362844044f8057";

const loadOptions = async (inputValue, callback) => {
  // do some work
  const requestResults = await fetch(`https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=${inputValue}`, {
    headers: {
      "Ocp-Apim-Subscription-Key": BING_KEY
    }
  });
  const data = await requestResults.json()
  const resultsRaw = data.suggestionGroups[0].searchSuggestions;

  const retR = resultsRaw.map((el, idx) => { return { label: el.displayText, value: idx } });
  callback(retR);
}

const AutoSearch = withRouter((props) => {
  return <AsyncSelect value={props.tbValue} placeholder={props.tbValue || `Enter keyword ..`} loadOptions={loadOptions} onChange={(opt) => {
    props.history.push(`/searchedResults?q=${opt.label}`)
  }} />
})

export default AutoSearch;