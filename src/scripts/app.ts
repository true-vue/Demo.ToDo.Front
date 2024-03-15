import { ToDoList } from "./todo-plugin";

// force assert that element exists
const parent = document.getElementById("my-list") as HTMLElement;
const list = new ToDoList(parent);
