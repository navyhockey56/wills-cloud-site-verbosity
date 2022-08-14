import { CallbackGroups } from "../constants/callbacks.enum";
import { VBSAppComponent } from "../_verbosity/verbosity-app-component";
import { VerbosityRegistry } from "../_verbosity/verbosity-registry";
import { VerbosityRouter } from "../_verbosity/verbosity-router";

const SESSION_KEY = 'session';

export class SessionService implements VBSAppComponent {

  private storage : Storage;
  private registry : VerbosityRegistry;
  private router : VerbosityRouter;

  constructor() {
    this.storage = window.localStorage;
  }

  setVBSRegistry(registry: VerbosityRegistry): void {
    this.registry = registry;
  }

  setVBSRouter(router: VerbosityRouter): void {
    this.router = router;
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
