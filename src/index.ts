import { HomePage } from "./content/pages/home/home";
import { FileReferencesService } from "./services/file-references.service";
import { LoginService } from "./services/login.service";
import { SessionService } from "./services/session.service";
import { VerbosityApp } from "./_verbosity/verbosity-app";
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

require('./index.css');

require('./content/styles/basic.css');
require('./content/styles/button.css');
require('./content/styles/logo.css');
require('./content/styles/notification.css');
require('./content/styles/panel.css');

const APP = new VerbosityApp();

APP.registry.registerSingleton(new LoginService);

APP.registry.registerSingleton(new SessionService);
APP.registry.registerSingleton(new FileReferencesService);
APP.registry.registerSingleton(new FolderService);

APP.registry.registerSingleton(new IsLoggedInGuard);
APP.registry.registerSingleton(new IsNotLoggedInGuard);

APP.addRoute('/', {
  instance: () => new HomePage(),
  guard: APP.registry.getSingleton(IsNotLoggedInGuard)
});

APP.addRoute('/login', {
  instance: () => new LoginPage(),
  guard: APP.registry.getSingleton(IsLoggedInGuard)
});

APP.addRoute('/upload', {
  instance: () => new FileUploadPage(),
  guard: APP.registry.getSingleton(IsNotLoggedInGuard)
});

APP.addRoute('/search', {
  instance: () => new SearchPage(),
  guard: APP.registry.getSingleton(IsNotLoggedInGuard)
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
  guard: APP.registry.getSingleton(IsNotLoggedInGuard)
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
  guard: APP.registry.getSingleton(IsNotLoggedInGuard)
})

APP.addSimpleMount('header-mount', new Header());
APP.addSimpleMount('notification-mount', new NotificationPanel());

APP.start();
