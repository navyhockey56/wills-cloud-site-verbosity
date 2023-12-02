import { Callbacks } from "../../../constants/callbacks.enum";
import { LoginService } from "../../../services/login.service";
import { NotificationModel, MessageCategory } from "../../../services/models/general/notification.model";
import { APIResponse } from "../../../services/models/responses/api-response";
import { LoginResponse } from "../../../services/models/responses/login.response";
import { SessionService } from "../../../services/session.service";
import { isEnterKeyPress } from "../../../tools/event.tools";
import { AbstractTemplate } from "../../abstract-template";
import { IconTemplate } from "../../components/icon/icon-template";

export class LoginPage extends AbstractTemplate<HTMLElement> {
  private loginService : LoginService;

  // vbs-assign fields
  private usernameInput : HTMLInputElement;
  private passwordInput : HTMLInputElement;

  private usernameIconSpan : HTMLSpanElement;
  private passwordIconSpan : HTMLSpanElement;

  readTemplate() : string {
    return require('./login.html').default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded() : void {
    this.loginService = this.registry.getSingleton(LoginService);
    this.appendChildTemplateToElement(this.usernameIconSpan, new IconTemplate({ icon: 'user' }));
    this.appendChildTemplateToElement(this.passwordIconSpan, new IconTemplate({ icon: 'lock' }));
  }

  // vbs-event
  private onEnterInPasswordField(event: KeyboardEvent) {
    if (isEnterKeyPress(event)) this.login();
  }

  // vbs-event
  private login() {
    this.loginService.login({
      username: this.getUsername(),
      password: this.getPassword()
    }).then((response : APIResponse<LoginResponse>) => {
      if (!response.okay) {
        this.notifyLoginFailure();
      }

      const sessionService : SessionService = this.registry.getSingleton(SessionService)
      sessionService.setSession(response.data.token);
      this.notifyLoginSuccess();

      this.router.goTo('/');
    })
  }

  private getUsername() : string {
    return this.usernameInput.value;
  }

  private getPassword() : string {
    return this.passwordInput.value;
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
