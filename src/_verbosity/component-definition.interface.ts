import { RedirectGuard } from "./redirect-guard";
import { VBSComponent } from "./verbosity-component";

export interface VBSComponentDefinition<T extends HTMLElement> {
  instance: (params?: any) => VBSComponent<T>
  guard?: RedirectGuard;
};
