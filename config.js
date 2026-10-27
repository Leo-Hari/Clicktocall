// ============================================================
// SETTINGS FILE — this is the ONLY file you should need to edit
// by hand. It has no logic in it, just values.
// ============================================================

var CLICKTOCALL_CONFIG = {

  // Paste the full URL of your Catalyst function's /clicktocall route here.
  // This is the same base URL you already tested in Postman for /about or
  // /contact, but with the end replaced by "/clicktocall". Example:
  // if your tested URL was:
  //   https://clicktocall-60012345.development.catalystserverless.com/server/clicktocall_function/about
  // then this should be:
  //   https://clicktocall-60012345.development.catalystserverless.com/server/clicktocall_function/clicktocall
  CATALYST_FUNCTION_URL: "PASTE_YOUR_CATALYST_FUNCTION_URL_HERE",

  // These are the "labels" we attach to each piece of data before sending
  // it to your Catalyst function. They must exactly match the names your
  // Catalyst function reads from the request body (see catalyst-function.js,
  // the "/clicktocall" route) — currently recordId / module / phoneNumber
  // on both sides. Only rename a value here if you also rename it in that
  // function's code.
  FIELD_NAMES: {
    recordId: "recordId",
    module: "module",
    phoneNumber: "phoneNumber"
  }

};
