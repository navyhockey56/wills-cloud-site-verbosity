import { Callbacks } from "../../../../constants/callbacks.enum";
import { Icons } from "../../../../constants/icons.enum";
import { FileReferencesService } from "../../../../services/file-references.service";
import { NotificationModel, MessageCategory } from "../../../../services/models/general/notification.model";
import { APIResponse } from "../../../../services/models/responses/api-response";
import { AbstractTemplate } from "../../../abstract-template";
import { IconTemplate } from "../../../components/icon/icon-template";

export class UploadLocalFileForm extends AbstractTemplate<HTMLElement> {
  private fileReferenceService : FileReferencesService;
  private selectedFile : File;

  private isUploadingFile : boolean = false;

  // VBS Assignments
  private selectedFileNameElement : HTMLSpanElement;
  private fileInput : HTMLInputElement;
  private fileNameInput : HTMLInputElement;
  private uploadFileButton : HTMLAnchorElement;
  private selectFileIconSpan : HTMLSpanElement;
  private beginUploadIconSpan : HTMLSpanElement;

  readTemplate(): string {
    return require('./upload-local-file-form.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  hasEventListeners(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.fileReferenceService = this.registry.getSingleton(FileReferencesService);

    this.appendChildTemplateToElement(this.selectFileIconSpan, new IconTemplate({
      icon: Icons.PAPERCLIP,
    }));

    this.appendChildTemplateToElement(this.beginUploadIconSpan, new IconTemplate({
      icon: Icons.UPLOAD,
      yOffset: -6
    }));
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

  // VBS onclick event
  private uploadFile(event : MouseEvent) : void {
    event.preventDefault();

    if (this.isUploadingFile) {
      this.sendNotification({
        message: 'You are already uploading a file',
        messageCategory: MessageCategory.ERROR
      });

      return;
    }

    const fileName = this.getFileName();
    if (!this.selectedFile || !fileName || fileName.length === 0) {
      this.sendNotification({
        message: 'You must first select a file and provide a name',
        messageCategory: MessageCategory.ERROR
      });

      return;
    }

    this.isUploadingFile = true;
    this.uploadFileButton.textContent = 'Uploading...'

    this.fileReferenceService.uploadLocalFile(fileName, this.selectedFile)
      .then(this.onUploadResponse.bind(this));
  }

  private onUploadResponse(response : APIResponse<void>) : void {
    this.isUploadingFile = false;
    this.uploadFileButton.textContent = 'Begin Upload'

    if (!response.okay) {
      this.sendNotification({
        message: 'An error occurred when uploading your file',
        messageCategory: MessageCategory.ERROR
      });
    } else {
      this.sendNotification({
        message: 'File Upload has Begun',
        messageCategory: MessageCategory.INFO
      });
    }
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
