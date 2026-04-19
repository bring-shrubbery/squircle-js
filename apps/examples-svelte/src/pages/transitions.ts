import { mount } from "svelte";
import "../styles.css";
import Page from "./transitions.svelte";

mount(Page, { target: document.getElementById("app")! });
