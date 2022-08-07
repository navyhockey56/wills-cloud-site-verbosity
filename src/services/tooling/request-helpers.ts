export const toSearchParams = (params: any) : URLSearchParams => {
  const searchParams : URLSearchParams = new URLSearchParams();
  if (!params) return searchParams;

  Object.keys(params).forEach((key: any) => {
    searchParams.set(key, params[key].toString());
  })

  return searchParams;
};

export const createEndpoint = (contextPath : string, params?: any) => {
  return `http://localhost:3000/api/v1/${contextPath}?` + toSearchParams(params).toString();
};
