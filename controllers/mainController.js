import {
  getAllEntries,
  filterByName,
  filterByBorough,
} from "../data/queries/dbFountains.js";

const controller = {
  /* Render main page with all fountains */
  getAll: async (req, res) => {
    const url = req.url;

    const allFountains = await getAllEntries();
    res.render("main", {
      title: "All Landmarks",
      entries: allFountains,
      options: req.app.locals.boroughs,
      obfuscate: obfuscate,
      cardUrl: url,
    });
  },

  /* Render main page with results after filtering fountains*/
  getSearch: async (req, res) => {
    let matches, title;
    const url = req.url;

    // Determine SQL query based on url parameter
    const param = req.params.group;
    if (param.match(/search/i)) {
      const searchTerm = req.query.name;
      console.log("Search term:", searchTerm);
      matches = await filterByName(searchTerm);
      title = `Landmarks with '${searchTerm}' in name`;
    } else {
      matches = await filterByBorough(param);
      title = `Landmarks in ${param}`;
    }

    res.render("main", {
      title: title,
      entries: matches,
      options: req.app.locals.boroughs,
      obfuscate: obfuscate,
      cardUrl: url,
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
