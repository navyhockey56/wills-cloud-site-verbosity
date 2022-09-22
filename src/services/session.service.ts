import { VerbosityRegistry, VerbosityRouter } from "verbosity";
import { CallbackGroups } from "../constants/callbacks.enum";

const SESSION_KEY = 'session';

export class SessionService {
  private storage! : Storage;
  private registry! : VerbosityRegistry;
  private router! : VerbosityRouter;

  constructor(registry : VerbosityRegistry, router : VerbosityRouter) {
    this.storage = window.localStorage;
    this.registry = registry;
    this.router = router;
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
