import { mount } from "svelte";
import "../styles.css";
import Page from "./card.svelte";

mount(Page, { target: document.getElementById("app")! });
