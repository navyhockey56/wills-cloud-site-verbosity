import { LoginRequest } from "./models/requests/login.request";
import { APIResponse } from "./models/responses/api-response";
import { LoginResponse } from "./models/responses/login.response";
import { createEndpoint, toAPIResponse } from "./tooling/request-helpers";

export class LoginService {
  async login(loginRequest: LoginRequest) : Promise<APIResponse<LoginResponse>> {
    const response : Response = await fetch(createEndpoint('login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginRequest)
    });

    return toAPIResponse(response);
  }
}
