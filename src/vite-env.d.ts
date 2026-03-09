/// <reference types="vite/client" />

import type { InitialDataEnvelope } from "./types";

declare global {
  interface Window {
    __INITIAL_DATA__?: InitialDataEnvelope;
  }
}

export {};
