import { VerbosityTemplate } from "verbosity-dom";
import { Callbacks } from "../../../constants/callbacks.enum";
import { FileReferencesService } from "../../../services/file-references.service";
import { MessageCategory } from "../../../services/models/general/notification.model";
import { PopUpModel } from "../../../services/models/general/pop-up.model";
import { FileReferenceModel, isAudioFile, isImageFile, isPdfFile, isTextFile, isVideoFile, prettyFileSize } from "../../../services/models/responses/file-reference.response";
import { isPlainLeftClick } from "../../../tools/event.tools";
import { AbstractTemplate } from "../../abstract-template";
import { AudioViewer } from "./components/audio-viewer";
import { ImageViewer } from "./components/image-viwer";
import { MediaViewer } from "./components/media-viewer";
import { PDFViewer } from "./components/pdf-viewer";
import { TextViewer } from "./components/text-viewer";
import { VideoViewer } from "./components/video-viewer";

export class FileReferenceView extends AbstractTemplate<HTMLElement> {
  // Instance parameters
  private fileId : number;
  private fileReference : FileReferenceModel;

  // vbs-assign fields:
  private fileNameElement : HTMLParagraphElement;
  private fileTypeElement : HTMLParagraphElement;
  private sourceElement : HTMLParagraphElement;
  private sizeElement : HTMLParagraphElement;
  private downloadFileButton : HTMLAnchorElement;
  private editFileButton : HTMLAnchorElement;
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

  beforeTemplateAdded(): void {
    this.populateTemplateWithFileData();

    if (!this.fileReference || !this.fileReference.download_url) {
      const fileService : FileReferencesService = this.registry.getSingleton(FileReferencesService);
      fileService.get(this.fileId, true).then((fileReference) => {
        if (!fileReference.okay) {
          throw Error('Unable to fetch file reference');
        }

        this.setFileReference(fileReference.data);
        this.populateTemplateWithFileData();
      });
    }
  }

  private populateTemplateWithFileData() {
    if (!this.fileReference) return;

    this.fileNameElement.textContent = this.fileReference.simple_file_name;
    this.fileTypeElement.textContent = this.fileReference.file_type;
    this.sourceElement.textContent = this.fileReference.original_source || 'Unknown';
    this.sizeElement.textContent = prettyFileSize(this.fileReference.bytes);

    this.downloadFileButton.href = this.fileReference.download_url;

    this.editFileButton.href = `/files/${this.fileReference.id}/edit`
    this.editFileButton.onclick = this.editFile.bind(this);
  }

  // vbs onclick event
  private viewFile() : void {
    if (!this.fileReference || !this.fileReference.download_url) return;

    this.dom.replaceElementWithTemplate(this.fileReferenceViewTemplate, new MediaViewer(this.fileReference, this.fileReferenceViewTemplate));
  }

  // vbs onclick event
  private editFile(event: MouseEvent) : void {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    this.router.goTo(`/files/${this.fileReference.id}/edit`, { fileReference: this.fileReference })
  }

  private deleteFileButtonClick(event : MouseEvent) : void {
    event.preventDefault();

    const popUpCallback : (popUpModel : PopUpModel) => void = this.registry.getCallback(Callbacks.ADD_POPUP.toString());
    popUpCallback({
      header: 'Are you sure?',
      message: "Once you delete a file, it cannot be restored via synchronization.",
      messageCategory: MessageCategory.WARN,
      buttons: [
        {
          buttonText: "Cancel",
          closePopUpOnClick: true,
          onClick: () => {} // Do nothing on cancellation
        },
        {
          buttonText: "Delete",
          closePopUpOnClick: true,
          onClick: this.onDeleteFileAccepted.bind(this)
        }
      ]
    })
  }

  private onDeleteFileAccepted(_event : MouseEvent) : void {
    const fileService : FileReferencesService = this.registry.getSingleton(FileReferencesService);

    fileService.delete(this.fileId).then(response => {
      if (!response.okay) {
        throw Error('Failed to delete file')
      }

      this.router.goTo('/')
    })
  }
}
