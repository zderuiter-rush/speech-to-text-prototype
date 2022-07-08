import CommandTree from "./commandTree";
import { speech, controlVoice, sttFromMic } from "../Voice";

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
const length = ["length", "long"];
const depth = ["depth", "width", "wide"];
const height = ["height", "high"];
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
const location = ["location put away"];
// navigate sections
const nextSection = ["next section"];
const ogpack = ["original package", "original packaging"];
const reship = ["reship", "reshipping"];
const missParts = ["missing parts"];
const whrDmg = ["where damage", "damage on", "damaged on"];
const assemInstr = ["instructions", "instruction"];
// add notes
const addNotes = ["add notes", "added notes", "add note", "added note"];
const endNotes = [
  "end note",
  "end notes",
  "and note",
  "and notes",
  "endnotes",
  "endnote",
];
const clearNotes = ["clear note", "clear notes"];
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
    type: "box",
    yes: "yes",
    no: "no",
  },
  condition: {
    prompt: ".cond.prompt",
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
    prompt: ".miss.prompt",
    no: ".no_miss",
    some: ".some_miss",
    most: ".most_miss",
  },
  whrDmg: {
    prompt: ".whr_dmg",
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
  dmgImg: {
    prompt: ".add_dmg_img",
  },
  assemInstr: {
    prompt: ".are_inst_incl",
    yes: ".yes_instr",
    no: ".no_instr",
  },
  notes: {
    prompt: ".add_notes",
  },
  location: {
    prompt: ".l_prompt",
    area: ".l_area",
    zone: ".l_zone",
    loc: ".l_loc",
    pallet: ".l_pallet",
  },
};

const current = {
  section: null,
  mode: "train",
  prompt: "",
};

export function mode(mode) {
  current.mode = mode;
}

/**
 * List of all commands with their respective functions
 *
 * IMPORTANT: All function return "true" to make the command function repeat and
 * return "false" to make the command function stop repeating and wait for the next
 * command. (It repeats so users can pause after saying a command)
 */
export const root = new CommandTree();

function setPrompt(long, short) {
  if (current.mode !== "free") {
    current.prompt = current.mode === "train" ? long : short;
    speech.addToQueue(current.prompt);
  }
  if (current.section.prompt !== undefined) {
    $(current.section.prompt).scrollIntoView();
  }
}

function next(bypass = false) {
  if (current.mode === "free" && !bypass) current.section = undefined;

  switch (current.section) {
    case null:
      current.section = sections.ogpack;
      break;
    case sections.ogpack:
      current.section = sections.reship;
      break;
    case sections.reship:
      current.section = sections.dimensions;
      break;
    case sections.dimensions:
      current.section = sections.condition;
      break;
    case sections.damaged.missParts:
      current.section = sections.missParts;
      break;
    case sections.missParts:
      current.section = sections.whrDmg;
      break;
    case sections.whrDmg.top:
    case sections.whrDmg.bottom:
    case sections.whrDmg.interior:
      current.section = current.section.vis;
      break;
    case sections.whrDmg.top.vis:
    case sections.whrDmg.bottom.vis:
    case sections.whrDmg.interior.vis:
      current.section = current.section.sev;
      break;
    case sections.whrDmg.top.vis.sev:
    case sections.whrDmg.bottom.vis.sev:
    case sections.whrDmg.interior.vis.sev:
      if (
        !$(".top._dmg").checked ||
        !$(".bot._dmg").checked ||
        !$(".int._dmg").checked
      ) {
        current.section = sections.damaged.addDmg;
        setPrompt("Is there additional damage?", "More Damage?");
      } else {
        current.section = sections.damaged.dmgImg;
        startSection();
      }
      break;
    case sections.damaged.dmgImg:
      current.section = sections.dmgImg;
      break;
    case sections.dmgImg:
      current.section = sections.assemInstr;
      return;
    case sections.assemInstr:
      current.section = sections.notes;
      break;
    case sections.notes:
      current.section = sections.location;
      break;
    default:
      break;
  }
  startSection();
}

