import { SessionService } from "../services/session.service";
import { RedirectGuard } from "../_verbosity/redirect-guard";

export class IsNotLoggedInGuard extends RedirectGuard {
  getRedirect(): string | null {
    const sessionService : SessionService = this.registry.getService(SessionService);
    if (!sessionService.hasSession()) return '/login';

    return null;
  }
}