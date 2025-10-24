/**
 * Function to determine filter options shown in sidebar,
 * based on the boroughs to which landmarks belong
 */
import { getAllBoroughs } from "../data/queries/dbLandmarks.js";

async function ejsConfig(app) {
  const boroughs = await getAllBoroughs();
  if (boroughs.length > 0) {
    app.locals.options = boroughs;
  }
}

export default ejsConfig;
