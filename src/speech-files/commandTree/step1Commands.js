import HashTableNode from "./commandTree";
import "select2";
import $ from "jquery";
import { controlVoice } from "../STT";

const qs$ = (s, o = document) => o.querySelector(s);

/**
 * List of all command groups
 */
// supplier code select
const suppCode = ["supplier code"];
// navigate pages
const nextPage = ["next page"];
const prevPage = ["last page", "previous page"];
// control voice
const control = ["control voice"];

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
  if ($(".suppliercodes").select2("data").length > 0) {
    $(".suppliercodes").select2().val(null).trigger("change");
  }
  if (/[0-9A-Z]{2,4}01(?!-)/.test(qs$(".select2-search__field").value)) {
    console.log("stuff: " + qs$(".select2-search__field").value);
    qs$(".select2-search__field").value += "-";
  }
  let test = /([0-9A-Z]{1,4})?((01)|(01(-?([A-Z]{2,}){1,2})))?/;
  if (test.test(e)) {
    console.log("test: " + test.exec(e)[0]);
    qs$(".select2-search__field").value += test.exec(e)[0];
  }
  if (
    /[0-9A-Z]{2,4}01-([A-Z]{2,}){1,2}/.test(qs$(".select2-search__field").value)
  ) {
    console.log("select: " + qs$(".select2-search__field").value.toString());
    const val = qs$(".select2-search__field").value.toString();
    $(".suppliercodes").select2().val([val]).trigger("change");
    return false;
  }
  return true;
});

root.addGroup(root, nextPage, function (e) {
  qs$(".nextpage").click();
});

root.addGroup(root, prevPage, function (e) {
  qs$(".prevpage").click();
});

root.addGroup(root, control, controlVoice);
