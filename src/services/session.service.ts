import { CallbackGroups } from "../constants/callbacks.enum";
import { VerbosityService } from "../_verbosity/verbosity-service";

const SESSION_KEY = 'session';

export class SessionService extends VerbosityService {

  private storage : Storage;

  constructor() {
    super();

    this.storage = window.localStorage;
  }

  getSession(): string | null {
    return this.storage.getItem(SESSION_KEY);
  }

  setSession(token: string): void {
    this.storage.setItem(SESSION_KEY, token);

    const onSessionSetCallbacks : (() => void)[] =
      this.registry.getCallbackGroup(CallbackGroups.ON_SESSION_SET.toString());

    onSessionSetCallbacks.forEach(callback => callback());
  }

  clearSession(): void {
    this.storage.removeItem(SESSION_KEY);
    const onSessionClearedCallbacks : (() => void)[] =
      this.registry.getCallbackGroup(CallbackGroups.ON_SESSION_CLEARED.toString());

    onSessionClearedCallbacks.forEach(callback => callback());
    this.router.goTo('/login');
  }

  hasSession(): boolean {
    return !!this.getSession();
  }
}
