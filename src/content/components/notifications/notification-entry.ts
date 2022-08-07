import { MessageCategory, NotificationModel } from "../../../services/models/general/notification.model";
import { VBSComponent } from "../../../_verbosity/verbosity-component";

export class NotificationEntry extends VBSComponent<HTMLLIElement> {

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

  hasAssignments(): boolean {
    return true;
  }

  beforeVBSComponentAdded(): void {
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

    this.template.style.backgroundColor = backgroundColor;
  }
}
