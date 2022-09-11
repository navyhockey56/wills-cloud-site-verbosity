import { Callbacks } from "../../../constants/callbacks.enum";
import { PopUpModel } from "../../../services/models/general/pop-up.model";
import { VBSComponent } from "../../../_verbosity/verbosity-component";
import { PopUpContent } from "./components/pop-up-content";

export class PopUpFrame extends VBSComponent<HTMLElement> {

  private currentPopUp : PopUpContent;

  // VBS Assignmnets
  private popUpContentMount : HTMLTemplateElement;

  readTemplate(): string {
    return require('./pop-up.html').default;
  }

  hasAssignments(): boolean {
    return true;
  }

  beforeVBSComponentAdded(): void {
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
    this.dom.replaceMount(this.popUpContentMount, this.currentPopUp);
  }

  private removePopUp() {
    this.dom.replaceComponentWithElement(this.currentPopUp, this.popUpContentMount);
  }
}
