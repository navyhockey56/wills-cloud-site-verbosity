import { FileReferencesService } from "../../../services/file-references.service";
import { UpdateFileReferenceRequest } from "../../../services/models/requests/update.file-reference.request";
import { APIResponse } from "../../../services/models/responses/api-response";
import { FileReferenceModel } from "../../../services/models/responses/file-reference.response";
import { AbstractTemplate } from "../../abstract-template";

export class EditFileReferencePage extends AbstractTemplate<HTMLDivElement> {
  private fileReferencesService : FileReferencesService;

  // Instance parameters
  private fileId : number;
  private fileReference : FileReferenceModel;

  // VBS Assignments
  private fileNameInput : HTMLInputElement;
  private fileTypeInput : HTMLInputElement;

  readTemplate(): string {
    return require('./edit-file-reference.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  hasEventListeners(): boolean {
    return true;
  }

  setFileId(fileId: number) {
    this.fileId = fileId;
  }

  setFileReference(fileReference : FileReferenceModel) {
    this.fileReference = fileReference;
    this.fileId = this.fileReference.id;
  }

  beforeTemplateAdded(): void {
    this.fileReferencesService = this.registry.getSingleton(FileReferencesService);

    if (!this.fileReference) {
      this.loadFile();
    } else {
      this.onFileLoaded();
    }
  }

  private loadFile() : void {
    this.fileReferencesService.get(this.fileId, false).then((response : APIResponse<FileReferenceModel>) => {
      if (!response.okay) {
        throw Error("Failed to load file");
      }

      this.setFileReference(response.data);
      this.onFileLoaded();
    })
  }

  private onFileLoaded() : void {
    this.fileNameInput.value = this.fileReference.file_name;
    this.fileTypeInput.value = this.fileReference.file_type;
  }

  // VBS onclick event
  private saveFileChanges(event: MouseEvent) : void {
    const request : UpdateFileReferenceRequest = {};

    const fileName = this.fileNameInput.value;
    if (fileName !== this.fileReference.file_name) request.file_name = fileName;

    const fileType = this.fileTypeInput.value;
    if (fileType !== this.fileReference.file_type) request.file_type = fileType;

    if (Object.keys(request).length === 0) {
      this.router.goTo(`/files/${this.fileId}`, { fileReference: this.fileReference });
      return;
    }

    this.fileReferencesService.update(this.fileId, request).then((response) => {
      if (!response.okay) {
        throw Error("Failed to update file");
      }

      this.router.goTo(`/files/${this.fileId}`, { fileReference: response.data });
    });
  }
}
