import { speech, toggleVoice } from "../Voice";
import { $, sections, current } from "./inspectionGlobals";
import { root as commandRoot } from "./inspectionCommands";

// get the root from the commands file
export const root = commandRoot;

/**
 * used to change the mode to use
 *
 * @param {String} mode "train", "expert", or "free"
 */
export function mode(mode) {
  current.mode = mode;
}

/**
 * This function will set the current.prompt based on the current.mode.
 * If the current.mode is "train", then use the long version of the prompt
 * If the current.mode is "expert", use the short version of the prompt
 * If the current.mode is "free", do not say any prompt at all
 * Lastly, scroll the current section into view on the page
 *
 * @param {String} long the long version of the prompt to use in training mode
 * @param {String} short short version of the prompt to use in expert mode
 */
export function setPrompt(long, short) {
  // set the current.prompt and add it to the text to speech queue
  if (current.mode !== "free") {
    current.prompt = current.mode === "train" ? long : short;
    speech.addToQueue(current.prompt);
  }
  // if the current section has a prompt, then we want to scroll to that section
  if (current.section.prompt !== undefined) {
    $(current.section.prompt).scrollIntoView();
  }
}

/**
 * This is used to move the current.section to the next section. This could
 * be simplified pretty easily to just using an array instead of an object array
 * of variables, but I thought that naming each section would make it a lot
 * easier to understand for other parts.
 *
 * @param {boolean} bypass used when mode is "free" and we want to auto move to the next section
 */
export function next(bypass = false) {
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
      // the next section here is decided by whether the user says ther is more damage
      // to add or not, or each area of damage is already added
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

/**
 * This function performs the actions for each section. The actions are primarily just
 * setting what prompts to say for each sections.
 */
export async function startSection() {
  switch (current.section) {
    case null:
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
      next();
      break;
    case sections.ogpack:
      setPrompt("Is the item in original packaging?", "Original packaging?");
      break;
    case sections.reship:
      setPrompt("Can the package be reused for shipping?", "Reshipping?");
      break;
    case sections.dimensions:
      // when it is the dimensions section, either read off what the dimensions are
      // or tell the user to change the dimensions.
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
      } else {
        current.prompt = `Correct the dimensions`;
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
      toggleVoice();
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
