const DEV = location.hostname === "localhost" && Boolean(0)

import "./42/ui/media/picto.js"
import "./42/ui/media/folder.js"
import "./42/ui/desktop/workspaces.js"
import "./42/ui/desktop/dock.js"
import "./42/ui/control/pathpicker.js"
import "./42/api/gui/common.js"
import "./42/ui/media/icon.js"
import { os } from "./42/api/os.js"
import { animateIn, animateOut } from "./c/libs/animate-css/4.1/animate.js"
import { Timer } from "./42/lib/timing/Timer.js"
import { Dragger } from "./42/lib/dom/Dragger.js"
import { css } from "./42/lib/dom/appendCSS.js"
import { toTitleCase } from "./42/lib/type/string/transform.js"
import { resetAllData } from "./42/lib/browser/resetAllData.js"
import { toggleFullscreen } from "./42/lib/browser/toggleFullscreen.js"
import { getRects } from "./42/lib/dom/getRects.js"
import { keep } from "./42/api/keep.js"
import { loadCSS } from "./42/api/load/loadCSS.js"
import { loadDesktopStyle } from "./42/api/os/loadDesktopStyle.js"
import { joinPath } from "./42/lib/syntax/path/joinPath.js"

/** @import { FolderComponent } from "./42/ui/media/folder.js" */

const params = new URLSearchParams(location.search)
const desktopParam = params.get("desktop")
const mobileMedia = matchMedia("(width < 700px)")

const state = await keep(
  desktopParam //
    ? joinPath(desktopParam, "desktop.json5")
    : "~/config/desktop.json5",
  { icons: {} },
)

os.desktop ??= {}
os.desktop.done = false
os.desktop.state = state

window.name = "desktop"
document.addEventListener("contextmenu", (e) => e.preventDefault())

// Load animation rules before rendering icons to avoid restyling the desktop.
await Promise.allSettled([
  loadDesktopStyle(),
  loadCSS("./c/libs/animate-css/4.1/animate.css"),
])

// Set inherited animation defaults before the desktop has hundreds of nodes.
css`
  :root {
    --animate-duration: 0.6666666s;
    --animate-delay: 0.6666666s;
  }
`

/** @type {FolderComponent} */
let desktopFolderEl
let desktopRect

function getDesktopRect() {
  const rect = desktopFolderEl.getBoundingClientRect()
  const s = getComputedStyle(desktopFolderEl)
  const paddingTop = Number.parseInt(s.paddingTop)
  const paddingLeft = Number.parseInt(s.paddingLeft)
  const paddingRight = Number.parseInt(s.paddingRight)
  const paddingBottom = Number.parseInt(s.paddingBottom)
  const top = rect.top + paddingTop
  const left = rect.left + paddingLeft
  const width = desktopFolderEl.clientWidth - paddingLeft - paddingRight
  const height = desktopFolderEl.clientHeight - paddingTop - paddingBottom
  desktopRect = { top, left, width, height }
  return desktopRect
}

let iconSize = 68
let iconSizeHalf = iconSize
function getIconCoord(x, y, width = iconSize) {
  iconSize = width
  iconSizeHalf = iconSize / 2
  x -= desktopRect.left ?? 0
  y -= desktopRect.top ?? 0
  const column = Math.floor((x + iconSizeHalf) / iconSize) + 1
  const row = Math.floor((y + iconSizeHalf) / iconSize) + 1
  return { column, row }
}

function setRowCol(el, row, column) {
  el.style.gridRow = row
  el.style.gridColumn = column
  el.ariaRowIndex = row
  el.ariaColIndex = column
}

function getDesktopOrderedIcons(icons) {
  return icons.toSorted((a, b) => {
    const aCoord = state.icons[a.value] ?? {}
    const bCoord = state.icons[b.value] ?? {}
    return (
      (aCoord.row ?? Infinity) - (bCoord.row ?? Infinity) ||
      (aCoord.column ?? Infinity) - (bCoord.column ?? Infinity)
    )
  })
}

function getMobileOrderedIcons(icons) {
  const desktopOrder = getDesktopOrderedIcons(icons)
  const desktopIndexes = new Map(
    desktopOrder.map((icon, index) => [icon.value, index]),
  )
  const mobile = state.mobile ?? {}

  return desktopOrder.toSorted((a, b) => {
    const aOrder = Number.isFinite(mobile[a.value])
      ? mobile[a.value]
      : desktopIndexes.get(a.value)
    const bOrder = Number.isFinite(mobile[b.value])
      ? mobile[b.value]
      : desktopIndexes.get(b.value)
    return aOrder - bOrder
  })
}

