import { Callbacks } from "../../../../constants/callbacks.enum";
import { Icons } from "../../../../constants/icons.enum";
import { FileReferencesService } from "../../../../services/file-references.service";
import { NotificationModel, MessageCategory } from "../../../../services/models/general/notification.model";
import { APIResponse } from "../../../../services/models/responses/api-response";
import { AbstractTemplate } from "../../../abstract-template";
import { IconTemplate } from "../../../components/icon/icon-template";

export class UploadRemoteFileForm extends AbstractTemplate<HTMLElement> {
  private fileReferenceService : FileReferencesService;

  // VBS assignments
  private fileUrlInput : HTMLInputElement;
  private fileNameInput : HTMLInputElement;
  private beginUploadIconSpan : HTMLSpanElement;

  readTemplate(): string {
    return require('./upload-remote-file-form.html').default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.fileReferenceService = this.registry.getSingleton(FileReferencesService);

    this.appendChildTemplateToElement(this.beginUploadIconSpan, new IconTemplate({
      icon: Icons.UPLOAD,
      yOffset: -6
    }));
  }

  // VBS onclick event
  private uploadFile(event : MouseEvent): void {
    event.preventDefault();

    const fileUrl = this.getFileUrl();
    const fileName = this.getFileName();
    if (!fileUrl || !fileName) {
      this.sendNotification({
        message: 'You must first select a URL and provide a name',
        messageCategory: MessageCategory.ERROR
      });

      return;
    }

    this.fileReferenceService.uploadRemoteFile({
      file_name: fileName,
      download_link: fileUrl
    }).then(this.onUploadResponse.bind(this));
  }

  private onUploadResponse(response : APIResponse<void>) : void {
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

  private getFileUrl() : string {
    if (!this.fileUrlInput) return null;

    return this.fileUrlInput.value;
  }

  private getFileName() : string {
    if (!this.fileNameInput) return null;

    return this.fileNameInput.value;
  }
}
