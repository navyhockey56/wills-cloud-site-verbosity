import { AbstractTemplate } from "../../../abstract-template";

export class LoadMoreEntry extends AbstractTemplate<HTMLAnchorElement> {
  template: HTMLAnchorElement;

  private onClick : (event : MouseEvent) => void;

  constructor(onClick : (event : MouseEvent) => void) {
    super();

    this.onClick = onClick;
  }

  readTemplate(): string {
    return require('./load-more-entry.html').default;
  }

  hasBindings(): boolean {
    return true;
  }
}
