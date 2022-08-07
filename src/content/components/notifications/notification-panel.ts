import { Callbacks } from "../../../constants/callbacks.enum";
import { NotificationModel } from "../../../services/models/general/notification.model";
import { VBSComponent } from "../../../_verbosity/verbosity-component";
import { NotificationEntry } from "./notification-entry";

export class NotificationPanel extends VBSComponent<HTMLUListElement> {

  readTemplate(): string {
    return require('./notification-panel.html').default;
  }

  beforeVBSComponentAdded(): void {
    this.registry.registerCallback(
      Callbacks.ADD_NOTIFICATION.toString(),
      this.addNotification.bind(this)
    );
  }

  private addNotification(notification: NotificationModel) {
    const notificationEntry : NotificationEntry = new NotificationEntry(notification);
    this.appendChildToMount(this.template, notificationEntry);

    setTimeout(() => {
      this.removeChildComponent(notificationEntry);
    }, notification.timeout || 2000);
  }
}
