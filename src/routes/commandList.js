import { Component } from "react";
import "../styles/commandList.scss";
import { timer } from "../speech-files/STT";
import { commandTree } from "../speech-files/STT";

const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => o.querySelectorAll(s);

export default class CommandList extends Component {
  componentDidMount() {
    commandTree.root = null;
    $$(".container").forEach(function (container) {
      container.addEventListener("click", function () {
        $(".commands", container).classList.toggle("expand");
      });
    });

    $$(".timer").forEach(function (opt) {
      opt.addEventListener("change", function () {
        if ($(".timer.on").checked) {
          timer(true);
        } else {
          timer(false);
        }
      });
    });
  }

  render() {
    return (
      <div className="commandList_cont">
        <div>
          <table className="timerTable">
            <tbody>
              <tr>
                <td>
                  <h4>Set Timer</h4>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="radio" className="timer on" name="sttTimer" />
                  <label>On</label>
                  <input
                    type="radio"
                    className="timer off"
                    name="sttTimer"
                    defaultChecked
                  />
                  <label>Off</label>
                </td>
              </tr>
            </tbody>
          </table>

          <h5>
            <a
              href="https://github.com/zderuiter-rush/speech-to-text-prototype"
              target="_blank"
              rel="noreferrer"
            >
              <i>Click here to see full list of commands and documentation</i>
            </a>
          </h5>
          <div className="container">
            <h2 className="title">Every Page Commands</h2>
            <ul className="commands">
              <li>
                <strong>Next/Previous Page:</strong> if the page has the button,
                this will navigate you to the next/previous page
              </li>
              <li>
                <strong>Control Voice:</strong> then say...
                <ul>
                  <li>
                    <strong>Pause:</strong> stop voice from executing commands
                  </li>
                  <li>
                    <strong>Resume:</strong> have voice resume executing
                    commands
                  </li>
                  <li>
                    <strong>Stop:</strong> end voice altogether
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="container">
            <h2 className="title">Home Page Commands</h2>
            <ul className="commands">
              <li>
                <strong>Length:</strong> the next number said will fill in the
                Length field
              </li>
              <li>
                <strong>Depth:</strong> the next number said will fill in the
                Depth field
              </li>
              <li>
                <strong>Height:</strong> the next number said will fill in the
                Height field
              </li>
              <li>
                <strong>Add Note:</strong> say anything and it will be added to
                the Notes field
                <ul>
                  <li>
                    <strong>End Note(s):</strong> this command will stop adding
                    what you say to the Notes field
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="container">
            <h2 className="title">Step 1 Commands</h2>
            <ul className="commands">
              <li>
                <strong>Supplier Code:</strong> then say the supplier Code
                <ul>
                  <li>
                    <strong>*Warning*</strong> this command is still being
                    worked on and does not currently perform enitirely correctly
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="container">
            <h2 className="title">Step 2 Commmands</h2>
            <ul className="commands">
              <li>
                <strong>Correct, Yes, Yep, Yeah:</strong> these commands will
                mark "Correct" for the section you are currently on
              </li>
              <li>
                <strong>No, Incorrect, Wrong:</strong> these commands will mark
                "Incorrect" for the section you are currently on
              </li>
              <li>
                <strong>Verify All:</strong> mark correct for everything in the
                page
              </li>
              <li>
                <strong>Add Note:</strong> say anything and it will be added to
                the Notes field
                <ul>
                  <li>
                    <strong>End Note(s):</strong> this command will stop adding
                    what you say to the Notes field
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="container">
            <h2 className="title">Step 3 Commands</h2>
            <ul className="commands">
              <li>
                <strong>Correct, Yes, Yep, Yeah:</strong> these commands will
                mark "Yes" for the section you are currently on
              </li>
              <li>
                <strong>No, Incorrect, Wrong:</strong> these commands will mark
                "No" for the section you are currently on
              </li>
              <li>
                <strong>Weight:</strong> change the weight if you are on the Box
                Dimensions and Weights section
              </li>
              <li>
                <strong>Dimensions:</strong> then say the 3 dimensions, in no
                particular order, and they will be added to the box dimensions
              </li>
              <li>
                <strong>New, Like New, Damaged, Trash:</strong> mark the
                respective button in the product condition section
              </li>
              <li>
                <i>If the product is damaged...</i>
                <ul>
                  <li>
                    <strong>No, Some, Most:</strong> mark the respective choice
                    for if the product is missing parts
                  </li>
                  <li>
                    <strong>Top, Front, Corner, Sides:</strong> mark said choice
                    for where the damage is
                  </li>
                  <li>
                    <strong>Bottom, Back:</strong> mark said choice for where
                    the damage is
                  </li>
                  <li>
                    <strong>Interior:</strong> mark said choice for where the
                    damage is
                  </li>
                  <li>
                    <strong>Clearly Visible, Hidden:</strong> mark the
                    respective choice for how visible the damage is
                  </li>
                  <li>
                    <strong>Minor, Moderate, Considerable:</strong> mark the
                    respective choise for how sever the damage is
                  </li>
                </ul>
              </li>
              <li>
                <strong>Add Note:</strong> say anything and it will be added to
                the Notes field
                <ul>
                  <li>
                    <strong>End Note(s):</strong> this command will stop adding
                    what you say to the Notes field
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
