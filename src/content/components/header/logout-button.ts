import { Icons } from "../../../constants/icons.enum";
import { SessionService } from "../../../services/session.service";
import { AbstractTemplate } from "../../abstract-template";
import { IconTemplate } from "../icon/icon-template";

export class LogoutButton extends AbstractTemplate<HTMLAnchorElement> {
  private sessionService : SessionService;

  private iconSpan : HTMLSpanElement;

  readTemplate(): string {
    return require('./logout-button.html').default;
  }

  hasEventListeners(): boolean {
    return true;
  }

  hasAssignments() : boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.sessionService = this.registry.getSingleton(SessionService);
    this.appendChildTemplateToElement(this.iconSpan, new IconTemplate({
      icon: Icons.DOOR,
      yOffset: -6
    }));
  }

  onClick(event: MouseEvent) : void {
    event.preventDefault();

    this.sessionService.clearSession();
  }
}
