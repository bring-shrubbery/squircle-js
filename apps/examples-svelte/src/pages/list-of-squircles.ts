import { mount } from "svelte";
import "../styles.css";
import Page from "./list-of-squircles.svelte";

mount(Page, { target: document.getElementById("app")! });
