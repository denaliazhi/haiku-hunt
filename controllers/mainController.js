import {
  getAllEntries,
  filterByName,
  filterByBorough,
} from "../data/queries/dbFountains.js";

const controller = {
  getAll: async (req, res) => {
    const allFountains = await getAllEntries();
    res.render("main", {
      title: "All Fountains",
      entries: allFountains,
      totalResults: allFountains.length,
      options: req.app.locals.boroughs,
    });
  },
  getSearch: async (req, res) => {
    let matches, title;

    // Determine SQL query based on search parameter
    if (req.query.name) {
      const name = req.query.name;
      matches = await filterByName(name);
      title = `Fountains with '${name}' in name`;
    } else if (req.query.borough) {
      let borough = req.query.borough;
      matches = await filterByBorough(borough);
      title = `Fountains in ${borough}`;
    }

    res.render("main", {
      title: title,
      entries: matches,
      totalResults: matches.length,
      options: req.app.locals.boroughs,
    });
  },
};

export default controller;
