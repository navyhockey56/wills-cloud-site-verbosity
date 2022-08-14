import { VerbosityDom } from "./verbosity-dom";
import { VerbosityRegistry } from "./verbosity-registry";
import { VerbosityRouter } from "./verbosity-router";
import { VBSComponentDefinition } from "./component-definition.interface";
import { VBSComponent } from "./verbosity-component";
import { RegisterableComponent, VBSComponentHydrater } from "./verbosity-app-component";

interface SimpleMount {
  mountId: string,
  component: VBSComponent<HTMLElement>
}

export class VerbosityApp {
  router: VerbosityRouter;
  registry: VerbosityRegistry;
  dom: VerbosityDom;

  private simpleMounts : SimpleMount[];

  constructor() {
    this.simpleMounts = [];

    const hydrater : VBSComponentHydrater = {
      hydrateComponent: this.hydrateVBSAppComponent.bind(this)
    };

    this.dom = new VerbosityDom(this.hydrateComponent.bind(this));
    this.registry = new VerbosityRegistry(hydrater);
    this.router = new VerbosityRouter(this.dom);
  }

  addSimpleMount(mountId: string, component: VBSComponent<HTMLElement>) {
    this.simpleMounts.push({mountId, component});
  }

  addRoute(path: string, componentDefintion : VBSComponentDefinition<HTMLElement>) : void {
    this.router.addRoute(path, componentDefintion);
  }

  start() : void {
    this.simpleMounts.forEach((simpleMount: SimpleMount) => {
      const mount = document.getElementById(simpleMount.mountId);
      this.dom.replaceMount(mount, simpleMount.component);
    });

    this.router.goTo(window.location.pathname);
  }

  private hydrateComponent(component: VBSComponent<HTMLElement>) : void {
    component.hydrateComponent(this.dom, this.router, this.registry);
  }

  private hydrateVBSAppComponent(component : RegisterableComponent) : void {
    if (component.setVBSDom) component.setVBSDom(this.dom);
    if (component.setVBSRegistry) component.setVBSRegistry(this.registry);
    if (component.setVBSRouter) component.setVBSRouter(this.router);
  }
}
