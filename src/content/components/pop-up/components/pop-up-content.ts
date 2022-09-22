import { Callbacks } from "../../../../constants/callbacks.enum";
import { ButtonModelOnClick, PopUpButtonModel, PopUpModel } from "../../../../services/models/general/pop-up.model";
import { AbstractTemplate } from "../../../abstract-template";
import { PopUpButton } from "./pop-up-button";

export class PopUpContent extends AbstractTemplate<HTMLElement> {
  private popUpModel : PopUpModel;

  private removePopUpCallback : () => void;

  // VBS Assignments
  private headerElement : HTMLHeadingElement;
  private contentElement : HTMLParagraphElement;
  private buttonPanel : HTMLSpanElement;

  constructor(popUpModel : PopUpModel) {
    super();

    this.popUpModel = popUpModel;
  }

  readTemplate(): string {
    return require('./pop-up-content.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.removePopUpCallback = this.registry.getCallback(Callbacks.REMOVE_POPUP.toString());

    this.headerElement.textContent = this.popUpModel.header;
    this.contentElement.textContent = this.popUpModel.message;

    const buttonModels = this.popUpModel.buttons || [this.defaultCloseButton()]

    buttonModels.forEach(buttonModel => {
      const popUpButton = new PopUpButton(
        buttonModel.buttonText,
        this.wrapButtonOnClick(buttonModel).bind(this)
      );

      this.appendChildTemplateToElement(this.buttonPanel, popUpButton);
    });
  }

  private wrapButtonOnClick(model: PopUpButtonModel) : ButtonModelOnClick {
    return (mouseEvent : MouseEvent) => {
      model.onClick(mouseEvent);
      if (!model.closePopUpOnClick) return;

      this.removePopUpCallback();
    }
  }

  private defaultCloseButton() : PopUpButtonModel {
    return {
      buttonText: "close",
      onClick: (event) => {
        event.preventDefault();
      },
      closePopUpOnClick: true
    };
  }
}
