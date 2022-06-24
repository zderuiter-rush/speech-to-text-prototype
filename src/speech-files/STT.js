import { getCredentials } from "./key_util";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { startVerification } from "./commandTree/step2Commands";
import { startInspection } from "./commandTree/step3Commands";

const speechsdk = require("microsoft-cognitiveservices-speech-sdk");
const { wordsToNumbers } = require("words-to-numbers");

const $ = (s, o = document) => o.querySelector(s);
const baseURL = "http://localhost:3000/";
// const baseURL = "https://sheltered-plateau-09726.herokuapp.com/";

// Speech to text setup
var startSTT = false;

// timer for speech to text to make sure it doesn't keep recording indefinitely
// change timerOn to true to turn on timer
var sttTimer = null;
var sttInterval = 5000;
var timerOn = false;

export const commandTree = {
  command: null,
  commandText: null,
  root: null,
  reset: () => {
    commandTree.command = null;
    commandTree.commandText = null;
    if (commandTree.root !== null) {
      commandTree.root.setKeepCommand(false);
    }
  },
  handleRecognizedSpeech: (key) => {
    commandTree.command = commandTree.root.getCommand(
      commandTree.root.formatKey(key),
      ""
    );

    if (
      !speech.paused ||
      (speech.paused && commandTree.command["txt"] === "control voice")
    ) {
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
    }
  },
};

export const speech = {
  speechConfig: null,
  audioInConfig: null,
  audioOutConfig: null,
  recognizer: null,
  synthesizer: null,
  paused: false,
  initialize: (key, region) => {
    speech.speechConfig = speechsdk.SpeechConfig.fromSubscription(key, region);
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
  start: async () => {
    speech.recognizer.recognized = speech.recognized;
    speech.recognizer.recognizing = speech.recognizing;
    speech.recognizer.canceled = speech.canceled;
    await speech.recognizer.startContinuousRecognitionAsync();
    $(".speechtext").innerHTML = "Start talking and it will appear here!";
  },
  recognized: (s, e) => {
    if (e.result.reason === ResultReason.NoMatch) {
      $(".speechtext").innerHTML = "Please speak louder or more clearly...";
    } else {
      $(".speechtext").innerHTML = e.result.text;
      if (timerOn && !speech.paused && startSTT) {
        sttTimer = setTimeout(sttFromMic, sttInterval);
      }
      commandTree.handleRecognizedSpeech(e.result.text);
    }
  },
  recognizing: (s, e) => {
    if (timerOn && !speech.paused && startSTT) clearTimeout(sttTimer);
    $(".speechtext").innerHTML = e.result.text;
  },
  canceled: (s, e) => {
    var str = "(cancel) Reason: " + speechsdk.CancellationReason[e.reason];
    if (e.reason === speechsdk.CancellationReason.Error) {
      str += ": " + e.errorDetails;
    }
    console.log(str);
  },
  stop: async () => {
    await speech.recognizer.stopContinuousRecognitionAsync();
    speech.recognizer.close();
    speech.recognizer = null;
    // speech.audioInConfig.close();
    // speech.audioInConfig = null;
    // speech.speechConfig.close();
    // speech.speechConfig = null;
  },
  synthesize: async (text, rate = 1.5, close = false) => {
    await speech.synthesizer.speakSsmlAsync(
      speech.createSsml(text, rate),
      (result) => {
        if (result) {
          if (close) {
            speech.synthesizer.close();
            speech.synthesizer = null;
            // speech.audioOutConfig.close();
            // speech.audioOutConfig = null;
          }
          return result.audioData;
        }
      },
      (error) => {
        console.log(error);
        speech.synthesizer.close();
        speech.synthesizer = null;
        // speech.audioOutConfig.close();
        // speech.audioOutConfig = null;
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
    await speech.synthesize("Voice ended.", 1.5, false);
    commandTree.reset();
    await speech.stop();
    if (timerOn) clearTimeout(sttTimer);
    return;
  }

  const cred = await getCredentials();

  speech.initialize(cred.key, cred.region);
  await speech.start();

  if (timerOn) sttTimer = setTimeout(sttFromMic, sttInterval);

  startPage();
}

export async function startPage() {
  if (startSTT) {
    await speech.synthesize("You are now on");
    const route = window.location.href.replace(baseURL, "");
    switch (route) {
      case "1":
        await speech.synthesize("Recieve Products Page.");
        break;
      case "2":
        await speech.synthesize("Verification Page.");
        startVerification();
        break;
      case "3":
        await speech.synthesize("Product Inspection Page.");
        startInspection();
        break;
      case "command-list":
        await speech.synthesize("Command List Page");
        break;
      default:
        await speech.synthesize("Home Page.");
        break;
    }
  }
}

export function controlVoice(cmd) {
  if (cmd.toLowerCase().includes("pause")) {
    speech.paused = true;
    if (timerOn) {
      clearTimeout(sttTimer);
      sttTimer = setTimeout(sttFromMic, sttInterval);
    }
    speech.synthesize("Voice paused");
    return false;
  }
  if (cmd.toLowerCase().includes("resume")) {
    speech.paused = false;
    if (timerOn) {
      clearTimeout(sttTimer);
      sttTimer = setTimeout(sttFromMic, sttInterval);
    }
    speech.synthesize("Voice resumed");
    return false;
  }
  if (cmd.toLowerCase().includes("stop")) {
    sttFromMic();
    return false;
  }
  return true;
}

export function timer(on) {
  timerOn = on;
  clearTimeout(sttTimer);
  if (on) {
    sttTimer = setTimeout(sttFromMic, sttInterval);
  }
}
