import { getCredentials } from "./key_util";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { commandTree } from "./commandTree";
// import { startVerification } from "./commandTree/step2Commands";
import { startSection } from "./inspection/inspectionProcess";

// speech sdk and library to turn words to numbers
const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

// query select because jQuery is weird
const $ = (s, o = document) => o.querySelector(s);

// IGNORE THESE, THEY WERE USED WHEN THERE WERE MULTIPLE PAGES THAT NEEDED VOICE
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

/**
 * speech class to control all speech related functions (init, stop, synthesize text to speech)
 */
export const speech = {
  // vars used for all functions
  // configs
  speechConfig: null,
  audioInConfig: null,
  audioOutConfig: null,
  // recognizer vars
  recognizer: null,
  // phraseList: null,
  // synthesizer vars
  synthesizer: null,
  paused: false,
  textQueue: [],
  rateQueue: [],
  player: null,
  playing: false,

  /**
   * Initialize all speech recognizer things and start continuous recognition
   *
   * @param {String} key Azure subscription key
   * @param {String} region Azure subscriptoin region
   */
  initialize: async (key, region) => {
    speech.speechConfig = speechsdk.SpeechConfig.fromSubscription(key, region);
    speech.audioInConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    speech.recognizer = new speechsdk.SpeechRecognizer(speech.speechConfig);
    // speech.phraseList = speechsdk.PhraseListGrammar.fromRecognizer(
    //   speech.recognizer
    // );
    speech.recognizer.recognized = speech.recognized;
    speech.recognizer.recognizing = speech.recognizing;
    speech.recognizer.canceled = speech.canceled;

    await speech.recognizer.startContinuousRecognitionAsync();
    $(".speechtext").innerHTML = "Start talking and it will appear here!";
  },

  /**
   * Once a phrase/sentence is fully recognized, this will be called
   */
  recognized: (s, e) => {
    // what happens if the recognizer doesn't know what was said
    if (e.result.reason === ResultReason.NoMatch) {
      $(".speechtext").innerHTML = "Please speak louder or more clearly...";
    }
    // if it knows what was said...
    else {
      // set the html speech bar's text to what was recognized
      $(".speechtext").innerHTML = e.result.text;
      // start timer
      if (timerOn && !speech.paused && startVoice) {
        sttTimer = setTimeout(voiceTimeout, sttInterval);
      }
      // handle the recognized speech
      commandTree.handleRecognizedSpeech(e.result.text, speech.paused);
    }
  },

  /**
   * while speech is still being recognized, this is called
   */
  recognizing: (s, e) => {
    // reset timer
    if (timerOn && !speech.paused && startVoice) clearTimeout(sttTimer);
    // set the html speech bar's text to what was recognized
    $(".speechtext").innerHTML = e.result.text;
  },

  /**
   * if an error occurs with speech recognition, it is usually cancelled automatically
   * and this is called
   */
  canceled: (s, e) => {
    var str = "(cancel) Reason: " + speechsdk.CancellationReason[e.reason];
    if (e.reason === speechsdk.CancellationReason.Error) {
      str += ": " + e.errorDetails;
    }
    console.log(str);
  },

  /**
   * stop recognizing, close, and reset to null
   */
  stop: async () => {
    await speech.recognizer.stopContinuousRecognitionAsync();
    speech.recognizer.close();
    speech.recognizer = null;
  },

  /**
   * This adds the next thing to be said through text to speech to a queue.
   * A queue is used so multiple phrases are not outputted at once and to avoid
   * a weird issue where the text would not be said at random points.
   *
   * @param {String} text text to be synthesized
   * @param {number} rate rate at which the text will be said (1.5 at default)
   */
  addToQueue: (text, rate = 1.5) => {
    // add text and rate to their respective queues
    speech.textQueue.push(text);
    speech.rateQueue.push(rate);

    // if what was just added is the only thing in the queue and what was previously
    // added is not still playing, play what was just added to the queue
    if (
      speech.textQueue.length === 1 &&
      speech.rateQueue.length === 1 &&
      !speech.playing
    ) {
      speech.playing = true;
      speech.synthesize(speech.textQueue.shift(), speech.rateQueue.shift());
    }
  },

  /**
   * This is used to convert the text to speech and play/output the speech.
   * Everything for the synthesizer and player that plays the audio is initialized
   * and closed in this function. Although this is obviously slower, this is the best
   * way to avoid weird bugs where the speech sometimes doesn't play or plays audio
   * after a long delay.
   *
   * @param {String} text text to be synthesized to speech
   * @param {number} rate rate at which the text will be spoken
   */
  synthesize: async (text, rate = 1.5) => {
    // initialize all audio output config
    speech.player = new speechsdk.SpeakerAudioDestination();
    speech.player.onAudioEnd = function (_) {
      // when the synthesizer is closed, audio end is called to close the player and
      // start the next text to be synthesized from the queue, if it exists.
      // if there is nothing else to be played, then mark speech.playing as false
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

    // set up config for the synthesizer with the audio output config
    // we just set up
    speech.synthesizer = new speechsdk.SpeechSynthesizer(
      speech.speechConfig,
      speech.audioOutConfig
    );

    // use speakSsmlAsync to have more control over how the voice sounds, currently only used
    // to control the rate, but almost anything can be controlled
    // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup?tabs=csharp
    await speech.synthesizer.speakSsmlAsync(
      speech.createSsml(text, rate),
      // if synthesized properly, close and return audio data
      (result) => {
        if (result) {
          speech.synthesizer.close();
          return result.audioData;
        }
      },
      // if there was an error, print error and close
      (error) => {
        console.log(error);
        speech.synthesizer.close();
      }
    );
  },

  /**
   * create the SSML used in synthesize() with the given text and rate
   *
   * @param {String} text text used in SSML that will be synthesized
   * @param {number} rate rate at which to speak the text
   * @returns string of SSML to be used for synthesis
   */
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

/**
 * when the voice timer times out, ask if they are still there,
 * then stop and close Voice if there is no response within 15 seconds
 */
function voiceTimeout() {
  speech.addToQueue("Are you still there?");
  clearTimeout(sttTimer);
  sttTimer = setTimeout(toggleVoice, 15000);
}

/**
 * This is used by the microphone icon to toggle Voice on and off.
 * on turn ON: get credentials from server, intialize, start timer,
 *    then start the inspection page
 * on turn OFF: say "Voice Ended" for an audio indication, reset commandTree
 *    variables, stop and close recognizer, reset timer
 *
 * @param {boolean} stop used to make sure voice is stopped
 */
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

/**
 * Simple function that will start the voice-inspection process if Voice has been started.
 */
export async function startPage() {
  if (startVoice) {
    speech.addToQueue("Product Inspection Page.");
    startSection();

    // *IGNORE* THIS WAS USED WHEN THERE WERE MULTIPLE PAGES USING VOICE
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

/**
 * function used to control pausing/resuming exection of commands and
 * stop Voice through a voiced command
 *
 * @param {String} cmd text recognized from speech to control voice
 * @returns false to end command, true to keep command
 */
export function controlVoice(cmd) {
  // if they say "control voice pause": pause command control with speech.paused
  // and reset timer. *While paused, the timer won't be reset upon recognizing new speech*
  if (cmd.toLowerCase().includes("pause")) {
    speech.paused = true;
    if (timerOn) {
      clearTimeout(sttTimer);
      sttTimer = setTimeout(voiceTimeout, sttInterval);
    }
    speech.addToQueue("Voice paused");
    return false;
  }

  // if they say "control voice resume": resume command control with speech.paused and reset timer.
  if (cmd.toLowerCase().includes("resume")) {
    speech.paused = false;
    if (timerOn) {
      clearTimeout(sttTimer);
      sttTimer = setTimeout(voiceTimeout, sttInterval);
    }
    speech.addToQueue("Voice resumed");
    return false;
  }

  // if they say "control voice stop": toggle voice off
  if (cmd.toLowerCase().includes("stop")) {
    toggleVoice(true);
    return false;
  }
  return true;
}

/**
 * turn timer on off
 *
 * @param {boolean} on turn timer on or off
 */
export function timer(on) {
  timerOn = on;
  clearTimeout(sttTimer);
  if (on) {
    sttTimer = setTimeout(voiceTimeout, sttInterval);
  }
}

/**
 * used to reset phrases for each page. I thought adding a phrase list for better
 * recognition would be good, but it didn't make any noticable difference in how well
 * it recognized anything, so I removed all the stuff involving phraselists. I did just
 * comment it all out, so if a phrase list is decided to be added back, it should be
 * simple to just uncomment all of the phrase list stuff from: Voice.js and inspectionProcess.js
 *
 * @param {String[String[]]} lists array of arrays of strings of all commands for a page
 */
export function resetPhrases(lists) {
  speech.phraseList.clear();
  lists.forEach(function (phrases) {
    speech.phraseList.addPhrases(phrases);
  });
}
