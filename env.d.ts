/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SEARCHAPI_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
