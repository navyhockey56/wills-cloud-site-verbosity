export enum BasicOrderableFields {
  ID = 'id',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at'
}

export interface OrderableRequest<OrderByFields> {
  order_by?: OrderByFields | OrderByFields[];
}
