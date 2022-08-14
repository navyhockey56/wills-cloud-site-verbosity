import { SessionService } from "../../../services/session.service";
import { VBSComponent } from "../../../_verbosity/verbosity-component";

export class LogoutButton extends VBSComponent<HTMLAnchorElement> {
  private sessionService : SessionService;

  readTemplate(): string {
    return require('./logout-button.html').default;
  }

  hasEventListeners(): boolean {
    return true;
  }

  beforeVBSComponentAdded(): void {
    this.sessionService = this.registry.getSingleton(SessionService);
    this.template.href = '/login';
  }

  onClick(event: MouseEvent) : void {
    event.preventDefault();

    this.sessionService.clearSession();
  }
}
