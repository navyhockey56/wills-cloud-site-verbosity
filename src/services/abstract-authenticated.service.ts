import { VBSAppComponent } from "../_verbosity/verbosity-app-component";
import { VerbosityRegistry } from "../_verbosity/verbosity-registry";
import { SessionService } from "./session.service";

export abstract class AbstractAuthenticatedService implements VBSAppComponent {
  private registry : VerbosityRegistry;

  setVBSRegistry(registry : VerbosityRegistry) {
    this.registry = registry;
  }

  protected getSession() : string {
    const sessionService : SessionService = this.registry.getSingleton(SessionService);
    return sessionService.getSession();
  }

  protected basicHeaders(contentType?: string) : any {
    const headers : any = { 'Authorization': `Bearer ${this.getSession()}` };
    if (contentType) headers['Content-Type'] = contentType;

    return headers;
  }
}
