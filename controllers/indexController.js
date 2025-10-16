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
    const name = req.query.name;
    console.log(name);
    const results = await queries.filterByName(name);
    const boroughs = await queries.getAllBoroughs();
    res.render("index", {
      title: `Fountains with '${name}' in name`,
      entries: results,
      options: boroughs,
      totalResults: results.length,
    });
  },
  getBorough: async (req, res) => {
    const borough = req.params.borough;
    const results = await queries.filterByBorough(borough);
    const boroughs = await queries.getAllBoroughs();
    res.render("index", {
      title: `Fountains in ${borough}`,
      entries: results,
      options: boroughs,
      totalResults: results.length,
    });
  },
};

export default controller;
