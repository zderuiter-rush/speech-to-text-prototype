import HashTableNode from "./commandTree";
import { speech } from "../STT";
import { controlVoice } from "../STT";

const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => o.querySelectorAll(s);

/**
 * List of all command groups
 */
// control all verifications
const checkAll = ["verify all", "all verified", "verify it all"];
// verify
const verify = ["yep", "yes", "yeah", "correct"];
// unverify
const unverify = ["no", "incorrect", "wrong"];
const correctDims = ["dimensions", "dimension"];
// add notes
const addNotes = ["add notes", "added notes", "add note", "added note"];
const endNotes = [
  "end note",
  "end notes",
  "and note",
  "and notes",
  "stop note",
  "stop notes",
];
// navigate pages
const nextPage = ["next page"];
const prevPage = ["last page", "previous page"];
// control voice
const control = ["control voice"];

// Sections of verification page
const sections = {
  category: {
    correct: ".pcat.correct",
    incorrect: ".pcat.incorrect",
    text: ".category",
  },
  dimensions: {
    correct: ".pdim.correct",
    incorrect: ".pdim.incorrect",
    text: ".dimensions",
    new: ".correct_dims",
  },
  color: {
    correct: ".pclr.correct",
    incorrect: ".pclr.incorrect",
    text: ".color",
  },
  material: {
    correct: ".pmat.correct",
    incorrect: ".pmat.incorrect",
    text: ".material",
  },
  images: {
    correct: ".pimg.correct",
    incorrect: ".pimg.incorrect",
  },
};
var currentSection = null;

/**
 * List of all commands with their respective functions
 *
 * IMPORTANT: All function return "true" to make the command function repeat and
 * return "false" to make the command function stop repeating and wait for the next
 * command. (It repeats so users can pause after saying a command)
 */
export const root = new HashTableNode();

export function startVerification() {
  switch (currentSection) {
    case null:
      currentSection = sections.category;
      break;
    case sections.category:
      currentSection = sections.dimensions;
      break;
    case sections.dimensions:
      currentSection = sections.color;
      break;
    case sections.color:
      currentSection = sections.material;
      break;
    case sections.material:
      currentSection = sections.images;
      speech.synthesize("Please look at your computer.");
      speech.synthesize("Do these images look correct?");
      return;
    default:
      speech.synthesize(
        "If you would like to add images, please do so on your computer."
      );
      speech.synthesize(
        "If you would like to add notes, please say: 'Add Notes', say the note, then say: 'End Notes', to stop adding notes.",
        1
      );
      currentSection = null;
      return;
  }
  let voice = $(currentSection.text).innerHTML.replace(/<(\/)?([^>].)*>/g, "");
  voice =
    currentSection === sections.category
      ? voice.replace("&gt;", ",")
      : currentSection === sections.dimensions
      ? voice
          .replace(/x/g, "by")
          .replace(/W/g, "width")
          .replace(/D\s/g, "depth ")
          .replace(/H/g, "height")
          .replace(/"/g, " inch")
      : voice;
  const verb = currentSection === sections.dimensions ? "are" : "is";
  speech.synthesize("The" + voice.split(" ")[0] + verb);
  speech.synthesize(voice.split(" ").slice(1).join(" "));
}

root.addGroup(root, verify, function (e) {
  $(currentSection.correct).click();
  startVerification();
});

root.addGroup(root, unverify, function (e) {
  $(currentSection.incorrect).click();
  switch (currentSection) {
    case sections.category:
      break;
    case sections.dimensions:
      speech.synthesize("What are the correct dimensions?");
      break;
    case sections.color:
      break;
    case sections.material:
      return;
    default:
      return;
  }
});

root.addGroup(root, correctDims, function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    if ($(".cd.w").innerHTML === "") {
      $(".cd.w").innerHTML = res[0];
      return true;
    } else if ($(".cd.d").innerHTML === "") {
      $(".cd.d").innerHTML = res[0];
      return true;
    } else {
      $(".cd.h").innerHTML = res[0];
    }
    startVerification();
    return false;
  }
  return true;
});

root.addGroup(root, checkAll, function (e) {
  $$(".correct").forEach(function (correctButton) {
    correctButton.click();
  });
});

root.addGroup(root, addNotes, function (e) {
  let continueDamage = true;
  $(".add_notes").value += e + " ";

  endNotes.forEach(function (cmd) {
    if ($(".add_notes").value.toLowerCase().includes(cmd)) {
      $(".add_notes").value = $(".add_notes").value.substring(
        0,
        $(".add_notes").value.toLowerCase().indexOf(cmd)
      );
      continueDamage = false;
    }
  });

  return continueDamage;
});

root.addGroup(root, nextPage, function (e) {
  currentSection = null;
  $(".nextpage").click();
});

root.addGroup(root, prevPage, function (e) {
  currentSection = null;
  $(".prevpage").click();
});

root.addGroup(root, control, controlVoice);
