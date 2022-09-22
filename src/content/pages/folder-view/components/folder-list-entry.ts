import { FolderResponse } from "../../../../services/models/responses/folder.response";
import { isPlainLeftClick } from "../../../../tools/event.tools";
import { AbstractTemplate } from "../../../abstract-template";
import { IconTemplate } from "../../../components/icon/icon-template";

export class FoldersListEntry extends AbstractTemplate<HTMLAnchorElement> {

  private folder : FolderResponse;

  private iconSpan : HTMLSpanElement;
  private nameElement : HTMLParagraphElement;

  constructor(folder : FolderResponse) {
    super();

    this.folder = folder;
  }

  readTemplate(): string {
    return require("./folder-list-entry.html").default;
  }

  hasEventListeners(): boolean {
    return true;
  }

  hasAssignments(): boolean {
    return true;
  }

  beforeTemplateAdded() : void {
    this.nameElement.textContent = this.folder.folder_name;
    this.element.href = this.folderPath();

    this.appendChildTemplateToElement(this.iconSpan, new IconTemplate({
      icon: 'folder',
      yOffset: 3
    }));
  }

  // vbs-event-onclick
  private onClick(event : MouseEvent) {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    this.router.goTo(this.folderPath(), { folder: this.folder });
  }

  private folderPath() : string {
    return `/folders/${this.folder.id}`;
  }
}
