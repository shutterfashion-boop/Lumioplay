import { mkdir, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const releaseDir = path.resolve(repoRoot, 'release')

const packageJson = JSON.parse(await readFile(path.resolve(repoRoot, 'package.json'), 'utf8'))
const version = packageJson.version
const zipName = `lumioplay-v${version}.zip`
const zipPath = path.resolve(releaseDir, zipName)

await mkdir(releaseDir, { recursive: true })
await rm(zipPath, { force: true })

await execFileAsync('zip', [
  '-r',
  zipPath,
  'plugin.json',
  'README.md',
  'CHANGELOG.md',
  'dist/runtime.js',
], {
  cwd: repoRoot,
})

console.log(`Packaged release ZIP: ${zipPath}`)
