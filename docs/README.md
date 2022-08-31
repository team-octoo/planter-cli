# docs (react)  

This documentation has been autocreated by planter. Install planter globally to easily develop within this application.  
Install command: **npm install -g @team-octoo/planter**  
Planter will give you commands to create components, state files, and much more. Just type in 'planter -h' in a terminal.  

## Styling  

This app uses Custom to style its components.  
When creating a component using the planter library...  
A custom method has been chosen...  

## Component structure  

BEP component structure stands for 'Basics', 'Elements' and 'Pages'.  
It is a triple layered component structure...   

- Basics: Your basic building blocks. These components do not have any business logic in them. They get their state through props.  
- Elements: Elements are a collection of basic components and (sometimes) other elements. They can get their state through props or can have some business logic within the component itself.  
- Pages: Pages are the largest components. These usually are a collection of elements. It is common that they contain business logic and pass data toward child components.  

**Example**  
A simple note application has a login page, overview page, edit page.  
On the login page, there is a login container (just a div) which contains a form (element or basic) with input fields (basics).  
The overview page has the navigation (element) and a list of notes (element). The moment the overview page is rendered, the notes are fetched. When fetched, the notes are passed to the list element.  
The edit page has the navigation (element) and a form (basic or element) with input fields (basic). When the edit page is rendered, the note details are fetched. When fetched, the details are passed to the input components.  
(This is just an example but it illustrated how a simple app would be structured.)  

## Packages  
These packages were installed at the start of the project:  

- **React-router**: The defacto standard in React routing.
https://reactrouter.com/docs/en/v6

- **Zustand**: A small, fast and scalable bearbones state-management solution using simplified flux principles.
https://www.npmjs.com/package/zustand

- **Axios**: A more comprehensive fetch library which supports request cancelling, automatic json transforms, ...
https://www.npmjs.com/package/axios



---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
