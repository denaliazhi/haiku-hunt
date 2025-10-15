/**
 *  Retrieve fountains data from NYC Open Data "NYC Parks Monuments" API.
 *  Source: https://data.cityofnewyork.us/Recreation/NYC-Parks-Monuments/6rrm-vxj9/about_data
 *  Load data into database.
 */

const APP_TOKEN = process.env.APP_TOKEN;

// Socrata query language: https://dev.socrata.com/docs/queries/
const soql = "SELECT%20name%20SEARCH%20%22fountain%22";

async function getFountainsFromAPI() {
  try {
    const resp = await fetch(
      `https://data.cityofnewyork.us/api/v3/views/6rrm-vxj9/query.json?pageNumber=1&pageSize=10&app_token=${APP_TOKEN}&query=${soql}`
    );
    if (!resp.ok)
      throw new Error(`API request failed: ${resp.status}, ${resp.statusText}`);

    let results = [];
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

function main() {
  getFountainsFromAPI();
}

main();
