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

    const postData = JSON.stringify(payload);

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

    // Parse and check what Google actually returned
    const data = JSON.parse(result.body);
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find(p => p.inline_data?.mime_type?.startsWith("image/"));

    if (!imgPart) {
      // Return debug info so we can see what came back
      const textPart = parts.find(p => p.text);
      const finishReason = data?.candidates?.[0]?.finishReason;
      const errorMsg = data?.error?.message;
      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `No image in response. finishReason: ${finishReason}, text: ${textPart?.text?.slice(0,200)}, apiError: ${errorMsg}, partsCount: ${parts.length}`
        }),
      };
    }

    return {
      statusCode: result.status,
      headers: { ...headers, "Content-Type": "application/json" },
      body: result.body,
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
