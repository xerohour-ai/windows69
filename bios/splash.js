import { sleep } from "../42/lib/timing/sleep.js"
// import { identifyKeyboardLayout } from "../42/api/env/device/keyboard/identifyKeyboardLayout.js"

// const keyboardLayout = await identifyKeyboardLayout()

const STEPS = [
  { name: "CPU", fn: (env) => `${env.cpu.cores} cores` },
  { name: "GPU", fn: (env) => `${env.gpu.vendor} ${env.gpu.model}` },
  { name: "Memory", fn: (env) => `${env.memory.gigabytes} GB` },
  {
    name: "Network",
    fn: (env) => env.network.type || "±" + env.network.effectiveType,
  },
  { name: "Languages", fn: (env) => env.languages },
  { name: "Pointer", fn: (env) => env.pointer.type },
  // {
  //   name: "Keyboard",
  //   fn: () =>
  //     keyboardLayout
  //       ? `${keyboardLayout.name} (${keyboardLayout.code})`
  //       : "Unknown",
  // },
  { name: "OS", fn: (env) => env.os.name },
  { name: "Device", fn: (env) => env.device.type },
  { name: "Browser", fn: (env) => env.browser.name },
  { name: "Engine", fn: (env) => env.engine.name },
  { name: "Realm", fn: (env) => env.realm },
]

export async function splash(log, logError) {
  log("\n")

  const envPromise = import("../42/api/env.js") //
    .then((m) => m.env)

  for (const { name } of window.navigator.plugins) {
    await sleep(16 + 100 * Math.random())
    log(name + "\n")
  }

  log("\n")

  try {
    const env = await envPromise

    for (const { name, fn } of STEPS) {
      await sleep(16 + 100 * Math.random())
      log(`${name}: ${fn(env)}\n`)
    }

    log(`\nStarting Windows94 on ${env}`)
  } catch (error) {
    logError(error)
  }

  await sleep(1000 + 2000 * Math.random())

  // If the splash file is not actually served (e.g. not yet uploaded),
  // do not show a 404 frame over the whole screen: skip the splash.
  const splashSrc = "c/users/windows93/interface/splashs/v3.voxel.html"
  try {
    const splashRes = await fetch(splashSrc, { method: "HEAD" })
    if (!splashRes.ok) return null
  } catch {
    return null
  }

  const iframeEl = document.createElement("iframe")
  iframeEl.id = "splash-screen"
  // iframeEl.src = "/c/users/windows93/interface/splashs/v2.html"
  // iframeEl.src = "/c/users/windows93/interface/splashs/v3.html"
  // iframeEl.src = "/c/users/windows93/interface/splashs/v3.voxel.48.html"
  iframeEl.src = splashSrc
  iframeEl.style.cssText = /* style */ `
    position: fixed;
    opacity: 0;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    pointer-events: none;
    z-index: 120000;`
  // Keep splash removal inside the same isolated boot container.
  const containerEl = document.querySelector("#boot-container") ?? document.body
  containerEl.append(iframeEl)
  await new Promise((resolve) => (iframeEl.onload = () => resolve()))
  iframeEl.style.removeProperty("opacity")

  await sleep(3000)
  // await new Promise(() => {})

  return iframeEl
}
