import { AbstractTemplate } from "../../../abstract-template";

export class VideoViewer extends AbstractTemplate<HTMLElement> {

  private fileUrl : string;

  // VBS Assignments
  private sourceElement : HTMLSourceElement;

  constructor(fileUrl : string) {
    super();

    this.fileUrl = fileUrl;
  }

  readTemplate(): string {
    return require('./video-viewer.html').default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.sourceElement.src = this.fileUrl;
  }
}
