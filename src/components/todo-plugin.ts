export class ToDoList {
  #options: PluginOptions | undefined

  #listElement = document.createElement("ul");
  #addButtonElement = document.createElement("button");
  #newItemTextElement = document.createElement("textarea");
  #listMessage = document.createElement("div");

  constructor(parent: HTMLElement, options?: PluginOptions) {
    this.#options = options;

    const mainWrapper = document.createElement("div");
    mainWrapper.classList.add("todo");
    // mainWrapper.textContent = "test";
    this.#listMessage.classList.add("todo-message");
    this.#listMessage.textContent = "Lista jest pusta - dodaj nowy element poniżej!";

    mainWrapper.appendChild(this.#listMessage)

    this.#listElement.classList.add("todo-list");
    mainWrapper.appendChild(this.#listElement);

    const footerElement = document.createElement("div");
    footerElement.classList.add("todo-footer");

    footerElement.appendChild(this.#newItemTextElement);
    footerElement.appendChild(this.#addButtonElement);

    this.#addButtonElement.textContent = "Dodaj";
    this.#addButtonElement.addEventListener("click", () => {
      this.add();
    });

    mainWrapper.appendChild(footerElement);

    parent.appendChild(mainWrapper);

    // todo handle rejection
    this.#initData();
  }

  add(item?: ListItem) {
    const newItem: ListItem = {
      id: item ? item.id : 0,
      text: item ? item.text : this.#newItemTextElement.value,
      isChecked: item ? item.isChecked : false
    }

    // storage first (only when item is passed explicity)
    if (!item && this.#storage) this.#storage.onItemAdded(newItem);

    const itemWrapper = document.createElement("li");
    itemWrapper.classList.add("todo-item");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = newItem.isChecked

    check.addEventListener("change", () => {
      itemWrapper.classList.toggle("todo-item-done");
    });

    const text = document.createElement("div");
    text.textContent = newItem.text
    text.classList.add("todo-item-text");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.addEventListener("click", () => {
      // storage first (handle rejection)
      if (this.#storage) this.#storage.onItemRemoved(newItem)
      this.#listElement.removeChild(itemWrapper);
      this.#setListMessage();
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edytuj";
    editButton.dataset.mode = "readonly";

    let textEdit: HTMLTextAreaElement;
    editButton.addEventListener("click", () => {
      const editedItem: ListItem = {
        id: newItem.id,
        text: textEdit?.value ?? "",
        isChecked: check.checked
      }
      if (editButton.dataset.mode === "readonly") {
        textEdit = document.createElement("textarea")
        textEdit.value = text.textContent ?? "";
        check.after(textEdit);
        text.classList.add("hidden");
        editButton.dataset.mode = "editing";
        editButton.textContent = "Zapisz";
      } else {

        text.textContent = editedItem.text;
        text.classList.remove("hidden");
        itemWrapper.removeChild(textEdit);
        editButton.dataset.mode = "readonly";
        editButton.textContent = "Edytuj";
        // storage first (handle rejection)
        if (this.#storage) this.#storage.onItemUpdated(editedItem)
      }
    });

    itemWrapper.appendChild(check);
    itemWrapper.appendChild(text);
    itemWrapper.appendChild(deleteButton);
    itemWrapper.appendChild(editButton);

    this.#listElement.appendChild(itemWrapper);

    this.#newItemTextElement.value = "";
    this.#setListMessage();
  }

  get #storage() {
    return this.#options?.storage;
  }

  #setListMessage() {
    const hasItems = this.#listElement.hasChildNodes();
    if (hasItems) {
      this.#listMessage.classList.add("hidden");
    } else {
      this.#listMessage.classList.remove("hidden");
    }
  }

  #initData() {
    if (this.#storage) {
      const list = this.#storage.onLoad();
      list.forEach(i => this.add(i))
    }
  }
}

export interface ListItem {
  id: number,
  text: string,
  isChecked: boolean
}

export interface PluginOptions {
  storage: StorageProvider
}

export type ListItemChangeHandler = (item: ListItem) => void

export interface StorageProvider {
  onItemAdded: ListItemChangeHandler
  onItemRemoved: ListItemChangeHandler
  onItemUpdated: ListItemChangeHandler
  onLoad: () => ListItem[]
}