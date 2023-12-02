export interface FileReferenceModel {
  id: number;
  folder_id: number;
  file_name: string;
  simple_file_name: string;
  file_location: string;
  file_type: string;
  original_source: string;
  download_url?: string;
  private: boolean;
  bytes: string;
}

export const isImageFile = (fileReference : FileReferenceModel) : boolean => {
  return !!['image', 'jpeg'].find((type) => fileReference.file_type.includes(type))
};

export const isAudioFile = (fileReference : FileReferenceModel) : boolean => {
  return !!['audio', 'mp3'].find((type) => fileReference.file_type.includes(type));
}

export const isVideoFile = (fileReference : FileReferenceModel) : boolean => {
  return !!['video', 'mp4'].find((type) => fileReference.file_type.includes(type));
}

export const isTextFile = (fileReference : FileReferenceModel) : boolean => {
  return !!['text', 'txt'].find((type) => fileReference.file_type.includes(type))
}

export const isPdfFile = (fileReference : FileReferenceModel) : boolean => {
  return !!['pdf'].find((type) => fileReference.file_type.includes(type))
}

export const prettyFileSize = (bytes : string) : string => {
  const twoDecimalPlaces = (value : number) : string => {
    const valueParts = value.toString().split('.');
    if (valueParts.length == 1) {
      return valueParts[0];
    }

    return `${valueParts[0]}.${valueParts[1].slice(0, 2)}`
  }

  const bytesAsInt = parseInt(bytes);
  if (bytesAsInt < 1024) {
    return `${twoDecimalPlaces(bytesAsInt)} b`
  }

  const kilobytes = bytesAsInt / 1024;
  if (kilobytes < 1024) {
    return `${twoDecimalPlaces(kilobytes)} kb`
  }

  const megabytes = bytesAsInt / (1024 * 1024);
  if (megabytes < 1024) {
    return `${twoDecimalPlaces(megabytes)} mb`;
  }

  const gigabytes = bytesAsInt / (1024 * 1024 * 1024);
  return `${twoDecimalPlaces(gigabytes)} gb`;
}

export const folderName = (fileReference : FileReferenceModel) : string => {
  const folderNameParts = fileReference.file_name.split("/").slice(0, -1);
  if (folderNameParts.length == 0) return "ROOT";

  return folderNameParts.join("/");
}