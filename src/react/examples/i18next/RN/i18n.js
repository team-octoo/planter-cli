/* istanbul ignore file */
/* v8 ignore start */
import i18n from "i18next";

import {initReactI18next} from "react-i18next";
import RNLanguageDetector from "@os-team/i18next-react-native-language-detector";
import AsyncStoragePlugin from "i18next-react-native-async-storage";

import enTranslation from "./locales/en.json";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(RNLanguageDetector)
  .use(AsyncStoragePlugin("en"))
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    compatibilityJSON: "v3",
    ns: [],
    fallbackLng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome
    nsSeparator: false, // we do not use keys in form messages.welcome
    namespaceSeparator: false,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

// i18n.on("languageChanged", function (lng) {
//   custom event trigger when language is changed  (rerender)
// });

export default i18n;
