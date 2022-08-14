import { FolderService } from "../../../services/folder.service";
import { FolderResponse } from "../../../services/models/responses/folder.response";
import { isPlainLeftClick } from "../../../tools/event.tools";
import { VBSComponent } from "../../../_verbosity/verbosity-component";

export class HomePage extends VBSComponent<HTMLDivElement> {

  private folderService : FolderService;
  private rootFolder : FolderResponse;

  // vbs assign fields
  private explorerButton : HTMLAnchorElement;

  readTemplate(): string {
    return require("./home.html").default;
  }

  hasEventListeners(): boolean {
    return true;
  }

  hasAssignments(): boolean {
    return true;
  }

  beforeVBSComponentAdded() : void {
    this.folderService = this.registry.getSingleton(FolderService);

    this.folderService.getRootFolder().then(rootFolder => {
      if (!rootFolder.okay) {
        throw Error('Unable to fetch root folder');
      }

      this.rootFolder = rootFolder.data
      this.explorerButton.href = `/folders/${this.rootFolder.id}`;
    });
  }

  // vbs-event-onclick
  private onExplorerButtonClick(event : MouseEvent) : void {
    if (!isPlainLeftClick(event) || !this.rootFolder) return;

    event.preventDefault();
    this.router.goTo(`/folders/${this.rootFolder.id}`, { folder: this.rootFolder });
  }

  // VBS event onclick
  private onUploadButtonClick(event : MouseEvent) : void {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    this.router.goTo('/upload');
  }

  private onSearchButtonClick(event : MouseEvent) : void {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    this.router.goTo('/search');
  }
}
