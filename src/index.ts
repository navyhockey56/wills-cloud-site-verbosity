import { VerbosityApp } from 'verbosity';

import { HomePage } from "./content/pages/home/home";
import { FileReferencesService } from "./services/file-references.service";
import { LoginService } from "./services/login.service";
import { SessionService } from "./services/session.service";
import { LoginPage } from "./content/pages/login/login";
import { Header } from "./content/components/header/header";
import { FolderService } from "./services/folder.service";
import { FolderViewPage } from "./content/pages/folder-view/folder-view";
import { IsLoggedInGuard } from "./guards/is-logged-in.guard";
import { IsNotLoggedInGuard } from "./guards/is-not-logged-in-guard";
import { FileReferenceView } from "./content/pages/file-reference-view/file-reference-view";
import { FileUploadPage } from "./content/pages/file-upload/file-upload";
import { NotificationPanel } from "./content/components/notifications/notification-panel";
import { SearchPage } from "./content/pages/search/search";
import { EditFileReferencePage } from "./content/pages/edit-file-reference/edit-file-reference";
import { PopUpFrame } from "./content/components/pop-up/pop-up";

require('./index.css');
require('./content/styles/basic.css');
require('./content/styles/button.css');
require('./content/styles/field.css');
require('./content/styles/input.css');
require('./content/styles/label.css');
require('./content/styles/logo.css');
require('./content/styles/notification.css');
require('./content/styles/panel.css');

const APP = new VerbosityApp();

APP.setTemplateHydrater((template) => {
  // Inject the dom, registry, and router into the template
  const simpleTemplate = template as any;
  simpleTemplate.dom = APP.dom;
  simpleTemplate.registry = APP.registry;
  simpleTemplate.router = APP.router;
});

APP.registry.registerSingleton(new LoginService);

const sessionService = new SessionService(APP.registry, APP.router);
APP.registry.registerSingleton(sessionService);
APP.registry.registerSingleton(new FileReferencesService(APP.registry));
APP.registry.registerSingleton(new FolderService(APP.registry));

const isLoggedInGuard = new IsLoggedInGuard(sessionService);
const isNotLoggedInGuard = new IsNotLoggedInGuard(sessionService);

APP.addRoute('/', {
  instance: () => new HomePage(),
  guard: isNotLoggedInGuard
});

APP.addRoute('/login', {
  instance: () => new LoginPage(),
  guard: isLoggedInGuard
});

APP.addRoute('/upload', {
  instance: () => new FileUploadPage(),
  guard: isNotLoggedInGuard
});

APP.addRoute('/search', {
  instance: () => new SearchPage(),
  guard: isNotLoggedInGuard
});

APP.addRoute('/files/:fileId', {
  instance: (params : any) => {
    const fileView = new FileReferenceView();

    if (params.fileReference) {
      fileView.setFileReference(params.fileReference)
    } else if (params.fileId) {
      fileView.setFileId(params.fileId)
    }

    return fileView;
  },
  guard: isNotLoggedInGuard
})

APP.addRoute('/files/:fileId/edit', {
  instance: (params : any) => {
    const fileView = new EditFileReferencePage();

    if (params.fileReference) {
      fileView.setFileReference(params.fileReference)
    } else if (params.fileId) {
      fileView.setFileId(params.fileId)
    }

    return fileView;
  },
  guard: isNotLoggedInGuard
})

APP.addRoute('/folders/:folderId', {
  instance: (params : any) => {
    const folderView = new FolderViewPage();

    if (params.folder) {
      folderView.setFolder(params.folder)
    } else if (params.folderId) {
      folderView.setFolderId(params.folderId)
    }

    return folderView;
  },
  guard: isNotLoggedInGuard
})

APP.addSimpleMount('header-mount', new Header());
APP.addSimpleMount('notification-mount', new NotificationPanel());
APP.addSimpleMount('pop-up-mount', new PopUpFrame());

APP.start();
