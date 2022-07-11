import { Component } from "react";
import { toggleVoice } from "../speech-files/Voice";
import "../styles/speechtext.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneLines } from "@fortawesome/free-solid-svg-icons";

/**
 * Simple bar at top of page to display whatever is spoken.
 * When the microphone icon is clicked, it starts/stops Voice
 */
export default class SpeechText extends Component {
  componentDidMount() {
    document.querySelector(".speechbutton").addEventListener("click", () => {
      toggleVoice();
    });
  }

  render() {
    return (
      <div className="speechtextcontainer">
        <FontAwesomeIcon className="speechbutton" icon={faMicrophoneLines} />
        <div className="speechtext">Speech will go here...</div>
      </div>
    );
  }
}
