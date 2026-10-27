"use strict";

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

module.exports = (req, res) => {
  // Allows the Zoho CRM widget (a different website) to call this function
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const url = req.url.split("?")[0];

  // Browsers send a quick "OPTIONS" check before a POST; answer it
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // The new click-to-call route
  if (url === "/clicktocall" && req.method === "POST") {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      let body;
      try {
        body = JSON.parse(raw || "{}");
      } catch (err) {
        sendJson(res, 400, { status: "error", message: "Body must be valid JSON" });
        return;
      }

      const recordId = body.recordId;
      const moduleName = body.module;
      const phoneNumber = body.phoneNumber;

      if (!recordId || !moduleName || !phoneNumber) {
        sendJson(res, 400, {
          status: "error",
          message: "recordId, module and phoneNumber are all required"
        });
        return;
      }

      console.log("Click-to-call request:", recordId, moduleName, phoneNumber);

      // TODO (later phase): create a session and push to the Android app
      sendJson(res, 200, {
        status: "success",
        message: "Request received",
        received: { recordId: recordId, module: moduleName, phoneNumber: phoneNumber }
      });
    });

    return;
  }

  // Your original starter routes, kept as they were
  res.writeHead(200, { "Content-Type": "text/html" });
  switch (url) {
    case "/about":
      res.write("<h1>about page</h1>");
      break;
    case "/contact":
      res.write("<h1>contact page</h1>");
      break;
    default:
      res.write("<h1>default page</h1>");
      break;
  }
  res.end();
};
