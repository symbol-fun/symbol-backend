import express from 'express'
import { authenticateAndSetAccount } from '../middleware'

import {
  createEmote,
  fetchAllEmotes,
  // updateEmote,
  deleteEmote,
  fetchUnrespondedEmotes,
  fetchEmote,
  createEmotes,
  fetchEmoteReplyChain,
} from '../controllers/emote.controller'
import { validateRequest } from '../middleware/validateRequest'
import {
  createEmoteValidation,
  fetchAllEmotesValidation,
  // updateEmoteValidation,
  deleteEmoteValidation,
  fetchEmoteValidation,
  createEmotesManyValidation,
  fetchUnrespondedEmotesValidation,
  fetchEmoteReplyChainValidation,
} from '../validations/emote.validation'

export const emoteRouter = express.Router()

emoteRouter.post(
  '/',
  createEmoteValidation,
  validateRequest,
  authenticateAndSetAccount,
  createEmote
)

emoteRouter.post(
  '/many',
  createEmotesManyValidation,
  validateRequest,
  authenticateAndSetAccount,
  createEmotes
)

emoteRouter.get(
  '/single',
  fetchEmoteValidation,
  validateRequest,
  fetchEmote
)

emoteRouter.get(
  '/',
  fetchAllEmotesValidation,
  validateRequest,
  fetchAllEmotes
)

emoteRouter.get(
  '/fetchUnrespondedEmotes',
  fetchUnrespondedEmotesValidation,
  validateRequest,
  authenticateAndSetAccount,
  fetchUnrespondedEmotes
)

emoteRouter.get(
  '/fetchEmoteReplyChain',
  fetchEmoteReplyChainValidation,
  validateRequest,
  fetchEmoteReplyChain
)

// emoteRouter.put(
//   '/',
//   updateEmoteValidation,
//   validateRequest,
//   updateEmote
// )

emoteRouter.delete(
  '/',
  deleteEmoteValidation,
  validateRequest,
  deleteEmote
)
