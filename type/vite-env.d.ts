/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { Location } from '@remix-run/router';

declare module 'react-router-dom' {
   function useLocation<T>(): Location<T>;
}

