import { VerbosityService } from "./verbosity-service";
import { RedirectGuard } from "./redirect-guard";
// import { VBSState } from "./veribosity-state";

export class VerbosityRegistry {
  private serviceVerbosityRegistry : Record<string, VerbosityService>
  private guardRegister : Record<string, RedirectGuard>

  // private stateRegistry : Record<string, VBSState>;

  private callbackRegister : Record<string, any>;

  constructor() {
    this.serviceVerbosityRegistry = {};
    this.guardRegister = {};
    this.callbackRegister = {};
    // this.stateRegistry = {};
  }

  registerService(service : VerbosityService) : void {
    this.serviceVerbosityRegistry[service.constructor.name] = service;
    service.setVerbosityRegistry(this);
  }

  getService<T extends VerbosityService>(clazz: any) : T {
    return this.serviceVerbosityRegistry[clazz.name] as T;
  }

  registerGuard(guard : RedirectGuard) {
    this.guardRegister[guard.constructor.name] = guard;
    guard.setVerbosityRegistry(this);
  }

  getGuard<T extends RedirectGuard>(clazz: any) : T {
    return this.guardRegister[clazz.name] as T;
  }

  registerCallback(key: string, callback: any) : void {
    this.callbackRegister[key] = callback;
  }

  getCallback<T>(key: string) : T {
    return this.callbackRegister[key] as T;
  }

  // registerState(key: string, state : VBSState) {
  //   this.stateRegistry[key] = state;
  // }

  // getState<T extends VBSState>(key: string) : T {
  //   return this.stateRegistry[key] as T;
  // }
}
