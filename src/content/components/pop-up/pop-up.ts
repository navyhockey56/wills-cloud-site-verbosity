import { Callbacks } from "../../../constants/callbacks.enum";
import { PopUpModel } from "../../../services/models/general/pop-up.model";
import { AbstractTemplate } from "../../abstract-template";
import { PopUpContent } from "./components/pop-up-content";

export class PopUpFrame extends AbstractTemplate<HTMLElement> {
  private currentPopUp : PopUpContent;

  // VBS Assignmnets
  private popUpContentMount : HTMLTemplateElement;

  readTemplate(): string {
    return require('./pop-up.html').default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded(): void {
    this.registry.registerCallback(
      Callbacks.ADD_POPUP.toString(),
      this.addPopUp.bind(this)
    );

    this.registry.registerCallback(
      Callbacks.REMOVE_POPUP.toString(),
      this.removePopUp.bind(this)
    );
  }

  private addPopUp(popUpModel: PopUpModel) {
    this.currentPopUp = new PopUpContent(popUpModel);
    this.dom.replaceElementWithTemplate(this.popUpContentMount, this.currentPopUp);
  }

  private removePopUp() {
    this.dom.replaceTemplateWithElement(this.currentPopUp, this.popUpContentMount);
  }
}
