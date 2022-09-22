import { VerbosityRedirectGuard } from "verbosity";
import { SessionService } from "../services/session.service";

export class IsNotLoggedInGuard implements VerbosityRedirectGuard {
  private sessionService! : SessionService;

  constructor(sessionService : SessionService) {
    this.sessionService = sessionService;
  }

  getRedirect(): string | null {
    if (!this.sessionService.hasSession()) return '/login';

    return null;
  }
}
