import { Callbacks } from "../../../constants/callbacks.enum";
import { FileReferencesService } from "../../../services/file-references.service";
import { MessageCategory } from "../../../services/models/general/notification.model";
import { PopUpModel } from "../../../services/models/general/pop-up.model";
import { FileReferenceModel, isAudioFile, isImageFile, isPdfFile, isTextFile, isVideoFile, prettyFileSize } from "../../../services/models/responses/file-reference.response";
import { isPlainLeftClick } from "../../../tools/event.tools";
import { VBSComponent } from "../../../_verbosity/verbosity-component";
import { AudioViewer } from "./components/audio-viewer";
import { ImageViewer } from "./components/image-viwer";
import { PDFViewer } from "./components/pdf-viewer";
import { TextViewer } from "./components/text-viewer";
import { VideoViewer } from "./components/video-viewer";

export class FileReferenceView extends VBSComponent<HTMLElement> {
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

  beforeVBSComponentAdded(): void {
    this.populateTemplateWithFileData();

    if (!this.fileReference || !this.fileReference.download_url) {
      const fileService : FileReferencesService = this.registry.getSingleton(FileReferencesService);
      fileService.get(this.fileId, true).then((fileReference) => {
        console.log(fileReference)
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

    this.fileNameElement.textContent = this.fileReference.file_name;
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

    let viewComponent : VBSComponent<HTMLElement> = null;
    if (isImageFile(this.fileReference)) {
      viewComponent = new ImageViewer(this.fileReference.download_url);
    } else if (isAudioFile(this.fileReference)) {
      viewComponent = new AudioViewer(this.fileReference.download_url);
    } else if (isVideoFile(this.fileReference)) {
      viewComponent = new VideoViewer(this.fileReference.download_url);
    } else if (isTextFile(this.fileReference)) {
      viewComponent = new TextViewer(this.fileReference.download_url);
    } else if (isPdfFile(this.fileReference)) {
      viewComponent = new PDFViewer(this.fileReference.download_url);
    }

    if (!viewComponent) {
      throw Error(`No file viewer exists for file type ${this.fileReference.file_type}`);
    }

    this.dom.replaceMount(this.fileReferenceViewTemplate, viewComponent);
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
