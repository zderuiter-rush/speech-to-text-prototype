import HashTableNode from "./commandTree";
import { getRecognizedSpeech } from "../STT";

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
    return false;
  }
  return true;
});

root.add("width", function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".width.input").value = $(".width.result").innerHTML = res[0];
    return false;
  }
  return true;
});

root.add("height", function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".height.input").value = $(".height.result").innerHTML = res[0];
    return false;
  }
  return true;
});

root.add("add damage", function (e) {
  var recognizedSpeech = getRecognizedSpeech();
  console.log(recognizedSpeech);
  if (recognizedSpeech.toLowerCase().includes("end of damage")) {
    let end = recognizedSpeech.indexOf("end of damage");
    $(".damagedetails").value += recognizedSpeech.substring(0, end);
    return false;
  }
  if (recognizedSpeech.toLowerCase().includes("add damage")) {
    recognizedSpeech = recognizedSpeech.replace(/(A|a)dd damage\.?\s?/g, "");
    $(".damagedetails").value += recognizedSpeech;
    return true;
  }
  $(".damagedetails").value += recognizedSpeech + " ";
  return true;
});
