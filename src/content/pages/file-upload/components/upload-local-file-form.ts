import { Callbacks } from "../../../../constants/callbacks.enum";
import { FileReferencesService } from "../../../../services/file-references.service";
import { NotificationModel, MessageCategory } from "../../../../services/models/general/notification.model";
import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class UploadLocalFileForm extends VBSComponent<HTMLElement> {
  private fileReferenceService : FileReferencesService;
  private selectedFile : File;

  // VBS Assignments
  private selectedFileNameElement : HTMLSpanElement;
  private fileInput : HTMLInputElement;
  private fileNameInput : HTMLInputElement;

  readTemplate(): string {
    return require('./upload-local-file-form.html').default;
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

  // VBS onclick event
  private onFileSelected(event : Event) : void {
    const files : FileList | null = this.fileInput.files;
    if (!files || files.length === 0) return;

    const file : File = files.item(0) as File;
    this.selectedFileNameElement.textContent = file.name;
    this.fileNameInput.value = file.name;
    this.selectedFile = file;
  }

  private uploadFile(event : MouseEvent) : void {
    event.preventDefault();

    const fileName = this.getFileName();
    if (!this.selectedFile || !fileName || fileName.length === 0) {
      this.sendNotification({
        message: 'You must first select a file and provide a name',
        messageCategory: MessageCategory.ERROR
      });

      return;
    }

    this.fileReferenceService.uploadLocalFile(fileName, this.selectedFile)
      .then(this.onUploadSuccess.bind(this));
  }

  private onUploadSuccess() : void {
    this.sendNotification({
      message: 'File Upload has Begun',
      messageCategory: MessageCategory.INFO
    });
  }

  private sendNotification(notification: NotificationModel) : void {
    const notificationCallback : (notification : NotificationModel) => void =
      this.registry.getCallback(Callbacks.ADD_NOTIFICATION.toString());

    notificationCallback(notification);
  }

  private getFileName() : string {
    if (!this.fileNameInput) return null;

    return this.fileNameInput.value;
  }
}
