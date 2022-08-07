import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class AudioViewer extends VBSComponent<HTMLElement> {
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

  beforeVBSComponentAdded(): void {
    this.sourceElement.src = this.fileUrl;
  }
}
