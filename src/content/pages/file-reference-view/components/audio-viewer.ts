import { AbstractTemplate } from "../../../abstract-template";

export class AudioViewer extends AbstractTemplate<HTMLElement> {

  private fileUrl : string;

  // VBS Assignments
  private sourceElement : HTMLSourceElement;

  constructor(fileUrl : string) {
    super();

    this.fileUrl = fileUrl;
  }

  readTemplate(): string {
    return require('./audio-viewer.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.sourceElement.src = this.fileUrl;
  }
}
