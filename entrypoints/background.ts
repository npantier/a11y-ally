import { sendMessage } from '../src/messaging';

export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;
    // Side panel open must happen in the user-gesture turn (Chrome/Edge only).
    try {
      await (browser as any).sidePanel.open({ tabId: tab.id });
    } catch {
      // sidePanel unavailable — overlay still works.
    }
    await sendMessage('toggleOverlay', undefined, tab.id);
  });
});
