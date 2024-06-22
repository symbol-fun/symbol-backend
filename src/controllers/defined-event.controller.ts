import type { Request, Response } from 'express'
import { DECODED_ACCOUNT } from '../util/jwtTokenUtil'

import { handleError, handleSuccess } from '../lib/base'
import {
  createDefinedEventInDB,
  fetchAllDefinedEventsFromDB,
  fetchDefinedEventFromDB,
  updateDefinedEventInDB,
  deleteDefinedEventInDB,
} from '../services/symbol-definition.service'
import type { DefinedEventQueryOptions, DefinedEventResponse } from '../types/symbol-definition.types'

export async function createDefinedEvent(req: Request, res: Response) {
  try {
    const decodedAccount = (req as any).decodedAccount as DECODED_ACCOUNT
    const reqBody = req.body
    const requestData = {
      eventCreator: decodedAccount.twitterUsername,
      eventSymbol: reqBody.eventSymbol,
    }
    const DefinedEvent = await createDefinedEventInDB(requestData)
    return handleSuccess(res, { DefinedEvent })
  } catch (error) {
    console.error('Error occurred while creating DefinedEvent', error)
    return handleError(res, error, 'Unable to create DefinedEvent')
  }
}

export async function fetchDefinedEvent(req: Request, res: Response) {
  try {
    // const decodedAccount = (req as any).decodedAccount as DECODED_ACCOUNT
    const eventCreator = req.query.eventCreator
      ? (req.query.eventCreator as string)
      : null
    const definedEventId = req.query.definedEventId as string
    const eventSymbol = req.query.eventSymbol as string
    const definedEvent = await fetchDefinedEventFromDB({
      definedEventId,
      eventSymbol,
      eventCreator,
    })
    return handleSuccess(res, { definedEvent })
  } catch (error) {
    console.error('Error occurred while fetching DefinedEvent', error)
    return handleError(res, error, 'Unable to fetch DefinedEvent')
  }
}

export async function fetchAllDefinedEvents(req: Request, res: Response) {
  try {
    const skip = Number.parseInt(req.query.skip as string) || 0
    const limit = Number.parseInt(req.query.limit as string) || 10
    const orderBy = req.query.orderBy as keyof DefinedEventResponse
    const orderDirection =
      (req.query.orderDirection as string | undefined) ?? 'desc'
    // const search = (req.query.search as string) || null
    const eventCreator = (req.query.eventCreator as string) || null
    const eventSymbol = (req.query.eventSymbol as string) || null

    const options: DefinedEventQueryOptions = {
      skip,
      limit,
      orderBy,
      orderDirection,
      // search,
      eventCreator,
      eventSymbol,
    }

    const definedEvents = await fetchAllDefinedEventsFromDB(options)
    return handleSuccess(res, { definedEvents })
  } catch (error) {
    console.error('Error occurred while fetching all DefinedEvents', error)
    return handleError(res, error, 'Unable to fetch all DefinedEvents')
  }
}

export async function updateDefinedEvent(req: Request, res: Response) {
  try {
    const decodedAccount = (req as any).decodedAccount as DECODED_ACCOUNT
    const definedEventId = req.body.definedEventId as string
    const updatedEventSymbol = req.body.updatedEventSymbol as string
    const updatedDefinedEvent = await updateDefinedEventInDB({
      senderTwitterUsername: decodedAccount.twitterUsername,
      definedEventId,
      updatedEventSymbol
    })
    return handleSuccess(res, { updatedDefinedEvent })
  } catch (error) {
    console.error('Error occurred while updating DefinedEvent', error)
    return handleError(res, error, 'Unable to update DefinedEvent')
  }
}

export async function deleteDefinedEvent(req: Request, res: Response) {
  try {
    const definedEventId = req.body.definedEventId as string
    await deleteDefinedEventInDB(definedEventId)
    return handleSuccess(res, { message: `DefinedEvent with ID ${definedEventId} has been deleted` })
  } catch (error) {
    console.error('Error occurred while deleting DefinedEvent', error)
    return handleError(res, error, 'Unable to delete DefinedEvent')
  }
}