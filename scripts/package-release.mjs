import { cp, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { tmpdir } from 'node:os'

const execFileAsync = promisify(execFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const releaseDir = path.resolve(repoRoot, 'release')

const packageJson = JSON.parse(await readFile(path.resolve(repoRoot, 'package.json'), 'utf8'))
const version = packageJson.version
const zipName = `lumioplay-v${version}.zip`
const zipPath = path.resolve(releaseDir, zipName)
const tempDir = await mkdtemp(path.join(tmpdir(), 'lumioplay-release-'))
const packageRoot = path.join(tempDir, 'lumioplay')

await mkdir(releaseDir, { recursive: true })
await rm(zipPath, { force: true })
await mkdir(packageRoot, { recursive: true })

try {
  await cp(path.resolve(repoRoot, 'plugin.json'), path.resolve(packageRoot, 'plugin.json'))
  await cp(path.resolve(repoRoot, 'README.md'), path.resolve(packageRoot, 'README.md'))
  await cp(path.resolve(repoRoot, 'CHANGELOG.md'), path.resolve(packageRoot, 'CHANGELOG.md'))
  await mkdir(path.resolve(packageRoot, 'dist'), { recursive: true })
  await cp(path.resolve(repoRoot, 'dist/runtime.js'), path.resolve(packageRoot, 'dist/runtime.js'))

  await execFileAsync('zip', [
    '-r',
    zipPath,
    'lumioplay',
  ], {
    cwd: tempDir,
  })
} finally {
  await rm(tempDir, { recursive: true, force: true })
}

console.log(`Packaged release ZIP: ${zipPath}`)
