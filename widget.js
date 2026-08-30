// ============================================================
// WIDGET LOGIC — this file runs the whole widget:
// 1. Asks Zoho CRM which record we're looking at (PageLoad)
// 2. Fetches that record's Phone number
// 3. Sends Record ID + Module + Phone Number to your Catalyst
//    function when the Call button is clicked
// ============================================================

var currentRecord = {
  id: null,
  module: null,
  phone: null
};

function setStatus(message, isError) {
  var el = document.getElementById("statusMessage");
  el.textContent = message;
  el.style.color = isError ? "#c0392b" : "#2e7d32";
}

// Step 1: once we know which record we're on, ask Zoho CRM for its
// field values (PageLoad only tells us the ID, not the phone number).
function loadRecordDetails(entity, recordId) {
  ZOHO.CRM.API.getRecord({ Entity: entity, RecordID: recordId })
    .then(function (response) {
      var record = response.data[0];
      var phone = record.Phone || record.Mobile || "";

      currentRecord.id = recordId;
      currentRecord.module = entity;
      currentRecord.phone = phone;

      document.getElementById("recordInfo").textContent =
        entity + " record — Phone: " + (phone || "not set");

      var callButton = document.getElementById("callButton");
      if (phone) {
        callButton.disabled = false;
      } else {
        callButton.disabled = true;
        setStatus("This record has no Phone number on file.", true);
      }
    })
    .catch(function (error) {
      console.error("Could not load record:", error);
      setStatus("Could not load record details. See browser console for the error.", true);
    });
}

// Step 2: when the Call button is clicked, send the record's data to
// your Catalyst function.
function sendToBackend() {
  var callButton = document.getElementById("callButton");
  callButton.disabled = true;
  setStatus("Sending call request...", false);

  var payload = {};
  payload[CLICKTOCALL_CONFIG.FIELD_NAMES.recordId] = currentRecord.id;
  payload[CLICKTOCALL_CONFIG.FIELD_NAMES.module] = currentRecord.module;
  payload[CLICKTOCALL_CONFIG.FIELD_NAMES.phoneNumber] = currentRecord.phone;

  fetch(CLICKTOCALL_CONFIG.CATALYST_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Server responded with status " + response.status);
      }
      return response.text();
    })
    .then(function (result) {
      setStatus("Call request sent successfully.", false);
      console.log("Backend response:", result);
    })
    .catch(function (error) {
      setStatus("Something went wrong sending the call request. See browser console.", true);
      console.error("Error calling backend:", error);
    })
    .finally(function () {
      callButton.disabled = false;
    });
}

document.getElementById("callButton").addEventListener("click", sendToBackend);

// Zoho calls this function automatically as soon as the widget opens
// on a record, and hands us the Module name (Entity) and Record ID.
ZOHO.embeddedApp.on("PageLoad", function (data) {
  var entity = data.Entity;
  var recordId = Array.isArray(data.EntityId) ? data.EntityId[0] : data.EntityId;

  if (!entity || !recordId) {
    setStatus("Could not read the record from Zoho CRM.", true);
    return;
  }

  loadRecordDetails(entity, recordId);
});

// This line switches the widget "on" and must be the last thing that runs.
ZOHO.embeddedApp.init();
