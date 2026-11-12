"use server";

import type { HelloPayload } from "@/lib/hello";

/** Wire up a delivery service here before accepting contact messages. */
export async function sendHello(payload: HelloPayload): Promise<void> {
  void payload;
  // Never claim delivery or log personal information without a delivery backend.
  throw new Error("Contact message delivery is not configured yet.");
}
