/**
 *  Retrieve fountains data from NYC Open Data "NYC Parks Monuments" API.
 *  Source: https://data.cityofnewyork.us/Recreation/NYC-Parks-Monuments/6rrm-vxj9/about_data
 *  Load data into database.
 */

const APP_TOKEN = process.env.APP_TOKEN;

// Socrata query language: https://dev.socrata.com/docs/queries/
const QUERY =
  "SELECT%20name%2C%20borough%2C%20parkname%2C%20location%2C%20dedicated%2C%20architect%2C%20categories%2C%20x%2C%20y%20SEARCH%20%22fountain%22";

// Anything > 40 results doesn't return full output
// String gets cut off and causes json.parse syntaxError due to unclosed quote
const RESULTS_PER_PAGE = 40;
// Pagination to get all expected 252 results
const PAGE_COUNT = 7;

async function getFountainsFromAPI(page, results) {
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

async function main() {
  let results = [];
  for (let page = 1; page <= PAGE_COUNT; page++) {
    console.log(`Getting page ${page}`);
    await getFountainsFromAPI(page, results);
  }
  console.log(results.length);
}

main();
