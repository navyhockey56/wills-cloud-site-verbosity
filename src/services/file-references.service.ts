import { AbstractAuthenticatedService } from "./abstract-authenticated.service";
import { FileReferencesRequest } from "./models/requests/file-references.request";
import { UploadRemoteFileRequest } from "./models/requests/upload-remote-file.request";
import { FileReferenceModel } from "./models/responses/file-reference.response";
import { APIResponse, PaginatedAPIResponse } from "./models/responses/api-response";
import { createEndpoint } from "./tooling/request-helpers";
import { UpdateFileReferenceRequest } from "./models/requests/update.file-reference.request";

export class FileReferencesService extends AbstractAuthenticatedService {

  async get(fileReferenceId: number, includeDownloadUrl: boolean) : Promise<APIResponse<FileReferenceModel>> {
    const endpoint = createEndpoint(`file_references/${fileReferenceId}`, {
      include_download_url: includeDownloadUrl
    });

    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    return this.convertResponse(response);
  }

  async list(params: FileReferencesRequest = {}) : Promise<PaginatedAPIResponse<FileReferenceModel[]>> {
    const endpoint = createEndpoint('file_references', params);
    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    return this.convertPaginatedResponse(response);
  }

  async update(fileId: number, request: UpdateFileReferenceRequest) : Promise<APIResponse<FileReferenceModel>> {
    const endpoint = createEndpoint(`file_references/${fileId}`);
    const response : Response = await fetch(endpoint, {
      method: 'PUT',
      headers: this.basicHeaders('application/json'),
      body: JSON.stringify(request)
    });

    return this.convertResponse(response);
  }

  async delete(fileId: number) : Promise<APIResponse<void>> {
    const endpoint = createEndpoint(`file_references/${fileId}`);
    const response : Response = await fetch(endpoint, {
      method: 'DELETE',
      headers: this.basicHeaders('application/json'),
    });

    return this.convertResponse(response, true);
  }

  async uploadRemoteFile(request : UploadRemoteFileRequest) : Promise<APIResponse<void>> {
    const endpoint = createEndpoint('file_references/download_from');
    const response : Response = await fetch(endpoint, {
      method: 'POST',
      headers: this.basicHeaders('application/json'),
      body: JSON.stringify(request)
    });

    return this.convertResponse(response, true);
  }

  async uploadLocalFile(fileName: string, file: File) : Promise<APIResponse<void>> {
    const payload = new FormData();
    payload.append("file_name", fileName);
    payload.append("file_type", file.type);
    payload.append("file", file);

    const endpoint = createEndpoint('file_references');
    const response : Response = await fetch(endpoint, {
      method: 'POST',
      headers: this.basicHeaders(''),
      body: payload
    });

    return this.convertResponse(response, true);
  }
}
