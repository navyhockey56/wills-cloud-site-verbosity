import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class TextViewer extends VBSComponent<HTMLParagraphElement> {
  private fileUrl : string;

  constructor(fileUrl: string) {
    super();

    this.fileUrl = fileUrl;
  }

  readTemplate(): string {
    return require('./text-viewer.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  beforeVBSComponentAdded(): void {
    fetch(this.fileUrl).then(this.loadData.bind(this));
  }

  async loadData(response: Response) {
    this.template.textContent = await response.text();
  }
}
