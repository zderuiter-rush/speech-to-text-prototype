import React from "react";
import { sttFromMic } from "../speech-files/STT";
import "../styles/speechtext.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneLines } from "@fortawesome/free-solid-svg-icons";

export default class SpeechText extends React.Component {
  async componentDidMount() {}

  render() {
    return (
      <div className="speechtextcontainer">
        <FontAwesomeIcon
          className="speechbutton"
          icon={faMicrophoneLines}
          onClick={sttFromMic}
        />
        <div className="speechtext">Speech will go here...</div>
      </div>
    );
  }
}
