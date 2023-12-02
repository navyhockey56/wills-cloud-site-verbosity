import { AbstractTemplate } from "../../abstract-template";
import { IconTemplate } from "../../components/icon/icon-template";
import { UploadLocalFileForm } from "./components/upload-local-file-form";
import { UploadRemoteFileForm } from "./components/upload-remote-file-form";

export class FileUploadPage extends AbstractTemplate<HTMLElement> {
  private currentMount : HTMLElement;

  private localFileForm : UploadLocalFileForm;
  private remoteFileForm : UploadRemoteFileForm;

  // VBS Assignments
  private uploadFormMount : HTMLTemplateElement;
  private localFileIconSpan : HTMLSpanElement;
  private remoteFileIconSpan : HTMLSpanElement;

  readTemplate(): string {
    return require('./file-upload.html').default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.currentMount = this.uploadFormMount;

    this.appendChildTemplateToElement(this.localFileIconSpan, new IconTemplate({
      icon: 'house',
      yOffset: -6
    }));

    this.appendChildTemplateToElement(this.remoteFileIconSpan, new IconTemplate({
      icon: 'cloud',
      yOffset: -6
    }));
  }

  // VBS onclick event
  private uploadLocalFile(event : MouseEvent) : void {
    event.preventDefault();

    if (!this.localFileForm) {
      this.localFileForm = new UploadLocalFileForm();
    }

    this.dom.replaceElementWithTemplate(this.currentMount, this.localFileForm);
    this.currentMount = this.localFileForm.element;
  }

  // VBS onclick event
  private uploadRemoteFile(event: MouseEvent) : void {
    event.preventDefault();

    if (!this.remoteFileForm) {
      this.remoteFileForm = new UploadRemoteFileForm();
    }

    this.dom.replaceElementWithTemplate(this.currentMount, this.remoteFileForm);
    this.currentMount = this.remoteFileForm.element;
  }
}
