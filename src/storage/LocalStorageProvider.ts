import { ListItem } from "../components/todo-plugin";
import StorageProviderBase from "./StorageProviderBase";

export default class LocalStorageProvider extends StorageProviderBase {
  #storePrefix: string = "todo"
  #storeName: string = "default"
  #storeDataCache: ListItem[] = []

  get storeKey() {
    return `${this.#storePrefix}-${this.#storeName}`
  }

  #saveData() {
    const rawData = JSON.stringify(this.#storeDataCache)
    localStorage.setItem(this.storeKey, rawData)
  }

  #loadData() {
    let data = []
    const rawData = localStorage.getItem(this.storeKey);
    if (rawData) {
      data = JSON.parse(rawData);
    }

    return data;
  }

  constructor(storeName: string) {
    super({
      onLoad: () => this.#storeDataCache,
      onItemAdded: item => {
        item.id = new Date().getTime();
        this.#storeDataCache.push(item);
        this.#saveData()
      },
      onItemUpdated: item => {
        const updateIndex = this.#storeDataCache.findIndex(i => i.id === item.id)
        this.#storeDataCache[updateIndex] = item;
        this.#saveData()
      },
      onItemRemoved: item => {
        const deleteIndex = this.#storeDataCache.findIndex(i => i.id === item.id)
        this.#storeDataCache.splice(deleteIndex, 1)
        this.#saveData()
      }
    })
    this.#storeName = storeName
    this.#storeDataCache = this.#loadData();
  }
}