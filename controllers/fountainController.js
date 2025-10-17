import { getFountainClues } from "../data/queries/dbClues.js";
import { getFountain } from "../data/queries/dbFountains.js";

const controller = {
  getDetails: async (req, res) => {
    const id = req.params.id;
    try {
      const fountain = await getFountain(id);
      const clues = await getFountainClues(id);
      res.render("fountain", {
        title: "Blah",
        entry: fountain[0],
        options: req.app.locals.boroughs,
        clues: clues,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send("Fountain not found.");
    }
  },
  getAddClue: (req, res) => {
    console.log(req.params.id);
    res.render("clueForm", {
      title: "Add a Haiku Clue",
      options: req.app.locals.boroughs,
      id: req.params.id,
    });
  },
  postAddClue: async (req, res) => {
    // Validate form data
    // If valid, update clues table with new clue for fountain id
    // If invalid, re-render form with error messages and previously entered data
    const id = req.params.id;
    console.log(req.body);
    res.redirect(`/fountain/${id}`);
  },
};

export default controller;

// {
//   'line-1': 'I am a cat',
//   'line-2': "No I'm not",
//   'line-3': 'Yes',
//   author: 'Cat'
// }