function applyResponsiveLayout() {
  if (!desktopFolderEl) return

  const icons = [...desktopFolderEl.querySelectorAll("ui-icon")]
  if (mobileMedia.matches) {
    const ordered = getMobileOrderedIcons(icons)
    const columns =
      getComputedStyle(desktopFolderEl).gridTemplateColumns.split(" ").length

    for (let index = 0; index < ordered.length; index++) {
      const icon = ordered[index]
      icon.style.order = index
      icon.ariaRowIndex = Math.floor(index / columns) + 1
      icon.ariaColIndex = (index % columns) + 1
    }
  } else {
    for (const icon of icons) {
      icon.style.removeProperty("order")
      const coord = state.icons[icon.value]
      if (!coord) continue
      const { row, column } = coord
      setRowCol(icon, row, column)
    }
  }
}

function saveMobileOrder(icons) {
  state.mobile = Object.fromEntries(
    icons.map((icon, index) => [icon.value, index]),
  )
  applyResponsiveLayout()
}

mobileMedia.addEventListener("change", () => {
  getDesktopRect()
  applyResponsiveLayout()
})

// let startButton
let inContextMenu = false

os.desktop.el = os.render({
  tag: "main#os.fit.rows",
  content: [
    {
      tag: "#desktop",
      content: [
        {
          tag: "iframe#wallpaper.desktop.fit.action-false",
          frameBorder: "0",
        },
        {
          if: !DEV,
          tag: "ui-folder#desktopFolder._scrollbar-overlay",

          virtualizable: {
            buffer: 5000,
            usePadding: true,
          },

          matrixable: {
            useAria: true,
          },

          created(el) {
            desktopFolderEl = /** @type {FolderComponent} */ (el)
          },

          on: [
            {
              "prevent": true,
              "Ctrl+h": (e, target) => {
                target.showHiddenFiles = !target.showHiddenFiles
              },
            },
            {
              "selector": "ui-icon",
              "touchend || dblclick || Enter": (e, icon) => {
                if (inContextMenu) {
                  inContextMenu = false
                  return
                }

                if (Dragger.isDragging) return

                if (icon.ariaDescription === "folder") {
                  os.explorer(icon.value)
                } else if (icon.ariaDescription === "shortcut") {
                  os.exec(icon.command, { cwd: desktopFolderEl.value })
                } else {
                  os.apps.open(icon.value)
                }
              },
            },
            {
              "contextmenu"(e, target) {
                if (e.pointerType === "touch") inContextMenu = true

                target.displayContextMenu(e, ({ type }) => {
                  if (type === "background") {
                    return {
                      end: [
                        "---",
                        {
                          label: "Properties",
                          action: () => os.exec("appearance"),
                        },
                      ],
                    }
                  }
                })
              },
              "ui:folder.inexistent": async (e) => {
                e.preventDefault()
                const res = await os.confirm(
                  `%md The File Index seems to be in an incorrect state.  \nIf the problem persists, you should reset all data to repair the system.  \n**You'll lose every saved files**.`,
                  {
                    label: "DesktopError",
                    icon: "error",
                    decline: "Retry",
                    agree: "Reset All Data",
                  },
                )

                if (res) {
                  await resetAllData()
                  location.reload()
                }
              },
              "ui:folder.items": async (e) => {
                e.detail.items.push(os.trash.iconPlan)
              },
              "ui.render": async (e, el) => {
                await os.apps.ready

                getDesktopRect()

                os.trash.getIcon()
                // if (os.trash.icon && !(os.trash.icon.value in state.icons)) {
                //   const { icon } = os.trash
                //   const { clientWidth } = icon
                //   if (clientWidth) iconSize = clientWidth
                //   const row = Math.floor(desktopRect.height / iconSize)
                //   const column = Math.floor(desktopRect.width / iconSize)
                //   state.icons[icon.value] = { row, column }
                // }

                const icons = el.querySelectorAll("ui-icon")
                const untracked = []
                const removed = new Set(Object.keys(state.icons))

                let maxRow = 0
                let maxCol = 0

                for (const icon of icons) {
                  if (icon.value in state.icons) {
                    removed.delete(icon.value)
                    const { row, column } = state.icons[icon.value]
                    setRowCol(icon, row, column)
                    maxCol = Math.max(maxCol, column)
                    maxRow = Math.max(maxRow, row)
                  } else {
                    untracked.push(icon)
                  }
                }

                for (const { target, x, y, width } of await getRects(
                  untracked,
                )) {
                  const coord = getIconCoord(x, y, width)
                  setRowCol(target, coord.row, coord.column)
                  state.icons[target.value] = coord
                }

                for (const item of removed) delete state.icons[item]

                applyResponsiveLayout()
              },
              "ui:folder.contextmenu-creation": async ({ detail }) => {
                const coord = getIconCoord(
                  detail.x - iconSizeHalf,
                  detail.y - iconSizeHalf,
                )
                state.icons[detail.filename] = coord
              },
            },
          ],

          transferable: {
            accept: { kind: ["42_TR_ICON", "42_TR_APP_TAB"] },
            import(details) {
              if (details.kind.includes("42_TR_APP_TAB")) {
                console.log("TODO: make app tab import")
                return "revert"
              }

              if (details.isOriginDropzone) {
                const { items, coord } = details

                if (mobileMedia.matches) {
                  const ordered = getMobileOrderedIcons([
                    ...desktopFolderEl.querySelectorAll("ui-icon"),
                  ])
                  const dragged = new Set(
                    items.map(({ target }) => target.value),
                  )
                  const first = items[0]
                  const centerX = coord.x + first.width / 2
                  const centerY = coord.y + first.height / 2
                  const target = ordered.find((icon) => {
                    if (dragged.has(icon.value)) return false
                    const rect = icon.getBoundingClientRect()
                    return (
                      centerX >= rect.left &&
                      centerX <= rect.right &&
                      centerY >= rect.top &&
                      centerY <= rect.bottom
                    )
                  })

                  if (target) {
                    const moved = ordered.filter((icon) =>
                      dragged.has(icon.value),
                    )
                    const remaining = ordered.filter(
                      (icon) => !dragged.has(icon.value),
                    )
                    remaining.splice(remaining.indexOf(target), 0, ...moved)
                    saveMobileOrder(remaining)

                    for (const item of items) {
                      const { x, y } = item.target.getBoundingClientRect()
                      item.x = x
                      item.y = y
                    }
                  }

                  return "revert"
                }

                const { x, y } = coord
                const diffX = x - items[0].x
                const diffY = y - items[0].y
                for (const item of items) {
                  const coord = getIconCoord(item.x + diffX, item.y + diffY)
                  setRowCol(item.target, coord.row, coord.column)
                  state.icons[item.target.value] = coord
                  const { x, y } = item.target.getBoundingClientRect()
                  item.x = x
                  item.y = y
                }

                return "revert"
              }
            },

            added(paths, { x, y, items, isDropImports }) {
              getDesktopRect()
              if (isDropImports) {
                for (let i = 0, l = paths.length; i < l; i++) {
                  state.icons[paths[i]] = getIconCoord(
                    x - iconSizeHalf, // center
                    y - iconSizeHalf + i * iconSize,
                  )
                }
              } else {
                for (let i = 0, l = paths.length; i < l; i++) {
                  state.icons[paths[i]] = getIconCoord(
                    x - items[i].offsetX,
                    y - items[i].offsetY,
                  )
                }
              }
            },

            dropzone: "invisible",

            items: {
              type: "side",
              revertAnimation: { ms: 60 },
              // revertAnimation: false,
              start() {
                getDesktopRect()
                if (!mobileMedia.matches) return

                desktopFolderEl.classList.add("desktop-folder--sorting")
                const stopSorting = () => {
                  removeEventListener("pointerup", stopSorting)
                  removeEventListener("pointercancel", stopSorting)
                  queueMicrotask(() => {
                    desktopFolderEl.classList.remove("desktop-folder--sorting")
                  })
                }
                addEventListener("pointerup", stopSorting)
                addEventListener("pointercancel", stopSorting)
              },
            },
          },
        },
        {
          tag: "ui-workspaces",
          created(el) {
            os.workspaces = /** @type {any} */ (el)
          },
        },
        {
          tag: "ui-toaster",
        },
      ],
    },

    {
      // if: !DEV,
      tag: "footer#taskbar.panel.cols.liquid.outset.gap-xxs.pa-xxs.selection-false",
      content: [
        {
          tag: "button#start.txt-b.pa-x-xs.gap-xs",
          content: "Start",
          picto: "/c/users/windows93/pictures/logo/windows93-16.png",
          // created(el) {
          //   startButton = el
          // },
          menu: () => [
            {
              label: "Programs",
              picto: "apps/programs",
              content: () =>
                os.plans.makeAppsMenuItems(undefined, {
                  catalogue: true,
                  // groupBy: "category",
                  // groupBy: "/c/programs/",
                  groupBy: /\/c\/(programs|wip)\//,
                }),
            },
            {
              label: "Documents",
              picto: "apps/documents",
              content: () => os.plans.makeMenuItemsFromDir("/"),
            },
            {
              label: "Settings",
              picto: "apps/settings",
              content: [
                {
                  label: "Appearance",
                  picto: "/c/programs/system/Appearance/icon-16.png",
                  action: () => os.exec("appearance"),
                },
                {
                  label: "Fullscreen",
                  picto: "apps/shutdown",
                  action: () => toggleFullscreen(),
                },
                {
                  label: "Reinstall",
                  picto: "apps/install",
                  action: async () => {
                    const res = await os.confirm(
                      "Are you sure to reinstall Windows94, you will loose all your saved data (trust me...)",
                      { icon: "question" },
                    )
                    if (res) {
                      const { resetAllData } = await import(
                        "./42/lib/browser/resetAllData.js"
                      )
                      await resetAllData()
                      location.reload()
                    }
                  },
                },
              ],
            },
            "---",
            {
              label: "Find",
              picto: "apps/search-file",
              action: () => os.showCommandPalette(),
              shortcut: "Ctrl+p",
            },
            {
              label: "Run",
              picto: "apps/run",
              action: async () => {
                const res = await os.prompt("There is nowhere you can run", {
                  label: "Run",
                  icon: "run",
                })
                if (res) os.exec(res)
              },
            },
            {
              label: "Reboot",
              picto: "apps/standby",
              action: () => {
                window.dispatchEvent(new CustomEvent("ui:desktop.reboot"))
                // location.href = location.pathname
              },
            },
            {
              label: "Session",
              picto: "apps/session",
              action: () => {
                window.dispatchEvent(new CustomEvent("ui:desktop.logout"))
                os.users.logout()
              },
            },
          ],
        },
        {
          tag: "#quickLaunch",
        },
        {
          tag: "ui-dock.grow",
        },
        {
          tag: "#notificationArea.cols.items-center.pa-xxs.pa-x-xs.inset-shallow",
          content: [
            // {
            //   tag: "button.clear",
            //   picto: "/c/users/windows93/interface/icons/16x16/shutdown.png",
            //   on: { click: () => toggleFullscreen() },
            // },

            {
              tag: "#tray",
              style: { display: "contents" },
            },

            {
              tag: "#clock.grow.pixel-font",
              content: "-",
              created(el, { signal }) {
                let lastFormated
                const clockFormat = Intl.DateTimeFormat("en", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: false,
                })
                function advanceClock() {
                  const formated = clockFormat.format(new Date())
                  if (formated !== lastFormated) {
                    el.textContent = formated
                    lastFormated = formated
                  }
                }

                const timer = new Timer(advanceClock, 1000, { signal })
                timer.start()

                advanceClock()
                // @ts-ignore
                el.style.minWidth = `${lastFormated.length}ch`
                el.style.marginLeft = `1ch`
              },
            },
          ],
        },
      ],
    },
  ],
})

