import HashTableNode from "./commandTree";
// import { getRecognizedSpeech } from "../STT";

// HTML handling setup
const $ = (s, o = document) => o.querySelector(s);

/**
 * List of all commands with their respective functions
 *
 * IMPORTANT: All function return "true" to make the command function repeat and
 * return "false" to make the command function stop repeating and wait for the next
 * command. (It repeats so users can pause after saying a command)
 */
export const root = new HashTableNode();

root.add("length", function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".length.input").value = $(".length.result").innerHTML = res[0];
    console.log(res);
    return false;
  }
  return true;
});

root.add("depth", function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".width.input").value = $(".width.result").innerHTML = res[0];
    console.log(res);
    return false;
  }
  return true;
});

root.add("height", function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".height.input").value = $(".height.result").innerHTML = res[0];
    console.log(res);
    return false;
  }
  return true;
});

root.add("add damage", addDamage);
root.add("added damage", addDamage);
function addDamage(e) {
  $(".damagedetails").value += e + " ";

  if ($(".damagedetails").value.toLowerCase().includes("end of damage")) {
    $(".damagedetails").value = $(".damagedetails").value.replace(
      /\.?\s?(E|e)nd of damage\.?\s?/g,
      "."
    );
    return false;
  }
  if (
    $(".damagedetails").value.toLowerCase().includes("add damage") ||
    $(".damagedetails").value.toLowerCase().includes("added damage")
  ) {
    $(".damagedetails").value = $(".damagedetails").value.replace(
      /(A|a)dd(ed)? damage\.?\s?/g,
      ""
    );
  }

  return true;
}
