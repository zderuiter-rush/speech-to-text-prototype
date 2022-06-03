import { getTokenOrRefresh } from "./token_util";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { root } from "./commandTree/commands";

const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

// HTML handling setup
const $ = (s, o = document) => o.querySelector(s);

// Speech to text setup
var startSTT = false;
// var keepCommand = false;
var command = null;
var recognizedSpeech = "";

var speech = {
  speechConfig: null,
  audioConfig: null,
  recognizer: null,
  initialize: (authToken, region) => {
    speech.speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      authToken,
      region
    );
    speech.audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    speech.recognizer = new speechsdk.SpeechRecognizer(
      speech.speechConfig,
      speech.audioConfig
    );
  },
  start: () => {
    speech.recognizer.recognized = speech.recognized;
    speech.recognizer.recognizing = speech.recognizing;
    speech.recognizer.startContinuousRecognitionAsync();
  },
  recognized: (s, e) => {
    if (e.result.reason === ResultReason.NoMatch) {
      $(".speechtext").innerHTML = "Please speak louder or more clearly...";
    } else {
      $(".speechtext").innerHTML = recognizedSpeech = e.result.text;

      var keys = e.result.text.split(" ");

      command = root.getCommand(root.formatKey(e.result.text));
      if (command !== null) {
        root.setKeepCommand(command(keys[0]));
      }
      root.doCommand(command, keys.slice(1).join(" "));
    }
  },
  recognizing: (s, e) => {
    $(".speechtext").innerHTML = e.result.text;
  },
  stop: () => {
    speech.recognizer.stopContinuousRecognitionAsync();
  },
};

export async function sttFromMic() {
  startSTT = !startSTT;
  if (!startSTT) {
    speech.stop();
    return;
  }

  const tokenObj = await getTokenOrRefresh();

  speech.initialize(tokenObj.authToken, tokenObj.region);
  speech.start();
}

export function getRecognizedSpeech() {
  return recognizedSpeech;
}
