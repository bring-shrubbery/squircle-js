import { render } from "solid-js/web";
import { Badge } from "../examples/NotificationBadge";
import "../styles.css";

render(() => <Badge count={7} />, document.getElementById("app")!);
