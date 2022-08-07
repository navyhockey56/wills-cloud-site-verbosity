import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class VideoViewer extends VBSComponent<HTMLElement> {
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

  hasAssignments(): boolean {
    return true;
  }

  beforeVBSComponentAdded(): void {
    this.sourceElement.src = this.fileUrl;
  }
}
