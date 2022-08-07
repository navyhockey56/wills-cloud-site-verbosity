import { VerbosityService } from "../_verbosity/verbosity-service";
import { SessionService } from "./session.service";

export abstract class AbstractAuthenticatedService extends VerbosityService {
  protected getSession() : string {
    const sessionService : SessionService = this.registry.getService(SessionService);
    return sessionService.getSession();
  }

  protected basicHeaders(contentType?: string) : any {
    const headers : any = { 'Authorization': `Bearer ${this.getSession()}` };
    if (contentType) headers['Content-Type'] = contentType;

    return headers;
  }
}
