import App from "./app";
import path from "path";

const app = new App({
	receivers: path.resolve(__dirname, "receivers"),
	models: path.resolve(__dirname, "models"),
});

app.start();
