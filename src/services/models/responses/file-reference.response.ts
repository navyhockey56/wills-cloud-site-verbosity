export interface FileReferenceModel {
  id: number;
  file_name: string;
  simple_file_name: string;
  file_location: string;
  file_type: string;
  tags?: string[];
  download_url?: string;
}

export const isImageFile = (fileReference : FileReferenceModel) : boolean => {
  return !!['image', 'jpeg'].find((type) => fileReference.file_type.includes(type))
};

export const isAudioFile = (fileReference : FileReferenceModel) : boolean => {
  return fileReference.file_type.includes('mp3');
}

export const isVideoFile = (fileReference : FileReferenceModel) : boolean => {
  return fileReference.file_type.includes('video') || fileReference.file_type.includes('mp4');
}
