package com.jaraqe;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.microsoft.codepush.react.ReactInstanceHolder;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                new VectorIconsPackage(),
                new FastImageViewPackage(),
                new ReactNativeOneSignalPackage(),
                new CodePush("JMGDn3Keys_GbvRp2xOJWT_81b96BkesVKwUG", getApplicationContext(), BuildConfig.DEBUG)
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

    @Override
    public String getJSMainModuleName() {
        return "index";
    }

    @Override
    public String getJSBundleFile() {
        // Override default getJSBundleFile method with the one CodePush is providing
        return CodePush.getJSBundleFile();
    }

    // @Override
    // public void onCreate() {
    //   super.onCreate();
    //   SoLoader.init(this, /* native exopackage */ false);
    // }
}
