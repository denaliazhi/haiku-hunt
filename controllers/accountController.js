import {
  getPublished,
  getSolved,
  getSaved,
  deleteClue,
} from "../data/queries/dbUsers.js";

const controller = {
  /* Render user's published haikus */
  getPublished: async (req, res) => {
    const clues = await getPublished(req.user.userid);
    res.render("dashboard", {
      selectedTab: "published",
      tabTitle: "Your published haikus",
      message: "What will you write today?",
      clues: clues,
    });
  },

  /* Render user's saved haikus */
  getSaved: async (req, res) => {
    const clues = await getSaved(req.user.userid);
    res.render("dashboard", {
      selectedTab: "saved",
      tabTitle: "Your saved clues",
      message: "What will you solve today?",
      clues: clues,
    });
  },

  /* Render user's solved landmarks */
  getSolved: async (req, res) => {
    const clues = await getSolved(req.user.userid);
    res.render("dashboard", {
      selectedTab: "solved",
      tabTitle: "Your solved landmarks",
      message: "What's next?",
      clues: clues,
    });
  },

  postDeleteClue: async (req, res) => {
    const clueId = req.params.clueid;
    try {
      await deleteClue(clueId);
    } catch (err) {
      console.log(err);
    }
    res.redirect("/account");
  },
};

export default controller;
