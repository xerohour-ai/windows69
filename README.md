# windows94

A bare Windows 94 shell: the Windows 93 BIOS boot screen, desktop, taskbar
and window manager, stripped of everything else. No bundled programs, no
games, no music, no ROMs, no user files — just the shell.

Built from the windows93-fork code base (`index.html`, `desktop.*`, `42/`,
`bios/`, `c/libs/animate-css/`), rebranded to Windows 94.

Kept the system programs the desktop itself needs (`Explorer`,
`Appearance`) and the interface assets the theme needs
(`interface/icons/`, the Windows 94 theme scheme, the start-button logo).

`files.cbor` is a regenerated index of this pruned tree (directories are
objects, file leaves are `0`); `42.tar.gz` is rebuilt from the shell files
(`42/`, `bios/`, plus the root shell files). The internal user folder is
still `c/users/windows93` — the BIOS, system config and timestamps all
reference that name, and renaming it was not verified safe.

Live at https://xerohour-ai.github.io/windows69/
