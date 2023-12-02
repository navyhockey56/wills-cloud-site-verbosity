import { Callbacks } from "../../../constants/callbacks.enum";
import { NotificationModel } from "../../../services/models/general/notification.model";
import { AbstractTemplate } from "../../abstract-template";
import { NotificationEntry } from "./notification-entry";

export class NotificationPanel extends AbstractTemplate<HTMLUListElement> {

  readTemplate(): string {
    return require('./notification-panel.html').default;
  }

  hasBindings(): boolean {
    return false;
  }

  beforeTemplateAdded(): void {
    this.registry.registerCallback(
      Callbacks.ADD_NOTIFICATION.toString(),
      this.addNotification.bind(this)
    );
  }

  private addNotification(notification: NotificationModel) {
    const notificationEntry : NotificationEntry = new NotificationEntry(notification);
    this.appendChildTemplateToElement(this.element, notificationEntry);

    setTimeout(() => {
      this.removeChildComponent(notificationEntry);
    }, notification.timeout || 2000);
  }
}
