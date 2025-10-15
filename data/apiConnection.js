/**
 *  Retrieve fountains data from NYC Open Data "NYC Parks Monuments" API.
 *  Source: https://data.cityofnewyork.us/Recreation/NYC-Parks-Monuments/6rrm-vxj9/about_data
 */

import FIELDS from "./queryFields.js";

const APP_TOKEN = process.env.APP_TOKEN;

// Socrata query language: https://dev.socrata.com/docs/queries/
const formattedFields = FIELDS.map((field) => `${field},`)
  .join(" ")
  .replace(/,$/, "");
const soql = [`SELECT ${formattedFields}`, `SEARCH "fountain"`];
const query = soql.join(" ");

// Helper variables to get results from all pages
// API request seems limited to 1 page / 40 results at a time
// Else json.parse syntaxError
const TOTAL_PAGES = 7;
const RESULTS_PER_PAGE = 40;

/* Fetch results from all pages */
async function getFountainsFromAPI() {
  let results = [];
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    console.log(`Getting page ${page}`);
    await getPageData(page, results);
  }
  return results;
}

/* Helper function to fetch one page of results from API */
async function getPageData(page, results) {
  try {
    const baseUrl =
      "https://data.cityofnewyork.us/api/v3/views/6rrm-vxj9/query.json";

    const params = {
      pageNumber: page,
      pageSize: RESULTS_PER_PAGE,
      app_token: APP_TOKEN,
      query: query,
    };
    const queryParams = new URLSearchParams(params);
    const url = `${baseUrl}?${queryParams.toString()}`;

    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`API request failed: ${resp.status}, ${resp.statusText}`);
    }

    for await (const chunk of resp.body) {
      const decoder = new TextDecoder("utf-8");
      const str = decoder.decode(chunk);
      const arr = JSON.parse(str);
      console.log("Received chunk:", arr.length);
      results.push(...arr);
    }
    console.log("Stream end.");
  } catch (err) {
    throw new Error("Couldn't get fountains data from API.");
  }
}

export { getFountainsFromAPI };
