import { PaginatedReqest } from "../models/requests/interfaces/paginated.request";
import { APIResponse, PaginatedAPIResponse } from "../models/responses/api-response";

export const toSearchParams = (params: any) : URLSearchParams => {
  const searchParams : URLSearchParams = new URLSearchParams();
  if (!params) return searchParams;

  Object.keys(params).forEach((key: any) => {
    searchParams.set(key, params[key].toString());
  })

  return searchParams;
};

export const createEndpoint = (contextPath : string, params?: any) => {
  return `/api/v1/${contextPath}?` + toSearchParams(params).toString();
};

export const toAPIResponse = async <T> (response : Response) : Promise<APIResponse<T>> => {
  return {
    headers: response.headers,
    okay: response.ok,
    data: await response.json()
  }
}

export const toPaginatedResponse = async <T> (response : Response) : Promise<PaginatedAPIResponse<T>> => {
  const headers : Headers = response.headers;
  const paginatedResponse = await toAPIResponse(response) as PaginatedAPIResponse<T>;

  paginatedResponse.currentPage = parseNumberHeader('page', headers);
  paginatedResponse.nextPage = parseNumberHeader('next-page', headers);
  paginatedResponse.previousPage = parseNumberHeader('prev-page', headers);
  paginatedResponse.totalItems = parseNumberHeader('total', headers);
  paginatedResponse.totalPages = parseNumberHeader('total-pages', headers);
  paginatedResponse.itemsPerPage = parseNumberHeader('per-page', headers);

  return paginatedResponse;
}

const parseNumberHeader = (header: string, headers: Headers) : number => {
  const value = headers.get(header);
  if (!value) return null;

  return Number.parseInt(value);
}

export const nextPageRequest = <T extends PaginatedReqest, H> (response: PaginatedAPIResponse<H>, data?: any) : T => {
  if (!response.nextPage) return data;

  return { ...data,
    page: response.nextPage,
    page_size: response.itemsPerPage
  };
};
