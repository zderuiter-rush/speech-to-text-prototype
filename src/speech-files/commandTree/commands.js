import HashTableNode from "./commandTree";

// HTML handling setup
const $ = (s, o = document) => o.querySelector(s);

/**
 * List of all command groups
 */
// Dimensions
const length = ["length", "long"];
const depth = ["depth", "width", "wide"];
const height = ["height", "high"];
// Damages
const addDamage = ["add damage", "added damage", "add note", "added note"];
const endDamage = [
  "end damage",
  "end of damage",
  "ended damage",
  "add of damage",
];
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

root.addGroup(root, length, function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".length.input").value = $(".length.result").innerHTML = res[0];
    return false;
  }
  return true;
});

root.addGroup(root, depth, function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".depth.input").value = $(".depth.result").innerHTML = res[0];
    return false;
  }
  return true;
});

root.addGroup(root, height, function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".height.input").value = $(".height.result").innerHTML = res[0];
    return false;
  }
  return true;
});

root.addGroup(root, addDamage, function (e) {
  $(".damagedetails").value += e + " ";

  addDamage.forEach(function (cmd) {
    if ($(".damagedetails").value.toLowerCase().includes(cmd)) {
      $(".damagedetails").value = $(".damagedetails").value.replace(
        /(A|a)dd(ed)? (damage)|(note)\.?\s?/g,
        ""
      );
    }
  });

  return endDamage.forEach(function (cmd) {
    if ($(".damagedetails").value.toLowerCase().includes(cmd)) {
      $(".damagedetails").value = $(".damagedetails").value.replace(
        /\.?\s?(E|e)nd(ed)?( of)? damage\.?\s?/g,
        "."
      );
      return false;
    }
    return true;
  });
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
