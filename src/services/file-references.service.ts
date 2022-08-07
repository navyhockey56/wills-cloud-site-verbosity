import { AbstractAuthenticatedService } from "./abstract-authenticated.service";
import { FileReferencesRequest } from "./models/requests/file-references.request";
import { UploadRemoteFileRequest } from "./models/requests/upload-remote-file.request";
import { FileReferenceModel } from "./models/responses/file-reference.response";
import { createEndpoint } from "./tooling/request-helpers";

export class FileReferencesService extends AbstractAuthenticatedService {

  async get(fileReferenceId: number, includeDownloadUrl: boolean) : Promise<FileReferenceModel> {
    const endpoint = createEndpoint(`file_references/${fileReferenceId}`, {
      include_download_url: includeDownloadUrl
    });

    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    return response.json();
  }

  async list(params: FileReferencesRequest = {}) : Promise<FileReferenceModel[]> {
    const endpoint = createEndpoint('file_references', params);
    const response : Response = await fetch(endpoint, {
      method: 'GET',
      headers: this.basicHeaders(),
    });

    return response.json();
  }

  async uploadRemoteFile(request : UploadRemoteFileRequest) : Promise<Response> {
    const endpoint = createEndpoint('file_references/download_from');
    const response : Response = await fetch(endpoint, {
      method: 'POST',
      headers: this.basicHeaders('application/json'),
      body: JSON.stringify(request)
    });

    return response;
  }

  async uploadLocalFile(fileName: string, file: File) : Promise<Response> {
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

    return response;
  }
}
