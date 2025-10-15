import * as queries from "../data/dbQueries.js";

const controller = {
  get: async (req, res) => {
    const fountains = await queries.getAllEntries();
    res.render("index", { title: "Testing", entries: fountains });
  },
};

export default controller;