export async function startSection() {
  switch (current.section) {
    case null:
      next();
      break;
    case sections.ogpack:
      setPrompt("Is the item in original packaging?", "Original packaging?");
      break;
    case sections.reship:
      setPrompt("Can the package be reused for shipping?", "Reshipping?");
      break;
    case sections.dimensions:
      if ($(".box.w").value !== "" && !current.section.redo) {
        let weight = $(".box_label.w").innerHTML + $(".box.w").value + "lbs.";
        let dimensions =
          `Dimensions: ${$(".box.l").value} by ` +
          `${$(".box.d").value} by ${$(".box.h").value}`;
        current.prompt =
          current.mode === "train"
            ? "Box Dimensions and Weights... " +
              `${weight}... ${dimensions}... Are these dimensions correct?`
            : `${weight}... ${dimensions}...`;
      } else if (current.mode !== "free") {
        let prompt =
          `To change the dimensions of the ${current.section.type}, please say: ` +
          `Weight: then say the weight. And/Or: `;
        prompt +=
          current.section.type === "box"
            ? `Dimensions: then say the dimensions.`
            : `Length: then say the length. And Depth: then say the depth. ` +
              `And Height: then say the height... Say "Next Section" when you are done.`;
        current.prompt = prompt;
      }
      speech.addToQueue(current.prompt);
      $(current.section.prompt).scrollIntoView();
      break;
    case sections.condition:
      setPrompt(
        "When you are ready, please say: Condition: then say the condition",
        "Condition"
      );
      break;
    case sections.missParts:
      setPrompt(
        "Is the product missing parts? Answer with: no, some, or most.",
        "Missing Parts?"
      );
      break;
    case sections.whrDmg:
      if (current.mode !== "free") {
        if (current.mode === "train") {
          let prompt = "Where is the damage? Answer with: ";
          if (!$(".top._dmg").checked)
            prompt += "top, front, corner, or sides. ";
          if (!$(".bot._dmg").checked) prompt += "bottom or back. ";
          if (!$(".int._dmg").checked) prompt += "interior.";
          current.prompt = prompt;
        } else {
          current.prompt = "Where?";
        }
        speech.addToQueue(current.prompt);
      }
      $(current.section.prompt).scrollIntoView();
      break;
    case sections.whrDmg.top.vis:
    case sections.whrDmg.bottom.vis:
    case sections.whrDmg.interior.vis:
      setPrompt(
        "How visible is the damage? Answer with: clearly visible, or hidden",
        "Visibility?"
      );
      break;
    case sections.whrDmg.top.vis.sev:
    case sections.whrDmg.bottom.vis.sev:
    case sections.whrDmg.interior.vis.sev:
      setPrompt(
        "How severe is the damage? Answer with: minor, moderate, or considerable",
        "Severity?"
      );
      break;
    case sections.dmgImg:
      setPrompt(
        "Please use your computer to add a picture of the damage",
        "Add Picture"
      );
      sttFromMic();
      next();
      break;
    case sections.assemInstr:
      setPrompt(
        "Are there printed assembly instructions included with this product?",
        "Instructions?"
      );
      break;
    case sections.notes:
      setPrompt(
        "If you would like to add notes, please say: 'Add Notes', then say the note... " +
          "To stop adding notes, say: 'End Notes'... " +
          "Or, move on by saying 'Next Section'.",
        "Notes"
      );
      break;
    case sections.location:
      setPrompt(
        "Please say 'Location Put Away' to add the location.",
        "Location"
      );
      break;
    default:
      break;
  }
}

root.addGroup(root, verify, function (e) {
  if (current.section.yes !== undefined) {
    switch (current.section) {
      case sections.dimensions:
        current.section.redo = false;
        break;
      case sections.damaged.addDmg:
        current.section.add = true;
        current.section = sections.missParts;
        break;
      default:
        $(current.section.yes).click();
        break;
    }
    next();
  }
  return false;
});

