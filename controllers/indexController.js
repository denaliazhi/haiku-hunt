import * as queries from "../data/dbQueries.js";

const controller = {
  getAll: async (req, res) => {
    const results = await queries.getAllEntries();
    const boroughs = await queries.getAllBoroughs();
    res.render("index", {
      title: "All Fountains",
      entries: results,
      options: boroughs,
      totalResults: results.length,
    });
  },
  getSearch: async (req, res) => {
    let results, title;

    if (req.query.name) {
      const name = req.query.name;
      results = await queries.filterByName(name);
      title = `Fountains with '${name}' in name`;
    } else if (req.query.borough) {
      let borough = req.query.borough;
      results = await queries.filterByBorough(borough);
      title = `Fountains in ${borough}`;
    }

    const boroughs = await queries.getAllBoroughs();
    res.render("index", {
      title: title,
      entries: results,
      options: boroughs,
      totalResults: results.length,
    });
  },
};

export default controller;
