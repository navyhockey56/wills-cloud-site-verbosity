import { RegisterableComponent, VBSAppComponent, VBSComponentHydrater } from "./verbosity-app-component";

export class VerbosityRegistry {
  private callbackRegister : Record<string, any>;
  private callbackGroupRegister: Record<string, any[]>;

  private singletonRegistry : Record<string, RegisterableComponent>;
  private namedRegistry : Record<string, VBSAppComponent>;

  private componentHydrater: VBSComponentHydrater;

  constructor(componentHydrater: VBSComponentHydrater) {
    this.componentHydrater = componentHydrater;

    this.singletonRegistry = {};
    this.namedRegistry = {};

    this.callbackRegister = {};
    this.callbackGroupRegister = {};
  }

  registerSingleton(component: RegisterableComponent) {
    this.singletonRegistry[component.constructor.name] = component;
    this.componentHydrater.hydrateComponent(component);
  }

  getSingleton<T extends RegisterableComponent>(clazz : any) : T {
    return this.singletonRegistry[clazz.name] as T;
  }

  registerNamedComponent(key: string, component : VBSAppComponent) {
    this.namedRegistry[key] = component;
    this.componentHydrater.hydrateComponent(component);
  }

  getNamedComponent<T extends VBSAppComponent>(key: string) : T {
    return this.namedRegistry[key] as T;
  }

  registerCallback(key: string, callback: any) : void {
    this.callbackRegister[key] = callback;
  }

  getCallback<T>(key: string) : T {
    return this.callbackRegister[key] as T;
  }

  registerWithCallbackGroup(group: string, callback: any) : void {
    const callbacks = (this.callbackGroupRegister[group] ||= []);
    callbacks.push(callback);
  }

  unregisterWithCallbackGroup(group: string, callback: any) : void {
    const callbacks = this.callbackGroupRegister[group];
    if (!callbacks) {
      throw Error(`Callback group ${group} does not exist`);
    }

    this.callbackGroupRegister[group] = (callbacks as any[]).filter(element => element != callback);
  }

  getCallbackGroup<T>(group : string) : T[] {
    const callbacks = this.callbackGroupRegister[group];
    if (!callbacks) return [];

    return callbacks as T[];
  }
}
