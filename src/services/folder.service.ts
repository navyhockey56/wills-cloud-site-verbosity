import { NamedComponents } from "../constants/named-components.enum";
import { AbstractAuthenticatedService } from "./abstract-authenticated.service";
import { APIResponse } from "./models/responses/api-response";
import { FolderResponse } from "./models/responses/folder.response";
import { createEndpoint, toAPIResponse } from "./tooling/request-helpers";

export class FolderService extends AbstractAuthenticatedService {

  async get(folderId: number) : Promise<APIResponse<FolderResponse>> {
    const endpoint = createEndpoint(`folders/${folderId}`, {
      show_private: this.sessionService.isPrivateModeEnabled()
    });

    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    return toAPIResponse(response);
  }

  async getRootFolder() : Promise<APIResponse<FolderResponse>> {
    const endpoint = createEndpoint('folders/root_folder', {
      show_private: this.sessionService.isPrivateModeEnabled()
    });

    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    return toAPIResponse(response);
  }

  async update(folderId: number, isPrivate: boolean) : Promise<APIResponse<FolderResponse>> {
    const endpoint = createEndpoint(`folders/${folderId}`);
    const payload = { private: isPrivate };
    const response : Response = await fetch(endpoint, {
      method: 'PUT',
      headers: this.basicHeaders('application/json'),
      body: JSON.stringify(payload)
    });

    return toAPIResponse(response);
  }
}
