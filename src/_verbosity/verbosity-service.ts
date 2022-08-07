import { VerbosityRegistry } from "./verbosity-registry";
import { VerbosityRouter } from "./verbosity-router";

export class VerbosityService {
  protected registry : VerbosityRegistry;
  protected router : VerbosityRouter;

  setVerbosityRegistry(registry : VerbosityRegistry) {
    this.registry = registry;
  }

  setRouter(router : VerbosityRouter) {
    this.router = router;
  }
}

// export type VerbosityService = VerbosityRegistryAccessVBSComponent & RouterAccessVBSComponent;

// export interface VerbosityRegistryAccessVBSComponent {
//   setVerbosityRegistry?(registry : VerbosityRegistry) : void;
//   registry : VerbosityRegistry;
// }

// export interface RouterAccessVBSComponent {
//   setRouter?(router : Router) : void;
//   router : Router;
// }
