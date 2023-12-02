import { VerbosityTemplate } from "verbosity-dom";
import { FileReferenceModel, isAudioFile, isImageFile, isPdfFile, isTextFile, isVideoFile } from "../../../../services/models/responses/file-reference.response";
import { AbstractTemplate } from "../../../abstract-template";
import { AudioViewer } from "./audio-viewer";
import { ImageViewer } from "./image-viwer";
import { PDFViewer } from "./pdf-viewer";
import { TextViewer } from "./text-viewer";
import { VideoViewer } from "./video-viewer";

export class MediaViewer extends AbstractTemplate<HTMLDivElement> {
  private contentDiv : HTMLDivElement;

  private fileReference! : FileReferenceModel;
  private replaceWithElement! : HTMLElement;

  constructor(fileReference : FileReferenceModel, replaceWithElement: HTMLElement) {
    super();

    this.fileReference = fileReference;
    this.replaceWithElement = replaceWithElement;
  }

  readTemplate(): string {
    require('./media-viewer.css');

    return require('./media-viewer.html').default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded() : void {
    let viewComponent : VerbosityTemplate<HTMLElement> = null;
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

    this.appendChildTemplateToElement(this.contentDiv, viewComponent);
  }

  private exitViewer() {
    this.dom.replaceTemplateWithElement(this, this.replaceWithElement);
  }
}
