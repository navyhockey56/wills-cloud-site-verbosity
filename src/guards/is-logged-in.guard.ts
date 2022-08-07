import { SessionService } from "../services/session.service";
import { RedirectGuard } from "../_verbosity/redirect-guard";

export class IsLoggedInGuard extends RedirectGuard {
  getRedirect(): string | null {
    const sessionService : SessionService = this.registry.getService(SessionService);
    if (sessionService.hasSession()) return '/';

    return null;
  }
}
