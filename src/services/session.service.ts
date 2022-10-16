import { VerbosityRegistry, VerbosityRouter } from "verbosity";
import { CallbackGroups, Callbacks } from "../constants/callbacks.enum";
import { MessageCategory, NotificationModel } from "./models/general/notification.model";

const SESSION_KEY = 'session';
const PRIVATE_MODE_KEY = 'private_mode';

export class SessionService {
  private storage! : Storage;
  private registry! : VerbosityRegistry;
  private router! : VerbosityRouter;

  constructor(registry : VerbosityRegistry, router : VerbosityRouter) {
    this.storage = window.localStorage;
    this.registry = registry;
    this.router = router;
  }

  enablePrivateMode() : void {
    this.storage.setItem(PRIVATE_MODE_KEY, 'true');
    this.notifyPrivateModeValue();
  }

  disablePrivateMode() : void {
    this.storage.setItem(PRIVATE_MODE_KEY, 'false');
    this.notifyPrivateModeValue();
  }

  togglePrivateMode() : boolean {
    const enabled = !this.isPrivateModeEnabled();
    this.storage.setItem(PRIVATE_MODE_KEY, enabled.toString());
    this.notifyPrivateModeValue();
    return enabled;
  }

  private notifyPrivateModeValue() : void {
    const callback : (notification : NotificationModel) => void = this.registry.getCallback(Callbacks.ADD_NOTIFICATION.toString());
    callback({
      message: `Private mode is now ${ this.isPrivateModeEnabled() ? 'enabled' : 'disabled' }`,
      messageCategory: MessageCategory.INFO
    });
  }

  isPrivateModeEnabled() : boolean {
    return this.storage.getItem(PRIVATE_MODE_KEY) === 'true';
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
    this.storage.removeItem(PRIVATE_MODE_KEY);
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
