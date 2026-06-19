import { sendMessage } from '../src/messaging';

// The MV3 sidePanel API isn't in the webextension-polyfill types WXT bundles,
// so narrow the access to just the method we call instead of casting to `any`.
type SidePanelCapable = { sidePanel?: { open(options: { tabId: number }): Promise<void> } };

export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;
    // Side panel open must happen in the user-gesture turn (Chrome/Edge only).
    try {
      await (browser as unknown as SidePanelCapable).sidePanel?.open({ tabId: tab.id });
    } catch {
      // sidePanel unavailable — overlay still works.
    }
    await sendMessage('toggleOverlay', undefined, tab.id);
  });
});
