const https = require("https");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const body = JSON.parse(event.body);
    const { apiKey, payload } = body;

    if (!apiKey) return { statusCode: 400, headers, body: JSON.stringify({ error: "No API key" }) };

    // Build request exactly as Google's REST docs show
    const requestBody = {
      contents: payload.contents,
      generation_config: {
        response_modalities: ["TEXT", "IMAGE"]
      }
    };

    const postData = JSON.stringify(requestBody);

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: "generativelanguage.googleapis.com",
        path: `/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      });

      req.on("error", (e) => reject(e));
      req.setTimeout(25000, () => { req.destroy(); reject(new Error("Timed out")); });
      req.write(postData);
      req.end();
    });

    return {
      statusCode: result.status,
      headers: { ...headers, "Content-Type": "application/json" },
      body: result.body,
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
