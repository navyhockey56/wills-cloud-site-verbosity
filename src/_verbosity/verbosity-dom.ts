import { VBSComponent } from "./verbosity-component";
import { TemplateLoader } from "./template-loader";

export interface TemplateLoadOptions {
  id?: string;
}

interface VBSComponentInformation {
  isMountedAsChild: boolean;
  mount?: HTMLElement;
}

export class VerbosityDom {

  private componentHydrater: (component: VBSComponent<HTMLElement>) => void;

  private templateLoader : TemplateLoader;
  private componentsMap : Map<VBSComponent<HTMLElement>, VBSComponent<HTMLElement>[]>;
  private componentInfoMap : Map<VBSComponent<HTMLElement>, VBSComponentInformation>;

  constructor(componentHydrater: (component: VBSComponent<HTMLElement>) => void) {
    this.componentHydrater = componentHydrater;
    this.componentsMap = new Map;
    this.componentInfoMap = new Map;
    this.templateLoader = new TemplateLoader;
  }


  replaceMountById<T extends HTMLElement>(
    mountId: string,
    component: VBSComponent<T>,
    options?: TemplateLoadOptions
  ): T {
    const mount: HTMLElement = document.getElementById(mountId);
    if (!mount) {
      throw Error(`Unable to mount to element with ID=${mountId} because the element is not on the page.`)
    }

    return this.replaceMount(mount, component, options);
  }

  replaceMount<T extends HTMLElement>(
    mount: HTMLElement,
    component: VBSComponent<T>,
    options?: TemplateLoadOptions
  ): T {
    this.hydrateVBSComponent(component);
    const template : T = this.templateLoader.loadTemplate(component, options);

    this.componentInfoMap.set(component, { isMountedAsChild: false })
    this.componentsMap.set(component, []);

    component.beforeVBSComponentAdded();
    mount.parentElement.replaceChild(template, mount);
    component.onVBSComponentAdded();

    return template;
  }

  replaceComponentWithElement(
    component: VBSComponent<HTMLElement>,
    element : HTMLElement
  ) {
    this.recursiveBeforeVBSComponentRemoved(component);
    const parentElement = component.template.parentElement;
    parentElement.replaceChild(element, component.template);
    this.recursiveAfterVBSComponentRemoved(component);
    this.clearVBSComponentFromDom(component);
  }

  replaceVBSComponent<T extends HTMLElement>(
    currentVBSComponent: VBSComponent<HTMLElement>,
    newVBSComponent: VBSComponent<T>,
    options?: TemplateLoadOptions
  ) : T {
    this.hydrateVBSComponent(newVBSComponent);
    const parentElement = currentVBSComponent.template.parentElement;

    this.recursiveBeforeVBSComponentRemoved(currentVBSComponent);
    const newElement : T = this.templateLoader.loadTemplate(newVBSComponent, options);

    this.componentInfoMap.set(newVBSComponent, { isMountedAsChild: false })
    this.componentsMap.set(newVBSComponent, []);

    newVBSComponent.beforeVBSComponentAdded();
    parentElement.replaceChild(newElement, currentVBSComponent.template);

    this.recursiveAfterVBSComponentRemoved(currentVBSComponent);
    this.clearVBSComponentFromDom(currentVBSComponent);
    newVBSComponent.onVBSComponentAdded();

    return newElement;
  }

  appendChildToMountById<T extends HTMLElement>(
    mountId: string,
    parentVBSComponent: VBSComponent<HTMLElement>,
    childVBSComponent: VBSComponent<T>,
    options?: TemplateLoadOptions
  ): T {
    const mount: HTMLElement = document.getElementById(mountId);
    if (!mount) {
      throw Error(`Unable to append to element with ID=${mountId} because the element is not on the page.`)
    }

    return this.appendChildToMount(mount, parentVBSComponent, childVBSComponent, options);
  }

