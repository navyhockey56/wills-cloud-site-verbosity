import { SessionService } from "../services/session.service";
import { RedirectGuard } from "../_verbosity/redirect-guard";
import { VBSAppComponent } from "../_verbosity/verbosity-app-component";
import { VerbosityRegistry } from "../_verbosity/verbosity-registry";

export class IsLoggedInGuard extends RedirectGuard implements VBSAppComponent {
  private registry : VerbosityRegistry;

  setVBSRegistry(registry : VerbosityRegistry) {
    this.registry = registry;
  }

  getRedirect(): string | null {
    const sessionService : SessionService = this.registry.getSingleton(SessionService);
    if (sessionService.hasSession()) return '/';

    return null;
  }
}
