import { defineExtensionMessaging } from '@webext-core/messaging';
import type { ReportModel } from '../core/audit/types';

interface ProtocolMap {
  toggleOverlay(): void;
  runAudit(): ReportModel;
  highlightElement(id: string): void;
  highlightSelector(selector: string): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
