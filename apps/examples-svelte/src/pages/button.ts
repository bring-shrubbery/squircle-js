import { mount } from "svelte";
import "../styles.css";
import Page from "./button.svelte";

mount(Page, { target: document.getElementById("app")! });
