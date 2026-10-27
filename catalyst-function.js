// ============================================================
// REFERENCE COPY — this file is not run from this repo.
// It's a saved copy of the code that lives inside your Zoho
// Catalyst function's own online editor. Paste its contents
// there (see SETUP-AND-TESTING.md Step 0 for exact steps).
// ============================================================

const catalyst = require('zcatalyst-sdk-node');
const express = require('express');
const app = express();

// Lets Express read JSON data sent in the body of a POST request.
// (Needed for the new /clicktocall route below — your existing
// /about and /contact routes don't need it.)
app.use(express.json());

app.get('/about', (req, res) => {
  res.status(200).send('This is a sample response from the "about" route.');
});

app.get('/contact', (req, res) => {
  res.status(200).send('This is a sample response from the "contact" route.');
});

// ---- NEW: this is the route the Click-to-Call widget sends data to ----
app.post('/clicktocall', (req, res) => {
  const { recordId, module, phoneNumber } = req.body || {};

  if (!recordId || !module || !phoneNumber) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing one of: recordId, module, phoneNumber'
    });
  }

  console.log('Click-to-Call request received:');
  console.log('  recordId:    ', recordId);
  console.log('  module:      ', module);
  console.log('  phoneNumber: ', phoneNumber);

  // TODO (later phase): trigger the actual outbound call here.

  res.status(200).json({
    status: 'success',
    message: 'Received call request for ' + phoneNumber,
    recordId: recordId,
    module: module,
    phoneNumber: phoneNumber
  });
});

module.exports = app;
