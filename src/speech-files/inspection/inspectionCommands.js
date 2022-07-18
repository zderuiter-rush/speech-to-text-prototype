import CommandTree from "../commandTree";
import { next, startSection } from "./inspectionProcess";
import { speech, controlVoice, toggleVoice } from "../Voice";
import { $, cmds, sections, current } from "./inspectionGlobals";

/**
 * List of all commands with their respective functions
 *
 * IMPORTANT: All functions return "true" to make the command function repeat and
 * return "false" to make the command function stop repeating and wait for the next
 * command. (It repeats so users can pause after saying a command)
 */

// command tree root that will get all commands added to
export const root = new CommandTree();

/**
 * Command: "Yes, Yeah, Yep, Correct"
 * This will mark "yes" or "correct" for any section in the inspection process that
 * can be anwered with yes.
 */
root.addGroup(root, cmds.verify, function (e) {
  if (current.section.yes !== undefined) {
    switch (current.section) {
      case sections.dimensions:
        // when responding with yes here, it is to say the dimensions are correct
        current.section.redo = false;
        break;
      case sections.damaged.addDmg:
        // when responding yes here, it is to add more damage to a different area (top, bottom, interior)
        current.section.add = true;
        current.section = sections.missParts;
        break;
      default:
        // click "yes" for whatever question
        $(current.section.yes).click();
        break;
    }
    // move to next section
    next();
  }
  return false;
});

/**
 * Command: "no", "incorrect", "wrong"
 * This command will mark "no" for the sections that can be marked with no
 */
root.addGroup(root, cmds.unverify, function (e) {
  if (current.section.no !== undefined) {
    switch (current.section) {
      // if not the original packaging, need to mark that the Voice should
      // say we need to add the dimensions of the box
      case sections.ogpack:
        sections.dimensions.redo = true;
        $(current.section.no).click();
        break;
      // if the box can't be reshipped, need to mark that Voice should change
      // to saying "product" instead of "box" when saying the dimensions
      case sections.reship:
        sections.dimensions.type = "product";
        $(current.section.no).click();
        break;
      // this is for when the user responds with "no" to if the dimensions said
      // by Voice are correct or not, then we need to redo the dimensions
      // and move back up to before the dimensions section
      case sections.dimensions:
        current.section.redo = true;
        current.section = sections.reship;
        break;
      // this if for when the user says there is no more damage to add
      // (when adding damage to top, bottom, interior of te product)
      case sections.damaged.addDmg:
        current.section.add = false;
        current.section = sections.damaged.dmgImg;
        break;
      // otherwise just click "no"
      default:
        $(current.section.no).click();
        break;
    }
    // next section
    next();
  }
  return false;
});

/**
 * This command is used to change/correct the dimensions of the box/product.
 * What this does is listen for 3 numbers, then it will add those numbers, in
 * order, to the longest to shortest sides dimensions (which will then automatically
 * reorder to the proper order upon changing).
 *
 * What will need to be done in actual implementation is that this will have to switch between
 * listening for 2 and 3 numbers when the category changes to curtains, for example.
 */
