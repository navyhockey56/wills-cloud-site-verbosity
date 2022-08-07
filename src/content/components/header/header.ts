import { SessionService } from "../../../services/session.service";
import { VBSComponent } from "../../../_verbosity/verbosity-component";
import { LogoutButton } from "./logout-button";

export class Header extends VBSComponent<HTMLDivElement> {
  private sessionService : SessionService;

  // VBS Assignments
  private logoutButtonMount : HTMLElement;
  private logoutButtonVBSComponent: LogoutButton;
  private homeLogoElement : HTMLAnchorElement;

  private onSessionSetCallback : () => void;
  private onSessionClearedCallback : () => void;

  constructor() {
    super();

    this.onSessionSetCallback = this.bindLogoutButton.bind(this);
    this.onSessionClearedCallback = this.unbindLogoutButton.bind(this);
  }

  readTemplate(): string {
    return require('./header.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  hasEventListeners(): boolean {
    return true;
  }

  beforeVBSComponentAdded(): void {
    this.homeLogoElement.href = '/';

    this.sessionService = this.registry.getService(SessionService);
    this.sessionService.registerOnSessionSetCallback(this.onSessionSetCallback);
    this.sessionService.registerOnSessionClearedCallback(this.onSessionClearedCallback);

    if (!this.sessionService.hasSession()) return;

    this.bindLogoutButton();
  }

  beforeVBSComponentRemoved(): void {
    this.sessionService.unRegisterOnSessionSetCallback(this.onSessionSetCallback);
    this.sessionService.unRegisterOnSessionClearedCallback(this.onSessionClearedCallback);
  }

  private bindLogoutButton() : void {
    this.logoutButtonVBSComponent = new LogoutButton();
    this.appendChildToMount(this.logoutButtonMount, this.logoutButtonVBSComponent);
  }

  private unbindLogoutButton() : void {
    this.dom.removeChildVBSComponent(this, this.logoutButtonVBSComponent)
  }

  private goHome(event : MouseEvent) : void {
    event.preventDefault();

    console.log("Going home...")
    this.router.goTo('/');
  }
}
