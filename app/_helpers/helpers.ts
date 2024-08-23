// import { frFR, deDE, enUS } from '@clerk/localizations';
import { createRouteMatcher } from '@clerk/nextjs/server';
// import type { LocalizationResource } from '@clerk/types';

// import { LocaleCode } from '@ngf/utils';

// export const getClerkLocale = (locale: LocaleCode): LocalizationResource => {
//   switch (locale) {
//     case 'fr-CH':
//       return frFR;
//     case 'de-CH':
//       return deDE;
//     case 'en-US':
//       return enUS;
//     default:
//       return deDE;
//   }
// };

const LocalePrefixPattern = '^\\/([\\w]{2})-([\\w]{2})';
const PublicPaths = ['/sign-in', '/sign-up', '/after-sign-up', '/verify'];
const PublicPathsRegex = PublicPaths.map(
  (path) => new RegExp(LocalePrefixPattern + '\\/' + path + '$')
);
export const isPublicRoute = createRouteMatcher(PublicPaths);
