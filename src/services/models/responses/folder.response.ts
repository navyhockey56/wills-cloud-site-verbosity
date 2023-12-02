export interface FolderResponse {
  id: number;
  folder_id?: number;
  folder_name: string;
  path: string;
  children_folders?: FolderResponse[];
  private: boolean;
}
