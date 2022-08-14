import { FileReferenceModel } from "../../../../services/models/responses/file-reference.response";
import { isPlainLeftClick } from "../../../../tools/event.tools";
import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class FileReferenceListEntryVBSComponent extends VBSComponent<HTMLAnchorElement> {
  private fileReference: FileReferenceModel;

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

  onVBSComponentAdded(): void {
    this.template.text = `File: ${this.fileReference.simple_file_name} | Type: ${this.fileReference.file_type}`
    this.template.href = this.filePath();
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
}
