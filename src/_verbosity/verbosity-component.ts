import { VerbosityDom, TemplateLoadOptions } from "./verbosity-dom";
import { VerbosityRouter } from "./verbosity-router";
import { VerbosityRegistry } from "./verbosity-registry";

export interface VBSComponentLifecycle {
  beforeVBSComponentAdded(): void;
  onVBSComponentAdded(): void;
  beforeVBSComponentRemoved(): void;
  afterVBSComponentRemoved(): void;
}

export abstract class VBSComponent<T extends HTMLElement> implements VBSComponentLifecycle {
  template : T;
  mountedChildrenVBSComponents : Map<HTMLElement, Map<VBSComponent<HTMLElement>, HTMLElement>>;

  protected dom: VerbosityDom;
  protected router : VerbosityRouter;
  protected registry : VerbosityRegistry;

  constructor() {
    this.mountedChildrenVBSComponents = new Map;
  }

  hydrateComponent(dom: VerbosityDom, router: VerbosityRouter, registry: VerbosityRegistry) {
    this.dom = dom;
    this.router = router;
    this.registry = registry;
  }

  // setDom(dom: VerbosityDom) {
  //   this.dom = dom;
  // }

  // setRouter(router : VerbosityRouter) : void {
  //   this.router = router;
  // }

  // setVerbosityRegistry(registry : VerbosityRegistry) : void {
  //   this.registry = registry;
  // }

  beforeVBSComponentAdded(): void {};
  onVBSComponentAdded(): void {};
  beforeVBSComponentRemoved(): void {};
  afterVBSComponentRemoved(): void {};

  abstract readTemplate() : string;

  hasEventListeners() : boolean {
    return false;
  }

  hasAssignments() : boolean {
    return false;
  }

  appendChildToMount<H extends HTMLElement>(
    mount: HTMLElement,
    childVBSComponent: VBSComponent<H>,
    options?: TemplateLoadOptions) : H {
    return this.dom.appendChildToMount(mount, this, childVBSComponent, options);
  }

  removeChildComponent(childComponent: VBSComponent<HTMLElement>) : void {
    this.dom.removeChildVBSComponent(this, childComponent);
  }

  removeAllChildren() : void {
    this.dom.removeAllChildren(this);
  }
}
