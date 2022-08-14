import { AbstractAuthenticatedService } from "./abstract-authenticated.service";
import { APIResponse } from "./models/responses/api-response";
import { FolderResponse } from "./models/responses/folder.response";
import { createEndpoint, toAPIResponse } from "./tooling/request-helpers";

export class FolderService extends AbstractAuthenticatedService {

  async get(folderId: number) : Promise<APIResponse<FolderResponse>> {
    const endpoint = createEndpoint(`folders/${folderId}`);
    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    return toAPIResponse(response);
  }

  async getRootFolder() : Promise<APIResponse<FolderResponse>> {
    const endpoint = createEndpoint('folders/root_folder');
    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    return toAPIResponse(response);
  }
}
