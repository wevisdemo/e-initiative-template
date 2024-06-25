# 🖋️ WeVis's E-Initiative Template

Full process template for citizen initiative campaign, from digital signatures collection to PDF document rendering for legislative submission.

## What is included?

1. **Ready to use campaign static website** _(Astro, Svelte, Tailwind and DaisyUI)_
   - An online form with signature pad
   - Signatures counter, from both offline and online channel
   - Support offline sign locations list
   - Campaign related information
2. **Database configuration** _(Firebase, and Google Sheets with Sheethuahua)_
   - Firebase rules for spamming protection for online submission
   - Firebase emulator with mocked data for local development
   - Google Sheets template for human-curated data
3. **Post-campaign scripts** _(pdf-lib and NodeJS)_
   - Download online submission signatories' data as CSV files
   - Render CSV data on the pdf template for legislative submission

Configulation file is provided, but everything can be customized with code.

## Usage

**Requirements**

- NodeJS v20 or higher
- Firebase CLI

### Clone the template

```sh
npx degit github:wevisdemo/e-initiative-template <project-name>
```

The template will be downloaded to the `project-name` folder.

### Set up data sources

#### Firebase

For online signature submission

1. Create a new project in Firebase Console
2. Set up Authentication
   2.1. Enable Email/Password and Anonymous sign-in methods.
   2.2. Add user and provide email/password for admin account. Then add the same information in local `.env.production` file (create it in the project folder if not exist) with `ADMIN_EMAIL` and `ADMIN_PASSWORD` keys.
   2.3. Copy admin's User UID for the next step.
3. Set up Firestore Database
   3.1 Enable the Firestore
   3.2 Copy rules from `firestore.rules` and don't forget to update admin's UID from the previous step. (Only update rules on the console, )
4. Obtain Firebase config
   3.1 Add a new Web app from project settings > General > Your Apps
   3.2 Copy `firebaseConfig` as a one-line JSON format and put it in `PUBLIC_FIREBASE_CONFIG` of local `.env.production` file.

At the end, your `.env.production` file should look like this:

```env
PUBLIC_FIREBASE_CONFIG={"apiKey": "???", "authDomain": "???", "projectId": "???", "storageBucket": "???", "messagingSenderId": "???", "appId": "???"}
ADMIN_EMAIL=???
ADMIN_PASSWORD=???
```

Note: there is a `.env.development` with mocked data for working with the Firebase emulator in local development environment. You don't need to change anything there.

#### Google Sheets

For human-curated data, including offline signatures count and voluntary sign locations. Skip this step if your campaign don't need both function.

1. Duplicate Google Sheets template. It contain 2 sheets.
   - `offline-signature` sheets for recoding offline signature count in each day. Total number is the summation of every row.
   - `locations` is the sign location showing in the location page.
2. Grant "Viewer" permission to "Anyone with the link" in Share menu
3. Obtain Sheets ID from the URL `https://docs.google.com/spreadsheets/d/{sheetsID}/` and add it to the `sheets.id` in `e-initiative.config.mjs`
4. _(Optional)_ If you allow anyone to submit a voluntary offline sign location.
   4.1. Create a Google Form with fields coresponded to `locations` sheet's columns
   4.2. In the form response settings, link the form response to your duplicated sheets. A respose sheet will be created with each question in the header.
   4.2. Rename column header to be like `locations` sheet. Doesn't need to have the same order, but it must coresponded to each question.
   4.3 Remove old `locations` sheet and rename form response sheet to be `locations` instead.

### Configuration file

Most of the campaign information can be config via `e-initiative.config.mjs`. Explanation can be found by hovering at the configuration keys (on JSDoc supported IDE) or the type definition file. Configuration should be update first so that you will know what is not covered and require editing the source code.

### Campaign website

#### Development

Website content can be directly edited through source code. Index page entry point to get started is `/src/pages/index.astro`

To start Astro development server and Firebase emulator:

```sh
npm run dev
```

During the development mode, any changes to Firebase will be in local emulator, leaving production database untouched. Mock data will be initialized in Firestore emulator for post-campaign script testing. The `.env.development` is used.

#### Build

To build website for production:

```sh
npm run build
```

Static site will be generated to `/dist` and we can preview production build with

```sh
npm run preview
```

Note that production build will use `.env.production` and the real Firebase, not emulator.

#### Deployment

Because we use Static Site Generation (SSG), no data from Firebase and Google Sheets will be update after the build. So we recommended to use CI/CD tools that support schedule deployment such as Github Actions. Then we can periodically re-build and re-deploy in a given period.

### Post-campaign scripts

#### Download signatories' data

To get signatories' data in CSV format:

```sh
npm run download:local # from Firebase emulator
npm run download:prod  # from Firebase in production
```

Use `download:local` to get mock data for PDF rendering adjustment. (Firebase emulator must be running from `dev` or `dev:firebase` command)

Use `download:prod` to get the production data after the campaign end.

Duplicated or invalid record will be filtered out. Output CSV files will be generated to `/out` directory. One version with base64 signature data, one version without it.

#### Render PDF files

Signatories' data must be downloaded first. Then PDF files can be rendered using:

```sh
npm run render
```

Output PDF files will be generated to `/out` directory. Recommend using mock data from `download:local` while adjusting fields' offset configurations and render to see how it look first before using the production data.

## Appendix

### How to make a legislative initiative?

Citizens have the rights to propose a law draft to the parliament, when they can gather enough signatures (more about [Thailand legislative process](https://parliamentwatch.wevis.info/legislative-process)). The initiative leader usually follow this pattern:

1. **Pre-campaign**

   - Create a law draft
   - Design campaign content and activities

2. **Campaign**
   - Promote the intiative
   - Collect citizen signatures through offline/online channel
3. **Post campaign**
   - Submit the draft together with all the signatures to the parliament

## ⚖️ License

This project is licensed under [Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/) with WeVis Ltd. and Punch Up Ltd. as licensors.
