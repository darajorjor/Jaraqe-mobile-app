/**
 * push
 * pop
 * popToRoot
 * showLightBox
 * handleDeepLink
 * showModal
 * dismissModal
 * dismissAllModals
 * */
import { Navigation } from 'react-native-navigation';
// import { bugsnag } from 'src/App';

const generalMethods = [
  'dismissModal',
  'dismissAllModals',
  'showModal',
  'handleDeepLink',
  'showLightBox',
  'startTabBasedApp',
  'showInAppNotification',
  'dismissInAppNotification',
  'startSingleScreenApp',
];

const generalOptions = {
  navigatorStyle: {
    navBarHidden: true,
  },
  animationType: 'slide-horizontal',
};

let disabled = false;

export function navigate({ navigator, method, screen, options = {} }) {
  if (screen && (disabled === screen)) return null;
  disabled = screen;

  setTimeout(() => {
    disabled = false;
  }, 400);

  if (options && options.navigatorStyle) {
    options.navigatorStyle = {
      ...generalOptions.navigatorStyle,
      ...options.navigatorStyle
    }
  }
  options = { ...generalOptions, ...options };
  if (screen) {
    if (typeof screen === 'string') {
      options.screen = `hampa.${screen}`;
    } else {
      options.screen = screen;
    }
  }
  // bugsnag.leaveBreadcrumb(screen ? (typeof screen === 'object' ? JSON.stringify(screen) : screen) : method, {
  //   screen,
  //   method,
  //   link: options.link ? options.link : null,
  // });
  if (generalMethods.includes(method)) {
    return Navigation[ method ](options);
  }

  if (options.callback) {
    setTimeout(options.callback.fn, options.callback.timeout);
  }

  if (!navigator[ method ]) {
    const err = new Error('this method does not exist in navigator: ', method);
    // bugsnag.notify(err, {
    //   where: arguments.callee.caller
    // });
    throw err;
  }

  return navigator[ method ](options);
}