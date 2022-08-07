import { VerbosityService } from "../_verbosity/verbosity-service";

const SESSION_KEY = 'session';

export class SessionService extends VerbosityService {

  private storage : Storage;
  private onSessionSetCallbacks : (() => void)[];
  private onSessionClearedCallbacks : (() => void)[];

  constructor() {
    super();

    this.onSessionSetCallbacks = [];
    this.onSessionClearedCallbacks = [];
    this.storage = window.localStorage;
  }

  registerOnSessionSetCallback(callback: () => void) : void {
    this.onSessionSetCallbacks.push(callback);
  }

  registerOnSessionClearedCallback(callback: () => void) : void {
    this.onSessionClearedCallbacks.push(callback);
  }

  unRegisterOnSessionSetCallback(callback: () => void) : void {
    this.onSessionSetCallbacks = this.onSessionSetCallbacks.filter(otherCallback => otherCallback !== callback);
  }

  unRegisterOnSessionClearedCallback(callback: () => void) : void {
    this.onSessionClearedCallbacks = this.onSessionClearedCallbacks.filter(otherCallback => otherCallback !== callback);
  }

  getSession(): string | null {
    return this.storage.getItem(SESSION_KEY);
  }

  setSession(token: string): void {
    this.storage.setItem(SESSION_KEY, token);
    this.onSessionSetCallbacks.forEach(callback => callback());
  }

  clearSession(): void {
    this.storage.removeItem(SESSION_KEY);
    this.onSessionClearedCallbacks.forEach(callback => callback());
    this.router.goTo('/login');
  }

  hasSession(): boolean {
    return !!this.getSession();
  }
}
