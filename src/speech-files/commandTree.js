const { wordsToNumbers } = require("words-to-numbers");

/**
 * This class serves as the data structure to store/retrieve commands with
 * their functions.
 *
 * It works as a decision tree that progresses down the tree by using the
 * commands as keys. Using the example below, if you had the command "bc",
 * then when getCommand is called, it will get whatever function is there
 * and return an object that has the function and the String command ("bc").
 * This is also able to have a command at any level of the tree, so command
 * "b" can have a function to go with it, same as how "bc" can.
 *
 *              root
 *            /      \
 *          "a"      "b"
 *                  /   \
 *                "c"   "d"
 */
export default function CommandTree() {
  // the current command being used, stored in the root
  var command = null;

  // the current command's text, stored in the root
  var commandText = null;

  // used so the root knows if the current command is still being used between
  // mutliple events of recognized speech
  var keepCommand = false;

  // used so the getCommand function knows to use the current command phrase found
  // even if there are more words that match other commands or are more words in
  // the recognized speech
  var thisCommand = false;

  // this is a object array of the words in the command, if it's the first layer
  // of the tree, this stores the first word of the command, 2nd layer: 2nd word,
  // and so on. The key for this object array is the word in the command, and the
  // word stores another object that will have the function for the command (if
  // it is the last word in the command) or a link to the next CommandTree that
  // stores the second layer/word for the command
  this.content = {};

  /**
   * Function to add multiple commands at once that will all use the same function.
   * This is used in a case like "weight" being recognized as "wait"
   * @param {CommandTree} root the CommandTree that serves as the root to add all the
   *                            functions to
   * @param {String[]} keys an array of strings that are the commands to be added
   * @param {function} func the function that each command will perform when called
   */
  this.addGroup = function (root, keys, func) {
    keys.forEach(function (key) {
      root.add(key, func);
    });
  };

  /**
   * This function adds a single command to this CommandTree. It first splits the command
   * into an array of words, then, if there are multiple words, this will recursively
   * call itself until it gets to the last word to add the function to the last word.
   *
   * @param {String} key the command that will be added to this CommandTree
   * @param {function} func the function that this command will execute when called
   */
  this.add = function (key, func) {
    // split the key (command) into an array of words
    let keys = key.split(" ");

    // if the current word is not in the current layer, add it
    if (!this.content.hasOwnProperty(keys[0])) {
      this.content[keys[0]] = {};
    }

    if (keys.length > 1) {
      // if there are multiple words add the next CommandTree node to the current word
      this.content[keys[0]]["next"] = new CommandTree();

      // then add the next word to this word's CommandTree node
      this.content[keys[0]]["next"].add(keys.slice(1).join(" "), func);
    } else {
      // if it is the last word (or there was only one word), give it a function
      this.content[keys[0]]["cmd"] = func;
    }
  };

  /**
   * This function takes in the recognized speech and iterates through every word
   * until a command is found. Once found, this will return an object storing
   * the function and string for the command phrase found.
   *
   * @param {String} key string from the recognized speech
   * @param {String} txt *only used within the function* a word at a time is added to
   *                      this when recursively finding the function to make the
   *                      command phrase
   * @returns object array with the command function and string of the command phrase
   */
  this.getCommand = function (key, txt = "") {
    // first split the key into an array of words
    let keys = key.split(" ");

    // if we are finding a new command (or aren't keeping the last used command to
    // continue using), then continue to find it, otherwise return the last used
    // command that we want to keep using
    if (!keepCommand) {
      // if there are multiple words...
      if (keys.length > 1) {
        // if the current word is not part of any command, go to the next word
        if (this.content[keys[0]] === undefined) {
          return this.getCommand(keys.slice(1).join(" "), txt);
        }
        // if the current word is a part of a command and the next CommandTree
        // layer exists and has the next word in the key, go to the next layer
        else if (
          this.content[keys[0]]["next"] !== undefined &&
          this.content[keys[0]]["next"].getContent()[keys[1]] !== undefined
        ) {
          // go to next layer
          let cmd = this.content[keys[0]]["next"].getCommand(
            keys.slice(1).join(" "),
            txt + keys[0] + " "
          );
          // set the command for this layer (only needed at root so
          // keepCommand works)
          command = cmd["cmd"];
          return cmd;
        }
        // if this word is in this layer and the next layer doesn't have
        // the next word in the key, this word is the end of the command phrase
        else {
          thisCommand = true;
        }
      }

      // if it was chosen that the current word is the end of the found
      // command phrase or it is the last word in the key...
      if (thisCommand || keys.length === 1) {
        // check that the current word exists in the current layer
        // and, if it does, that it actually has a command function
        // attached to it. If not, return null
        if (
          this.content[keys[0]] === undefined ||
          this.content[keys[0]]["cmd"] === undefined
        ) {
          return null;
        }
        // if the current word and command function exists, set the current
        // layer's command function, set the commandText, and return
        command = this.content[keys[0]]["cmd"];
        commandText = txt + keys[0];
        return {
          cmd: command,
          txt: commandText,
        };
      }
      return null;
    }
    // if we want to keep the command, return the command, the command text is
    // set to "" to indicate that it is a previously used command, not a new one
    return {
      cmd: command,
      txt: "keepCommand",
    };
  };

  /**
   * @returns the current layers content
   */
  this.getContent = function () {
    return this.content;
  };

  /**
   * set the keepCommand for this layer (only used with the root)
   *
   * @param {boolean} keep
   */
  this.setKeepCommand = function (keep) {
    keepCommand = keep;
  };

  /**
   * This takes out all special characters that could be seen in
   * the recognized speech from Voice and puts it all in lower case.
   * This is done to make recognized speech in a uniform format that
   * is more easily readable/iterable for CommandTree getCommand
   *
   * @param {String} key the recognized speech from Voice
   * @returns the recognized speech in a format readable to CommandTree
   */
  this.formatKey = function (key) {
    var noPunctuation = key.replace(/[.,/#!$%^&*?;:{}=\-_`~()]/g, "");
    var finalNoPunc = noPunctuation.replace(/\s{2,}/g, " ");
    return finalNoPunc.toLowerCase();
  };
}

/**
 * commandTree object that will handle recognized speech and execute the received commands
 */
export const commandTree = {
  // current command to be used after being received
  command: null,

  // command phrase string after being received, used to remove
  // the command itself from the recognized speech so no function
  // gets messed up in some weird way
  commandText: null,

  // CommandTree class root that will have all the commands and functions
  root: null,

  /**
   * Function used to reset all variables used back to base
   * root is not reset so the page does not have to be refreshed
   * after resetting this object
   */
  reset: () => {
    commandTree.command = null;
    commandTree.commandText = null;
    if (commandTree.root !== null) {
      commandTree.root.setKeepCommand(false);
    }
  },

  /**
   * This function handles the recognized speech by using the root to get the
   * command function and phrase, format the recognized speech for the function,
   * then perform the function while we still want to keep the command. Once
   * we don't want to keep the command anymore, this will call itself with what
   * remains of the recognized speech to try and find/execute another command.
   *
   * @param {String} key the recognized speech
   */
  handleRecognizedSpeech: (key, paused) => {
    // if the root hasn't been set somehow or the key is blank/empty, do nothing
    if (commandTree.root === null || key === "") {
      return;
    }

    // get the command from a formatted version of the key
    commandTree.command = commandTree.root.getCommand(
      commandTree.root.formatKey(key)
    );

    // while Voice is not paused from "control voice" command, execute command,
    // unless the command is null
    if (
      (!paused || (paused && commandTree.command["txt"] === "control voice")) &&
      commandTree.command !== null
    ) {
      let keys = null;

      // if the command text is "keepCommand", we are using the previouse command found
      // else, we are using a new command, so we need to remove the command text from the
      // key so nothing weird happens when the command text is fed into its own function
      if (commandTree.command["txt"] !== "keepCommand") {
        let cmdContent = key.substring(
          key.toLowerCase().indexOf(commandTree.command["txt"]) +
            commandTree.command["txt"].length +
            1
        );
        keys = cmdContent.split(" ");
      } else {
        keys = key.split(" ");
      }
      // split key into array of words to more easily iterate through

      // replace all word numbers with symbol numbers (i.e. "one" to "1")
      for (let i = 0; i < keys.length; i++) {
        let num = wordsToNumbers(keys[i], { impliedHundreds: true });
        if (/[0-9]*(.[0-9]*)?/.test(num)) {
          keys[i] = num.toString();
        }
      }

      // execute the command for as long as it should be kept/continued to be used.
      // if we reach the end of the key or we should search for the next command,
      // call handleRecognizedSpeech with the rest of the key
      let keepCommand = false;
      do {
        keepCommand = commandTree.command["cmd"](keys[0]);
        commandTree.root.setKeepCommand(keepCommand);
        if (keepCommand) keys = keys.slice(1);
      } while (keepCommand && keys.join(" ") !== "");
      commandTree.handleRecognizedSpeech(keys.join(" "));
    }
  },
};
