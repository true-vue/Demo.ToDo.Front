import { PluginOptions, ToDoList } from "./components/todo-plugin";
import LocalStorageProvider from "./storage/LocalStorageProvider";

// force assert that element exists
const parent = document.getElementById("my-list") as HTMLElement;
const options: PluginOptions = {
    storage: new LocalStorageProvider("my-list")
}
new ToDoList(parent, options);
