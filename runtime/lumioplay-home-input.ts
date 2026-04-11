import { getGamepadExitCombo, getGamepadMapping } from './lumioplay-storage'
import { onLibretroStopped, sendLibretroInput, stopLibretroGame } from './lumioplay-launcher'

const JOYPAD_BUTTON_COUNT = 16
const KEYBOARD_TO_JOYPAD: Record<string, number> = {
  KeyZ: 0,
  KeyA: 1,
  ShiftRight: 2,
  Enter: 3,
  ArrowUp: 4,
  ArrowDown: 5,
  ArrowLeft: 6,
  ArrowRight: 7,
  KeyX: 8,
  KeyS: 9,
  KeyQ: 10,
  KeyW: 11,
}

let sessionActive = false
let keyboardState = Array(JOYPAD_BUTTON_COUNT).fill(false) as boolean[]
let gamepadState = Array(JOYPAD_BUTTON_COUNT).fill(false) as boolean[]
let lastSentState = Array(JOYPAD_BUTTON_COUNT).fill(false) as boolean[]
let comboHeld = false
let rafId = 0
let unlistenLibretroStopped: (() => void) | null = null

function mergeInputStates(): boolean[] {
  return Array.from({ length: JOYPAD_BUTTON_COUNT }, (_, index) => {
    return Boolean(keyboardState[index] || gamepadState[index])
  })
}

function pushInputState() {
  const merged = mergeInputStates()
  const changed = merged.some((pressed, index) => pressed !== lastSentState[index])
  if (!changed) return
  lastSentState = merged
  void sendLibretroInput([...merged])
}

function resetInputState() {
  keyboardState = Array(JOYPAD_BUTTON_COUNT).fill(false)
  gamepadState = Array(JOYPAD_BUTTON_COUNT).fill(false)
  lastSentState = Array(JOYPAD_BUTTON_COUNT).fill(false)
  void sendLibretroInput(Array(JOYPAD_BUTTON_COUNT).fill(false))
}

function onKeyDown(event: KeyboardEvent) {
  if (!sessionActive) return
  const mapped = KEYBOARD_TO_JOYPAD[event.code]
  const shouldHandle = event.code === 'Escape' || mapped !== undefined
  if (!shouldHandle) return
  event.preventDefault()
  if (event.code === 'Escape') {
    void stopHomeInputSession()
    return
  }
  if (mapped !== undefined && !keyboardState[mapped]) {
    keyboardState[mapped] = true
    pushInputState()
  }
}

function onKeyUp(event: KeyboardEvent) {
  if (!sessionActive) return
  const mapped = KEYBOARD_TO_JOYPAD[event.code]
  if (mapped === undefined) return
  if (keyboardState[mapped]) {
    keyboardState[mapped] = false
    pushInputState()
  }
}

function onFrame() {
  if (!sessionActive) return
  const pad = navigator.getGamepads?.().find((entry) => Boolean(entry)) ?? null
  const mapping = getGamepadMapping()
  const exitCombo = getGamepadExitCombo()
  const nextState = Array(JOYPAD_BUTTON_COUNT).fill(false)

  if (pad) {
    Object.entries(mapping).forEach(([joypadIndexRaw, gamepadButtonRaw]) => {
      const joypadIndex = Number(joypadIndexRaw)
      const gamepadButtonIndex = Number(gamepadButtonRaw)
      if (!Number.isFinite(joypadIndex) || !Number.isFinite(gamepadButtonIndex)) return
      if (joypadIndex < 0 || joypadIndex >= JOYPAD_BUTTON_COUNT || gamepadButtonIndex < 0) return
      nextState[joypadIndex] = Boolean(pad.buttons[gamepadButtonIndex]?.pressed)
    })

    const comboPressed =
      exitCombo.length > 0 &&
      exitCombo.every((buttonIndex) => Boolean(pad.buttons[buttonIndex]?.pressed))

    if (comboPressed && !comboHeld) {
      comboHeld = true
      void stopHomeInputSession()
      return
    }
    if (!comboPressed) comboHeld = false
  }

  gamepadState = nextState
  pushInputState()
  rafId = window.requestAnimationFrame(onFrame)
}

export function startHomeInputSession() {
  if (sessionActive) return
  sessionActive = true
  comboHeld = false
  keyboardState = Array(JOYPAD_BUTTON_COUNT).fill(false)
  gamepadState = Array(JOYPAD_BUTTON_COUNT).fill(false)
  lastSentState = Array(JOYPAD_BUTTON_COUNT).fill(false)

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  rafId = window.requestAnimationFrame(onFrame)

  if (!unlistenLibretroStopped) {
    unlistenLibretroStopped = onLibretroStopped(() => {
      void stopHomeInputSession({ skipStopCommand: true })
    })
  }
}

export async function stopHomeInputSession(options?: { skipStopCommand?: boolean }) {
  if (!sessionActive) return
  sessionActive = false
  comboHeld = false
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  if (rafId) {
    window.cancelAnimationFrame(rafId)
    rafId = 0
  }
  resetInputState()
  if (!options?.skipStopCommand) {
    await stopLibretroGame()
  }
}

export function isHomeInputSessionActive(): boolean {
  return sessionActive
}
