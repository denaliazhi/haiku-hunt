/**
 * Helper functions to manipulate strings
 */

/* Hide all words in name except for first letter of
   each word and/or a special exception word */
function obfuscate(name, exception) {
  const regex = new RegExp(exception, "i");
  const dashed = name
    .split(" ")
    .map((word) => {
      if (word.match(regex)) {
        return word;
      } else {
        return word[0] + word.slice(1).replace(/./g, "-");
      }
    })
    .join(" ");
  return dashed;
}

/* Capitalize each word in name */
function capitalizeAll(name) {
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export { obfuscate, capitalizeAll };
