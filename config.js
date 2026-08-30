// ============================================================
// SETTINGS FILE — this is the ONLY file you should need to edit
// by hand. It has no logic in it, just values.
// ============================================================

var CLICKTOCALL_CONFIG = {

  // Paste the full URL of your Catalyst function here.
  // This is the same URL you already tested successfully in Postman.
  // Example:
  // "https://clicktocall-60012345.development.catalystserverless.com/server/click_to_call_function/execute"
  CATALYST_FUNCTION_URL: "PASTE_YOUR_CATALYST_FUNCTION_URL_HERE",

  // These are the "labels" we attach to each piece of data before
  // sending it to your Catalyst function. Only change the text on
  // the right-hand side, and only if your function expects different
  // names (e.g. it reads req.body.record_id instead of req.body.recordId).
  FIELD_NAMES: {
    recordId: "recordId",
    module: "module",
    phoneNumber: "phoneNumber"
  }

};