root.addGroup(root, unverify, function (e) {
  if (current.section.no !== undefined) {
    switch (current.section) {
      case sections.ogpack:
        $(".box.w").value = "";
        $(".box.l").value = "";
        $(".box.d").value = "";
        $(".box.h").value = "";
        sections.dimensions.redo = true;
        $(current.section.no).click();
        break;
      case sections.reship:
        $(".isdims").innerHTML = "Product Dimensions and Weights";
        $(".box_label.l").textContent = "Length: ";
        $(".box_label.d").textContent = "Depth: ";
        $(".box_label.h").textContent = "Height: ";
        $(".box.l").classList.add("product");
        $(".box.d").classList.add("product");
        $(".box.h").classList.add("product");
        sections.dimensions.type = "product";
        $(current.section.no).click();
        break;
      case sections.dimensions:
        current.section.redo = true;
        current.section = sections.reship;
        break;
      case sections.damaged.addDmg:
        current.section.add = false;
        current.section = sections.damaged.dmgImg;
        break;
      default:
        $(current.section.no).click();
        break;
    }
    next();
  }
  return false;
});

root.addGroup(root, missSome, function (e) {
  if (current.section.some !== undefined) {
    $(current.section.some).click();
    next();
  }
  return false;
});

root.addGroup(root, missMost, function (e) {
  if (current.section.most !== undefined) {
    $(current.section.most).click();
    next();
  }
  return false;
});

root.addGroup(root, correctDims, function (e) {
  if (current.mode === "free" && current.section !== sections.dimensions) {
    current.section = sections.dimensions;
    startSection();
    current.section.redo = true;
    return false;
  }
  if (
    current.section !== sections.dimensions ||
    !current.section.redo ||
    current.section.type !== "box"
  ) {
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
    next();
    return false;
  }
  return true;
});

root.addGroup(root, length, function (e) {
  if (
    current.section !== sections.dimensions ||
    !current.section.redo ||
    current.section.type !== "product"
  ) {
    return false;
  }
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".box.l").value = $(".box.l").innerHTML = res[0];
    return false;
  }
  return true;
});

root.addGroup(root, depth, function (e) {
  if (
    current.section !== sections.dimensions ||
    !current.section.redo ||
    current.section.type !== "product"
  ) {
    return false;
  }
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".box.d").value = $(".box.d").innerHTML = res[0];
    return false;
  }
  return true;
});

root.addGroup(root, height, function (e) {
  if (
    current.section !== sections.dimensions ||
    !current.section.redo ||
    current.section.type !== "product"
  ) {
    return false;
  }
  let number = /[0-9]+(\.[0-9]+)?/;
  if (number.test(e)) {
    let res = number.exec(e);
    $(".box.h").value = $(".box.h").innerHTML = res[0];
    return false;
  }
  return true;
});

root.addGroup(root, weight, function (e) {
  if (current.section === sections.dimensions) {
    let number = /[0-9]+(\.[0-9]+)?/;
    if (number.test(e)) {
      let res = number.exec(e);
      $(".box.w").value = res[0];
      return false;
    }
  }
  return true;
});

root.addGroup(root, condition, function (e) {
  if (current.mode === "free") {
    current.section = sections.condition;
    startSection();
  }
  if (current.section !== sections.condition) {
    return false;
  }
  $(".condChoice").value += e + " ";
  if ($(".condChoice").value.toLowerCase().includes("like new")) {
    $(current.section.likeNew).click();
    $(".condChoice").value = "";
    current.section = sections.location;
    if (current.mode !== "free") startSection();
    return false;
  }
  if ($(".condChoice").value.toLowerCase().includes("new")) {
    $(current.section.new).click();
    $(".condChoice").value = "";
    current.section = sections.location;
    if (current.mode !== "free") startSection();
    return false;
  }
  if (/damage(d)?/.test($(".condChoice").value.toLowerCase())) {
    $(current.section.damaged).click();
    $(".condChoice").value = "";
    current.section = sections.missParts;
    if (current.mode !== "free") startSection();
    return false;
  }
  if ($(".condChoice").value.toLowerCase().includes("trash")) {
    $(current.section.trash).click();
    $(".condChoice").value = "";
    current.section = sections.dmgImg;
    if (current.mode !== "free") startSection();
    return false;
  }
  return true;
});

