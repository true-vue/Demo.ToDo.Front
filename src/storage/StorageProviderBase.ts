import type { ListItemChangeHandler, ListItem, StorageProvider } from "../components/todo-plugin"

export default class StorageProviderBase implements StorageProvider {
    onItemAdded: ListItemChangeHandler
    onItemRemoved: ListItemChangeHandler
    onItemUpdated: ListItemChangeHandler
    onLoad: () => ListItem[]

    constructor(cfg: StorageProvider) {
        this.onItemAdded = cfg.onItemAdded
        this.onItemRemoved = cfg.onItemRemoved
        this.onItemUpdated = cfg.onItemUpdated
        this.onLoad = cfg.onLoad
    }
}