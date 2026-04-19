import { mount } from "svelte";
import "../styles.css";
import Page from "./avatar.svelte";

mount(Page, { target: document.getElementById("app")! });
