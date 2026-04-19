import { mount } from "svelte";
import "../styles.css";
import Page from "./app-icon.svelte";

mount(Page, { target: document.getElementById("app")! });
