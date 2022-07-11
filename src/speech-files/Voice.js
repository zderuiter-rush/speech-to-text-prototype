import { getCredentials } from "./key_util";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { commandTree } from "./commandTree";
// import { startVerification } from "./commandTree/step2Commands";
import { startSection } from "./step3Commands";

// speech sdk and library to turn words to numbers
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

// query select because jQuery is weird
const $ = (s, o = document) => o.querySelector(s);

// IGNORE THESE, THEY WERE USED WHEN THERE WERE MULTIPLE PAGES THAT
// NEEDED VOICE
// const baseURL = "http://localhost:3000/";
// const baseURL = "https://sheltered-plateau-09726.herokuapp.com/";

// variable used to toggle Voice on/off
var startVoice = false;

// timer for speech to text to make sure it doesn't keep recording indefinitely
var sttTimer = null;

// timer interval (currently 5 seconds for testing/show casing, will be more for actual use)
var sttInterval = 5000;

// used right now for development, won't be needed in actual use since timer will always be used
var timerOn = false;

export const speech = {
  speechConfig: null,
  audioInConfig: null,
  audioOutConfig: null,
  recognizer: null,
  phraseList: null,
  synthesizer: null,
  paused: false,
  textQueue: [],
  rateQueue: [],
  player: null,
  playing: false,
  initialize: async (key, region) => {
    speech.speechConfig = speechsdk.SpeechConfig.fromSubscription(key, region);
    speech.audioInConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    speech.recognizer = new speechsdk.SpeechRecognizer(speech.speechConfig);
    speech.phraseList = speechsdk.PhraseListGrammar.fromRecognizer(
      speech.recognizer
    );
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
      if (timerOn && !speech.paused && startVoice) {
        sttTimer = setTimeout(voiceTimeout, sttInterval);
      }
      commandTree.handleRecognizedSpeech(e.result.text, speech.paused);
    }
  },
  recognizing: (s, e) => {
    if (timerOn && !speech.paused && startVoice) clearTimeout(sttTimer);
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
  },
  addToQueue: (text, rate = 1.5) => {
    speech.textQueue.push(text);
    speech.rateQueue.push(rate);
    if (
      speech.textQueue.length === 1 &&
      speech.rateQueue.length === 1 &&
      !speech.playing
    ) {
      speech.playing = true;
      speech.synthesize(speech.textQueue.shift(), speech.rateQueue.shift());
    }
  },
  synthesize: async (text, rate = 1.5) => {
    speech.player = new speechsdk.SpeakerAudioDestination();
    speech.player.onAudioEnd = function (_) {
      speech.player.close();
      if (speech.textQueue.length > 0 && speech.rateQueue.length > 0) {
        speech.synthesize(speech.textQueue.shift(), speech.rateQueue.shift());
      } else {
        speech.playing = false;
      }
    };
    speech.audioOutConfig = speechsdk.AudioConfig.fromSpeakerOutput(
      speech.player
    );

    speech.synthesizer = new speechsdk.SpeechSynthesizer(
      speech.speechConfig,
      speech.audioOutConfig
    );

    await speech.synthesizer.speakSsmlAsync(
      speech.createSsml(text, rate),
      (result) => {
        if (result) {
          speech.synthesizer.close();
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

function voiceTimeout() {
  speech.addToQueue("Are you still there?");
  clearTimeout(sttTimer);
  sttTimer = setTimeout(toggleVoice, 15000);
}

export async function toggleVoice(stop = false) {
  if (!startVoice && stop) return;
  startVoice = !startVoice;
  if (!startVoice) {
    speech.addToQueue("Voice ended.");
    commandTree.reset();
    await speech.stop();
    if (timerOn) clearTimeout(sttTimer);
    return;
  }

  const cred = await getCredentials();

  await speech.initialize(cred.key, cred.region);

  if (timerOn) sttTimer = setTimeout(voiceTimeout, sttInterval);

  startPage();
}

export async function startPage() {
  if (startVoice) {
    speech.addToQueue("Product Inspection Page.");
    startSection();

    // const route = window.location.href.replace(baseURL, "");
    // switch (route) {
    //   // case "1":
    //   //   speech.addToQueue("Recieve Products Page.");
    //   //   break;
    //   // case "2":
    //   //   speech.addToQueue("Verification Page.");
    //   //   startVerification();
    //   //   break;
    //   // case "3":
    //   //   speech.addToQueue("Product Inspection Page.");
    //   //   startSection();
    //   //   break;
    //   case "command-list":
    //     speech.addToQueue("Command List Page");
    //     break;
    //   default:
    //     speech.addToQueue("Product Inspection Page.");
    //     startSection();
    //     break;
    // }
  }
}

export function controlVoice(cmd) {
  if (cmd.toLowerCase().includes("pause")) {
    speech.paused = true;
    if (timerOn) {
      clearTimeout(sttTimer);
      sttTimer = setTimeout(voiceTimeout, sttInterval);
    }
    speech.addToQueue("Voice paused");
    return false;
  }
  if (cmd.toLowerCase().includes("resume")) {
    speech.paused = false;
    if (timerOn) {
      clearTimeout(sttTimer);
      sttTimer = setTimeout(voiceTimeout, sttInterval);
    }
    speech.addToQueue("Voice resumed");
    return false;
  }
  if (cmd.toLowerCase().includes("stop")) {
    toggleVoice();
    return false;
  }
  return true;
}

export function timer(on) {
  timerOn = on;
  clearTimeout(sttTimer);
  if (on) {
    sttTimer = setTimeout(voiceTimeout, sttInterval);
  }
}

export function resetPhrases(lists) {
  speech.phraseList.clear();
  lists.forEach(function (phrases) {
    speech.phraseList.addPhrases(phrases);
  });
}
