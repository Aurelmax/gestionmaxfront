/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { ServerFunctionClient } from 'payload'

import config from '@/payload.config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
/* @ts-expect-error - Payload CSS imports don't have type definitions */
import '@payloadcms/next/css'

import { importMap } from './importMap'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

// Payload RootLayout gère son propre <html> et <body>
// Il remplace complètement le root layout de Next.js pour cette route
const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
