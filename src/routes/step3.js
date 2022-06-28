import "../styles/step3.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
import { commandTree, startPage } from "../speech-files/STT";
import { root } from "../speech-files/commandTree/step3Commands";

const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => o.querySelectorAll(s);

export default class Step3 extends Component {
  async componentDidMount() {
    commandTree.root = root;

    $$(".cond").forEach(function (condChoice) {
      condChoice.addEventListener("click", function () {
        if (condChoice.classList.contains("dmg")) {
          $$(".damaged").forEach(function (element) {
            element.style.display = "block";
          });
        } else {
          $$(".damaged").forEach(function (element) {
            element.style.display = "none";
          });
        }
      });
    });

    $(".cond.trash").addEventListener("change", function () {
      if ($(".cond.trash").checked) {
        $(".add_dmg_img").style.display = "block";
      } else {
        $(".add_dmg_img").style.display = "none";
      }
    });

    $$("._dmg").forEach(function (condChoice) {
      condChoice.addEventListener("change", function () {
        if (condChoice.classList.contains("top")) {
          if (condChoice.checked) {
            $(".top_dmg_det").style.display = "block";
          } else {
            $(".top_dmg_det").style.display = "none";
          }
        } else if (condChoice.classList.contains("bot")) {
          if (condChoice.checked) {
            $(".bot_dmg_det").style.display = "block";
          } else {
            $(".bot_dmg_det").style.display = "none";
          }
        } else {
          if (condChoice.checked) {
            $(".int_dmg_det").style.display = "block";
          } else {
            $(".int_dmg_det").style.display = "none";
          }
        }
      });
    });

    $$(".box.dim").forEach(function (boxDim) {
      boxDim.addEventListener("change", function () {
        let dims = [
          $(".box.dim.l").value,
          $(".box.dim.d").value,
          $(".box.dim.h").value,
        ];
        dims.sort((a, b) => b - a);
        $(".box.dim.l").value = dims[0];
        $(".box.dim.d").value = dims[1];
        $(".box.dim.h").value = dims[2];
      });
    });

    startPage();
  }

