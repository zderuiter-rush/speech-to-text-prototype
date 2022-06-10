import "../styles/page1.scss";
import { Component } from "react";
import { Link } from "react-router-dom";

export default class Page1 extends Component {
  render() {
    return (
      <div className="stuff1container">
        <div className="stuff1">STUFF1</div>
        <Link className="prevpage" to="/">
          Prev Page
        </Link>
      </div>
    );
  }
}
