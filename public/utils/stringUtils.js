/* Helper function to hide name except for first letter
   of each word in the name or designated exception*/
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

export { obfuscate };
