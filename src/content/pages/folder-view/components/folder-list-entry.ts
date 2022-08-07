import { FolderResponse } from "../../../../services/models/responses/folder.response";
import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class FoldersListEntryVBSComponent extends VBSComponent<HTMLAnchorElement> {
  private folder : FolderResponse;

  constructor(folder : FolderResponse) {
    super();

    this.folder = folder;
  }

  readTemplate(): string {
    return require("./folder-list-entry.html").default;
  }

  hasEventListeners(): boolean {
    return true;
  }

  onVBSComponentAdded() : void {
    this.template.text = `Folder: ${this.folder.folder_name}`;
    this.template.href = this.folderPath();
  }

  // vbs-event-onclick
  private onClick(event : MouseEvent) {
    event.preventDefault();
    this.router.goTo(this.folderPath(), { folder: this.folder });
  }

  private folderPath() : string {
    return `/folders/${this.folder.id}`;
  }
}