// document.addEventListener("keydown", (e) => {
//   if (e.key === "Meta") {
//     startButton.dispatchEvent(new PointerEvent("pointerdown"))
//   }
// })

// MARK: Cleanup
// -------------

document.body.append(os.desktop.el)

await Promise.all([
  os.apps.ready, //
  os.themes.ready,
  os.apps.addedDesktops,
])
os.apps.addedDesktops.length = 0

if (desktopFolderEl) {
  desktopFolderEl.value = desktopParam //
    ? joinPath(desktopParam, "desktop/")
    : "~/desktop/"
  await desktopFolderEl.renderReady
}

os.desktop.loaded?.()
os.desktop.done = true
os.apps.initTrays()

// @ts-ignore
if (os.needsRootUserClaim) {
  os.users.claimRootUserDialog()
}

// MARK: Dialog animations
// -----------------------

// const skipAnimation = DEV
const skipAnimation = false
if (!skipAnimation) {
  // Hide all dialogs before animation starts
  css`
    ui-dialog {
      opacity: 0.001;
    }
  `

  // Ensure that dialogs already opened are visible
  for (const item of /** @type {NodeListOf<HTMLElement>} */ (
    document.querySelectorAll("ui-dialog")
  )) {
    item.style.opacity = "1"
  }

  window.addEventListener("ui:dialog.open", async ({ target: dialogEl }) => {
    os.activity.addTarget(dialogEl.querySelector("iframe"))

    if (
      dialogEl.maximized ||
      dialogEl.classList.contains("animation-false") ||
      (dialogEl.role === "alertdialog" && !("animationIn" in dialogEl.dataset))
    ) {
      dialogEl.style.opacity = "1"
      return
    }

    if (dialogEl.app) await dialogEl.app.ready
    dialogEl.style.opacity = "1"

    if ("animationIn" in dialogEl.dataset) {
      animateIn(dialogEl, dialogEl.dataset.animationIn)
    } else if (dialogEl.classList.contains("ui-dialog-filepicker")) {
      animateIn(dialogEl, "fadeInDown", "faster")
    } else animateIn(dialogEl, "random")
  })

  window.addEventListener("ui:dialog.close", async (e) => {
    const dialogEl = e.target
    os.activity.removeTarget(dialogEl.querySelector("iframe"))

    if (
      dialogEl.classList.contains("animation-false") ||
      (dialogEl.role === "alertdialog" && !("animationOut" in dialogEl.dataset))
    ) {
      return
    }

    dialogEl.dataset.willDisconnect = true
    e.preventDefault() // prevent dialog element remove

    dialogEl.classList.add("action-false")
    dialogEl.style.zIndex = 99_999 // --z-popup - 1

    await Promise.race([
      os.sleep(5000),
      (async () => {
        try {
          for (const track of os.mixer.tracks.values()) {
            if (track.dialogEl === dialogEl) track.destroy()
          }
        } catch {}

        if ("animationOut" in dialogEl.dataset) {
          await animateOut(dialogEl, dialogEl.dataset.animationOut)
        } else if (dialogEl.maximized) {
          await animateOut(dialogEl, "zoomOutDown", "faster")
        } else if (dialogEl.classList.contains("ui-dialog-filepicker")) {
          await animateOut(dialogEl, "fadeOutUpBig", "faster")
        } else await animateOut(dialogEl, "random")
      })(),
    ])

    dialogEl.remove()
  })
}

