import { getTokenOrRefresh } from "./token_util";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { startVerification } from "./commandTree/step2Commands";
import { startInspection } from "./commandTree/step3Commands";

const speechsdk = require("microsoft-cognitiveservices-speech-sdk");
const { wordsToNumbers } = require("words-to-numbers");
const $ = (s, o = document) => o.querySelector(s);
const baseURL = "http://localhost:3000/";

// Speech to text setup
var startSTT = false;

export const commandTree = {
  command: null,
  commandText: null,
  root: null,
  reset: () => {
    commandTree.command = null;
    commandTree.commandText = null;
    commandTree.root.setKeepCommand(false);
  },
  handleRecognizedSpeech: (key) => {
    commandTree.command = commandTree.root.getCommand(
      commandTree.root.formatKey(key),
      ""
    );

    let keys = null;
    if (commandTree.command["txt"] !== "") {
      let cmdContent = key.substring(
        key.toLowerCase().indexOf(commandTree.command["txt"]) +
          commandTree.command["txt"].length +
          1
      );
      keys = cmdContent.split(" ");
    } else {
      keys = key.split(" ");
    }

    for (let i = 0; i < keys.length; i++) {
      let num = wordsToNumbers(keys[i], { impliedHundreds: true });
      if (/[0-9]*(.[0-9]*)?/.test(num)) {
        keys[i] = num.toString();
      }
    }

    if (commandTree.command[0] !== null) {
      commandTree.root.setKeepCommand(commandTree.command["cmd"](keys[0]));
    }
    commandTree.root.doCommand(
      commandTree.command["cmd"],
      keys.slice(1).join(" ")
    );
  },
};

export const speech = {
  speechConfig: null,
  audioInConfig: null,
  audioOutConfig: null,
  recognizer: null,
  synthesizer: null,
  player: null,
  initialize: (authToken, region) => {
    speech.speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      authToken,
      region
    );
    speech.audioInConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    speech.audioOutConfig = speechsdk.AudioConfig.fromDefaultSpeakerOutput();
    speech.recognizer = new speechsdk.SpeechRecognizer(
      speech.speechConfig,
      speech.audioInConfig
    );
    speech.synthesizer = new speechsdk.SpeechSynthesizer(
      speech.speechConfig,
      speech.audioOutConfig
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
      $(".speechtext").innerHTML = e.result.text;
      commandTree.handleRecognizedSpeech(e.result.text);
    }
  },
  recognizing: (s, e) => {
    $(".speechtext").innerHTML = e.result.text;
  },
  stop: () => {
    speech.recognizer.stopContinuousRecognitionAsync();
  },
  synthesize: (text, rate = 1.5, close = false) => {
    speech.synthesizer.speakSsmlAsync(
      speech.createSsml(text, rate),
      (result) => {
        if (result) {
          if (close) {
            speech.synthesizer.close();
            speech.synthesizer = null;
          }
          return result.audioData;
        }
      },
      (error) => {
        console.log(error);
        speech.synthesizer.close();
      }
    );
  },
  createSsml: (text, rate = 1.5) => {
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-JennyNeural">
          <prosody rate="${rate}">
              ${text}
          </prosody>
        </voice>
      </speak>`;
  },
};

export async function sttFromMic() {
  startSTT = !startSTT;
  if (!startSTT) {
    speech.synthesize("Speech to text has ended.", 1.5, false);
    commandTree.reset();
    speech.stop();
    return;
  }

  const tokenObj = await getTokenOrRefresh();

  speech.initialize(tokenObj.authToken, tokenObj.region);
  speech.start();

  startPage();
}

export async function startPage() {
  if (startSTT) {
    speech.synthesize("You are now on");
    const route = window.location.href.replace(baseURL, "");
    switch (route) {
      case "1":
        speech.synthesize("Recieve Products Page.");
        break;
      case "2":
        speech.synthesize("Verification Page.");
        startVerification();
        break;
      case "3":
        speech.synthesize("Product Inspection Page.");
        startInspection();
        break;
      default:
        speech.synthesize("Home Page.");
        break;
    }
  }
}
