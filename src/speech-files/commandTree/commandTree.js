export default function HashTableNode() {
  var command = null;
  var commandText = null;
  var keepCommand = false;
  var startCommand = false;
  this.content = {};

  this.addGroup = function (root, keys, funcValue) {
    keys.forEach(function (key) {
      root.add(key, funcValue);
    });
  };

  this.add = function (key, funcValue) {
    let keys = key.split(" ");
    if (keys.length > 1) {
      if (!this.content.hasOwnProperty(keys[0])) {
        this.content[keys[0]] = {};
        this.content[keys[0]]["next"] = new HashTableNode();
      }
      this.content[keys[0]]["next"].add(keys.slice(1).join(" "), funcValue);
    } else {
      this.content[keys[0]] = {};
      this.content[keys[0]]["cmd"] = funcValue;
    }
  };

  this.getCommand = function (key, txt) {
    let keys = key.split(" ");
    if (!keepCommand) {
      if (keys.length > 1) {
        if (this.content[keys[0]] === undefined) {
          return this.getCommand(keys.slice(1).join(" "), txt);
        } else if (
          this.content[keys[0]]["next"] !== undefined &&
          this.content[keys[0]]["next"].getContent()[keys[1]] !== undefined
        ) {
          return this.content[keys[0]]["next"].getCommand(
            keys.slice(1).join(" "),
            txt + keys[0] + " "
          );
        } else {
          startCommand = true;
        }
      }
      if (startCommand || keys.length === 1) {
        if (
          this.content[keys[0]] === undefined &&
          this.content[keys[0]]["cmd"] === undefined
        ) {
          return null;
        }
        commandText = txt + keys[0];
        return {
          cmd: this.content[keys[0]]["cmd"],
          txt: commandText,
        };
      }
      return null;
    }
    return {
      cmd: command,
      txt: "",
    };
  };

  this.doCommand = function (cmd, key) {
    command = cmd;
    let keys = key.split(" ");

    if (!keepCommand || key === "") {
      if (keys.length > 1) {
        command = this.getCommand(this.formatKey(keys.join(" ")));
        if (command !== null) {
          keepCommand = command(keys[0]);
        }
        this.doCommand(command, keys.slice(1).join(" "));
      }
      return;
    }

    if (keepCommand) {
      keepCommand = startCommand = command(keys[0]);
    }
    this.doCommand(command, keys.slice(1).join(" "));
  };

  this.getContent = function () {
    return this.content;
  };

  this.setKeepCommand = function (keep) {
    keepCommand = keep;
  };

  this.formatKey = function (key) {
    var noPunctuation = key.replace(/[.,/#!$%^&*?;:{}=\-_`~()]/g, "");
    var finalNoPunc = noPunctuation.replace(/\s{2,}/g, " ");
    return finalNoPunc.toLowerCase();
  };
}
