import { ToDoList } from "./components/todo-plugin";

// force assert that element exists
const parent = document.getElementById("my-list") as HTMLElement;
new ToDoList(parent);
