import { MessageCategory } from "./notification.model";

export type ButtonModelOnClick = (event: MouseEvent) => any;

export interface PopUpButtonModel {
  buttonText : string;
  onClick: ButtonModelOnClick;
  closePopUpOnClick: boolean
}

export interface PopUpModel {
  header: string,
  message: string;
  messageCategory: MessageCategory;
  buttons?: PopUpButtonModel[];
}
