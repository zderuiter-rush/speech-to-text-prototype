import HashTableNode from "./commandTree";

const $ = (s, o = document) => o.querySelector(s);

/**
 * List of all command groups
 */
// supplier code select
const suppCode = ["supplier code"];
// navigate pages
const nextPage = ["next page"];
const prevPage = ["last page", "previous page"];

/**
 * List of all commands with their respective functions
 *
 * IMPORTANT: All function return "true" to make the command function repeat and
 * return "false" to make the command function stop repeating and wait for the next
 * command. (It repeats so users can pause after saying a command)
 */
export const root = new HashTableNode();

root.addGroup(root, suppCode, function (e) {
  // TODO: instead of saying letters, say words that start with the letters
  // and pull  first letter to put in
  if (/[0-9A-Z]{2,4}01(?!-)/.test($(".select2-search__field").value)) {
    $(".select2-search__field").value += "-";
  }
  let test = /([0-9A-Z]{1,4})?((01)|(01(-([A-Z]{2,}){1,2})))?/;
  if (test.test(e)) {
    $(".select2-search__field").value += test.exec(e)[0];
  }
  if (
    /[0-9A-Z]{2,4}01-([A-Z]{2,}){1,2}/.test($(".select2-search__field").value)
  ) {
    $(".select2-search__field").submit();
    return false;
  }
  return true;
});

root.addGroup(root, nextPage, function (e) {
  $(".nextpage").click();
});

root.addGroup(root, prevPage, function (e) {
  $(".prevpage").click();
});

root.addGroup(
  root,
  ["do a barrel roll", "roll out", "do a flip"],
  async function (e) {
    $("body").style.transition = "transform 3.5s";
    $("body").style.transformOrigin = "50% 50%";
    $("body").style.transform = "rotate(360deg)";
  }
);
