import { MessageCategory, NotificationModel } from "../../../services/models/general/notification.model";
import { AbstractTemplate } from "../../abstract-template";

export class NotificationEntry extends AbstractTemplate<HTMLLIElement> {

  private notification : NotificationModel;

  // VBS Assignments
  private messageElement : HTMLParagraphElement;

  constructor(notification: NotificationModel) {
    super();

    this.notification = notification;
  }

  readTemplate(): string {
    return require('./notification-entry.html').default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.messageElement.textContent = this.notification.message;

    let backgroundColor : string = null;
    switch(this.notification.messageCategory) {
      case MessageCategory.INFO:
        backgroundColor = 'blue';
        break;
      case MessageCategory.ERROR:
        backgroundColor = 'red';
        break;
      case MessageCategory.SUCCESS:
        backgroundColor = 'green';
        break;
      case MessageCategory.WARN:
        backgroundColor = 'yellow';
        break;
    }

    this.element.style.backgroundColor = backgroundColor;
  }
}
