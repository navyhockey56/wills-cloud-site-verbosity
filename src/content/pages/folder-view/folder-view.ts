import { FileReferencesService } from "../../../services/file-references.service";
import { FolderService } from "../../../services/folder.service";
import { FileReferenceModel } from "../../../services/models/responses/file-reference.response";
import { APIResponse, PaginatedAPIResponse } from "../../../services/models/responses/api-response";
import { FolderResponse } from "../../../services/models/responses/folder.response";
import { FileReferenceListEntry} from "./components/file-reference-list-entry";
import { FoldersListEntry } from "./components/folder-list-entry";
import { LoadMoreEntry } from "./components/load-more-entry";
import { nextPageRequest } from "../../../services/tooling/request-helpers";
import { AbstractTemplate } from "../../abstract-template";
import { SessionService } from "../../../services/session.service";
import { NotificationService } from "../../../services/notification.service";
import { MessageCategory } from "../../../services/models/general/notification.model";
import { IconTemplate } from "../../components/icon/icon-template";

export class FolderViewPage extends AbstractTemplate<HTMLElement> {
  private fileReferenceService : FileReferencesService;
  private folderService : FolderService;
  private notifcationService : NotificationService;

  private fileReferenceResponse : PaginatedAPIResponse<FileReferenceModel[]>;
  private loadMoreEntry : LoadMoreEntry;

  private isPrivateModeEnabled : boolean;

  // Instance parameters
  private folder : FolderResponse;
  private folderId : number;

  // vbs-assign Fields:
  private filesMount : HTMLSpanElement;
  private foldersMount : HTMLSpanElement;
  private folderPathElement : HTMLParagraphElement;
  private privateModeButtonDiv : HTMLDivElement;
  private privateModeButton : HTMLButtonElement;
  private goToParentFolderSpan : HTMLSpanElement;

  hasBindings(): boolean {
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

  beforeTemplateAdded() : void {
    this.fileReferenceService = this.registry.getSingleton(FileReferencesService);
    this.folderService = this.registry.getSingleton(FolderService);
    this.notifcationService = this.registry.getSingleton(NotificationService);

    this.isPrivateModeEnabled = (this.registry.getSingleton(SessionService) as SessionService).isPrivateModeEnabled();
    if (!this.isPrivateModeEnabled) {
      this.privateModeButtonDiv.remove();
    }

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

    if (this.folder.folder_id) {
      this.appendChildTemplateToElement(this.goToParentFolderSpan, new IconTemplate({ icon: 'back-arrow' }));
      this.goToParentFolderSpan.onclick = () => { this.router.goTo(`folders/${this.folder.folder_id}`) }
      this.goToParentFolderSpan.title = "Go To Parent Folder";
    }

    this.folderPathElement.textContent = `${this.folder.path}`;
    this.setPrivateModeButtonText();

    this.folder.children_folders.forEach(this.attachChildFolder.bind(this));
    this.loadFiles();
  }

  private attachChildFolder(childFolder: FolderResponse) {
    const folderListEntry = new FoldersListEntry(childFolder);
    this.appendChildTemplateToElement(this.foldersMount, folderListEntry, { id: `folder-entry-${childFolder.id}` });
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
        const fileListEntry = new FileReferenceListEntry(fileReference);
        this.appendChildTemplateToElement(this.filesMount, fileListEntry, { id: `file-reference-entry-${fileReference.id}` });
      });

      if (response.nextPage) {
        this.loadMoreEntry = new LoadMoreEntry(this.loadFiles.bind(this));
        this.appendChildTemplateToElement(this.filesMount, this.loadMoreEntry);
      }
    });
  }

  private setPrivateModeButtonText() : void {
    this.privateModeButton.textContent = `${this.folder.private ? 'Make Public' : 'Make Private'}`;
  }

  private togglePrivacy() : void {
    this.folderService.update(this.folderId, !this.folder.private).then(() => {
      this.folder.private = !this.folder.private;
      this.setPrivateModeButtonText();
      this.notifcationService.notify({
        message: 'Update complete',
        messageCategory: MessageCategory.SUCCESS,
        timeout: 1000
      });
    });
  }
}
