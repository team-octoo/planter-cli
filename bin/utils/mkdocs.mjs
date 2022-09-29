import os from "os";
// here is a map of docs in markdown format for the README.md after init.

export const docsMap = {
  intro:
    "# settings.name (settings.library)  " +
    os.EOL +
    os.EOL +
    "This documentation has been autocreated by planter. Install planter globally to easily develop within this application.  " +
    os.EOL +
    "Install command: **npm install -g @team-octoo/planter**  " +
    os.EOL +
    "Planter will give you commands to create components, state files, and much more. Just type in 'planter -h' in a terminal.  " +
    os.EOL +
    os.EOL,
  layout:
    "## Styling  " +
    os.EOL +
    os.EOL +
    "This app uses settings.layout to style its components.  " +
    os.EOL +
    "When creating a component using the planter library...  " +
    os.EOL,

  RNlayout:
    "## Styling  " +
    os.EOL +
    os.EOL +
    "This app uses react-native styles to style its components.  " +
    os.EOL +
    "When creating a component using the planter library...  " +
    os.EOL,

  RNsetup:
    "### React-native  " +
    os.EOL +
    os.EOL +
    "This project was bootstrapped with 'npx react-native init < name >'." +
    os.EOL +
    os.EOL +
    " ### Available Scripts  " +
    os.EOL +
    os.EOL +
    "In the project directory, you can run:  " +
    os.EOL +
    os.EOL +
    "**`npm run ios`**  " +
    os.EOL +
    "Runs the app in the development mode on ios (on a simulator or device).   " +
    os.EOL +
    "The app will reload when you make changes.  " +
    os.EOL +
    "Use the shake command to debug...  " +
    os.EOL +
    os.EOL +
    "**`npm run android`**   " +
    os.EOL +
    "Runs the app in the development mode on ios (on a simulator or device).   " +
    os.EOL +
    os.EOL +
    "**`npm run test`**  " +
    os.EOL +
    " Launches the test runner in the interactive watch mode.  ",

  "CSS-modules":
    "A .module.css file will be created next to the component file. This file can be used to created component specific styles.  " +
    os.EOL +
    os.EOL,
  "SASS-modules":
    "A .module.scss file will be created next to the component file. This file can be used to created component specific styles.  " +
    os.EOL +
    os.EOL,
  CSS:
    "A .css file will be created next to the component file. This file does NOT contain component specific styles.  " +
    os.EOL +
    os.EOL,
  SASS:
    "A .scss file will be created next to the component file. This file does NOT contain component specific styles.  " +
    os.EOL +
    os.EOL,

  "BEP (recommended)":
    "BEP component structure stands for 'Basics', 'Elements' and 'Pages'.  " +
    os.EOL +
    "It is a triple layered component structure...   " +
    os.EOL +
    os.EOL +
    "- Basics: Your basic building blocks. These components do not have any business logic in them. They get their state through props.  " +
    os.EOL +
    "- Elements: Elements are a collection of basic components and (sometimes) other elements. They can get their state through props or can have some business logic within the component itself.  " +
    os.EOL +
    "- Pages: Pages are the largest components. These usually are a collection of elements. It is common that they contain business logic and pass data toward child components.  " +
    os.EOL +
    os.EOL +
    "**Example**  " +
    os.EOL +
    "A simple note application has a login page, overview page, edit page.  " +
    os.EOL +
    "On the login page, there is a login container (just a div) which contains a form (element or basic) with input fields (basics).  " +
    os.EOL +
    "The overview page has the navigation (element) and a list of notes (element). The moment the overview page is rendered, the notes are fetched. When fetched, the notes are passed to the list element.  " +
    os.EOL +
    "The edit page has the navigation (element) and a form (basic or element) with input fields (basic). When the edit page is rendered, the note details are fetched. When fetched, the details are passed to the input components.  " +
    os.EOL +
    "(This is just an example but it illustrated how a simple app would be structured.)  ",
  Atomic:
    "Atomic design has a full documentation at: https://bradfrost.com/blog/post/atomic-web-design/  " +
    os.EOL +
    "The official documentation shows in detail how the structure works.  ",
  Custom: "A custom method has been chosen...  ",

  "CI/CD":
    "Planter provides the opportunity to setup your **CI pipelines automatically**.  " +
    os.EOL +
    "At the moment we provide CI setup for these **GIT Providers**:  " +
    os.EOL +
    os.EOL +
    "- Gitlab (.gitlab-ci.yml)  " +
    os.EOL +
    os.EOL +
    "To perform CI setup, just run **`planter setup:CI/CD <gitprovider>`**  " +
    os.EOL +
    "CD can be setup using a service of your choice (for example: [Microsoft Appcenter](https://appcenter.ms))  ",
};
