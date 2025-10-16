import { getAllBoroughs } from "./data/dbQueries.js";

async function initialConfig(app) {
  try {
    const boroughs = await getAllBoroughs();
    if (boroughs.length > 0) {
      app.locals.boroughs = boroughs;
    }
    console.log("Sidebar config loaded.");
  } catch (err) {
    console.log("Sidebar config not loaded: ", err);
    throw new Error("There was an issue loading this application.");
  }
}

export default initialConfig;
