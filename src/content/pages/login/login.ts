import { LoginService } from "../../../services/login.service";
import { VBSComponent } from "../../../_verbosity/verbosity-component";

export class LoginPage extends VBSComponent<HTMLElement> {
  private loginService : LoginService;

  // vbs-assign fields
  private usernameInput : HTMLInputElement;
  private passwordInput : HTMLInputElement;

  readTemplate() : string {
    return require('./login.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  hasEventListeners(): boolean {
    return true;
  }

  beforeVBSComponentAdded() : void {
    this.loginService = this.registry.getService(LoginService);
  }

  // vbs-event
  private onEnterInPasswordField(event: KeyboardEvent) {
    if (event.key === 'Enter') this.login();
  }

  // vbs-event
  private login() {
    this.loginService.login({
      username: this.getUsername(),
      password: this.getPassword()
    })
  }

  private getUsername() : string {
    return this.usernameInput.value;
  }

  private getPassword() : string {
    return this.passwordInput.value;
  }
}
