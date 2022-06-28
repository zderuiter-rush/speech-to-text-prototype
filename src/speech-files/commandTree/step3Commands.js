import HashTableNode from "./commandTree";
import { speech, controlVoice, resetPhrases } from "../STT";

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
const dmgTop = ["top", "front", "corner", "corners", "sides", "side"];
const dmgBot = ["bottom", "back"];
const dmgInt = ["interior", "inside"];
const visible = ["clearly visible", "visible", "clear"];
const hidden = ["hidden"];
const minor = ["minor", "miner"];
const moderate = ["moderate"];
const considerable = ["considerable"];
// location
const location = ["location"];
const areas = ["Receiving", "receiving"];
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
// control voice
const control = ["control voice"];

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
    redo: false,
    yes: "yes",
    no: "no",
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
    addDmg: {
      add: false,
      yes: "yes",
      no: "no",
    },
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
        hidden: ".bot_dmg_vis_h",
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
  assemInstr: {
    promt: ".are_inst_incl",
    yes: ".yes_instr",
    no: ".no_instr",
  },
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

export async function startInspection() {
  switch (currentSection) {
    case null:
      resetPhrases([
        verify,
        unverify,
        correctDims,
        weight,
        condition,
        missSome,
        missMost,
        dmgTop,
        dmgBot,
        dmgInt,
        visible,
        hidden,
        minor,
        moderate,
        considerable,
        location,
        nextSection,
        addNotes,
        endNotes,
      ]);
      currentSection = sections.ogpack;
      speech.addToQueue($(currentSection.prompt).innerHTML);
      break;
    case sections.ogpack:
      currentSection = sections.reship;
      speech.addToQueue($(currentSection.prompt).innerHTML);
      break;
    case sections.reship:
      currentSection = sections.dimensions;
      speech.addToQueue($(currentSection.prompt).innerHTML);
      if ($(".box.w").value !== "" && !currentSection.redo) {
        let weight = $(".box_label.w").innerHTML + $(".box.w").value + "lbs.";
        let dimensions =
          `Dimensions: ${$(".box.l").value} by ` +
          `${$(".box.d").value} by ${$(".box.h").value}`;
        speech.addToQueue(
          `${weight}... ${dimensions}... Are these dimensions correct?`
        );
      } else {
        speech.addToQueue(
          "To change the dimensions of the box or product, please say: " +
            "Weight: then say the weight. And/Or: " +
            "Dimensions: then say the dimensions."
        );
      }
      break;
    case sections.dimensions:
      currentSection = sections.condition;
      speech.addToQueue(
        "When you are ready, please say: Condition: then say the condition"
      );
      break;
    case sections.damaged.missParts:
      currentSection = sections.missParts;
      speech.addToQueue(
        "Is the product missing parts? Answer with: no, some, or most."
      );
      break;
    case sections.missParts:
      currentSection = sections.whrDmg;
      let prompt = "Where is the damage? Answer with: ";
      if (!$(".top._dmg").checked) prompt += "top, front, corner, or sides. ";
      if (!$(".bot._dmg").checked) prompt += "bottom or back. ";
      if (!$(".int._dmg").checked) prompt += "interior.";
      speech.addToQueue(prompt);
      break;
    case sections.whrDmg.top:
    case sections.whrDmg.bottom:
    case sections.whrDmg.interior:
      currentSection = currentSection.vis;
      speech.addToQueue(
        "How visible is the damage? Answer with: clearly visible, or hidden"
      );
      break;
    case sections.whrDmg.top.vis:
    case sections.whrDmg.bottom.vis:
    case sections.whrDmg.interior.vis:
      currentSection = currentSection.sev;
      speech.addToQueue(
        "How severe is the damage? Answer with: minor, moderate, or considerable"
      );
      break;
    case sections.whrDmg.top.vis.sev:
    case sections.whrDmg.bottom.vis.sev:
    case sections.whrDmg.interior.vis.sev:
      if (
        !$(".top._dmg").checked ||
        !$(".bot._dmg").checked ||
        !$(".int._dmg").checked
      ) {
        currentSection = sections.damaged.addDmg;
        speech.addToQueue("Is there additional damage?");
      } else {
        currentSection = sections.damaged.dmgImg;
        startInspection();
      }
      break;
    case sections.damaged.dmgImg:
      currentSection = sections.dmgImg;
      speech.addToQueue(
        "Please use your computer to add a picture of the damage"
      );
      startInspection();
      break;
    case sections.dmgImg:
      currentSection = sections.assemInstr;
      speech.addToQueue($(currentSection.promt).innerHTML);
      break;
    case sections.assemInstr:
      currentSection = sections.location;
      speech.addToQueue(
        "If you would like to add notes, please say: 'Add Notes', then say the note... " +
          "To stop adding notes, say: 'End Notes'... " +
          "Or, move on by saying 'Next Section'."
      );
      break;
    default:
      speech.addToQueue(
        "Please say 'Location': then say the location for the product."
      );
      break;
  }
}

root.addGroup(root, verify, function (e) {
  if (currentSection.yes !== undefined) {
    switch (currentSection) {
      case sections.dimensions:
        currentSection.redo = false;
        break;
      case sections.damaged.addDmg:
        currentSection.add = true;
        currentSection = sections.missParts;
        break;
      default:
        $(currentSection.yes).click();
        break;
    }
    startInspection();
  }
  return false;
});

