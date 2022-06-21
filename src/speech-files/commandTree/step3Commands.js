import HashTableNode from "./commandTree";
import { speech } from "../STT";

const $ = (s, o = document) => o.querySelector(s);

/**
 * List of all command groups
 */
// verify (yes/no/other answer types)
const verify = ["yes", "yep", "yeah", "correct"];
const unverify = ["no", "incorrect", "wrong"];
// correct the dimensions
const correctDims = ["dimensions", "dimension"];
const weight = ["weight", "weights", "wait"];
// condition
const condition = ["condition", "conditions"];
const missSome = ["some", "few"];
const missMost = ["most", "all"];
const dmgTop = ["top", "front", "corner", "sides"];
const dmgBot = ["bottom", "back"];
const dmgInt = ["interior"];
const visible = ["clearly visible", "visible", "clear"];
const hidden = ["hidden"];
const minor = ["minor"];
const moderate = ["moderate"];
const considerable = ["considerable"];
const dmgReport = ["report damage"];
// location
const location = ["location"];
// navigate sections
const nextSection = ["next section"];
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
const prevPage = ["last page", "previous page"];

// sections of inspection page
const sections = {
  ogpack: {
    prompt: ".isog_pack",
    yes: ".yes_pack",
    no: ".no_pack",
  },
  reship: {
    prompt: ".isreship",
    yes: ".yes_reuse",
    no: ".no_reuse",
  },
  dimensions: {
    prompt: ".isdims",
  },
  condition: {
    new: ".cond.new",
    likeNew: ".cond.lnew",
    damaged: ".cond.dmg",
    trash: ".cond.trash",
  },
  damaged: {
    missParts: "missParts",
    dmgImg: "dmgImg",
  },
  missParts: {
    no: ".no_miss",
    some: ".some_miss",
    most: ".most_miss",
  },
  whrDmg: {
    top: {
      checkbox: ".top._dmg",
      vis: {
        clearlyVis: ".top_dmg_vis_cv",
        hidden: ".top_dmg_vis_h",
        sev: {
          minor: ".top_dmg_sev_min",
          moderate: ".top_dmg_sev_mod",
          considerable: ".top_dmg_sev_con",
        },
      },
    },
    bottom: {
      checkbox: ".bot._dmg",
      vis: {
        clearlyVis: ".bot_dmg_vis_cv",
        hidden: ".botp_dmg_vis_h",
        sev: {
          minor: ".bot_dmg_sev_min",
          moderate: ".bot_dmg_sev_mod",
          considerable: ".bot_dmg_sev_con",
        },
      },
    },
    interior: {
      checkbox: ".int._dmg",
      vis: {
        clearlyVis: ".int_dmg_vis_cv",
        hidden: ".int_dmg_vis_h",
        sev: {
          minor: ".int_dmg_sev_min",
          moderate: ".int_dmg_sev_mod",
          considerable: ".int_dmg_sev_con",
        },
      },
    },
  },
  dmgImg: {},
  location: {
    area: ".l_area",
    zone: ".l_zone",
    loc: ".l_loc",
    pallet: ".l_pallet",
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

export function startInspection() {
  switch (currentSection) {
    case null:
      currentSection = sections.ogpack;
      speech.synthesize($(currentSection.prompt).innerHTML);
      speech.synthesize("Answer with: yes or no.");
      break;
    case sections.ogpack:
      currentSection = sections.reship;
      speech.synthesize($(currentSection.prompt).innerHTML);
      speech.synthesize("Answer with: yes or no.");
      break;
    case sections.reship:
      currentSection = sections.dimensions;
      speech.synthesize($(currentSection.prompt).innerHTML);
      speech.synthesize(
        "To change the dimensions of the box or product, please say"
      );
      speech.synthesize("Weight: then say the weight. And");
      speech.synthesize("Dimensions: then say the dimensions.");
      if ($(".box.w").value !== "") {
        let weight = $(".box_label.w").innerHTML + $(".box.w").value + "lbs.";
        let length = $(".box_label.l").innerHTML + $(".box.l").value + "in.";
        let depth = $(".box_label.d").innerHTML + $(".box.d").value + "in.";
        let height = $(".box_label.h").innerHTML + $(".box.h").value + "in.";
        speech.synthesize(weight);
        speech.synthesize(length);
        speech.synthesize(depth);
        speech.synthesize(height);
        speech.synthesize(
          "If the stated dimensions were correct, say: next section."
        );
      }
      break;
    case sections.dimensions:
      currentSection = sections.condition;
      speech.synthesize("When you are ready, please say");
      speech.synthesize("Condition: then say the condition");
      break;
    case sections.damaged.missParts:
      currentSection = sections.missParts;
      speech.synthesize("Is the product missing parts?");
      speech.synthesize("Answer with: no, some, or most.");
      break;
    case sections.missParts:
      currentSection = sections.whrDmg;
      speech.synthesize("Where is the damage?");
      speech.synthesize("Answer with: top, front, corner, sides");
      speech.synthesize("or bottom or back");
      speech.synthesize("or interior");
      break;
    case sections.whrDmg.top:
    case sections.whrDmg.bottom:
    case sections.whrDmg.interior:
      currentSection = currentSection.vis;
      speech.synthesize("How visible is the damage?");
      speech.synthesize("Answer with: clearly visible, or hidden");
      break;
    case sections.whrDmg.top.vis:
    case sections.whrDmg.bottom.vis:
    case sections.whrDmg.interior.vis:
      currentSection = currentSection.sev;
      speech.synthesize("How severe is the damage?");
      speech.synthesize("Answer with: minor, moderate, or considerable");
      break;
    case sections.whrDmg.top.vis.sev:
    case sections.whrDmg.bottom.vis.sev:
    case sections.whrDmg.interior.vis.sev:
      currentSection = sections.damaged.dmgImg;
      speech.synthesize("If you are done reporting damage say: next section");
      speech.synthesize("If you need to report more damage say: report damage");
      break;
    case sections.damaged.dmgImg:
      currentSection = sections.dmgImg;
      speech.synthesize(
        "Please use your computer to add a picture of the damage"
      );
      startInspection();
      break;
    case sections.dmgImg:
      currentSection = sections.location;
      speech.synthesize(
        "If you would like to add notes, please say: 'Add Notes', then say the note"
      );
      speech.synthesize("To stop adding notes, say: 'End Notes'.");
      speech.synthesize("Or, move on by saying 'Next Section'.");
      break;
    default:
      speech.synthesize(
        "Please say 'Location', then say the location for the product."
      );
      break;
  }
}

root.addGroup(root, verify, function (e) {
  if (currentSection.yes !== undefined) {
    $(currentSection.yes).click();
    startInspection();
  }
});

root.addGroup(root, unverify, function (e) {
  if (currentSection.no !== undefined) {
    $(currentSection.no).click();
    switch (currentSection) {
      case sections.ogpack:
        $(".box.w").value = "";
        $(".box.l").value = "";
        $(".box.d").value = "";
        $(".box.h").value = "";
        break;
      case sections.reship:
        $(".isdims").innerHTML = "Product Dimensions and Weights";
        break;
      default:
        break;
    }
    startInspection();
  }
});

root.addGroup(root, missSome, function (e) {
  if (currentSection.some !== undefined) {
    $(currentSection.some).click();
    startInspection();
  }
});

root.addGroup(root, missMost, function (e) {
  if (currentSection.most !== undefined) {
    $(currentSection.most).click();
    startInspection();
  }
});

root.addGroup(root, correctDims, function (e) {
  if (currentSection !== sections.dimensions) {
    return false;
  }
  if (
    $(".box.l").value !== "" &&
    $(".box.d").value !== "" &&
    $(".box.h").value !== ""
  ) {
    $(".box.l").value = "";
    $(".box.d").value = "";
    $(".box.h").value = "";
  }
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    if ($(".box.l").value === "") {
      $(".box.l").value = res[0];
      return true;
    } else if ($(".box.d").value === "") {
      $(".box.d").value = res[0];
      return true;
    } else {
      $(".box.h").value = res[0];
      $(".box.h").dispatchEvent(new Event("change"));
    }
    startInspection();
    return false;
  }
  return true;
});

root.addGroup(root, weight, function (e) {
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".box.w").value = res[0];
    return false;
  }
  return true;
});

