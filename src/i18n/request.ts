import { getRequestConfig } from 'next-intl/server';
 
export default getRequestConfig(async ({ requestLocale }) => {
  // Provide a static locale, fetch a user setting, 
  // read from a cookie or use `requestLocale`
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale) {
    locale = 'en';
  }
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
