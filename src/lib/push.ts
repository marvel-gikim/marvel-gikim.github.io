/** Thin wrapper around the OneSignal v16 Web SDK loaded in index.html. */
type OneSignalApi = {
  Notifications: {
    isPushSupported(): boolean
    permission: boolean
    requestPermission(): Promise<void>
    addEventListener(event: "permissionChange", cb: (granted: boolean) => void): void
  }
  User: { PushSubscription: { optedIn?: boolean; optIn(): Promise<void> } }
}

declare global {
  interface Window {
    OneSignalDeferred?: Array<(os: OneSignalApi) => void | Promise<void>>
  }
}

/** Run code once the OneSignal SDK is ready (queues if it hasn't loaded yet). */
export function withOneSignal(fn: (os: OneSignalApi) => void | Promise<void>) {
  window.OneSignalDeferred = window.OneSignalDeferred || []
  window.OneSignalDeferred.push(fn)
}

export const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
export const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
