/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'

const serverFunction: ServerFunctionClient = async (...args) => {
  'use server'
  const { getPayload } = await import('payload')
  return getPayload({ config })
}

export const GET = REST_GET(config, serverFunction)
export const POST = REST_POST(config, serverFunction)
export const DELETE = REST_DELETE(config, serverFunction)
export const PATCH = REST_PATCH(config, serverFunction)
export const PUT = REST_PUT(config, serverFunction)
export const OPTIONS = REST_OPTIONS(config)