root.addGroup(root, cmds.correctDims, function (e) {
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

/**
 * This command is used for when the dimensions are to describe the product,
 * not the box, and the length needs to be changed.
 * it does this by listening for the next number
 */
root.addGroup(root, cmds.length, function (e) {
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

/**
 * This command is used for when the dimensions are to describe the product,
 * not the box, and the depth needs to be changed.
 * it does this by listening for the next number
 */
root.addGroup(root, cmds.depth, function (e) {
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

/**
 * This command is used for when the dimensions are to describe the product,
 * not the box, and the height needs to be changed.
 * it does this by listening for the next number
 */
root.addGroup(root, cmds.height, function (e) {
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

/**
 * This command is used to change the weight of the product by listening
 * for the next number
 */
root.addGroup(root, cmds.weight, function (e) {
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

/**
 * This command is used to select the condition of the product. It uses
 * a hidden text box that stores what is said after this command is
 * activated and looking for "like new", "new", "damage(d)", or "trash" in
 * the hidden text box, then changing the condition to whatever was chosen
 */
root.addGroup(root, cmds.condition, function (e) {
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

/**
 * This command is used to click "some" when responding to if there are any missing parts
 */
root.addGroup(root, cmds.missSome, function (e) {
  if (current.section.some !== undefined) {
    $(current.section.some).click();
    next();
  }
  return false;
});

/**
 * This command is used to click "most" when responding to if there are any missing parts
 */
root.addGroup(root, cmds.missMost, function (e) {
  if (current.section.most !== undefined) {
    $(current.section.most).click();
    next();
  }
  return false;
});

/**
 * These next 3 commands are used to click "top, front, corner, sides",
 * "bottom, back", and "interior" when responding to where
 * the damage is. If the option has already been chosen, then Voice will say that
 * it has already been chosen
 */
root.addGroup(root, cmds.dmgTop, function (e) {
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
root.addGroup(root, cmds.dmgBot, function (e) {
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
root.addGroup(root, cmds.dmgInt, function (e) {
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

/**
 * These next 2 options are used when responding to how visible the damage is,
 * that being either clearly visible or hidden
 */
root.addGroup(root, cmds.visible, function (e) {
  if (current.section.clearlyVis !== undefined) {
    $(current.section.clearlyVis).click();
    next(true);
  }
  return false;
});
root.addGroup(root, cmds.hidden, function (e) {
  if (current.section.hidden !== undefined) {
    $(current.section.hidden).click();
    next(true);
  }
  return false;
});

/**
 * These next 3 commands are used when responding to how severe damage is
 * (minor, moderate, or considerable)
 */
root.addGroup(root, cmds.minor, function (e) {
  if (current.section.minor !== undefined) {
    $(current.section.minor).click();
    next();
  }
  return false;
});
root.addGroup(root, cmds.moderate, function (e) {
  if (current.section.moderate !== undefined) {
    $(current.section.moderate).click();
    next();
  }
  return false;
});
root.addGroup(root, cmds.considerable, function (e) {
  if (current.section.considerable !== undefined) {
    $(current.section.considerable).click();
    next();
  }
  return false;
});

/**
 * This command is used to add notes to the notes section. What is does is add
 * one word at a time and check if what has been added to the text area either
 * contains "end notes" or "clear notes", in which case either the command ends
 * or the text area is reset/cleared.
 * When the notes are ended, then it will go to the next section.
 */
root.addGroup(root, cmds.addNotes, function (e) {
  if (current.section === sections.notes || current.mode === "free") {
    if (current.mode === "free") $(".add_notes").scrollIntoView();
    let continueDamage = true;
    $(".add_notes").value += e + " ";

    cmds.endNotes.forEach(function (cmd) {
      if ($(".add_notes").value.toLowerCase().includes(cmd)) {
        $(".add_notes").value = $(".add_notes").value.substring(
          0,
          $(".add_notes").value.toLowerCase().indexOf(cmd)
        );
        continueDamage = false;
      }
    });

    cmds.clearNotes.forEach(function (cmd) {
      if ($(".add_notes").value.toLowerCase().includes(cmd)) {
        $(".add_notes").value = "";
      }
    });

    if (!continueDamage) next();
    return continueDamage;
  }
});

/**
 * This command is used to add the "201C0003" location since that is pretty much
 * always the only location used during the inspection process.
 */
root.addGroup(root, cmds.location, function (e) {
  if (current.section === sections.location || current.mode === "free") {
    current.section = sections.location;
    if (current.mode === "free") $(current.section.prompt).scrollIntoView();
    $(current.section.area).value = "201";
    $(current.section.zone).value = "C";
    $(current.section.loc).value = "0003";
    if (current.mode !== "free") toggleVoice();
  }
});

/**
 * This is used to force Voice to move on to the next section
 */
root.addGroup(root, cmds.nextSection, function (e) {
  next(true);
  return false;
});

/**
 * This function is used to choose whatever section you want to go to
 * while in free mode
 *
 * @param {String} sect the section to set the current.section to
 * @param {function} func an extra function to be used if the command needs to do
 *                        something extra
 * @returns false to indicate the command is done
 */
function chooseSectionWhileFree(sect, func = null) {
  if (current.mode === "free") {
    if (func !== null) func();
    current.section = sect;
    startSection();
  }
  return false;
}
/**
 * These next 5 commands are all to move to a given section while in
 * free mode
 */
root.addGroup(root, cmds.ogpack, function (e) {
  chooseSectionWhileFree(sections.ogpack);
});
root.addGroup(root, cmds.reship, function (e) {
  chooseSectionWhileFree(sections.reship);
});
root.addGroup(root, cmds.missParts, function (e) {
  chooseSectionWhileFree(sections.missParts);
});
root.addGroup(root, cmds.whrDmg, function (e) {
  chooseSectionWhileFree(sections.whrDmg, () => {
    if (!$(".cond.dmg").checked) {
      $(".cond.dmg").click();
    }
  });
});
root.addGroup(root, cmds.assemInstr, function (e) {
  chooseSectionWhileFree(sections.assemInstr);
});

/**
 * This command is used to control the voice by pausing and resuming the
 * execution of commands or stop Voice altogether
 */
root.addGroup(root, cmds.control, controlVoice);
