import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const entryFile = path.resolve(repoRoot, 'runtime/index.tsx')
const outfile = path.resolve(repoRoot, 'dist/runtime.js')

const tempDir = await mkdtemp(path.join(tmpdir(), 'lumioplay-build-'))
const reactShim = path.join(tempDir, 'react-shim.ts')
const jsxShim = path.join(tempDir, 'jsx-runtime-shim.ts')
const wrapperEntry = path.join(tempDir, 'wrapper-entry.ts')

await writeFile(
  reactShim,
  `
const react = globalThis.__lumioPluginRuntime?.react ?? globalThis.React
if (!react) {
  throw new Error('Lumio plugin runtime host has not initialized React.')
}
export default react
export const Fragment = react.Fragment
export const useEffect = react.useEffect
export const useMemo = react.useMemo
export const useRef = react.useRef
export const useState = react.useState
`,
)

await writeFile(
  jsxShim,
  `
const runtime = globalThis.__lumioPluginRuntime?.jsxRuntime
if (!runtime) {
  throw new Error('Lumio plugin runtime host has not initialized JSX runtime.')
}
export const Fragment = runtime.Fragment
export const jsx = runtime.jsx
export const jsxs = runtime.jsxs
export const jsxDEV = runtime.jsxDEV
`,
)

await writeFile(
  wrapperEntry,
  `
import * as mod from ${JSON.stringify(entryFile)}
const plugin =
  Reflect.get(mod, 'default') ??
  Reflect.get(mod, 'LumioplayPlugin') ??
  Object.values(mod).find((value) => value && typeof value === 'object' && 'id' in value && 'register' in value)
if (!plugin) {
  throw new Error('Could not find Lumioplay plugin export in bundle.')
}
globalThis.__lumioPluginRuntimeBundle = plugin
`,
)

const aliasPlugin = {
  name: 'lumioplay-runtime-alias',
  setup(buildApi) {
    buildApi.onResolve({ filter: /^react$/ }, () => ({ path: reactShim }))
    buildApi.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ path: jsxShim }))
  },
}

await mkdir(path.dirname(outfile), { recursive: true })

try {
  await build({
    entryPoints: [wrapperEntry],
    outfile,
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    jsx: 'automatic',
    minify: false,
    sourcemap: false,
    loader: {
      '.jpg': 'dataurl',
      '.jpeg': 'dataurl',
      '.png': 'dataurl',
    },
    plugins: [aliasPlugin],
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  })

  console.log(`Built plugin runtime: ${outfile}`)
} finally {
  await rm(tempDir, { recursive: true, force: true })
}