  appendChildToMount<T extends HTMLElement>(
    mount: HTMLElement,
    parentVBSComponent: VBSComponent<HTMLElement>,
    childVBSComponent: VBSComponent<T>,
    options?: TemplateLoadOptions
  ): T {
    if (!parentVBSComponent.template.contains(mount)) {
      throw Error(`You cannot append a child to a mount that does not belong to the parent component`);
    }

    const childrenVBSComponents : VBSComponent<HTMLElement>[] = this.componentsMap.get(parentVBSComponent);
    childrenVBSComponents.push(childVBSComponent);
    this.componentsMap.set(childVBSComponent, []);

    this.componentInfoMap.set(childVBSComponent, { isMountedAsChild: true, mount })

    this.hydrateVBSComponent(childVBSComponent);
    const childElement : T = this.templateLoader.loadTemplate(childVBSComponent, options);

    childVBSComponent.beforeVBSComponentAdded();
    mount.appendChild(childElement);
    childVBSComponent.onVBSComponentAdded();

    return childElement;
  }

  removeChildVBSComponent(parentVBSComponent: VBSComponent<HTMLElement>, childVBSComponent: VBSComponent<HTMLElement>) {
    const childVBSComponentInfo : VBSComponentInformation = this.componentInfoMap.get(childVBSComponent);
    if (!childVBSComponentInfo.isMountedAsChild) {
      throw Error(`You cannot remove a child component that was not added as a child`);
    }

    const childrenVBSComponents : VBSComponent<HTMLElement>[] = this.componentsMap.get(parentVBSComponent);
    this.componentsMap.set(parentVBSComponent, childrenVBSComponents.filter(component => component !== childVBSComponent));
    this.componentInfoMap.delete(childVBSComponent);

    this.recursiveBeforeVBSComponentRemoved(childVBSComponent);
    childVBSComponentInfo.mount.removeChild(childVBSComponent.template);
    this.recursiveAfterVBSComponentRemoved(childVBSComponent);
    this.clearVBSComponentFromDom(childVBSComponent);
  }

  removeAllChildren(parentVBSComponent: VBSComponent<HTMLElement>) : void {
    const childrenVBSComponents : VBSComponent<HTMLElement>[] = this.componentsMap.get(parentVBSComponent);
    if (!childrenVBSComponents) return;

    childrenVBSComponents.forEach(childVBSComponent => {
      const childVBSComponentInfo : VBSComponentInformation = this.componentInfoMap.get(childVBSComponent);
      this.componentInfoMap.delete(childVBSComponent);

      this.recursiveBeforeVBSComponentRemoved(childVBSComponent);
      childVBSComponentInfo.mount.removeChild(childVBSComponent.template);
      this.recursiveAfterVBSComponentRemoved(childVBSComponent);
      this.clearVBSComponentFromDom(childVBSComponent);
    })

    this.componentsMap.set(parentVBSComponent, []);
  }

  private hydrateVBSComponent(component : VBSComponent<HTMLElement>) {
    this.componentHydrater(component);
  }

  private recursiveBeforeVBSComponentRemoved(component: VBSComponent<HTMLElement>) : void {
    const childrenVBSComponents = this.componentsMap.get(component);
    childrenVBSComponents.forEach(childVBSComponent => this.recursiveBeforeVBSComponentRemoved(childVBSComponent));
    component.beforeVBSComponentRemoved();
  }

  private recursiveAfterVBSComponentRemoved(component: VBSComponent<HTMLElement>) : void {
    const childrenVBSComponents = this.componentsMap.get(component);
    childrenVBSComponents.forEach(childVBSComponent => this.recursiveAfterVBSComponentRemoved(childVBSComponent));
    component.afterVBSComponentRemoved();
  }

  private clearVBSComponentFromDom(component : VBSComponent<HTMLElement>) : void {
    const childrenVBSComponents = this.componentsMap.get(component);
    childrenVBSComponents.forEach(childVBSComponent => this.clearVBSComponentFromDom(childVBSComponent));
    this.componentInfoMap.delete(component);
    this.componentsMap.delete(component);
  }
}
