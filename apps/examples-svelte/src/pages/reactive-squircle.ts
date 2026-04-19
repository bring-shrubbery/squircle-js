import { mount } from "svelte";
import "../styles.css";
import Page from "./reactive-squircle.svelte";

mount(Page, { target: document.getElementById("app")! });
