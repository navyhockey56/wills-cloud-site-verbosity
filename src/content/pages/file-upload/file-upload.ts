import { VBSComponent } from "../../../_verbosity/verbosity-component";
import { UploadLocalFileForm } from "./components/upload-local-file-form";
import { UploadRemoteFileForm } from "./components/upload-remote-file-form";

export class FileUploadPage extends VBSComponent<HTMLElement> {

  private currentMount : HTMLElement;

  private localFileForm : UploadLocalFileForm;
  private remoteFileForm : UploadRemoteFileForm;

  // VBS Assignments
  private uploadFormMount : HTMLTemplateElement;


  readTemplate(): string {
    return require('./file-upload.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  hasEventListeners(): boolean {
    return true;
  }

  beforeVBSComponentAdded(): void {
    this.currentMount = this.uploadFormMount;
  }

  // VBS onclick event
  private uploadLocalFile(event : MouseEvent) : void {
    event.preventDefault();

    if (!this.localFileForm) {
      this.localFileForm = new UploadLocalFileForm();
    }

    this.dom.replaceMount(this.currentMount, this.localFileForm);
    this.currentMount = this.localFileForm.template;
  }

  // VBS onclick event
  private uploadRemoteFile(event: MouseEvent) : void {
    event.preventDefault();

    if (!this.remoteFileForm) {
      this.remoteFileForm = new UploadRemoteFileForm();
    }

    this.dom.replaceMount(this.currentMount, this.remoteFileForm);
    this.currentMount = this.remoteFileForm.template;
  }
}
