import { VerbosityDom } from "./verbosity-dom";
import { VBSComponentDefinition } from "./component-definition.interface";
import { VBSComponent } from "./verbosity-component";


interface PathMatcher {
  matchesPath(path: string) : boolean;
  extractParamatersFromPath?(path: string) : Record<string, any>;
}

class SimplePath implements PathMatcher {
  private path : string;

  constructor(path: string) {
    this.path = path;
  }

  matchesPath(path: string): boolean {
    return this.path === path;
  }
}

class DynamicPath implements PathMatcher {
  private parameterizedIndicesMap : string[];
  private pathParts : string[];

  constructor(path: string) {
    this.parameterizedIndicesMap = [];
    this.pathParts = path.split('/');
    this.pathParts.forEach((pathPart: string, index: number) => {
      if (pathPart.startsWith(':')) {
        this.parameterizedIndicesMap[index] = pathPart.slice(1, pathPart.length);
      } else {
        this.parameterizedIndicesMap[index] = null;
      }
    })
  }

  matchesPath(path: string): boolean {
    const pathParts : string[] = path.split('/');
    const matchingParts = pathParts.filter((pathPart: string, index: number) => {
      return this.parameterizedIndicesMap[index] || this.pathParts[index] === pathPart;
    })

    return matchingParts.length === this.pathParts.length;
  }

  extractParamatersFromPath(path: string): Record<string, string> {
    const extractedParameters : Record<string, string> = {};
    const pathParts : string[] = path.split('/');

    pathParts.forEach((pathPart: string, index: number) => {
      const parameterName : string = this.parameterizedIndicesMap[index];
      if (parameterName) {
        extractedParameters[parameterName] = pathPart;
      }
    });

    return extractedParameters;
  }
}

interface Route {
  componentDefinition : VBSComponentDefinition<HTMLElement>;
  pathMatcher : PathMatcher;
}

export class VerbosityRouter {
  private pageMount: HTMLElement;
  private currentPageVBSComponent : VBSComponent<HTMLElement>;

  private dom : VerbosityDom;
  private routes : Route[];

  constructor(dom: VerbosityDom) {
    this.dom = dom;
    this.pageMount = document.getElementById('page-mount');
    this.routes = [];

    // Bind to the back button to manage state so that the page actually refreshes
    window.onpopstate = (event : PopStateEvent) => this.goTo(event.state);
  }

  addRoute(path: string, componentDefinition: VBSComponentDefinition<HTMLElement>) : void {
    const pathMatcher = path.includes(':') ? new DynamicPath(path) : new SimplePath(path);
    this.routes.push({ componentDefinition, pathMatcher  })
  }

  private findMatchingRoute(path: string) : Route | null {
    return this.routes.find((route) => route.pathMatcher.matchesPath(path));
  }

  private extractPathParameters(path: string, route: Route) : Record<string, string> {
    if (!route.pathMatcher.extractParamatersFromPath) {
      return {};
    }

    return route.pathMatcher.extractParamatersFromPath(path);
  }

  goTo(path: string, params?: any) : void {
    console.debug("Router.goTo() called with path", path);

    const matchingRoute : Route = this.findMatchingRoute(path);
    if (!matchingRoute) {
      throw new Error(`Router.goTo() called with invalid path ${path}`);
    }

    const pageDefinition : VBSComponentDefinition<HTMLElement> = matchingRoute.componentDefinition;

    const redirect = pageDefinition.guard ? pageDefinition.guard.getRedirect() : null;
    if (redirect) {
      console.debug("Redirecting to:", redirect);
      this.goTo(redirect);
      return;
    }

    console.debug("Router.goTo() is mounting path", path);

    // Update the context path, if necessary
    if (window.history.state !== path) {
      // Only push the current path if the window is not set to the current path
      // This is required for the "Forward" button to work after the "Back" button is pressed.
      window.history.pushState(path, '', path);
    }

    const pathParams = this.extractPathParameters(path, matchingRoute);
    const mergedParams = { ...(params || {}), ...pathParams };
    const instance : VBSComponent<HTMLElement> = pageDefinition.instance(mergedParams);

    if (this.currentPageVBSComponent) {
      this.dom.replaceVBSComponent(this.currentPageVBSComponent, instance);
    } else {
      this.dom.replaceMount(this.pageMount, instance);
    }

    this.currentPageVBSComponent = instance;
  }
}
