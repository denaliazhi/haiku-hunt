import * as queries from "../data/dbQueries.js";

const controller = {
  getAll: async (req, res) => {
    const allFountains = await queries.getAllEntries();
    res.render("index", {
      title: "All Fountains",
      entries: allFountains,
      totalResults: allFountains.length,
      options: req.app.locals.boroughs,
    });
  },
  getSearch: async (req, res) => {
    let matchedFountains, title;

    // Determine SQL query based on search parameter
    if (req.query.name) {
      const name = req.query.name;
      matchedFountains = await queries.filterByName(name);
      title = `Fountains with '${name}' in name`;
    } else if (req.query.borough) {
      let borough = req.query.borough;
      matchedFountains = await queries.filterByBorough(borough);
      title = `Fountains in ${borough}`;
    }

    res.render("index", {
      title: title,
      entries: matchedFountains,
      totalResults: matchedFountains.length,
      options: req.app.locals.boroughs,
    });
  },
};

export default controller;
