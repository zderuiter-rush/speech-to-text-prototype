export default function HashTableNode() {
  var content = {};
  var command = null;
  var keepCommand = false;
  var startCommand = false;

  this.add = function (key, funcValue) {
    let keys = key.split(" ");
    if (keys.length > 1) {
      if (!content.hasOwnProperty(keys[0])) {
        content[keys[0]] = {};
        content[keys[0]][0] = new HashTableNode();
      }
      content[keys[0]][0].add(keys.slice(1).join(" "), funcValue);
    } else {
      content[keys[0]] = {};
      content[keys[0]][1] = funcValue;
    }
  };

  this.getCommand = function (key) {
    let keys = key.split(" ");
    if (!keepCommand) {
      if (keys.length > 1) {
        if (content[keys[0]] === undefined) {
          return this.getCommand(keys.slice(1).join(" "));
        } else if (
          content[keys[0]][0] !== undefined &&
          content[keys[0]][0].getContent()[keys[1]] !== undefined
        ) {
          return content[keys[0]][0].getCommand(keys.slice(1).join(" "));
        } else {
          startCommand = true;
        }
      }
      if (startCommand || keys.length === 1) {
        if (
          content[keys[0]] === undefined &&
          content[keys[0]][1] === undefined
        ) {
          return null;
        }
        return content[keys[0]][1];
      }
      return null;
    }
    return command;
  };

  this.doCommand = function (cmd, key) {
    command = cmd;
    if (command === null || key === "") {
      return;
    }

    let keys = key.split(" ");
    if (keepCommand) {
      keepCommand = startCommand = command(keys[0]);
      if (!keepCommand) {
        if (keys.length > 1) {
          keys = keys.slice(1);
          command = this.getCommand(keys.join(" "));
          keepCommand = startCommand = command(keys[0]);
          this.doCommand(command, keys.slice(1).join(" "));
        }
      } else {
        this.doCommand(command, keys.slice(1).join(" "));
      }
    }
  };

  this.getContent = function () {
    return content;
  };

  this.setKeepCommand = function (keep) {
    keepCommand = keep;
  };
}
