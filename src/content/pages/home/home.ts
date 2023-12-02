import { Icons } from "../../../constants/icons.enum";
import { FolderService } from "../../../services/folder.service";
import { FolderResponse } from "../../../services/models/responses/folder.response";
import { isPlainLeftClick } from "../../../tools/event.tools";
import { AbstractTemplate } from "../../abstract-template";
import { IconTemplate } from "../../components/icon/icon-template";

export class HomePage extends AbstractTemplate<HTMLDivElement> {
  private folderService : FolderService;
  private rootFolder : FolderResponse;

  // vbs assign fields
  private explorerButton : HTMLAnchorElement;
  private imageElement : HTMLImageElement;
  private searchIconSpan : HTMLSpanElement;
  private explorerIconSpan : HTMLSpanElement;
  private uploadIconSpan : HTMLSpanElement;

  private cloudIconSpan : HTMLSpanElement;

  readTemplate(): string {
    return require("./home.html").default;
  }

  hasBindings(): boolean {
    return true;
  }

  beforeTemplateAdded() : void {
    this.appendChildTemplateToElement(this.searchIconSpan, new IconTemplate({
      icon: Icons.SEARCH,
      yOffset: -6
    }));

    this.appendChildTemplateToElement(this.explorerIconSpan, new IconTemplate({
      icon: Icons.FOLDER,
      yOffset: -6
    }));

    this.appendChildTemplateToElement(this.uploadIconSpan, new IconTemplate({
      icon: Icons.UPLOAD,
      yOffset: -6
    }));

    // this.appendChildTemplateToElement(this.cloudIconSpan, new IconTemplate({
    //   icon: Icons.CLOUD,
    //   height: 128,
    //   width: 128,
    //   //excludeSvgStyle: true
    // }))

    this.folderService = this.registry.getSingleton(FolderService);

    this.imageElement.src = require('../../../assets/images/cloud.png').default;

    this.folderService.getRootFolder().then(rootFolder => {
      if (!rootFolder.okay) {
        throw Error('Unable to fetch root folder');
      }

      this.rootFolder = rootFolder.data
      this.explorerButton.href = `/folders/${this.rootFolder.id}`;
    });
  }

  // vbs-event-onclick
  private onExplorerButtonClick(event : MouseEvent) : void {
    if (!isPlainLeftClick(event) || !this.rootFolder) return;

    event.preventDefault();
    this.router.goTo(`/folders/${this.rootFolder.id}`, { folder: this.rootFolder });
  }

  // VBS event onclick
  private onUploadButtonClick(event : MouseEvent) : void {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    this.router.goTo('/upload');
  }

  private onSearchButtonClick(event : MouseEvent) : void {
    if (!isPlainLeftClick(event)) return;

    event.preventDefault();
    this.router.goTo('/search');
  }
}
