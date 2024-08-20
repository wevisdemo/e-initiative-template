# 🖋️ WeVis's E-Initiative Template

Full process template for citizen initiative campaign, from digital signatures collection to PDF document rendering for legislative submission.

[View campaign site demo](https://wevisdemo.github.io/e-initiative-template/)

**Table of contents**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [🌟 Features](#-features)
- [🔍 Usage](#-usage)
  - [Clone the template](#clone-the-template)
  - [Set up data sources](#set-up-data-sources)
    - [Firebase](#firebase)
    - [Google Sheets](#google-sheets)
  - [Configuration file](#configuration-file)
  - [Campaign website](#campaign-website)
    - [Development](#development)
    - [Build](#build)
    - [Deployment](#deployment)
  - [Post-campaign scripts](#post-campaign-scripts)
    - [Test and adjustment with mock data](#test-and-adjustment-with-mock-data)
    - [Download and render production data](#download-and-render-production-data)
- [📚 Appendix](#-appendix)
  - [How to make a legislative initiative?](#how-to-make-a-legislative-initiative)
- [⚖️ License](#-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 🌟 Features

1. **Ready to use campaign static website** _(Astro, Svelte, Tailwind and DaisyUI)_
   - An online form with signature pad
   - Signatures counter, from both offline and online channel
   - Support offline sign locations list
   - Privacy policy template
   - GitHub Action's Workflow file for build and deploy to Github Pages
2. **Database configuration** _(Firebase, and Google Sheets with Sheethuahua)_
   - Firebase rules for spamming protection for online submission
   - Firebase emulator with mocked data for local development
   - Google Sheets template for human-curated data
3. **Post-campaign scripts** _(pdf-lib and Node.js)_
   - Download online submission signatories' data as CSV files
   - Render CSV data on the pdf template for legislative submission

Configuration file is provided, but everything can be customized via code.

## 🔍 Usage

Required [Node.js](https://nodejs.org/en) v20 or higher with NPM package manager.

### Clone the template

```sh
npx degit github:wevisdemo/e-initiative-template <project-name>
```

The template will be downloaded to the `project-name` folder.

### Set up data sources

#### Firebase

For online signature submission

1. Create a new project in [Firebase Console](https://console.firebase.google.com)
2. Set up **Authentication**
   2.1. Enable _"Email/Password"_ and _"Anonymous"_ sign-in methods.
   2.2. Add user and provide email/password for admin account. Then add the same information in local `.env.production` file (create it in the project folder if it does not exist) with `ADMIN_EMAIL` and `ADMIN_PASSWORD` keys.
   2.3. Copy admin's User UID for the next step.
3. Set up **Firestore Database**
   3.1 Enable the Firestore
   3.2 Copy rules from [`firestore.rules`](firestore.rules) and update admin's UID from the previous step. (Only update rules on the console, [`firestore.rules`](firestore.rules) is used by the local emulator)
4. Obtain Firebase config
   3.1 Add a new web app from project settings > General > Your Apps
   3.2 Copy `firebaseConfig` as a one-line JSON format and put it in `PUBLIC_FIREBASE_CONFIG` of local `.env.production` file.

At the end, your `.env.production` file should look like this:

```env
PUBLIC_FIREBASE_CONFIG={"apiKey": "???", "authDomain": "???", "projectId": "???", "storageBucket": "???", "messagingSenderId": "???", "appId": "???"}
ADMIN_EMAIL=???
ADMIN_PASSWORD=???
```

**Note:** there is a `.env.development` with mocked data for working with the Firebase emulator in local development environment. You don't need to change anything there.

#### Google Sheets

For human-curated data, including offline signatures count and voluntary sign locations. Skip this step if your campaign don't need both function.

1. Duplicate [Google Sheets template](https://docs.google.com/spreadsheets/d/1PPl4bIKrNC68nc9sWDp7aolnTv0xiHZYQRlsvnRpAHc/edit?usp=sharing). It contain 2 sheets:
   - **"offline-signature"** sheets for recoding offline signature count in each day. Total number is the summation of every row.
   - **"locations"** is the sign location showing in the location page.
2. Grant _"Viewer"_ permission to _"Anyone with the link"_ in Share menu
3. Obtain Sheets ID from the URL `https://docs.google.com/spreadsheets/d/{sheetsID}/` and add it to the `sheets.id` in [`e-initiative.config.mjs`](e-initiative.config.mjs)
4. _(Optional)_ If you allow anyone to submit a voluntary offline sign location.
   4.1. Create a Google Form with fields corresponded to the columns in `locations` sheet.
   4.2. In the form response settings, link the form response to your duplicated sheets. A response sheet will be created with each question in the header.
   4.2. Rename column header to be like `locations` sheet. Doesn't need to have the same order, but it must corresponded to each question.
   4.3 Remove old `locations` sheet and rename form response sheet to be `locations` instead.

### Configuration file

Most of the campaign information can be config via [`e-initiative.config.mjs`](e-initiative.config.mjs). Explanation can be found by hovering at the configuration keys (on JSDoc supported IDE) or the [type definition file](src/models/config.d.ts). Configuration should be update first so that you will know what is not covered and require editing the source code.

### Campaign website

#### Development

- Website content can be directly edited through source code. Index page entry point to get started is [`src/pages/index.astro`](src/pages/index.astro).
- UI components are from either [Daisy UI v3](v3.daisyui.com) or custom made available in [`src/components`](src/components). Svelte is mainly used but you can install additional[ UI Framework integration for Astro](https://docs.astro.build/en/guides/framework-components/)
- Color theme defined in [`e-initiative.config.mjs`](e-initiative.config.mjs) is available as a Tailwind class. For VSCode user, Tailwind extension is recommended for Tailwind class auto-completion.
- Typography CSS global utility classes are defined in [`src/styles/typography.css`](src/styles/typography.css) and ready to be used.
- Design system is corresponded to the [Figma](https://www.figma.com/design/CmcP7sbvY4KSRshC2fKCfD/e-initiative-template)
- Don't forget to review the privacy policy in [`src/pages/privacy-policy.astro`](src/pages/privacy-policy.astro) and remove the _"mark"_ tags (for highlighting) after updating the content.

To start Astro development server and Firebase emulator:

```sh
npm run dev
```

During the development mode, any changes to Firebase will be in local emulator, leaving production database untouched. Mock data will be initialized in Firestore emulator for post-campaign script testing. The [`.env.development`](.env.developmen) is used.

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

Since Astro use Static Site Generation (SSG), no data from Firebase and Google Sheets will be updated after the build. So we recommended to use CI/CD tools that support schedule deployment such as Github Actions. Then we can periodically re-build and re-deploy in a given period. Don't forget to add all the production environment variables to the CI/CD.

Template also include GitHub Action's workflow file [`.github/workflows/demo.yaml`](.github/workflows/demo.yaml). Please remove it before pushing to GitHub if you don't want to use it. But if you do, don't forget to add all the production environment variables as a repository secrets and remove `PUBLIC_DEMO_MODE` env from the _Build with Astro_ step.

### Post-campaign scripts

Your PDF output template might not have the same field value/position as our given template. Before using the thoudsand of production records, we recommend testing with one record of mock data first.

#### Test and adjustment with mock data

To get mock data (Firebase emulator must be running from `dev` or `dev:firebase` command):

```sh
npm run download:local
```

Output CSV files will be generated to `/out` directory: one version with base64 signature data, one version without it. Then start the renderer in watch mode:

```sh
npm run render:watch
```

The output PDF files will be re-generated to `/out` directory everytime any file has changed. Keep adjusting the `renderer` config in [`e-initiative.config.mjs`](e-initiative.config.mjs) until the output PDF looks pretty.

#### Download and render production data

First, download the production signatories' data in CSV format (duplicated or invalid records will be filtered out):

```sh
npm run download:prod
```

Then, render to the PDF files:

```sh
npm run render
```

Both CSV and PDF files will be generated to `/out` directory, replacing existing data if exist (eg. from mock data).

## 📚 Appendix

### How to make a legislative initiative?

Citizens have the rights to propose a law draft to the parliament, when they can gather enough signatures (more about [Thailand legislative process](https://parliamentwatch.wevis.info/legislative-process)). The initiative leader usually follow this pattern:

1. **Pre-campaign**

   - Create a law draft
   - Design campaign content and activities

2. **Campaign**
   - Promote the initiative
   - Collect citizen signatures through offline/online channel
3. **Post campaign**
   - Submit the draft together with all the signatures to the parliament

## ⚖️ License

This project is licensed under [Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/) with WeVis Ltd. and Punch Up Ltd. as licensors.
