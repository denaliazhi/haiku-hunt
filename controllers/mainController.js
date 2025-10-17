import {
  getAllEntries,
  filterByName,
  filterByBorough,
} from "../data/queries/dbFountains.js";

const controller = {
  /* Render main page with all fountains */
  getAll: async (req, res) => {
    const allFountains = await getAllEntries();
    res.render("main", {
      title: "All Fountains",
      entries: allFountains,
      totalResults: allFountains.length,
      options: req.app.locals.boroughs,
      obfuscate: obfuscate,
    });
  },

  /* Render main page with results after filtering fountains*/
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
      obfuscate: obfuscate,
    });
  },
};

/* Helper function to hide fountain name except for 
   first letter of each word*/
function obfuscate(name) {
  const dashed = name
    .split(" ")
    .map((word) => {
      if (word.match(/fountain/i)) {
        return word;
      } else {
        return word[0] + word.slice(1).replace(/./g, "-");
      }
    })
    .join(" ");
  return dashed;
}

export default controller;
