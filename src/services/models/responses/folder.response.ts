export interface FolderResponse {
  id: number;
  folder_name: string;
  children_folders?: FolderResponse[];
}
