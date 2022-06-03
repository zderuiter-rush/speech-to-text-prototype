import { Component } from "react";
import "../styles/home.scss";

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <div className="dimensions">
          <form className="form lform">
            <div>
              <label htmlFor="length">Length: </label>
              <input className="length input" type="text"></input>
            </div>
            <div className="length result"></div>
          </form>
          <form className="form wform">
            <div>
              <label htmlFor="depth">Depth: </label>
              <input className="depth input" type="text"></input>
            </div>
            <div className="depth result"></div>
          </form>
          <form className="form hform">
            <div>
              <label htmlFor="height">Height: </label>
              <input className="height input" type="text"></input>
            </div>
            <div className="height result"></div>
          </form>
        </div>
        <div className="damages">
          <label htmlFor="damagedetails">Damages:</label>
          <textarea className="damagedetails"></textarea>
        </div>
      </div>
    );
  }
}
