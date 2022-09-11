import { VBSComponent } from "../../../../_verbosity/verbosity-component";

export class PopUpButton extends VBSComponent<HTMLButtonElement> {
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

  beforeVBSComponentAdded(): void {
    this.template.textContent = this.buttonText;
    this.template.onclick = this.onClick;
  }
}
