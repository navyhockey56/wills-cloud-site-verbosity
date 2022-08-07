import { AbstractAuthenticatedService } from "./abstract-authenticated.service";
import { FolderResponse } from "./models/responses/folder.response";
import { createEndpoint } from "./tooling/request-helpers";

export class FolderService extends AbstractAuthenticatedService {

  async get(folderId: number) : Promise<FolderResponse> {
    const endpoint = createEndpoint(`folders/${folderId}`);
    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error response');
    }

    return response.json();
  }

  async getRootFolder() : Promise<FolderResponse> {
    const endpoint = createEndpoint('folders/root_folder');
    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    return response.json();
  }
}