root.addGroup(root, condition, function (e) {
  if (currentSection !== sections.condition) {
    return false;
  }
  $(".condChoice").value += e + " ";
  if ($(".condChoice").value.toLowerCase().includes("like new")) {
    $(currentSection.likeNew).click();
    $(".condChoice").value = "";
    return false;
  }
  if ($(".condChoice").value.toLowerCase().includes("new")) {
    $(currentSection.new).click();
    $(".condChoice").value = "";
    return false;
  }
  if ($(".condChoice").value.toLowerCase().includes("damaged")) {
    $(currentSection.damaged).click();
    $(".condChoice").value = "";
    currentSection = sections.damaged.missParts;
    startInspection();
    return false;
  }
  if ($(".condChoice").value.toLowerCase().includes("trash")) {
    $(currentSection.trash).click();
    $(".condChoice").value = "";
    currentSection = sections.damaged.trash;
    startInspection();
    return false;
  }
  return true;
});

root.addGroup(root, dmgTop, function (e) {
  if (currentSection.top !== undefined) {
    $(currentSection.top.checkbox).click();
    currentSection = currentSection.top;
    startInspection();
  }
});
root.addGroup(root, dmgBot, function (e) {
  if (currentSection.bottom !== undefined) {
    $(currentSection.bottom.checkbox).click();
    currentSection = currentSection.bottom;
    startInspection();
  }
});
root.addGroup(root, dmgInt, function (e) {
  if (currentSection.interior !== undefined) {
    $(currentSection.interior.checkbox).click();
    currentSection = currentSection.interior;
    startInspection();
  }
});

