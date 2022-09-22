import { AbstractTemplate } from "../../../abstract-template";

export class PDFViewer extends AbstractTemplate<HTMLEmbedElement> {
  private fileUrl : string;

  constructor(fileUrl: string) {
    super();

    this.fileUrl = fileUrl;
  }

  readTemplate(): string {
    return require('./pdf-viewer.html').default;
  }

  beforeTemplateAdded(): void {
    this.element.src = this.fileUrl
  }
}
