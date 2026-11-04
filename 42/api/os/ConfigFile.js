import { inDesktopRealm } from "../env/realm/inDesktopRealm.js"
import { defer } from "../../lib/type/promise/defer.js"
import { normalizeFilename } from "../fs/normalizeFilename.js"
import { configure } from "../configure.js"
import { persist } from "../persist.js"
import { dispatch } from "../../lib/event/dispatch.js"
import { system } from "../system.js"

export class ConfigFile {
  #instanceInit

  constructor(filename, defaults) {
    this.isUserConfig = !filename.startsWith("/")
    this.path = normalizeFilename(
      this.isUserConfig ? `$HOME/${filename}` : filename,
    )
    persist.ensureType(filename)
    this.defaults = defaults ?? {}
    this.version = persist.getVersion(this.path) ?? -1
    this.ready = defer()
  }

  upgrade
  async setup(_) {}
  async postload() {}

  /**
   * @returns {Promise<any>}
   */
  async populate() {}

  async init(...args) {
    try {
      if (inDesktopRealm) {
        await (persist.has(this.path) ? this.load() : this.reset())
      } else {
        await this.load()
      }

      await this.setup(...args)
      this.ready.resolve()
    } catch (err) {
      this.ready.reject(err)
      throw err
    }
  }

  async load() {
    try {
      this.value = await persist.get(this.path)
    } catch (err) {
      // A missing file on first boot is expected, not corruption: reset to
      // defaults quietly. Broadcasting it as a window error would trip the
      // BIOS fatal-error trap -- a fresh ?reset-data boot showed a BIOS ERROR
      // dialog for the absent /users.json5 via this path.
      // Genuine corruption (unparseable file) is still reported.
      if (err?.code !== 'ENOENT') dispatch(globalThis, err)
      await this.reset()
    }

    await this.postload()
  }

  async save(options) {
    if (this.isUserConfig && !system.env?.USER) return
    await persist
      .set(this.path, this.value, options)
      .catch((err) => dispatch(globalThis, err))
  }

  async update(value, options) {
    if (typeof value === "function") this.value = await value(this.value)
    else Object.assign(this.value, value)
    return this.save(options)
  }

  async reset() {
    this.value = configure(this.defaults, await this.populate())
    await this.postload()
    return this.save()
  }
}
