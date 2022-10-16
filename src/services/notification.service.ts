import { VerbosityRegistry } from "verbosity";
import { Callbacks } from "../constants/callbacks.enum";
import { NotificationModel } from "./models/general/notification.model";
import { PopUpModel } from "./models/general/pop-up.model";

export class NotificationService {
  private registry! : VerbosityRegistry;

  private _noticationCallback : (notication: NotificationModel) => void;
  private _popUpCallback : (popUp : PopUpModel) => void;

  constructor(registry : VerbosityRegistry) {
    this.registry = registry;
  }

  notify(notication : NotificationModel) {
    const callback = this.noticationCallback();
    if (!callback) return;

    callback(notication);
  }

  popUp(popUp : PopUpModel) {
    const callback = this.noticationCallback();
    if (!callback) return;

    callback(popUp);
  }

  private noticationCallback() : (notication : NotificationModel) => void | null {
    this._noticationCallback = this.registry.getCallback(Callbacks.ADD_NOTIFICATION.toString());
    return this._noticationCallback;
  }

  private popUpCallback() : (notication : PopUpModel) => void | null {
    this._popUpCallback = this.registry.getCallback(Callbacks.ADD_POPUP.toString());
    return this._popUpCallback;
  }
}
