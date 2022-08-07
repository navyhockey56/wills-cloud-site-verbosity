import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class LoadMoreEntry extends VBSComponent<HTMLAnchorElement> {
  private onClick : (event : MouseEvent) => void;

  constructor(onClick : (event : MouseEvent) => void) {
    super();

    this.onClick = onClick;
  }

  readTemplate(): string {
    return require('./load-more-entry.html').default;
  }

  hasEventListeners(): boolean {
    return true;
  }
}
