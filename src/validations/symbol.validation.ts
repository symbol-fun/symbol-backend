import { body, query } from 'express-validator'

export const createSymbolValidation = [
  body('name')
    .notEmpty()
    .isString()
    .withMessage('name is not valid or null/empty'),
]

// export const fetchsymbolValidation = [
//   query('symbolId')
//     .notEmpty()
//     .isString()
//     .withMessage('symbolId is not valid or null/empty'),
// ]

export const fetchAllSymbolsValidation = [
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('skip should be a non-negative integer'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('limit should be a positive integer'),
  query('orderBy')
    .optional()
    .isString()
    .withMessage('orderBy should be a valid string if provided'),
  query('orderDirection')
    .optional()
    .isString()
    .withMessage('orderDirection should be a valid string if provided'),
  query('search')
    .optional()
    .isString()
    .withMessage('search should be a valid string if provided'),
]

// export const updatesymbolValidation = [
//   body('symbolId')
//     .notEmpty()
//     .isString()
//     .withMessage('symbolId is not valid or null/empty'),
//   body('updatedData')
//     .notEmpty()
//     .isObject()
//     .withMessage('updatedData should be a non-empty object'),
// ]

// export const deletesymbolValidation = [
//   body('symbolId')
//     .notEmpty()
//     .isString()
//     .withMessage('symbolId is not valid or null/empty'),
// ]