// MARK: FX
// --------

os.config.dock ??= {}
os.config.dock.contextMenu ??= {
  items: {
    effects: (dialogEl) => ({
      label: "Effects",
      content: [
        {
          label: "Filters",
          content: async () => {
            const { fx, effectList } = await import(
              "./c/programs/misc/FX/fx.js"
            )
            return effectList.map((name) => ({
              label: toTitleCase(name),
              action: () => fx(name, dialogEl, { reset: false }),
            }))
          },
        },
        {
          label: "Glitch",
          action: async () => {
            os.exec(`glitch #${dialogEl.id}`)
          },
        },
        {
          label: "IE6",
          action: () => {
            os.exec(`ie6 #${dialogEl.id}`)
          },
        },
      ],
    }),

    moveTo: (dialogEl) => ({
      label: "Move to",
      content: [
        {
          label: "Center of screen",
          picto: "aim",
          action: () => {
            dialogEl.unminimize?.()
            dialogEl.moveToCenter?.({ fixOverlap: true })
          },
        },
        "---",
        {
          label: "Front layer",
          picto: "arrow-stop-up",
          action: () => {
            dialogEl.unminimize?.()
            dialogEl.moveToTop?.()
          },
        },
        {
          label: "Up layer",
          picto: "arrow-up",
          action: () => {
            dialogEl.unminimize?.()
            dialogEl.moveUp?.()
          },
        },
        {
          label: "Down layer",
          picto: "arrow-down",
          action: () => {
            dialogEl.unminimize?.()
            dialogEl.moveDown?.()
          },
        },
        {
          label: "Back layer",
          picto: "arrow-stop-down",
          action: () => {
            dialogEl.unminimize?.()
            dialogEl.moveToBottom?.()
          },
        },
      ],
    }),

    resetSize: (dialogEl) => ({
      label: "Reset size",
      picto: "selection",
      action: () => {
        if (dialogEl.app) dialogEl.app.resize()
        else dialogEl.resize()
      },
    }),

    organizeWindows: {
      label: "Organize Windows",
      picto: "stack",
      action: () => os.workspaces?.current?.autoOrganize(),
    },

    stickOnBack: (dialogEl) => ({
      tag: "checkbox",
      label: "Stick on back",
      checked: dialogEl.isLocked,
      action: (e, el) => {
        console.warn(e, el.checked)
        if (el.checked) {
          dialogEl.moveToBottom?.()
          dialogEl.lockZIndex()
        } else {
          dialogEl.unlockZIndex()
          dialogEl.moveToTop?.()
        }
      },
    }),

    openProgramFolder: (dialogEl) => ({
      label: "Open Program Folder…",
      picto: "smiley",
      disabled: !dialogEl.app,
      action: () => {
        const { app } = dialogEl
        if (!app) return
        console.log(app.manifest.dirPath)
        os.explorer(app.manifest.dirPath)
      },
    }),
  },
  dock: ["effects", "moveTo"],
  dialog: [
    {
      label: "Window",
      content: ["moveTo", "resetSize", "stickOnBack"],
    },
    "effects",
    "---",
    "file",
    "---",
    "organizeWindows",
    "openProgramFolder",
  ],
}

