import { WebhooksService } from "@/services/webhooks.service";
import type { Webhook, WebhookPayload } from "@/types/global";

export type { Webhook } from "@/types/global";

export function getWebhooks(tenantId: string): Promise<Webhook[]> {
  return WebhooksService.getByTenant(tenantId);
}

export function createWebhooks(params: WebhookPayload): Promise<Webhook> {
  return WebhooksService.create(params);
}

export function updateWebhooks(id: string, body: WebhookPayload) {
  return WebhooksService.update(id, body);
}

export function deleteWebhooks(id: string, tenantId: string) {
  return WebhooksService.delete(id, tenantId);
}
