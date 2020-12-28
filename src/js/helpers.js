import { async } from "regenerator-runtime";
import { TIMEOUT_SECS } from "./config.js";

function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

export async function AJAX(url, uploadData = undefined) {
  try {
    const fecthPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fecthPro, timeout(TIMEOUT_SECS)]);
    // Convert response to json
    const data = await res.json();

    // Throw err if no response
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
}

/*
export async function getJSON(url) {
  try {
    const fecthPro = fetch(url);
    const res = await Promise.race([fecthPro, timeout(TIMEOUT_SECS)]);
    // Convert response to json
    const data = await res.json();

    // Throw err if no response
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
}

export async function sendJSON(url, uploadData) {
  try {
    const fecthPro = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fecthPro, timeout(TIMEOUT_SECS)]);
    // Convert response to json
    const data = await res.json();

    // Throw err if no response
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
}
*/
