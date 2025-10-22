import { getPublished, deleteClue } from "../data/queries/dbUsers.js";

const controller = {
  /* Render user's dashboard */
  getDashboard: async (req, res) => {
    const clues = await getPublished(req.user.userid);
    res.render("user-dashboard", { clues: clues });
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