let prefersReducedMotion = //
  matchMedia("(prefers-reduced-motion: reduce)").matches

async function hoShit(skipToasts) {
  const [img, singularity] = await Promise.all([
    import("./42/lib/graphic/screenshot.js") //
      .then(({ screenshot }) => screenshot()),
    import("./c/programs/misc/FX/singularity.js") //
      .then(({ singularity }) => singularity),
    skipToasts
      ? undefined
      : (async () => {
          for (let i = 0; i < (prefersReducedMotion ? 10 : 30); i++) {
            await os.sleep(100)
            os.toast("HO SHI-", {
              icon: "error",
              timeout: prefersReducedMotion ? undefined : 100,
            })
          }
        })(),
  ])

  if (prefersReducedMotion) {
    const ok = await os.confirm(
      "%md **Flashing** and **flickering** animations incoming. Are you sure you want to continue?",
      { icon: "warning", label: "Epilepsy and Seizures warning !" },
    )
    prefersReducedMotion = !ok
    if (prefersReducedMotion) return
  }

  const canvas = singularity(img)
  canvas.style.cssText = /* style */ `
    position: absolute;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: var(--z-popup);`
  document.body.append(canvas)
}

document.addEventListener("ui:folder.import", (e) => {
  if (e.target.value === "/trash/") {
    for (const item of e.detail.items) {
      if (item.target.folderPath === "/trash/") {
        e.mode = "nothing"
        e.detail.items.removeGhosts()
        e.target.append(item.target)
        e.preventDefault()
        hoShit()
        break
      }
    }
  }
})

