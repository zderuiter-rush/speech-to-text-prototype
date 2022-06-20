import "../styles/navbar.scss";
import { Link } from "react-router-dom";
import { Component } from "react";
import { ReactComponent as Logo } from "../icons/RushMarketLogo.svg";

export default class Navbar extends Component {
  render() {
    return (
      <header>
        <Link className="logocontainer" to="/">
          <Logo className="logo" />
        </Link>
        <nav className="nav">
          <ul>
            <li>
              <Link className="link" to="/1">
                Step 1
              </Link>
            </li>
            <li>
              <Link className="link" to="/2">
                Step 2
              </Link>
            </li>
            <li>
              <Link className="link" to="/3">
                Step 3
              </Link>
            </li>
            <li>
              <Link className="link" to="/command-list">
                Command List
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}
