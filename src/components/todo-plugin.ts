export class ToDoList {
    #listElement = document.createElement("ul");
    #addButtonElement = document.createElement("button");
    #newItemTextElement = document.createElement("textarea");
    #listMessage = document.createElement("div");
  
    constructor(parent: HTMLElement) {
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
    }
  
    add() {
      const itemWrapper = document.createElement("li");
      itemWrapper.classList.add("todo-item");
  
      const check = document.createElement("input");
      check.type = "checkbox";
  
      check.addEventListener("change", () => {
        itemWrapper.classList.toggle("todo-item-done");
      });
  
      const text = document.createElement("div");
      text.textContent = this.#newItemTextElement.value;
      text.classList.add("todo-item-text");
  
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Usuń";
      deleteButton.addEventListener("click", () => {
        this.#listElement.removeChild(itemWrapper);
        this.#setListMessage();
      });
  
      const editButton = document.createElement("button");
      editButton.textContent = "Edytuj";
      editButton.dataset.mode = "readonly";
  
      let textEdit: HTMLTextAreaElement;
      editButton.addEventListener("click", () => {
        if (editButton.dataset.mode === "readonly") {
          textEdit = document.createElement("textarea")
          textEdit.value = text.textContent ?? "";
          check.after(textEdit);
          text.classList.add("hidden");
          editButton.dataset.mode = "editing";
          editButton.textContent = "Zapisz";
        } else {
          text.textContent = textEdit.value;
          text.classList.remove("hidden");
          itemWrapper.removeChild(textEdit);
          editButton.dataset.mode = "readonly";
          editButton.textContent = "Edytuj";
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

    #setListMessage(){
      const hasItems = this.#listElement.hasChildNodes();
      if (hasItems) {
        this.#listMessage.classList.add("hidden");
      } else {
        this.#listMessage.classList.remove("hidden");
      }
    }
  }
  