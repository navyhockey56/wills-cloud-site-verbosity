import { FileReferencesService } from "../../../services/file-references.service";
import { PaginatedAPIResponse } from "../../../services/models/responses/api-response";
import { FileReferenceModel } from "../../../services/models/responses/file-reference.response";
import { nextPageRequest } from "../../../services/tooling/request-helpers";
import { isEnterKeyPress } from "../../../tools/event.tools";
import { VBSComponent } from "../../../_verbosity/verbosity-component";
import { FileReferenceListEntryVBSComponent } from "../folder-view/components/file-reference-list-entry";
import { LoadMoreEntry } from "../folder-view/components/load-more-entry";

export class SearchPage extends VBSComponent<HTMLElement> {
  private fileReferenceService : FileReferencesService;
  private fileReferenceResponse : PaginatedAPIResponse<FileReferenceModel[]>;
  private loadMoreEntry : LoadMoreEntry;

  // VBS Assignments
  private searchInput : HTMLInputElement;
  private searchResultsMount : HTMLSpanElement;

  readTemplate(): string {
    return require('./search.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  hasEventListeners(): boolean {
    return true;
  }

  beforeVBSComponentAdded(): void {
    this.fileReferenceService = this.registry.getSingleton(FileReferencesService);
  }

  private onEnterPress(event : KeyboardEvent) : void {
    if (isEnterKeyPress(event)) this.onSearch(event);
  }

  private onSearch(event: Event) : void {
    event.preventDefault();

    const request = { file_name: this.searchInput.value };
    this.fileReferenceService.list(request).then((response : PaginatedAPIResponse<FileReferenceModel[]>) => {
      this.fileReferenceResponse = response;

      if (!response.okay) {
        throw Error(`An error occurred ${response}`);
      }

      this.removeAllChildren();

      response.data.forEach((fileReference : FileReferenceModel) => {
        const fileListEntry = new FileReferenceListEntryVBSComponent(fileReference);
        this.appendChildToMount(this.searchResultsMount, fileListEntry, { id: `file-reference-entry-${fileReference.id}` });
      });

      if (response.nextPage) {
        this.loadMoreEntry = new LoadMoreEntry(this.loadMore.bind(this));
        this.appendChildToMount(this.searchResultsMount, this.loadMoreEntry);
      }
    })
  }

  private loadMore() : void {
    const request = nextPageRequest(this.fileReferenceResponse, { file_name: this.searchInput.value });

    this.fileReferenceService.list(request).then((response : PaginatedAPIResponse<FileReferenceModel[]>) => {
      this.fileReferenceResponse = response;

      if (!response.okay) {
        throw Error(`An error occurred ${response}`);
      }

      if (this.loadMoreEntry) {
        this.removeChildComponent(this.loadMoreEntry);
      }

      response.data.forEach((fileReference : FileReferenceModel) => {
        const fileListEntry = new FileReferenceListEntryVBSComponent(fileReference);
        this.appendChildToMount(this.searchResultsMount, fileListEntry, { id: `file-reference-entry-${fileReference.id}` });
      });

      if (response.nextPage) {
        this.loadMoreEntry = new LoadMoreEntry(this.loadMore.bind(this));
        this.appendChildToMount(this.searchResultsMount, this.loadMoreEntry);
      }
    })
  }
}
