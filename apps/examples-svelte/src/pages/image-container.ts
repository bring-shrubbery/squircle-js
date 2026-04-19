import { mount } from "svelte";
import "../styles.css";
import Page from "./image-container.svelte";

mount(Page, { target: document.getElementById("app")! });
