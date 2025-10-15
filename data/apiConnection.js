/**
 *  Retrieve fountains data from NYC Open Data "NYC Parks Monuments" API.
 *  Source: https://data.cityofnewyork.us/Recreation/NYC-Parks-Monuments/6rrm-vxj9/about_data
 */

import FIELDS from "./queryFields.js";

const APP_TOKEN = process.env.APP_TOKEN;

const SEARCH_TERM = "fountain";
const formatted = FIELDS.map((field) => `${field}%2C`)
  .join("%20")
  .replace(/%2C$/, "");

// Socrata query language: https://dev.socrata.com/docs/queries/
const QUERY = `SELECT%20${formatted}%20SEARCH%20%22${SEARCH_TERM}%22`;

// Anything > 40 results doesn't return full output
// String gets cut off and causes json.parse syntaxError due to unclosed quote
const RESULTS_PER_PAGE = 40;
// Pagination to get all expected 252 results
const PAGE_COUNT = 1; // Set to 7 in prod

async function getPageData(page, results) {
  try {
    const resp = await fetch(
      `https://data.cityofnewyork.us/api/v3/views/6rrm-vxj9/query.json?pageNumber=${page}&pageSize=${RESULTS_PER_PAGE}&app_token=${APP_TOKEN}&query=${QUERY}`
    );
    if (!resp.ok)
      throw new Error(`API request failed: ${resp.status}, ${resp.statusText}`);

    for await (const chunk of resp.body) {
      const decoder = new TextDecoder("utf-8");
      const str = decoder.decode(chunk);
      const arr = JSON.parse(str);
      console.log("Received chunk:", arr.length);
      results.push(...arr);
    }
    console.log("Stream end.");
  } catch (err) {
    console.log(err);
    throw new Error("Couldn't get fountains data from API.");
  }
}

async function getFountainsFromAPI() {
  let results = [];
  for (let page = 1; page <= PAGE_COUNT; page++) {
    console.log(`Getting page ${page}`);
    await getPageData(page, results);
  }
  return results;
}

export { getFountainsFromAPI };
