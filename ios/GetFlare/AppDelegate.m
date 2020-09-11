/**
 * Copyright (c) 2019 Flare Jewelry. All rights reserved.
 */

#import "AppDelegate.h"

#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>
#import <RNCPushNotificationIOS.h>
#import <BugsnagReactNative/BugsnagReactNative.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  #ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
  
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = UIColorFromRGB(0xF0F7FF);
  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];

  [BugsnagReactNative startWithAPIKey:@"a48fda6bc569b8e593d7cf2fe3b6a49c"];

  return YES;
}

// Required to register for notifications
// - (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
//   [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
// }
// Required for the register event.
// - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
// {
//   [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
// }
// // Required for the notification event. You must call the completion handler after handling the remote notification.
// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
// fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
//   [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
// }
// Required for the registrationError event.
// - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
// {
//   [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
// }
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

@end