// MARK: Upgrade
// -------------

if (os.env.VERSION === "3.0.0") {
  os.fileIndex.set("/changelog.txt", 0)
  await os.mimetypes.ready.then(() => {
    for (const obj of Object.values(os.mimetypes.value)) {
      for (const [key, val] of Object.entries(obj)) {
        if (!val.apps || val.apps.length === 0) continue
        if (key === "x-bytebeat") {
          const idx = val.apps.indexOf("bytebeat")
          if (idx !== undefined && idx > 0) {
            val.apps.splice(idx, 1)
            val.apps.unshift("bytebeat")
            console.log(key, val.apps)
          }
        }
        const t = val.apps.indexOf("text")
        const c = val.apps.indexOf("code")
        if (t !== -1) {
          if (c > t) {
            val.apps.splice(c, 1)
            val.apps.splice(t, 0, "code")
          } else if (c < 0) val.apps.splice(t, 0, "code")
        }
      }
    }

    return os.mimetypes.save()
  })

  os.env.VERSION = localStorage.getItem("sys42_version") ?? "3.1.0"
}

// MARK: Disk Usage
// ----------------

// import { bytesize } from "./42/lib/type/binary/bytesize.js"
// navigator.storage.estimate().then((estimate) => {
//   const options = { unit: "MB" }
//   console.log(
//     `storage usage ${bytesize(
//       estimate.usage, //
//       options,
//     )}/${bytesize(
//       estimate.quota,
//       options,
//     )} (${((estimate.usage / estimate.quota) * 100).toFixed(3)}%)`,
//   )
// })

