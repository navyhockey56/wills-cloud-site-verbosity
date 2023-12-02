import { CallbackGroups } from "../../../constants/callbacks.enum";
import { SessionService } from "../../../services/session.service";
import { isPlainLeftClick } from "../../../tools/event.tools";
import { AbstractTemplate } from "../../abstract-template";
import { LogoutButton } from "./logout-button";

export class Header extends AbstractTemplate<HTMLDivElement> {
  private sessionService : SessionService;

  // VBS Assignments
  private logoutButtonMount : HTMLElement;
  private logoutButtonVerbosityTemplate: LogoutButton;
  private homeLogoElement : HTMLAnchorElement;

  private onSessionSetCallback : () => void;
  private onSessionClearedCallback : () => void;

  readTemplate(): string {
    return require('./header.html').default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.onSessionSetCallback = this.bindLogoutButton.bind(this);
    this.onSessionClearedCallback = this.unbindLogoutButton.bind(this);

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

  beforeTemplateRemoved(): void {
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
    this.logoutButtonVerbosityTemplate = new LogoutButton();
    this.appendChildTemplateToElement(this.logoutButtonMount, this.logoutButtonVerbosityTemplate);
  }

  private unbindLogoutButton() : void {
    this.removeChildComponent(this.logoutButtonVerbosityTemplate)
  }

  // VBS onclick event
  private goHome(event : MouseEvent) : void {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    this.router.goTo('/');
  }
}
