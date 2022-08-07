import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class ImageViewer extends VBSComponent<HTMLElement> {
  private imageUrl : string;

  // VBS Assignments
  private imageElement : HTMLImageElement;

  constructor(imageUrl : string) {
    super();

    this.imageUrl = imageUrl;
  }

  readTemplate(): string {
    return require('./image-viewer.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  beforeVBSComponentAdded(): void {
    this.imageElement.src = this.imageUrl;
  }
}