root.addGroup(root, visible, function (e) {
  if (currentSection.clearlyVis !== undefined) {
    $(currentSection.clearlyVis).click();
    startInspection();
  }
});
root.addGroup(root, hidden, function (e) {
  if (currentSection.hidden !== undefined) {
    $(currentSection.hidden).click();
    startInspection();
  }
});

root.addGroup(root, minor, function (e) {
  if (currentSection.minor !== undefined) {
    $(currentSection.minor).click();
    startInspection();
  }
});
root.addGroup(root, moderate, function (e) {
  if (currentSection.moderate !== undefined) {
    $(currentSection.moderate).click();
    startInspection();
  }
});
root.addGroup(root, considerable, function (e) {
  if (currentSection.considerable !== undefined) {
    $(currentSection.considerable).click();
    startInspection();
  }
});

root.addGroup(root, dmgReport, function (e) {
  if (currentSection === sections.damaged.trash) {
    currentSection = sections.missParts;
    startInspection();
  }
});

root.addGroup(root, nextSection, function (e) {
  startInspection();
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

root.addGroup(root, location, function (e) {
  if (currentSection === sections.location) {
    if ($(currentSection.area).value === "") {
      $(currentSection.area).value = e;
      return true;
    } else if ($(currentSection.zone).value === "") {
      $(currentSection.zone).value = e;
      return true;
    } else if ($(currentSection.loc).value === "") {
      $(currentSection.loc).value = e;
      return true;
    } else {
      $(currentSection.pallet).value = e;
      return false;
    }
  }
});

root.addGroup(root, prevPage, function (e) {
  currentSection = null;
  $(".prevpage").click();
});
