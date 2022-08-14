import { FileReferencesService } from "../../../services/file-references.service";
import { FolderService } from "../../../services/folder.service";
import { FileReferenceModel } from "../../../services/models/responses/file-reference.response";
import { APIResponse, PaginatedAPIResponse } from "../../../services/models/responses/api-response";
import { FolderResponse } from "../../../services/models/responses/folder.response";
import { VBSComponent } from "../../../_verbosity/verbosity-component";
import { FileReferenceListEntryVBSComponent } from "./components/file-reference-list-entry";
import { FoldersListEntryVBSComponent } from "./components/folder-list-entry";
import { LoadMoreEntry } from "./components/load-more-entry";
import { nextPageRequest } from "../../../services/tooling/request-helpers";

export class FolderViewPage extends VBSComponent<HTMLElement> {
  private fileReferenceService : FileReferencesService;
  private folderService : FolderService;

  private fileReferenceResponse : PaginatedAPIResponse<FileReferenceModel[]>;
  private loadMoreEntry : LoadMoreEntry;

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
    this.fileReferenceService = this.registry.getSingleton(FileReferencesService);
    this.folderService = this.registry.getSingleton(FolderService);

    this.loadFolder();
  }

  private loadFolder() : void {
    if (!this.folder || !this.folder.children_folders) {
      this.folderService.get(this.folderId).then((folderResponse : APIResponse<FolderResponse>) => {
        if (!folderResponse.okay) {
          throw Error('Failed to fetch folder');
        }

        this.setFolder(folderResponse.data);
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
    const baseRequest = { parent_folder: this.folder.id };
    const request = this.fileReferenceResponse ? nextPageRequest(this.fileReferenceResponse, baseRequest) : baseRequest

    this.fileReferenceService.list(request).then((response : PaginatedAPIResponse<FileReferenceModel[]>) => {
      this.fileReferenceResponse = response;
      if (this.loadMoreEntry) {
        this.removeChildComponent(this.loadMoreEntry);
      }

      response.data.forEach((fileReference : FileReferenceModel) => {
        const fileListEntry = new FileReferenceListEntryVBSComponent(fileReference);
        this.appendChildToMount(this.filesMount, fileListEntry, { id: `file-reference-entry-${fileReference.id}` });
      });

      if (response.nextPage) {
        this.loadMoreEntry = new LoadMoreEntry(this.loadFiles.bind(this));
        this.appendChildToMount(this.filesMount, this.loadMoreEntry);
      }
    });
  }
}
