import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class PDFViewer extends VBSComponent<HTMLEmbedElement> {
  private fileUrl : string;

  constructor(fileUrl: string) {
    super();

    this.fileUrl = fileUrl;
  }

  readTemplate(): string {
    return require('./pdf-viewer.html').default;
  }

  beforeVBSComponentAdded(): void {
    this.template.src = this.fileUrl
    //fetch(this.fileUrl).then(this.loadData.bind(this));
  }

  async loadData(response: Response) {
    const data = await (await response.body.getReader().read()).value;
    // const values = [];
    // for (let i = 0; i < data.length; i++) {
    //   values.push(String.fromCharCode(data[i]));
    // }

    const base64 = btoa(String.fromCharCode(...data));

    this.template.src = `data:application/pdf;base64,${base64}`
  }
}
