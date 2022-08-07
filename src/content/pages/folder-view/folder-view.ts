import { FileReferencesService } from "../../../services/file-references.service";
import { FolderService } from "../../../services/folder.service";
import { FileReferenceModel } from "../../../services/models/responses/file-reference.response";
import { FolderResponse } from "../../../services/models/responses/folder.response";
import { VBSComponent } from "../../../_verbosity/verbosity-component";
import { FileReferenceListEntryVBSComponent } from "./components/file-reference-list-entry";
import { FoldersListEntryVBSComponent } from "./components/folder-list-entry";

export class FolderViewPage extends VBSComponent<HTMLElement> {
  private fileReferenceService : FileReferencesService;
  private folderService : FolderService;

  // Instance parameters
  private folder : FolderResponse;
  private folderId : number;

  // vbs-assign Fields:
  private filesMount : HTMLSpanElement;
  private foldersMount : HTMLSpanElement;

  hasAssignments(): boolean {
    return true;
  }

  setFolder(folder : FolderResponse) {
    this.folder = folder;
    this.folderId = folder.id;
  }

  setFolderId(folderId : number) {
    this.folderId = folderId;
  }

  readTemplate(): string {
    return require("./folder-view.html").default;
  }

  beforeVBSComponentAdded() : void {
    this.fileReferenceService = this.registry.getService(FileReferencesService);
    this.folderService = this.registry.getService(FolderService);

    this.loadFolder();
  }

  private loadFolder() : void {
    if (!this.folder || !this.folder.children_folders) {
      this.folderService.get(this.folderId).then((folderResponse : FolderResponse) => {
        this.setFolder(folderResponse);
        this.loadFolder();
      });

      return;
    }

    this.folder.children_folders.forEach(this.attachChildFolder.bind(this));
    this.loadFiles();
  }

  private attachChildFolder(childFolder: FolderResponse) {
    const folderListEntry = new FoldersListEntryVBSComponent(childFolder);
    this.appendChildToMount(this.foldersMount, folderListEntry, { id: `folder-entry-${childFolder.id}` });
  }

  private loadFiles() : void {
    this.fileReferenceService.list({ parent_folder: this.folder.id }).then((fileReferences : FileReferenceModel[]) => {
      fileReferences.forEach((fileReference : FileReferenceModel) => {
        const fileListEntry = new FileReferenceListEntryVBSComponent(fileReference);
        this.appendChildToMount(this.filesMount, fileListEntry, { id: `file-reference-entry-${fileReference.id}` });
      })
    });
  }
}
