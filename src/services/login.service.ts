import { Callbacks } from "../constants/callbacks.enum";
import { VerbosityService } from "../_verbosity/verbosity-service";
import { MessageCategory, NotificationModel } from "./models/general/notification.model";
import { LoginRequest } from "./models/requests/login.request";
import { SessionService } from "./session.service";
import { createEndpoint } from "./tooling/request-helpers";

export class LoginService extends VerbosityService {
  async login(loginRequest: LoginRequest) : Promise<void> {
    const response : Response = await fetch(createEndpoint('login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginRequest)
    });

    if (!response.ok) {
      this.notifyLoginFailure();
      return null;
    }

    response.json().then(json => {
      const sessionService : SessionService = this.registry.getService(SessionService)
      sessionService.setSession(json['token']);
      this.notifyLoginSuccess();

      this.router.goTo('/');
    });
  }

  private notifyLoginSuccess() : void {
    const notificationCallback : (notification : NotificationModel) => void =
      this.registry.getCallback(Callbacks.ADD_NOTIFICATION.toString());

    notificationCallback({
      message: 'Login Success',
      messageCategory: MessageCategory.SUCCESS
    });
  }

  private notifyLoginFailure() : void {
    const notificationCallback : (notification : NotificationModel) => void =
      this.registry.getCallback(Callbacks.ADD_NOTIFICATION.toString());

    notificationCallback({
      message: 'Login Failed',
      messageCategory: MessageCategory.ERROR
    });
  }
}
