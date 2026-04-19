import { atom } from "jotai";

export type Framework = "react" | "vue" | "svelte" | "solid";

export const LANGUAGE_SELECTOR_ATOM = atom<Framework>("react");
