import { VerbosityRegistry, VerbosityRouter } from "verbosity";
import { VerbosityTemplate, VerbosityDom, VerbosityTemplateLoadOptions } from "verbosity-dom";

export abstract class AbstractTemplate<T extends HTMLElement> implements VerbosityTemplate<T> {
  element : T;

  protected router : VerbosityRouter;
  protected registry : VerbosityRegistry;
  protected dom : VerbosityDom;

  abstract readTemplate(): string;

  abstract hasBindings(): boolean;

  /**
   * Appends the given child element to the given mount as a child element of
   * the mount.
   * @param mount The element to append the template to
   * @param childVerbosityTemplate The template to append to the mount
   * @param options Options for the child element
   * @returns The HTMLElement of the template
   */
  appendChildTemplateToElement<H extends HTMLElement>(
    mount: HTMLElement,
    childVerbosityTemplate: VerbosityTemplate<H>,
    options?: VerbosityTemplateLoadOptions) : H {

    return this.dom.appendChildTemplateToElement(mount, this, childVerbosityTemplate, options);
  }

  removeChildComponent(childComponent: VerbosityTemplate<HTMLElement>) : void {
    this.dom.removeChildTemplate(this, childComponent);
  }

  removeAllChildren() : void {
    this.dom.removeAllChildren(this);
  }
}
