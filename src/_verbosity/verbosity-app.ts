import { VerbosityService } from "./verbosity-service";
import { VerbosityDom } from "./verbosity-dom";
import { RedirectGuard } from "./redirect-guard";
import { VerbosityRegistry } from "./verbosity-registry";
import { VerbosityRouter } from "./verbosity-router";
import { VBSComponentDefinition } from "./component-definition.interface";
import { VBSComponent } from "./verbosity-component";

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
    this.dom = new VerbosityDom(this.hydrateComponent.bind(this));
    this.registry = new VerbosityRegistry();
    this.router = new VerbosityRouter(this.dom);
  }

  addSimpleMount(mountId: string, component: VBSComponent<HTMLElement>) {
    this.simpleMounts.push({mountId, component});
  }

  addRoute(path: string, componentDefintion : VBSComponentDefinition<HTMLElement>) : void {
    this.router.addRoute(path, componentDefintion);
  }

  registerService(service: VerbosityService) : void {
    this.registry.registerService(service);
    service.setRouter(this.router);
  }

  registerGuard(guard: RedirectGuard) {
    this.registry.registerGuard(guard);
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
}
