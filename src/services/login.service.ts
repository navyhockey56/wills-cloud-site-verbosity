import { ADD_NOTIFICATION } from "../content/components/notifications/notification-panel";
import { VerbosityService } from "../_verbosity/verbosity-service";
import { MessageCategory, NotificationModel } from "./models/general/notification.model";
import { LoginRequest } from "./models/requests/login.request";
import { SessionService } from "./session.service";

export class LoginService extends VerbosityService {
  async login(loginRequest: LoginRequest) : Promise<void> {
    const response : Response = await fetch('http://localhost:3000/api/v1/login', {
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
    const notificationCallback : (notification : NotificationModel) => void = this.registry.getCallback(ADD_NOTIFICATION);
    notificationCallback({
      message: 'Login Success',
      messageCategory: MessageCategory.SUCCESS
    });
  }

  private notifyLoginFailure() : void {
    const notificationCallback : (notification : NotificationModel) => void = this.registry.getCallback(ADD_NOTIFICATION);
    notificationCallback({
      message: 'Login Failed',
      messageCategory: MessageCategory.ERROR
    });
  }
}
