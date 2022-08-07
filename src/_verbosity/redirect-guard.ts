import { VerbosityRegistry } from "./verbosity-registry";

export abstract class RedirectGuard {
  protected registry : VerbosityRegistry;

  setVerbosityRegistry(registry : VerbosityRegistry) {
    this.registry = registry;
  }

  abstract getRedirect() : string | null;
}
