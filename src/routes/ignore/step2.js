import "../styles/step2.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
import { commandTree, startPage } from "../speech-files/STT";
import { root } from "../speech-files/commandTree/step2Commands";

const $ = (s, o = document) => o.querySelector(s);

export default class Step2 extends Component {
  async componentDidMount() {
    commandTree.root = root;

    $(".pdim.incorrect").addEventListener("click", function (e) {
      $(".correct_dims").style.display = "block";
    });
    $(".pdim.correct").addEventListener("click", function (e) {
      $(".correct_dims").style.display = "none";
    });

    startPage();
  }

  render() {
    return (
      <div className="step2_cont">
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <h2>1. Product Category</h2>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="pcat correct"
                    name="prod_cats"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input
                    type="radio"
                    className="pcat incorrect"
                    name="prod_cats"
                  />
                  <label htmlFor="pc_incorrect">Incorrect</label>
                </td>
                <td>
                  <div className="category">
                    <strong>Category:</strong> Stuff {">"} Sub-Stuff
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <h2>2. Are these attributes correct?</h2>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="pdim correct"
                    name="prod_dims"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input
                    type="radio"
                    className="pdim incorrect"
                    name="prod_dims"
                  />
                  <label htmlFor="pc_incorrect">Incorrect</label>
                </td>
                <td>
                  <div className="dimensions">
                    <strong>Dimensions:</strong> 20" W x 20" D x 53" H
                  </div>
                </td>
              </tr>
              <tr className="correct_dims">
                <td>
                  <div>Correct Dimensions? (inches)</div>
                </td>
                <td className="cd w"></td>
                <td className="wdhx">W x </td>
                <td className="cd d"></td>
                <td className="wdhx">D x </td>
                <td className="cd h"></td>
                <td className="wdhx">H</td>
              </tr>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="pclr correct"
                    name="prod_color"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input
                    type="radio"
                    className="pclr incorrect"
                    name="prod_color"
                  />
                  <label htmlFor="pc_incorrect">Incorrect</label>
                </td>
                <td>
                  <div className="color">
                    <strong>Color:</strong> Green
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="pmat correct"
                    name="prod_material"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input
                    type="radio"
                    className="pmat incorrect"
                    name="prod_material"
                  />
                  <label htmlFor="pc_incorrect">Incorrect</label>
                </td>
                <td>
                  <div className="material">
                    <strong>Material:</strong> Wood
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <h2>3. Do these images match the product?</h2>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="pimg correct"
                    name="prod_img"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input
                    type="radio"
                    className="pimg incorrect"
                    name="prod_img"
                  />
                  <label htmlFor="pc_incorrect">Incorrect</label>
                </td>
                <td>
                  <div>
                    <img
                      width="35%"
                      src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Stuff.co.nz_as_of_the_30th_of_May_2022.jpg"
                      alt="stuff"
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <h2>4. Market Images</h2>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="add_dmg_img">
                    <div>Place to add image...</div>
                    <div>But not really...</div>
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <h2>5. Add Notes</h2>
                </td>
              </tr>
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
        </div>
        <Link className="prevpage" to="/1">
          Prev Page
        </Link>
        <Link className="nextpage" to="/3">
          Next Page
        </Link>
      </div>
    );
  }
}
