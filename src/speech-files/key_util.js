import axios from "axios";

/**
 * Simple function to get the key and region from the server
 *
 * @returns object with azure cognitive services key and region
 */
export async function getCredentials() {
  try {
    const res = await axios.get("/api/get-speech-token");
    const key = res.data.key;
    const region = res.data.region;
    return { key: key, region: region };
  } catch (err) {
    console.log(err.response.data);
    return { authToken: null, error: err.response.data };
  }
}
