import { getAllBoroughs } from "../data/queries/dbFountains.js";

async function ejsConfig(app) {
  try {
    const boroughs = await getAllBoroughs();
    if (boroughs.length > 0) {
      app.locals.options = boroughs;
    }
  } catch (err) {
    console.log("Sidebar config not loaded: ", err);
    throw new Error("There was an issue loading this application.");
  }
}

export default ejsConfig;
