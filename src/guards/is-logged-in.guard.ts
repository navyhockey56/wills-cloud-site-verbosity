import { VerbosityRedirectGuard } from "verbosity";
import { SessionService } from "../services/session.service";

export class IsLoggedInGuard implements VerbosityRedirectGuard {
  private sessionService! : SessionService;

  constructor(sessionService : SessionService) {
    this.sessionService = sessionService;
  }

  getRedirect(): string | null {
    if (this.sessionService.hasSession()) return '/';

    return null;
  }
}
