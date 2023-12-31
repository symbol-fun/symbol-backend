import mongoose from 'mongoose'
import type { FilterQuery } from 'mongoose'

import { EmoteModel } from '../models/emote.model'
import type { EmoteDocument } from '../models/emote.model'
import type { EmoteQueryOptions, EmoteRequest, EmoteResponse } from '../types/emote.types'
import { InternalServerError } from './errors'
import { mapEmoteResponse } from '../util/emoteUtil'
import escapeStringRegexp from 'escape-string-regexp'
import { createSymbolInDB, fetchAllSymbolsFromDB } from './symbol.service'

export async function createEmoteInDB(emoteData: Partial<EmoteRequest>): Promise<EmoteResponse | null> {
  // Check if symbol exists
  const symbols = await fetchAllSymbolsFromDB({ search: emoteData.symbol } as any)
  if (symbols?.length === 0) {
    // Create the symbol if it does not exist
    await createSymbolInDB({ name: emoteData?.symbol?.toLowerCase() });
  }

  try {
    const emoteBuildData = {
      senderTwitterUsername: emoteData.senderTwitterUsername as string,
      receiverTwitterUsername: emoteData.receiverTwitterUsername as string,
      symbol: emoteData?.symbol?.toLowerCase() as string,
    }
    const emoteDoc = EmoteModel.build(emoteBuildData)
    const createdEmote = await EmoteModel.create(emoteDoc)
    return mapEmoteResponse(createdEmote)
  } catch (error) {
    console.error('Error occurred while creating emote in DB', error)
    throw new InternalServerError('Failed to create emote in DB')
  }
}

// export async function fetchEmoteFromDB(EmoteId: string): Promise<EmoteResponse | null> {
//   try {
//     const emoteDoc = await EmoteModel.findById(EmoteId)
//     return emoteDoc ? emoteDoc.toObject() : null
//   } catch (error) {
//     console.error('Error occurred while fetching Emote from DB', error)
//     throw new InternalServerError('Failed to fetch Emote from DB')
//   }
// }

export async function fetchAllEmotesFromDB(
  options: EmoteQueryOptions
): Promise<EmoteResponse[]> {
  try {

    const { skip, limit, orderBy, senderTwitterUsername, receiverTwitterUsername, symbol } = options
    const orderDirection = options.orderDirection === 'asc' ? 1 : -1

    // Sorting Options
    const sortOptions: any = {}
    sortOptions[orderBy] = orderDirection
    sortOptions._id = 1

    // Filter Options
    const filterOptions: FilterQuery<EmoteDocument>[] = []

    if (senderTwitterUsername) {
      filterOptions.push({
        $or: [
          { senderTwitterUsername: { $regex: new RegExp("^" + senderTwitterUsername + "$", 'iu') } },
        ],
      })
    }
    if (receiverTwitterUsername) {
      filterOptions.push({
        $or: [
          { receiverTwitterUsername: { $regex: new RegExp("^" + receiverTwitterUsername + "$", 'iu') } },
        ],
      })
    }
    if (symbol) {
      filterOptions.push({
        $or: [
          { symbol: { $regex: new RegExp("^" + symbol + "$", 'iu') } },
        ],
      })
    }

    // Filter Query
    let filterQuery = {}
    if (filterOptions.length > 0) {
      filterQuery = { $and: filterOptions }
    }

    const emoteDocs: EmoteDocument[] = await EmoteModel
      .find(filterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)

    return emoteDocs.map((doc) => mapEmoteResponse(doc) as EmoteResponse)
  } catch (error) {
    console.error('Error occurred while fetching all emotes from DB', error)
    throw new InternalServerError('Failed to fetch all emotes from DB')
  }
}

// export async function updateEmoteInDB(EmoteId: string, updatedData: Partial<EmoteResponse>): Promise<EmoteResponse | null> {
//   try {
//     const updatedEmoteDoc = await EmoteModel.findByIdAndUpdate(EmoteId, updatedData, { new: true })
//     return updatedEmoteDoc ? updatedEmoteDoc.toObject() : null
//   } catch (error) {
//     console.error('Error occurred while updating Emote in DB', error)
//     throw new InternalServerError('Failed to update Emote in DB')
//   }
// }

export async function deleteEmoteInDB(emoteId: string): Promise<void> {
  try {
    await EmoteModel.findByIdAndDelete(emoteId)
  } catch (error) {
    console.error('Error occurred while deleting emote from DB', error)
    throw new InternalServerError('Failed to delete emote from DB')
  }
}