  render() {
    return (
      <div className="step3_cont">
        <table>
          <tbody>
            <tr>
              <td>
                <h2 className="isog_pack">
                  Is the item in original packaging?
                </h2>
              </td>
            </tr>
            <tr>
              <td>
                <input type="radio" className="yes_pack" name="og_pack" />
                <label htmlFor="pc_correct">Yes</label>
                <input type="radio" className="no_pack" name="og_pack" />
                <label htmlFor="pc_incorrect">No</label>
              </td>
            </tr>

            <tr>
              <td>
                <h2 className="isreship">
                  Can the package be reused for shipping?
                </h2>
              </td>
            </tr>
            <tr>
              <td>
                <input type="radio" className="yes_reuse" name="reuse_ship" />
                <label htmlFor="pc_correct">Yes</label>
                <input type="radio" className="no_reuse" name="reuse_ship" />
                <label htmlFor="pc_incorrect">No</label>
              </td>
            </tr>

            <tr>
              <td>
                <h3 className="isdims">Box Dimensions and Weights</h3>
              </td>
            </tr>
            <tr>
              <td>
                <label className="box_label w">Weight: </label>
                <input type="text" className="box w" defaultValue="20" />
                <label className="box_weight label">lbs.</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className="box_label l">Longest Side: </label>
                <input type="text" className="box dim l" defaultValue="20" />
                <label className="box_length label">in.</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className="box_label d">2nd Longest Side: </label>
                <input type="text" className="box dim d" defaultValue="20" />
                <label className="box_depth label">in.</label>
              </td>
            </tr>
            <tr>
              <td>
                <label className="box_label h">Shortest Side: </label>
                <input type="text" className="box dim h" defaultValue="20" />
                <label className="box_height label">in.</label>
              </td>
            </tr>

            <tr>
              <td>
                <h2>What is the product condition?</h2>
              </td>
            </tr>
            <tr>
              <td>
                <input type="hidden" className="condChoice" />
                <input type="radio" className="cond new" name="prod_cond" />
                <label htmlFor="pc_correct">New</label>
                <input type="radio" className="cond lnew" name="prod_cond" />
                <label htmlFor="pc_incorrect">Like New</label>
                <input type="radio" className="cond dmg" name="prod_cond" />
                <label htmlFor="pc_incorrect">
                  Damaged and/or Missing Parts
                </label>
                <input type="radio" className="cond trash" name="prod_cond" />
                <label htmlFor="pc_incorrect">Trash</label>
              </td>
            </tr>

            <tr className="damaged">
              <td>
                <h2>Is the product missing parts?</h2>
              </td>
            </tr>
            <tr className="damaged">
              <td>
                <input type="radio" className="no_miss" name="prod_miss" />
                <label htmlFor="pc_correct">No</label>
                <input type="radio" className="some_miss" name="prod_miss" />
                <label htmlFor="pc_incorrect">Some/Few</label>
                <input type="radio" className="most_miss" name="prod_miss" />
                <label htmlFor="pc_incorrect">Most/All</label>
              </td>
            </tr>

            <tr className="damaged">
              <td>
                <h2>
                  Where is the damage? <i>Check all that apply</i>
                </h2>
              </td>
            </tr>
            <tr className="damaged">
              <td>
                <input type="checkbox" className="top _dmg" />
                <label htmlFor="top_dmg">Top, front, corner, sides</label>
              </td>
            </tr>
            <tr className="top_dmg_det">
              <td>
                How visible is the damage?
                <div>
                  <input
                    type="radio"
                    className="top_dmg_vis_cv"
                    name="top_dmg_vis"
                  />
                  <label htmlFor="top_dmg_vis_cv">Clearly Visible</label>
                  <input
                    type="radio"
                    className="top_dmg_vis_h"
                    name="top_dmg_vis"
                  />
                  <label htmlFor="top_dmg_vis_h">Hidden</label>
                </div>
              </td>
              <td>
                How severe is the damage?
                <div>
                  <input
                    type="radio"
                    className="top_dmg_sev_min"
                    name="top_dmg_sev"
                  />
                  <label htmlFor="top_dmg_sev_min">Minor</label>
                  <input
                    type="radio"
                    className="top_dmg_sev_mod"
                    name="top_dmg_sev"
                  />
                  <label htmlFor="top_dmg_sev_mod">Moderate</label>
                  <input
                    type="radio"
                    className="top_dmg_sev_con"
                    name="top_dmg_sev"
                  />
                  <label htmlFor="top_dmg_sev_con">Considerable</label>
                </div>
              </td>
            </tr>
            <tr className="damaged">
              <td>
                <input type="checkbox" className="bot _dmg" />
                <label htmlFor="bot_dmg">Bottom or back</label>
              </td>
            </tr>
            <tr className="bot_dmg_det">
              <td>
                How visible is the damage?
                <div>
                  <input
                    type="radio"
                    className="bot_dmg_vis_cv"
                    name="bot_dmg_vis"
                  />
                  <label htmlFor="bot_dmg_vis_cv">Clearly Visible</label>
                  <input
                    type="radio"
                    className="bot_dmg_vis_h"
                    name="bot_dmg_vis"
                  />
                  <label htmlFor="bot_dmg_vis_h">Hidden</label>
                </div>
              </td>
              <td>
                How severe is the damage?
                <div>
                  <input
                    type="radio"
                    className="bot_dmg_sev_min"
                    name="bot_dmg_sev"
                  />
                  <label htmlFor="bot_dmg_sev_min">Minor</label>
                  <input
                    type="radio"
                    className="bot_dmg_sev_mod"
                    name="bot_dmg_sev"
                  />
                  <label htmlFor="bot_dmg_sev_mod">Moderate</label>
                  <input
                    type="radio"
                    className="bot_dmg_sev_con"
                    name="bot_dmg_sev"
                  />
                  <label htmlFor="bot_dmg_sev_con">Considerable</label>
                </div>
              </td>
            </tr>
            <tr className="damaged">
              <td>
                <input type="checkbox" className="int _dmg" />
                <label htmlFor="int_dmg">Interior</label>
              </td>
            </tr>
            <tr className="int_dmg_det">
              <td>
                How visible is the damage?
                <div>
                  <input
                    type="radio"
                    className="int_dmg_vis_cv"
                    name="int_dmg_vis"
                  />
                  <label htmlFor="int_dmg_vis_cv">Clearly Visible</label>
                  <input
                    type="radio"
                    className="int_dmg_vis_h"
                    name="int_dmg_vis"
                  />
                  <label htmlFor="int_dmg_vis_h">Hidden</label>
                </div>
              </td>
              <td>
                How severe is the damage?
                <div>
                  <input
                    type="radio"
                    className="int_dmg_sev_min"
                    name="int_dmg_sev"
                  />
                  <label htmlFor="int_dmg_sev_min">Minor</label>
                  <input
                    type="radio"
                    className="int_dmg_sev_mod"
                    name="int_dmg_sev"
                  />
                  <label htmlFor="int_dmg_sev_mod">Moderate</label>
                  <input
                    type="radio"
                    className="int_dmg_sev_con"
                    name="int_dmg_sev"
                  />
                  <label htmlFor="int_dmg_sev_con">Considerable</label>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <br />
                <div className="add_dmg_img damaged">
                  <div>Place to add image...</div>
                  <div>But not really...</div>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <h2 className="are_inst_incl">
                  Are there printed assembly instructions included with this
                  product?
                </h2>
              </td>
            </tr>
            <tr>
              <td>
                <input type="radio" className="yes_instr" name="assem_instr" />
                <label htmlFor="pc_correct">Yes</label>
                <input type="radio" className="no_instr" name="assem_instr" />
                <label htmlFor="pc_incorrect">No</label>
              </td>
            </tr>

            <tr>
              <td>
                <br />
                <br />
                <label htmlFor="add_notes">Add Notes:</label>
                <div>
                  <textarea className="add_notes"></textarea>
                </div>
                <br />
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <td>
                <h2>Location</h2>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="l_area">Area</label>
                <div>
                  <input type="text" className="l_area" />
                </div>
                <br />
                <br />
              </td>
              <td>
                <label htmlFor="l_zone">Zone</label>
                <div>
                  <input type="text" className="l_zone" />
                </div>
                <br />
                <br />
              </td>
              <td>
                <label htmlFor="l_loc">Location</label>
                <div>
                  <input type="text" className="l_loc" />
                </div>
                <br />
                <br />
              </td>
              <td>
                <strong> -OR- </strong>
                <br />
                <br />
              </td>
              <td>
                <label htmlFor="l_pallet">Pallet</label>
                <div>
                  <input type="text" className="l_pallet" />
                </div>
                <br />
                <br />
              </td>
            </tr>
          </tbody>
        </table>
        <Link className="prevpage" to="/2">
          Prev Page
        </Link>
        <button className="pseudo_save">Pseudo Save</button>
      </div>
    );
  }
}
