import { Icons } from "../../../constants/icons.enum";
import { AbstractTemplate } from "../../abstract-template";

interface IconTemplateArgs {
  width?: number;
  height?: number;
  icon: string | Icons;
  yOffset?: number;
  xOffset?: number;
  excludeSvgStyle?: boolean;
  exludePathStyle?: boolean;
}

export class IconTemplate extends AbstractTemplate<HTMLElement> {
  private width!: number;
  private height!: number;
  private yOffset!: number;
  private xOffset!: number;
  private icon!: string;
  private excludeSvgStyle: boolean;
  private exludePathStyle: boolean;

  private pathElement : HTMLElement;

  constructor(args: IconTemplateArgs) {
    super();

    this.icon = args.icon.toString();
    this.width = args.width || 24;
    this.height = args.height || 24;
    this.yOffset = args.yOffset || 0;
    this.xOffset = args.xOffset || 0;
    this.excludeSvgStyle = args.excludeSvgStyle || false;
    this.exludePathStyle = args.exludePathStyle || false;
  }

  readTemplate(): string {
    return require ('./icon-template.html').default;
  }

  hasAssignments() : boolean {
    return true;
  }

  beforeTemplateAdded() : void {
    if (!this.excludeSvgStyle) {
      this.element.style.height = `${this.height}px`;
      this.element.style.width = `${this.width}px`;
    }

    if (!this.exludePathStyle) {
      this.pathElement.setAttribute('height', this.height.toString());
      this.pathElement.setAttribute('width', this.width.toString());
    }

    this.element.setAttribute('viewBox', `${this.xOffset} ${this.yOffset} ${this.height} ${this.width}`);

    this.pathElement.setAttribute('d', require(`../../../assets/icons/${this.icon}-svg-data.txt`).default);
  }
}
