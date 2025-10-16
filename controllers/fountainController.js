import { getFountain } from "../data/dbQueries.js";

const controller = {
  getDetails: async (req, res) => {
    const id = req.params.id;
    try {
      const fountain = await getFountain(id);
      res.render("card", {
        title: "Blah",
        entry: fountain[0],
        options: req.app.locals.boroughs,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send("Fountain not found.");
    }
  },
};

export default controller;