root.addGroup(root, dmgTop, function (e) {
  if (current.section.top !== undefined) {
    if (!$(current.section.top.checkbox).checked) {
      $(current.section.top.checkbox).click();
      current.section = current.section.top;
      next(true);
    } else {
      current.prompt =
        current.mode === "train"
          ? "Damaged top, front, corner, or sides: has already been chosen"
          : "Already chosen";
      speech.addToQueue(current.prompt);
    }
  }
  return false;
});
root.addGroup(root, dmgBot, function (e) {
  if (current.section.bottom !== undefined) {
    if (!$(current.section.bottom.checkbox).checked) {
      $(current.section.bottom.checkbox).click();
      current.section = current.section.bottom;
      next(true);
    } else {
      current.prompt =
        current.mode === "train"
          ? "Damaged bottom or back: has already been chosen"
          : "Already chosen";
      speech.addToQueue(current.prompt);
    }
  }
  return false;
});
root.addGroup(root, dmgInt, function (e) {
  if (current.section.interior !== undefined) {
    if (!$(current.section.interior.checkbox).checked) {
      $(current.section.interior.checkbox).click();
      current.section = current.section.interior;
      next(true);
    } else {
      current.prompt =
        current.mode === "train"
          ? "Damaged interior: has already been chosen"
          : "Already chosen";
      speech.addToQueue(current.prompt);
    }
  }
  return false;
});

root.addGroup(root, visible, function (e) {
  if (current.section.clearlyVis !== undefined) {
    $(current.section.clearlyVis).click();
    next(true);
  }
  return false;
});
root.addGroup(root, hidden, function (e) {
  if (current.section.hidden !== undefined) {
    $(current.section.hidden).click();
    next(true);
  }
  return false;
});

root.addGroup(root, minor, function (e) {
  if (current.section.minor !== undefined) {
    $(current.section.minor).click();
    next();
  }
  return false;
});
root.addGroup(root, moderate, function (e) {
  if (current.section.moderate !== undefined) {
    $(current.section.moderate).click();
    next();
  }
  return false;
});
root.addGroup(root, considerable, function (e) {
  if (current.section.considerable !== undefined) {
    $(current.section.considerable).click();
    next();
  }
  return false;
});

root.addGroup(root, addNotes, function (e) {
  if (current.section === sections.notes || current.mode === "free") {
    if (current.mode === "free") $(".add_notes").scrollIntoView();
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

    clearNotes.forEach(function (cmd) {
      if ($(".add_notes").value.toLowerCase().includes(cmd)) {
        $(".add_notes").value = "";
      }
    });

    if (!continueDamage) next();
    return continueDamage;
  }
});

root.addGroup(root, location, function (e) {
  if (current.section === sections.location || current.mode === "free") {
    current.section = sections.location;
    if (current.mode === "free") $(current.section.prompt).scrollIntoView();
    $(current.section.area).value = "201";
    $(current.section.zone).value = "C";
    $(current.section.loc).value = "0003";
    if (current.mode !== "free") sttFromMic();
  }
});

root.addGroup(root, nextSection, function (e) {
  next(true);
  return false;
});
function chooseSectionWhileFree(sect, func = null) {
  if (current.mode === "free") {
    if (func !== null) func();
    current.section = sect;
    startSection();
  }
  return false;
}
root.addGroup(root, ogpack, function (e) {
  chooseSectionWhileFree(sections.ogpack);
});
root.addGroup(root, reship, function (e) {
  chooseSectionWhileFree(sections.reship);
});
root.addGroup(root, missParts, function (e) {
  chooseSectionWhileFree(sections.missParts);
});
root.addGroup(root, whrDmg, function (e) {
  chooseSectionWhileFree(sections.whrDmg, () => {
    if (!$(".cond.dmg").checked) {
      $(".cond.dmg").click();
    }
  });
});
root.addGroup(root, assemInstr, function (e) {
  chooseSectionWhileFree(sections.assemInstr);
});

root.addGroup(root, prevPage, function (e) {
  current.section = null;
  $(".prevpage").click();
  return false;
});

root.addGroup(root, control, controlVoice);

// put back in first case if phrases are wanted
// resetPhrases([
//   verify,
//   unverify,
//   correctDims,
//   weight,
//   condition,
//   missSome,
//   missMost,
//   dmgTop,
//   dmgBot,
//   dmgInt,
//   visible,
//   hidden,
//   minor,
//   moderate,
//   considerable,
//   location,
//   nextSection,
//   addNotes,
//   endNotes,
// ]);
