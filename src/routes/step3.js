import { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/step3.scss";

export default class Step3 extends Component {
  render() {
    return (
      <div className="step3_cont">
        <table>
          <tbody>
            <tr>
              <td>
                <h2>Is the item in original packaging?</h2>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="radio"
                  className="yes_pack"
                  name="og_pack"
                  defaultChecked="checked"
                />
                <label htmlFor="pc_correct">Yes</label>
                <input type="radio" className="no_pack" name="og_pack" />
                <label htmlFor="pc_incorrect">No</label>
              </td>
            </tr>

            <tr>
              <td>
                <h2>Can the package be reused for shipping?</h2>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="radio"
                  className="yes_reuse"
                  name="reuse_ship"
                  defaultChecked="checked"
                />
                <label htmlFor="pc_correct">Yes</label>
                <input type="radio" className="no_reuse" name="reuse_ship" />
                <label htmlFor="pc_incorrect">No</label>
              </td>
            </tr>

            <tr>
              <td>
                <h3>Box Dimensions {"&"} Weights</h3>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="box_weight">Weight: </label>
                <input type="text" className="box_weight input" />{" "}
                <label className="box_weight label">20</label> lbs.
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="box_length">Length: </label>
                <input type="text" className="box_length input" />{" "}
                <label className="box_length label">20</label> in.
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="box_depth">Depth: </label>
                <input type="text" className="box_depth input" />{" "}
                <label className="box_depth label">20</label> in.
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="box_height">Height: </label>
                <input type="text" className="box_height input" />{" "}
                <label className="box_height label">20</label> in.
              </td>
            </tr>
            <br />

            <tr>
              <td>
                <h2>What is the product condition?</h2>
              </td>
            </tr>
            <tr>
              <td>
                <input type="radio" className="new_cond" name="prod_cond" />
                <label htmlFor="pc_correct">New</label>
                <input
                  type="radio"
                  className="lnew_cond"
                  name="prod_cond"
                  defaultChecked
                />
                <label htmlFor="pc_incorrect">Like New</label>
                <input type="radio" className="dmg_cond" name="prod_cond" />
                <label htmlFor="pc_incorrect">
                  Damaged and/or Missing Parts
                </label>
                <input type="radio" className="trash_cond" name="prod_cond" />
                <label htmlFor="pc_incorrect">Trash</label>
              </td>
            </tr>

            <tr>
              <td>
                <h2>Is the product missing parts?</h2>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="radio"
                  className="no_miss"
                  name="prod_miss"
                  defaultChecked
                />
                <label htmlFor="pc_correct">No</label>
                <input type="radio" className="some_miss" name="prod_miss" />
                <label htmlFor="pc_incorrect">Some/Few</label>
                <input type="radio" className="most_miss" name="prod_miss" />
                <label htmlFor="pc_incorrect">Most/All</label>
              </td>
            </tr>

            <tr>
              <td>
                <h2>
                  Where is the damage? <i>Check all that apply</i>
                </h2>
              </td>
            </tr>
            <tr>
              <td>
                <input type="radio" className="top_dmg" />
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
            <tr>
              <td>
                <input type="radio" className="bot_dmg" />
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
            <tr>
              <td>
                <input type="radio" className="int_dmg" />
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
            <br />
            <tr>
              <td>
                <div className="add_dmg_img">
                  <div>Place to add image...</div>
                  <div>But not really...</div>
                </div>
              </td>
            </tr>
            <br />

            <tr>
              <td>
                <label htmlFor="add_notes">Add Notes:</label>
                <div>
                  <textarea className="add_notes"></textarea>
                </div>
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
