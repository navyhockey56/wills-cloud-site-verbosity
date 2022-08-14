import { CallbackGroups } from "../../../constants/callbacks.enum";
import { SessionService } from "../../../services/session.service";
import { isPlainLeftClick } from "../../../tools/event.tools";
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

    this.registry.registerWithCallbackGroup(
      CallbackGroups.ON_SESSION_SET.toString(),
      this.onSessionSetCallback
    );

    this.registry.registerWithCallbackGroup(
      CallbackGroups.ON_SESSION_CLEARED.toString(),
      this.onSessionClearedCallback
    );

    this.sessionService = this.registry.getSingleton(SessionService);
    if (!this.sessionService.hasSession()) return;

    this.bindLogoutButton();
  }

  beforeVBSComponentRemoved(): void {
    this.registry.unregisterWithCallbackGroup(
      CallbackGroups.ON_SESSION_SET.toString(),
      this.onSessionSetCallback
    );

    this.registry.unregisterWithCallbackGroup(
      CallbackGroups.ON_SESSION_CLEARED.toString(),
      this.onSessionClearedCallback
    );
  }

  private bindLogoutButton() : void {
    this.logoutButtonVBSComponent = new LogoutButton();
    this.appendChildToMount(this.logoutButtonMount, this.logoutButtonVBSComponent);
  }

  private unbindLogoutButton() : void {
    this.dom.removeChildVBSComponent(this, this.logoutButtonVBSComponent)
  }

  // VBS onclick event
  private goHome(event : MouseEvent) : void {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    this.router.goTo('/');
  }
}
