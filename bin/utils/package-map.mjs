// here is a map of packagess to be installed (depending on the choice of the user)

export const packageMap = {
  "Error-boundary": {
    "no-dev": {
      ts: {
        packages: ["react-error-boundary"],
      },
      "no-ts": {
        packages: ["react-error-boundary"],
      },
    },
    docs: "https://www.npmjs.com/package/react-error-boundary",
    description: "Provides a component that acts as a fallback when render errors occur.",
  },
  Zustand: {
    "no-dev": {
      ts: {
        packages: ["zustand", "immer"],
        "native-packages": ["@react-native-async-storage/async-storage"],
      },
      "no-ts": {
        packages: ["zustand", "immer"],
        "native-packages": ["@react-native-async-storage/async-storage"],
      },
    },
    docs: "https://www.npmjs.com/package/zustand",
    description: "A small, fast and scalable bearbones state-management solution using simplified flux principles.",
  },
  Redux: {
    "no-dev": {
      ts: {
        packages: [
          "redux",
          "react-redux",
          "immer",
          "redux-logger",
          "redux-thunk",
          "redux-persist",
          "redux-mock-store",
          "@reduxjs/toolkit",
        ],
        "native-packages": ["@react-native-async-storage/async-storage"],
      },
      "no-ts": {
        packages: [
          "redux",
          "react-redux",
          "immer",
          "redux-logger",
          "redux-thunk",
          "redux-persist",
          "redux-mock-store",
          "@reduxjs/toolkit",
        ],
        "native-packages": ["@react-native-async-storage/async-storage"],
      },
    },
    dev: {
      ts: {
        packages: ["@types/redux-logger"],
      },
    },
    docs: "https://redux.js.org/introduction/getting-started",
    description:
      "Global predictable state management library. Redux-persist, -thunk, -logger and Immer are also installed.",
  },
  "Mock-service-worker": {
    dev: {
      ts: {
        packages: ["msw"],
      },
      "no-ts": {
        packages: ["msw"],
      },
    },
    docs: "https://mswjs.io/docs/",
    description: "Mock fetch requests in development & testing.",
  },
  Appcenter: {
    "no-dev": {
      ts: {
        packages: ["appcenter", "appcenter-analytics", "appcenter-crashes"],
      },
      "no-ts": {
        packages: ["appcenter", "appcenter-analytics", "appcenter-crashes"],
      },
    },
    docs: "https://www.npmjs.com/package/appcenter",
    description: "App Center is your continuous integration, delivery and learning solution for iOS and Android apps.",
  },

  MirageJS: {
    dev: {
      ts: {
        packages: ["jest-fetch-mock", "miragejs", "xmlhttprequest"],
      },
      "no-ts": {
        packages: ["jest-fetch-mock", "miragejs", "xmlhttprequest"],
      },
    },
    docs: "https://miragejs.com/",
    description:
      "Mirage JS is an API mocking library that lets you build, test and share a complete working JavaScript application without having to rely on any backend services.",
  },

  i18next: {
    "no-dev": {
      ts: {
        packages: ["react-i18next", "i18next", "i18next-browser-languagedetector"],
        "native-packages": ["@os-team/i18next-react-native-language-detector", "i18next-react-native-async-storage"],
      },
      "no-ts": {
        packages: ["react-i18next", "i18next", "i18next-browser-languagedetector"],
        "native-packages": ["@os-team/i18next-react-native-language-detector", "i18next-react-native-async-storage"],
      },
    },
    dev: {
      ts: {
        packages: ["i18next-parser"],
      },
      "no-ts": {
        packages: ["i18next-parser"],
      },
    },
    docs: "https://react.i18next.com/",
    description:
      "Add multiple language support to your application with i18next. A parser has been installed and configured. 'yarn translate' script is available.",
  },
  "Prop-types": {
    "no-dev": {
      ts: {
        packages: ["prop-types"],
      },
      "no-ts": {
        packages: ["prop-types"],
      },
    },
    docs: "https://www.npmjs.com/package/prop-types",
    description: "Add types to your component props. (Low level typing library)",
  },
  Axios: {
    "no-dev": {
      ts: {
        packages: ["axios"],
      },
      "no-ts": {
        packages: ["axios"],
      },
    },
    docs: "https://www.npmjs.com/package/axios",
    description: "A more comprehensive fetch library which supports request cancelling, automatic json transforms, ...",
  },
  Cypress: {
    dev: {
      ts: {
        packages: ["cypress", "@cypress/react", "@cypress/webpack-dev-server"],
      },
      "no-ts": {
        packages: ["cypress", "@cypress/react", "@cypress/webpack-dev-server"],
      },
    },
    docs: "https://www.cypress.io/blog/2021/04/06/cypress-component-testing-react/",
    description: "A testing library that tests end2end or integrations within the browser.",
  },
  GraphQL: {
    "no-dev": {
      ts: {
        packages: ["@apollo/client", "graphql"],
      },
      "no-ts": {
        packages: ["@apollo/client", "graphql"],
      },
    },
    docs: "https://www.apollographql.com/docs/react/",
    description:
      "A comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.",
  },
  "React-router": {
    "no-dev": {
      ts: {
        packages: ["react-router-dom@6"],
      },
      "no-ts": {
        packages: ["react-router-dom@6"],
      },
    },
    docs: "https://reactrouter.com/docs/en/v6",
    description: "The defacto standard in React routing.",
  },
  Wouter: {
    "no-dev": {
      ts: {
        packages: ["wouter"],
      },
      "no-ts": {
        packages: ["wouter"],
      },
    },
    docs: "https://www.npmjs.com/package/wouter",
    description: "A minimalistic, hooks based router for react.",
  },
  "Patch-Package": {
    "no-dev": {
      ts: {
        packages: ["patch-package", "postinstall-postinstall"],
      },
      "no-ts": {
        packages: ["patch-package", "postinstall-postinstall"],
      },
    },
    docs: "https://www.npmjs.com/package/patch-package",
    description: "patch-package lets app authors instantly make and keep fixes to npm dependencies.",
  },

  "React Hook Forms": {
    "no-dev": {
      ts: {
        packages: ["@hookform/resolvers", "yup", "react-hook-form"],
      },
      "no-ts": {
        packages: ["@hookform/resolvers", "yup", "react-hook-form"],
      },
    },
    docs: "https://react-hook-form.com/get-started",
    description: "Performant, flexible and extensible forms with easy-to-use validation.",
  },
  "React-Native-Dotenv": {
    dev: {
      ts: {
        packages: ["react-native-dotenv"],
      },
      "no-ts": {
        packages: ["react-native-dotenv"],
      },
    },
    docs: "https://www.npmjs.com/package/react-native-dotenv",
    description: "Load environment variables using import statements.",
  },
  "React-Navigation": {
    "no-dev": {
      ts: {
        packages: ["@react-navigation/native", "react-native-screens", "react-native-safe-area-context"],
      },
      "no-ts": {
        packages: ["@react-navigation/native", "react-native-screens", "react-native-safe-area-context"],
      },
    },
    docs: "https://reactnavigation.org/docs/getting-started/",
    description: "Routing and navigation for Expo and React Native apps.",
  },
  "Navigation-native-stack": {
    "no-dev": {
      ts: {
        packages: ["@react-navigation/native-stack"],
      },
      "no-ts": {
        packages: ["@react-navigation/native-stack"],
      },
    },
    docs: "https://reactnavigation.org/docs/getting-started/",
    description: "Routing and navigation for Expo and React Native apps.",
  },
  "Navigation-tabs": {
    "no-dev": {
      ts: {
        packages: ["@react-navigation/bottom-tabs"],
      },
      "no-ts": {
        packages: ["@react-navigation/bottom-tabs"],
      },
    },
    docs: "https://reactnavigation.org/docs/getting-started/",
    description: "Routing and navigation for Expo and React Native apps.",
  },
};