// MARK: Memory Usage
// ------------------

// function runMemoryMeasurements() {
//   const interval = 5000
//   console.log(`Next measurement in ${Math.round(interval / 1000)} seconds.`)
//   setTimeout(measureMemory, interval)
// }

// async function measureMemory() {
//   const memorySample = await performance.measureUserAgentSpecificMemory()
//   console.log(111, memorySample)
//   runMemoryMeasurements()
// }

// if (window.crossOriginIsolated) {
//   runMemoryMeasurements()
// }

// MARK: Ad Block Detection
// ------------------------

// async function detectBlocker() {
//   const script = document.createElement("script")
//   script.src = "./adblockdetect.js"
//   document.head.append(script)
//   return new Promise((resolve) => {
//     script.onerror = () => resolve(true)
//     script.onload = () => resolve(false)
//   })
// }

// detectBlocker().then(async (res) => {
//   if (res) return
//   await os.sleep(4000)
//   os.toast(
//     "%md No **Ad Blocker** detected!  \nYou will not find any ads here, but you should always use one",
//     { icon: "/c/programs/system/DoctorMarburgAntivirus/icon-32.gif" },
//   )
// })

// MARK: auto refresh
// ------------------
const autoRefreshDelay = Number.parseInt(params.get("autorefresh"), 10)
const autoRefreshEnabled =
  !Number.isNaN(autoRefreshDelay) && autoRefreshDelay > 0

if (autoRefreshEnabled) {
  let autoRefreshArmed = false
  let autoRefreshTimeout = null

  os.activity.on("change", (type) => {
    console.log(type)

    if (type === "active") {
      autoRefreshArmed = true

      clearTimeout(autoRefreshTimeout)
      autoRefreshTimeout = null
      return
    }

    if (!autoRefreshArmed) return

    clearTimeout(autoRefreshTimeout)

    autoRefreshTimeout = setTimeout(() => {
      window.location.reload()
    }, autoRefreshDelay * 1000)
  })
}

// MARK: exec
// ----------

const exec = params.get("exec")
if (exec && !exec.trim().startsWith("js")) {
  const bootEl = /** @type {HTMLElement} */ (document.querySelector("#boot"))
  if (bootEl) {
    const { untilDisconnected } = await import(
      "./42/lib/type/element/untilDisconnected.js"
    )
    await untilDisconnected(bootEl)
  }
  os.exec(exec)
}

// MARK: gbdxu promo
// -----------------

// if (!window.location.search.includes("?exec")) {
//  const bootEl = /** @type {HTMLElement} */ (document.querySelector("#boot"))
//  if (bootEl) {
//    const { untilDisconnected } = await import(
//      "./42/lib/type/element/untilDisconnected.js"
//    )
//    await untilDisconnected(bootEl)
//  }
//  window.top.sys42.toast(
//    "%md ![Windows93 DX](https://shop.windows93.net/Windows93_Adventure_GB_DX_U/picture.png)<br><br>" +
//      "If you enjoy Windows93.net and would like to support teh project, our Game Boy Color software artifact is now re-emerging as a highly limited, ultra exclusive premium handcrafted overkill collector micro-box edition directly from the deep internet vaults of our shop:<br><br>" +
//      "**[Windows93 DX Unlimited Mini-Box Edition (probably illegal in 7 countries)](https://shop.windows93.net/Windows93_Adventure_GB_DX_U/)**<br><br>" +
//      "Thank you very much for your support 🙏<br>" +
//      "Please enjoy your visit!",
//    {
//      label: "%md **BREAKING: Windows93.net now available on Game Boy**",
//      picto: "/c/users/windows93/interface/icons/32x32/misc/trivial.png",
//      timeout: 20_000,
//    },
//  )
// }

// // os.exec("obxd")
// os.exec("xpandr")
// os.exec(
//   "/c/users/windows93/music/midi/bangers/07 Christmas Memory- Trail to Sugarglaze Summit.mid",
// )
