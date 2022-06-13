import "../styles/step2.scss";
import { Component } from "react";
import { Link } from "react-router-dom";

export default class Step2 extends Component {
  render() {
    return (
      <div className="step2_cont">
        <div>
          <table>
            <tbody>
              <h2>1. Product Category</h2>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="correct"
                    name="prod_cats"
                    defaultChecked="checked"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input type="radio" className="incorrect" name="prod_cats" />
                  <label htmlFor="pc_incorrect">Incorrect</label>
                </td>
                <td>
                  <div>
                    <strong>Category:</strong> Stuff {">"} Sub-Stuff
                  </div>
                </td>
              </tr>

              <h2>2. Are these attributes correct?</h2>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="correct"
                    name="prod_dims"
                    defaultChecked="checked"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input type="radio" className="incorrect" name="prod_dims" />
                  <label htmlFor="pc_incorrect">Incorrect</label>
                </td>
                <td>
                  <div>
                    <strong>Dimensions:</strong> 20" W x 20" D x 53" H
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="correct"
                    name="prod_color"
                    defaultChecked="checked"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input type="radio" className="incorrect" name="prod_color" />
                  <label htmlFor="pc_incorrect">Incorrect</label>
                </td>
                <td>
                  <div>
                    <strong>Color:</strong> Green
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="correct"
                    name="prod_material"
                    defaultChecked="checked"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input
                    type="radio"
                    className="incorrect"
                    name="prod_material"
                  />
                  <label htmlFor="pc_incorrect">Incorrect</label>
                </td>
                <td>
                  <div>
                    <strong>Material:</strong> Wood
                  </div>
                </td>
              </tr>

              <h2>3. Do these images match the product?</h2>
              <tr>
                <td>
                  <input
                    type="radio"
                    className="correct"
                    name="prod_img"
                    defaultChecked="checked"
                  />
                  <label htmlFor="pc_correct">Correct</label>
                  <input type="radio" className="incorrect" name="prod_img" />
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
