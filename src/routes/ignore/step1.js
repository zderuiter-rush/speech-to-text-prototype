import { Component } from "react";
import { Link } from "react-router-dom";
import { commandTree, startPage } from "../speech-files/STT";
import { root } from "../speech-files/commandTree/step1Commands";
import "../styles/step1.scss";
import $ from "jquery";
import "select2";
import "select2/dist/css/select2.css";

export default class Step1 extends Component {
  componentDidMount() {
    commandTree.root = root;
    $(function () {
      $(".suppliercodes").select2({
        placeholder: "Select Supplier Code",
      });
    });
    startPage();
  }

  render() {
    return (
      <div className="step1_cont">
        <div>
          <label htmlFor="suppliercodes">
            Supplier Code:
            <select className="suppliercodes" multiple>
              <option value="4DC01-QVC">4DC01-QVC</option>
              <option value="4DC01-HYN">4DC01-HYN</option>
              <option value="4DC01-RM">4DC01-RM</option>
              <option value="7HV01">7HV01</option>
              <option value="7HV01-BO">7HV01-BO</option>
              <option value="7HV01-BR">7HV01-BR</option>
            </select>
          </label>
        </div>
        <div>
          <Link className="prevpage" to="/">
            Prev Page
          </Link>
          <Link className="nextpage" to="/2">
            Next Page
          </Link>
        </div>
      </div>
    );
  }
}
