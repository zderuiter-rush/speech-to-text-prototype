require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const path = require("path");
const port = process.env.PORT || 3001;

const app = express();
const publicPath = path.join(__dirname, "..", "public");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(express.static(publicPath));

app.get("/api/get-speech-token", async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;

  if (
    speechKey === "paste-your-speech-key-here" ||
    speechRegion === "paste-your-speech-region-here"
  ) {
    res
      .status(400)
      .send("You forgot to add your speech key or region to the .env file.");
  } else {
    const headers = {
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    try {
      const tokenResponse = await axios.post(
        `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
        null,
        headers
      );
      res.send({ token: tokenResponse.data, region: speechRegion });
    } catch (err) {
      res.status(401).send("There was an error authorizing your speech key.");
    }
  }
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(publicPath, "index.html"));
// });

app.listen(port, () => console.log("Express server is running!"));