import { AbstractTemplate } from "../../../abstract-template";

export class TextViewer extends AbstractTemplate<HTMLDivElement> {
  private fileUrl : string;

  private paragraphElement : HTMLParagraphElement;

  constructor(fileUrl: string) {
    super();

    this.fileUrl = fileUrl;
  }

  readTemplate(): string {
    return require('./text-viewer.html').default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    fetch(this.fileUrl).then(this.loadData.bind(this));
  }

  async loadData(response: Response) {
    this.paragraphElement.textContent = await response.text();
  }
}
