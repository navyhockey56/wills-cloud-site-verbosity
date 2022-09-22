import { AbstractTemplate } from "../../../abstract-template";

export class ImageViewer extends AbstractTemplate<HTMLElement> {
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

  beforeTemplateAdded(): void {
    this.imageElement.src = this.imageUrl;
  }
}
