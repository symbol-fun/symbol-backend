import type { EmoteNotifDocument } from '../models/emote-notif.model'
import type { EmoteNotifResponse } from '../types/emote-notif.types'

export function mapEmoteNotifResponse(
  emoteNotifDoc: EmoteNotifDocument
): EmoteNotifResponse {
  // if (!emoteNotifDoc) {
  //   return null
  // }

  return {
    id: emoteNotifDoc._id.toString(),
    emoteID: emoteNotifDoc.emoteID,
    hasReadCasually: emoteNotifDoc.hasReadCasually,
    hasReadDirectly: emoteNotifDoc.hasReadDirectly,
    timestamp: (emoteNotifDoc as any).createdAt,
  }
}
