import { OrdablePaginatedRequest } from "./interfaces/orderable-paginated.request";

export enum FileReferenceFields {
  ID = 'id',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',

  FILE_NAME = 'file_name',
  FILE_TYPE = 'file_type',
}

export interface FileReferencesRequest extends OrdablePaginatedRequest<FileReferenceFields> {
  all_tag_ids?: number[];
  any_tag_ids?: number[];
  file_name?: string;
  parent_folder?: number;
  show_private?: boolean;
}