root.addGroup(root, unverify, function (e) {
  if (currentSection.no !== undefined) {
    switch (currentSection) {
      case sections.ogpack:
        $(".box.w").value = "";
        $(".box.l").value = "";
        $(".box.d").value = "";
        $(".box.h").value = "";
        sections.dimensions.redo = true;
        $(currentSection.no).click();
        break;
      case sections.reship:
        $(".isdims").innerHTML = "Product Dimensions and Weights";
        $(currentSection.no).click();
        break;
      case sections.dimensions:
        currentSection.redo = true;
        currentSection = sections.reship;
        break;
      case sections.damaged.addDmg:
        currentSection.add = false;
        currentSection = sections.damaged.dmgImg;
        break;
      default:
        $(currentSection.no).click();
        break;
    }
    startInspection();
  }
  return false;
});

root.addGroup(root, missSome, function (e) {
  if (currentSection.some !== undefined) {
    $(currentSection.some).click();
    startInspection();
  }
  return false;
});

root.addGroup(root, missMost, function (e) {
  if (currentSection.most !== undefined) {
    $(currentSection.most).click();
    startInspection();
  }
  return false;
});

root.addGroup(root, correctDims, function (e) {
  if (currentSection !== sections.dimensions || !currentSection.redo) {
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
    startInspection();
    return false;
  }
  if ($(".condChoice").value.toLowerCase().includes("new")) {
    $(currentSection.new).click();
    $(".condChoice").value = "";
    startInspection();
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
    if (!$(currentSection.top.checkbox).checked) {
      $(currentSection.top.checkbox).click();
      currentSection = currentSection.top;
      startInspection();
    } else {
      speech.addToQueue(
        "Damaged top, front, corner, or sides: has already been chosen"
      );
    }
  }
  return false;
});
root.addGroup(root, dmgBot, function (e) {
  if (currentSection.bottom !== undefined) {
    if (!$(currentSection.bottom.checkbox).checked) {
      $(currentSection.bottom.checkbox).click();
      currentSection = currentSection.bottom;
      startInspection();
    } else {
      speech.addToQueue("Damaged bottom or back : has already been chosen");
    }
  }
  return false;
});
root.addGroup(root, dmgInt, function (e) {
  if (currentSection.interior !== undefined) {
    if (!$(currentSection.interior.checkbox).checked) {
      $(currentSection.interior.checkbox).click();
      currentSection = currentSection.interior;
      startInspection();
    } else {
      speech.addToQueue("Damaged interior: has already been chosen");
    }
  }
  return false;
});

root.addGroup(root, visible, function (e) {
  if (currentSection.clearlyVis !== undefined) {
    $(currentSection.clearlyVis).click();
    startInspection();
  }
  return false;
});
root.addGroup(root, hidden, function (e) {
  if (currentSection.hidden !== undefined) {
    $(currentSection.hidden).click();
    startInspection();
  }
  return false;
});

root.addGroup(root, minor, function (e) {
  if (currentSection.minor !== undefined) {
    $(currentSection.minor).click();
    startInspection();
  }
  return false;
});
root.addGroup(root, moderate, function (e) {
  if (currentSection.moderate !== undefined) {
    $(currentSection.moderate).click();
    startInspection();
  }
  return false;
});
root.addGroup(root, considerable, function (e) {
  if (currentSection.considerable !== undefined) {
    $(currentSection.considerable).click();
    startInspection();
  }
  return false;
});

root.addGroup(root, nextSection, function (e) {
  startInspection();
  return false;
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

  if (!continueDamage) startInspection();

  return continueDamage;
});

root.addGroup(root, location, function (e) {
  if (currentSection === sections.location) {
    currentSection = sections.location;
    if (e === "") return true;
    if (
      $(currentSection.area).value === "" &&
      $(currentSection.zone).value === "" &&
      $(currentSection.loc).value === "" &&
      /^[0-9]{3}[ABCU][0-9]{1,4}(\.)?$/.test(e)
    ) {
      $(currentSection.area).value = /^[0-9]{3}/.exec(e)[0];
      $(currentSection.zone).value = /[ABCU]/.exec(e)[0];
      let loc = "000" + /[0-9]{1,4}(\.)?$/.exec(e)[0].replace(".", "");
      $(currentSection.loc).value = loc.substring(loc.length - 4);
      return false;
    } else if (
      $(currentSection.area).value === "" &&
      (/^[0-9]{3}$/.test(e) || areas.includes(e))
    ) {
      $(currentSection.area).value = e;
      return true;
    } else if ($(currentSection.zone).value === "" && /[ABCU]/.test(e)) {
      $(currentSection.zone).value = /[ABCU]/.exec(e)[0];
      $(currentSection.loc).value = "0003";
      return false;
    } else {
      console.log("pallet");
      $(currentSection.pallet).value = e;
      return false;
    }
  }
});

root.addGroup(root, prevPage, function (e) {
  currentSection = null;
  $(".prevpage").click();
  return false;
});

root.addGroup(root, control, controlVoice);
