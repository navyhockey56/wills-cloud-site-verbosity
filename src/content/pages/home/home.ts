import { FolderService } from "../../../services/folder.service";
import { FolderResponse } from "../../../services/models/responses/folder.response";
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
    this.folderService = this.registry.getService(FolderService);

    this.folderService.getRootFolder().then(rootFolder => {
      this.rootFolder = rootFolder
      this.explorerButton.href = `/folders/${this.rootFolder.id}`;
    });
  }

  // vbs-event-onclick
  private onExplorerButtonClick(event : MouseEvent) : void {
    event.preventDefault();
    if (!this.rootFolder) return;

    this.router.goTo(`/folders/${this.rootFolder.id}`, { folder: this.rootFolder });
  }

  // VBS event onclick
  private onUploadButtonClick(event : MouseEvent) : void {
    event.preventDefault();

    this.router.goTo('/upload');
  }
}
