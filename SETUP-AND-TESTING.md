# Click-to-Call Widget — Setup & Testing Guide

This folder contains everything needed for a small web page ("the widget")
that Zoho CRM will open on top of a Contact or Lead record. It shows a
**Call** button; clicking it sends the record's ID, Module name, and Phone
Number to your Catalyst function.

## The files, in plain language

| File | What it is | Do you need to edit it? |
|---|---|---|
| `config.js` | Your settings — just your Catalyst function's URL, and the names of the 3 pieces of data it expects. | **Yes — always.** |
| `widget.html` | The page itself. Loads Zoho's script, then your CSS and JS. | No. |
| `style.css` | Colors, spacing, button look. | Only if you want it to look different. |
| `widget.js` | The logic: ask Zoho CRM which record we're on, fetch its Phone number, and send everything to your Catalyst function when Call is clicked. | No, unless something needs to change later. |
| `catalyst-function.js` | A saved copy of the code that goes **inside your Catalyst function** (not in this widget). It's the other end of the connection — it's what receives what the widget sends. | **Yes — you paste it into Catalyst once (Step 0 below).** |

Nothing here needs Node.js, npm, or any build step — these are the exact
files you will upload to Catalyst (except `catalyst-function.js`, which is
pasted into your Catalyst *function's* editor, a different place in the
Catalyst console than static hosting).

## Step 0 — Update your Catalyst function so it understands the widget

Your Catalyst function is still the default starter template — it only
knows how to answer `/about` and `/contact`. It doesn't yet know how to
receive `recordId`, `module`, and `phoneNumber`. `catalyst-function.js`
adds a new route, `/clicktocall`, that does.

1. In the Zoho Catalyst console, open your **Clicktocall** project, go to
   **Functions**, and open the function that currently answers `/about`
   and `/contact`.
2. Open its code editor (it should show a file like `index.js` with the
   `/about` and `/contact` routes you already tested).
3. **Select all the existing code and delete it.**
4. Open `catalyst-function.js` from this repo, copy its entire contents,
   and paste it into the now-empty editor. (It keeps your `/about` and
   `/contact` routes exactly as they were, and adds the new
   `/clicktocall` one below them.)
5. Save, then deploy/publish the function the same way you did the first
   time you tested it.

**How to check you did it right — test it exactly like you did before, in
Postman:**
- Method: **POST**
- URL: the same base URL you used for `/about`, but ending in
  `/clicktocall` instead (e.g. if your old URL ended in `.../about`, the
  new one ends in `.../clicktocall`)
- Body tab → raw → JSON, paste in:
  ```json
  {
    "recordId": "test123",
    "module": "Leads",
    "phoneNumber": "+15551234567"
  }
  ```
- Click Send.

**What "working" looks like:** a response with status **200** and a JSON
body like:
```json
{
  "status": "success",
  "message": "Received call request for +15551234567",
  "recordId": "test123",
  "module": "Leads",
  "phoneNumber": "+15551234567"
}
```
Also try sending it with one field removed — you should get back status
**400** and `"status": "error"`. That confirms the function is correctly
checking for all three fields.

Once that works in Postman, note down the exact URL you just used (ending
in `/clicktocall`) — you'll paste it into `config.js` next.

## Step 1 — Fill in your settings

1. Open `config.js`.
2. Replace `PASTE_YOUR_CATALYST_FUNCTION_URL_HERE` with the exact
   `/clicktocall` URL you just tested successfully in Postman in Step 0
   (keep the quotes around it).
3. Save the file.

**How to check you did it right:** open `config.js` in any text editor —
the line should now read something like:
```
CATALYST_FUNCTION_URL: "https://clicktocall-xxxxxxx.catalystserverless.com/server/your_function/execute",
```
with your real URL, not the placeholder text.

## Step 2 — Quick local sanity check (optional but recommended)

Before touching Zoho at all, you can open `widget.html` directly in a
browser (double-click the file) just to make sure there are no typos that
break the page.

**What "working" looks like:** the page shows the heading "Click to Call"
and the text "Loading record..." — it will stay stuck there forever
because there's no real Zoho CRM around it yet, and that's expected. What
you're checking for is that the page is **not blank** and shows **no
visibly broken layout**. If the whole page is blank white with nothing on
it, tell me and we'll fix it before going further.

## Step 3 — Upload the files to Zoho Catalyst static hosting

Upload these 4 files (`widget.html`, `style.css`, `config.js`, `widget.js`)
to your Catalyst project's static hosting folder, the same way you deployed
your Catalyst function. After deploying, Catalyst will give you a web
address for your static site — note down the full URL to `widget.html`,
e.g.:
```
https://clicktocall-xxxxxxx.catalystserverless.com/app/widget.html
```

**How to check:** paste that URL into a browser. You should see the same
"Click to Call" page as in Step 2, now loaded from the internet instead of
your computer.

## Step 4 — Register the widget in Zoho CRM's Developer Console

1. Go to your Zoho CRM Developer Console (Setup → Developer Hub → Widgets,
   or developer.zoho.com under your CRM project).
2. Click **Create Widget**.
3. **Widget Type:** choose **Custom Button**. (Zoho's Widget SDK cannot
   hook into a click on the CRM's own built-in blue phone number link —
   the supported way to do this is to add our own **Call** button next to
   it, which is what this widget is.)
4. **Hosting:** choose **External**.
5. **Index File / URL:** paste the `widget.html` URL from Step 3.
6. Save/Create the widget.

## Step 5 — Add the button to the Contact and Lead page layouts

1. In Zoho CRM Setup, go to the layout editor for the **Contacts** module
   (Setup → Customization → Modules → Contacts → Layout).
2. Find the **Links & Buttons** (custom buttons) section and add the widget
   button you just created onto the layout.
3. Repeat the same steps for the **Leads** module.

## Step 6 — Test it on a real record

1. Open any real Contact (or Lead) record in Zoho CRM that has a phone
   number saved on it.
2. Click the **Call** button you added.
3. **What "working" looks like:**
   - A small window/popup opens showing "Click to Call".
   - Under the heading, it shows something like
     `Contacts record — Phone: <the actual phone number>`.
   - The green **Call** button is clickable (not greyed out).
   - Clicking it shows "Sending call request..." and then
     "Call request sent successfully." in green.
4. **Then confirm the backend actually received it**, the same way you
   verified things in Postman before: check your Catalyst function's logs,
   and/or check the Calls module in Zoho CRM for a new record, if that's
   what your function does with the data.

## If something goes wrong

You don't need to read error messages yourself — just tell me exactly
which step above stopped matching its "what working looks like"
description (e.g. "on Step 6, the message turned red and said 'Something
went wrong sending the call request'"), and paste anything shown on
screen. That's enough for me to diagnose it with you.
