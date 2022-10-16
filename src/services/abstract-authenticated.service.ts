import { VerbosityRegistry } from "verbosity";
import { APIResponse, PaginatedAPIResponse } from "./models/responses/api-response";
import { SessionService } from "./session.service";
import { toAPIResponse, toPaginatedResponse } from "./tooling/request-helpers";

export abstract class AbstractAuthenticatedService {
  protected registry! : VerbosityRegistry;
  protected sessionService! : SessionService;

  constructor(registry : VerbosityRegistry) {
    this.registry = registry;
    this.sessionService = this.registry.getSingleton(SessionService);
  }

  protected getSession() : string {
    return this.sessionService.getSession();
  }

  protected basicHeaders(contentType?: string) : any {
    const headers : any = { 'Authorization': `Bearer ${this.getSession()}` };
    if (contentType) headers['Content-Type'] = contentType;

    return headers;
  }

  protected convertResponse<T>(response : Response, noContent?: boolean) : Promise<APIResponse<T>> {
    this.checkResponseForUnauthorized(response);

    return toAPIResponse(response, noContent);
  }

  protected convertPaginatedResponse<T>(response : Response) : Promise<PaginatedAPIResponse<T>> {
    this.checkResponseForUnauthorized(response);

    return toPaginatedResponse(response);
  }

  private checkResponseForUnauthorized(response : Response) {
    if (response.status !== 401) return;

    const sessionService : SessionService = this.registry.getSingleton(SessionService);
    sessionService.clearSession();
    throw Error('Unauthorized');
  }
}
