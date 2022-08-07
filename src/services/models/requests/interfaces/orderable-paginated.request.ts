import { OrderableRequest } from "./orderable.request";
import { PaginatedReqest } from "./paginated.request";

export interface OrdablePaginatedRequest<OrderByFields> extends PaginatedReqest, OrderableRequest<OrderByFields> {};
