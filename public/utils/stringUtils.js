/**
 * Helper functions to manipulate strings
 */

/* Hide all words in name except for first letter
   of each word */
function obfuscate(name) {
  const dashed = name
    .split(" ")
    .map((word) => word[0] + word.slice(1).replace(/./g, " _"))
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
