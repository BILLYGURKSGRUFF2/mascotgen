const https = require("https");

const ALLOWED_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-3.1-flash-image-preview",
];

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { apiKey, payload, model } = req.body;
    if (!apiKey) return res.status(400).json({ error: "No API key" });

    const modelName = ALLOWED_MODELS.includes(model) ? model : ALLOWED_MODELS[0];

    const requestBody = {
      contents: payload.contents,
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    };

    const postData = JSON.stringify(requestBody);

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: "generativelanguage.googleapis.com",
        path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
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

      req.on("error", reject);
      req.setTimeout(55000, () => { req.destroy(); reject(new Error("Timed out")); });
      req.write(postData);
      req.end();
    });

    const data = JSON.parse(result.body);
    return res.status(result.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
