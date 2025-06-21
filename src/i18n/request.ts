import { getRequestConfig } from "next-intl/server";

import { COOKIES, getCookie } from "@/lib/utils/cookies-utils";

import { EN } from "./en";
import { ES } from "./es";

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || "es";

// Messages map for supported locales
// This allows for easy addition of new languages in the future
// by simply adding a new entry in the messagesMap object.
// For example, to add French, you would create a `fr.ts` file and add
// `fr: FR` to the messagesMap object.
const messagesMap = {
  en: EN,
  es: ES,
};

export default getRequestConfig(async () => {
  const localeCookie = await getCookie(COOKIES.NEXT_LOCALE);

  const locale = localeCookie || DEFAULT_LOCALE;

  return {
    locale,
    messages: messagesMap[locale as keyof typeof messagesMap] || EN,
  };
});
