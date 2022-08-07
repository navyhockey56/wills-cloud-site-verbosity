import { FileReferencesService } from "../../../services/file-references.service";
import { FileReferenceModel, isAudioFile, isImageFile, isVideoFile } from "../../../services/models/responses/file-reference.response";
import { VBSComponent } from "../../../_verbosity/verbosity-component";
import { AudioViewer } from "./components/audio-viewer";
import { ImageViewer } from "./components/image-viwer";
import { VideoViewer } from "./components/video-viewer";

export class FileReferenceView extends VBSComponent<HTMLElement> {
  // Instance parameters
  private fileId : number;
  private fileReference : FileReferenceModel;

  // vbs-assign fields:
  private fileNameElement : HTMLParagraphElement;
  private fileTypeElement : HTMLParagraphElement;
  private downloadFileButton : HTMLAnchorElement;
  private fileReferenceViewTemplate : HTMLTemplateElement;

  readTemplate(): string {
    return require('./file-reference-view.html').default;
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

  beforeVBSComponentAdded(): void {
    this.populateTemplateWithFileData();

    if (!this.fileReference || !this.fileReference.download_url) {
      const fileService : FileReferencesService = this.registry.getService(FileReferencesService);
      fileService.get(this.fileId, true).then((fileReference) => {
        this.setFileReference(fileReference);
        this.populateTemplateWithFileData();
      });
    }
  }

  private populateTemplateWithFileData() {
    if (!this.fileReference) return;

    this.fileNameElement.textContent = this.fileReference.file_name;
    this.fileTypeElement.textContent = this.fileReference.file_type;
    this.downloadFileButton.href = this.fileReference.download_url;
  }

  // vbs onclick event
  private viewFile() : void {
    if (!this.fileReference || !this.fileReference.download_url) return;

    let viewComponent : VBSComponent<HTMLElement> = null;
    if (isImageFile(this.fileReference)) {
      viewComponent = new ImageViewer(this.fileReference.download_url);
    } else if (isAudioFile(this.fileReference)) {
      viewComponent = new AudioViewer(this.fileReference.download_url);
    } else if (isVideoFile(this.fileReference)) {
      viewComponent = new VideoViewer(this.fileReference.download_url);
    }

    if (!viewComponent) {
      throw Error(`No file viewer exists for file type ${this.fileReference.file_type}`);
    }

    this.dom.replaceMount(this.fileReferenceViewTemplate, viewComponent);
  }
}
