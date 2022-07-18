// html query selector because jQuery is weird
export const $ = (s, o = document) => o.querySelector(s);

/**
 * List of all command groups
 */
export const cmds = {
  // verify (yes/no/other answer types)
  verify: ["yes", "yep", "yeah", "correct"],
  unverify: ["no", "incorrect", "wrong"],
  // correct the dimensions
  correctDims: ["dimensions", "dimension"],
  weight: ["weight", "weights", "wait"],
  length: ["length", "long"],
  depth: ["depth", "width", "wide"],
  height: ["height", "high"],
  // condition
  condition: ["condition", "conditions"],
  missSome: ["some", "few"],
  missMost: ["most", "all"],
  dmgTop: ["top", "front", "corner", "corners", "sides", "side"],
  dmgBot: ["bottom", "back"],
  dmgInt: ["interior", "inside"],
  visible: ["clearly visible", "visible", "clear"],
  hidden: ["hidden"],
  minor: ["minor", "miner"],
  moderate: ["moderate"],
  considerable: ["considerable"],
  // location
  location: ["location put away"],
  // navigate sections
  nextSection: ["next section"],
  ogpack: ["original package", "original packaging"],
  reship: ["reship", "reshipping"],
  missParts: ["missing parts"],
  whrDmg: ["where damage", "damage on", "damaged on"],
  assemInstr: ["instructions", "instruction"],
  // add notes
  addNotes: ["add notes", "added notes", "add note", "added note"],
  endNotes: [
    "end note",
    "end notes",
    "and note",
    "and notes",
    "endnotes",
    "endnote",
  ],
  clearNotes: ["clear note", "clear notes"],
  // // navigate pages *NOT USED ANYMORE*
  // prevPage: ["last page", "previous page"],
  // control voice
  control: ["control voice"],
};

// sections of inspection page
export const sections = {
  // original packaging
  ogpack: {
    prompt: ".isog_pack",
    yes: ".yes_pack",
    no: ".no_pack",
  },
  //reshipping
  reship: {
    prompt: ".isreship",
    yes: ".yes_reuse",
    no: ".no_reuse",
  },
  // box/product dimensions
  dimensions: {
    prompt: ".isdims",
    redo: false,
    type: "box",
    yes: "yes",
    no: "no",
  },
  // condition
  condition: {
    prompt: ".cond.prompt",
    new: ".cond.new",
    likeNew: ".cond.lnew",
    damaged: ".cond.dmg",
    trash: ".cond.trash",
  },
  // used to navigate between sections of condition
  damaged: {
    missParts: "missParts",
    dmgImg: "dmgImg",
    addDmg: {
      add: false,
      yes: "yes",
      no: "no",
    },
  },
  // missing parts
  missParts: {
    prompt: ".miss.prompt",
    no: ".no_miss",
    some: ".some_miss",
    most: ".most_miss",
  },
  // where is the damage
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
  // damage image
  dmgImg: {
    prompt: ".add_dmg_img",
  },
  // assembly instructions
  assemInstr: {
    prompt: ".are_inst_incl",
    yes: ".yes_instr",
    no: ".no_instr",
  },
  // add notes text box
  notes: {
    prompt: ".add_notes",
  },
  // location
  location: {
    prompt: ".l_prompt",
    area: ".l_area",
    zone: ".l_zone",
    loc: ".l_loc",
    pallet: ".l_pallet",
  },
};

// used to keep track of what the current section/mode/prompt is that is
// being used while going through the inspection page
export const current = {
  section: null,
  mode: "train",
  prompt: "",
};
