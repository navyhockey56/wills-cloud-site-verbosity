import { Icons } from "../../../../constants/icons.enum";
import { FileReferenceModel, isAudioFile, isImageFile, isVideoFile, prettyFileSize } from "../../../../services/models/responses/file-reference.response";
import { isPlainLeftClick } from "../../../../tools/event.tools";
import { AbstractTemplate } from "../../../abstract-template";
import { IconTemplate } from "../../../components/icon/icon-template";

export class FileReferenceListEntry extends AbstractTemplate<HTMLAnchorElement> {
  private fileReference: FileReferenceModel;

  private iconSpan : HTMLSpanElement;
  private nameElement : HTMLParagraphElement;

  constructor(fileReference: FileReferenceModel) {
    super();

    this.fileReference = fileReference;
  }

  readTemplate(): string {
    return require("./file-reference-list-entry.html").default;
  }

  hasEventListeners(): boolean {
    return true;
  }

  hasAssignments() : boolean {
    return true;
  }

  onTemplateAdded(): void {
    this.nameElement.textContent = `${this.fileReference.simple_file_name} | Type: ${this.fileReference.file_type} | Size: ${prettyFileSize(this.fileReference.bytes)}`
    this.element.href = this.filePath();

    this.appendChildTemplateToElement(this.iconSpan, new IconTemplate({
      icon: this.iconName(),
      yOffset: 3
    }))
  }

  // vbs-event-onclick
  private onClick(event: MouseEvent) {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    this.router.goTo(this.filePath(), { fileReference: this.fileReference });
  }

  private filePath(): string {
    return `/files/${this.fileReference.id}`;
  }

  private iconName() : string {
    if (isAudioFile(this.fileReference)) {
      return Icons.HEADPHONES;
    } else if (isVideoFile(this.fileReference)) {
      return Icons.VIDEO;
    } else if (isImageFile(this.fileReference)) {
      return Icons.IMAGE;
    } else {
      return Icons.GENERIC_FILE;
    }
  }
}
