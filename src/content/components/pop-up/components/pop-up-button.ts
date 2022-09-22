import { AbstractTemplate } from "../../../abstract-template";

export class PopUpButton extends AbstractTemplate<HTMLButtonElement> {
  template: HTMLButtonElement;

  private buttonText: string;
  private onClick: (event: MouseEvent) => void

  constructor(buttonText: string, onClick: (event: MouseEvent) => void) {
    super();

    this.buttonText = buttonText;
    this.onClick = onClick;
  }

  readTemplate(): string {
    return require('./pop-up-button.html').default;
  }

  beforeTemplateAdded(): void {
    this.element.textContent = this.buttonText;
    this.element.onclick = this.onClick;
  }
}
