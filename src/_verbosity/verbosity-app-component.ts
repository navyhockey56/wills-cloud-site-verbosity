import { VerbosityDom } from "./verbosity-dom";
import { VerbosityRegistry } from "./verbosity-registry";
import { VerbosityRouter } from "./verbosity-router";

export interface VBSComponentHydrater {
  hydrateComponent(component: VBSAppComponent) : void;
}

export interface VBSAppComponent {
  setVBSDom?(dom: VerbosityDom) : void;
  setVBSRegistry?(registry : VerbosityRegistry) : void;
  setVBSRouter?(router : VerbosityRouter) : void;
}

export type RegisterableComponent = VBSAppComponent | any;