import * as queries from "../data/dbQueries.js";

const controller = {
  get: async (req, res) => {
    const results = await queries.getAllEntries();
    const boroughs = await queries.getBoroughs();
    res.render("index", {
      title: "All Fountains",
      entries: results,
      options: boroughs,
      totalResults: results.length,
    });
  },
};

export default controller;
