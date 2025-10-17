// Need to use node event emitter

const upvote = document.querySelector("#up-vote");
const downvote = document.querySelector("#down-vote");
const votes = document.querySelector(".votes p");

upvote.addEventListener("click", () => {
  console.log(votes.textContent);
  votes.textContent = parseInt(votes.textContent) + 1;
});
