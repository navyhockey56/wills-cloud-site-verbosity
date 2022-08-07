import { VBSComponent } from "./verbosity-component";
import { TemplateLoadOptions } from "./verbosity-dom";

export class TemplateLoader {
  loadTemplate<T extends HTMLElement>(component: VBSComponent<T>, options?: TemplateLoadOptions) : T {
    const templateParent = document.createElement('template');
    templateParent.innerHTML = component.readTemplate();
    const template : T = templateParent.content.firstChild as T;

    component.template = template;

    if (component.hasEventListeners() || component.hasAssignments()) {
      this.attachVbsBindings(component);
    }

    if (!options) return template;
    if (options.id) template.id = options.id;

    return template;
  }

  private attachVbsBindings(component: VBSComponent<HTMLElement>) {
    this.attachVbsBindingsFor(component.template, component);
  }

  private attachVbsBindingsFor(template: HTMLElement, component: VBSComponent<HTMLElement>) {
    Object.keys(template.dataset).forEach((key : string) => {
      if (component.hasEventListeners() && key.startsWith('vbsEvent')) {
        this.attachEventListener(key, template, component);
      } else if (component.hasAssignments() && key === 'vbsAssign') {
        this.bindAssingment(template.dataset[key], template, component)
      }
    });

    for (let i = 0; i < template.children.length; i++) {
      const child : any = template.children[i];
      if (child['children'] && child['dataset']) {
        this.attachVbsBindingsFor(child as HTMLElement, component);
      }
    }
  }

  private attachEventListener(key: string, template: HTMLElement, component: VBSComponent<HTMLElement>) {
    console.debug('Attaching event listener', key);
    const eventListenerFunctionName = template.dataset[key];
    const eventListener : (event : Event) => void = (component as any)[eventListenerFunctionName];
    if (!eventListener) {
      throw new Error(`Cannot find event listener ${eventListenerFunctionName}`);
    }

    const eventListenerName : string = key.slice(8, key.length).toLocaleLowerCase();
    (template as any)[eventListenerName] = eventListener.bind(component);
  }

  private bindAssingment(fieldName: string, template: HTMLElement, component: VBSComponent<HTMLElement>) {
    console.debug('Binding for field', fieldName);
    (component as any)[fieldName] = template;
  }
}
