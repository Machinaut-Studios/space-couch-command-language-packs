# Space Couch Command Language Packs

Language Packs translate the text in Space Couch Command. This repository holds three of them, and explains how
to install a pack and how to make your own. The examples below use **Marglar**, a joke pack where random words
become "Marglar", because you can't miss it working.

| Pack | Folder | What it is |
| --- | --- | --- |
| **Marglar** | [`packs/marglar`](packs/marglar) | The joke pack: about one word in four becomes "Marglar". |
| **Deutsch** | [`packs/deutsch`](packs/deutsch) | German translation (AI-translated, see below). |
| **Italiano** | [`packs/italiano`](packs/italiano) | Italian translation (AI-translated, see below). |

The host picks one language for the whole room. The main screen and every phone in the room switch to it, and
players who join with their phones receive it automatically. Nobody but the host installs anything.

### About the German and Italian packs

We don't speak German or Italian. Both packs were translated with AI from the game's English text. The game's
pack checker confirms that every line loads, keeps its `{parameters}` and plural forms, and stays within its
length limit, but no native speaker has read them yet. Expect some lines that sound stiff, odd or simply wrong.

If you speak German or Italian, we'd love your help. Open an issue with the line you saw (and what it should
say), or send a pull request that fixes it. Small corrections are just as welcome as big ones.

## Install a pack

You need the desktop version of the game (from Steam). Phones that host a game can't load packs in this version.

### 1. Download the pack

On this page, click the green **Code** button, then **Download ZIP**, and unzip it. The packs are inside the
`packs` folder.

### 2. Find your mods folder

The easiest way: start the game, press **ESC** on the main screen (or click **☰**) to open **Settings**, choose
**MODS**, then **OPEN MODS FOLDER**. Your file manager opens in the right place.

Or open it yourself:

| System | Mods folder |
| --- | --- |
| Windows | `%APPDATA%\Space Couch Command\mods`<br>which is usually `C:\Users\<you>\AppData\Roaming\Space Couch Command\mods` |
| macOS | `~/Library/Application Support/Space Couch Command/mods`<br>which is `/Users/<you>/Library/Application Support/Space Couch Command/mods` |
| Linux | `~/.config/Space Couch Command/mods`<br>(or `$XDG_CONFIG_HOME/Space Couch Command/mods` if you set that variable) |
| Steam Deck | `/home/deck/.config/Space Couch Command/mods` |

Some of these folders are hidden:

- **Windows:** paste `%APPDATA%\Space Couch Command` into the File Explorer address bar.
- **macOS:** in Finder choose **Go → Go to Folder…** (Shift-Command-G) and paste the path.
- **Linux and Steam Deck:** press Ctrl+H in the file manager to show hidden folders such as `.config`.

If you play the **demo**, the folder is `Space Couch Command Demo` instead of `Space Couch Command`.
If there is no `mods` folder yet, start the game once, or create the folder yourself.

### 3. Copy the pack in

Copy the pack's folder, for example `marglar`, into `mods`. Its `pack.json` must sit directly inside it:

```
mods/
  marglar/
    pack.json
    marglar.json
```

A common mistake is copying the whole download, which leaves the pack too deep
(`mods/space-couch-command-language-packs-main/packs/marglar/pack.json`). The game won't find it there.

### 4. Choose it in the game

1. In the lobby, open **Settings** (ESC or ☰ on the main screen) and choose **MODS**. Press **REFRESH**.
   Marglar is listed with how much of the game it covers (all of it) and any problems (none).
2. Back in Settings, change the **LANGUAGE** row to **Marglar**.

The lobby now reads "2 OF 4 STATIONS MARGLAR · 1 READY", and the phones follow. The language can only be changed
in the lobby, by the host. To go back to English, choose English in the LANGUAGE row. To uninstall a pack,
delete its folder from `mods`.

Steam Workshop support is coming later. Once it's out, subscribing to a pack on the Workshop will install it for
you.

## Make your own pack

All you need is a text editor. There's nothing to build or compile. This section walks through making Marglar
by hand; a real translation works the same way.

### Quick start

1. In the game, open **Settings → MODS** and press **EXPORT ENGLISH TEMPLATE**. The game writes a folder called
   `_english-template` into your mods folder. It holds every piece of text in the game, in English, with notes.
2. Copy that folder and rename the copy, here `marglar`. Folders whose names start with `_` or `.` are ignored by
   the game, so the name of your copy must not start with either.
3. In `marglar`, rename `pack.template.json` to `pack.json` and fill it in (see below).
4. Edit the text in `en.json`: swap some words for "Marglar". Delete any entries you haven't changed; the game
   shows those in English.
5. In the game, press **REFRESH** on the MODS screen, then pick Marglar in the **LANGUAGE** row.

Every time you save a change, press REFRESH and the new text goes out to every screen in the room. You can see
your work on the TV and the phones while you write it.

### pack.json

Marglar's `pack.json`:

```json
{
  "id": "marglar",
  "language": "en",
  "name": "Marglar",
  "version": "1.0.0",
  "author": "Space Couch Command",
  "sourceHashes": { "log.hostilesCleared": "…", "…": "…" }
}
```

The language is `en` because Marglar keeps English grammar and English plural rules. A German pack would say
`de`, an Italian one `it`.

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Lower-case letters, digits, `.`, `_` and `-`, up to 64 characters, starting with a letter or digit. Must be different from every other pack. |
| `language` | yes | A language tag such as `de`, `it`, `pt-BR` or `zh-Hans`. It also decides the plural rules. |
| `name` | yes | The name shown in the game. Up to 64 characters. |
| `version` | yes | Your own version text. |
| `author` | no | Shown on the MODS screen. |
| `gameVersion` | no | The game version you translated against. |
| `font` | no | A font file in the pack folder; see Fonts. |
| `sourceHashes` | no | Fingerprints of the English you translated from; see Keeping up with game updates. |

If two packs use the same `id`, the first folder (sorted by name) wins and the other is listed as unusable.

### The text files

Every `.json` file directly in the pack folder is read, and they are merged, so your text can live in one file
(Marglar uses `marglar.json`) or many (the German and Italian packs use one file per part of the game). If the
same key appears twice, the first file by name wins and the MODS screen reports it.

Text is nested JSON. Each level of nesting adds a dot to the key, so this:

```json
{ "log": { "hostilesCleared": "Hostiles cleared — standing down marglar red alert" } }
```

sets the text for the key `log.hostilesCleared`, which in English reads "Hostiles cleared — standing down from
red alert". Writing `"log.hostilesCleared": "…"` at the top level does the same.

**Notes.** Any key that starts with `_` is ignored. The template uses them to explain each entry and give its
maximum length (`_hostilesCleared` describes `hostilesCleared`, `_comment` describes a group). Keep them, delete
them or add your own.

**Unchanged text.** Delete the entry, or make it an empty string `""`. It shows in English.

**Parameters.** Words in braces are filled in by the game. In

```json
"crewed": { "other": "{seated} OF {count} STATIONS MARGLAR · {ready} READY" }
```

`{seated}`, `{count}` and `{ready}` become numbers. Spell each one exactly as in the English, and put it wherever
your grammar needs it. An entry that adds a parameter the English doesn't have is dropped. An entry that leaves
one out still loads, with a warning.

**Plurals.** Text that depends on a number is an object with one entry per plural form. English, and so Marglar,
has two:

```json
"crewed": {
  "one": "{seated} OF {count} STATION MARGLAR · {ready} READY",
  "other": "{seated} OF {count} STATIONS MARGLAR · {ready} READY"
}
```

The forms are `zero`, `one`, `two`, `few`, `many` and `other`, following the
[CLDR plural rules](https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html) for your
language (Italian, for example, uses `one`, `many` and `other`). `other` is required. The MODS screen tells you
which forms your language still needs.

**Plain text only.** Anything that looks like HTML, such as `<b>` or `&amp;`, is dropped.

**Length.** Buttons and gauges have limited room. The template's notes give the maximum length of each entry;
"SHIP LOST" may be up to 14 characters, so "MARGLAR LOST" (12) fits. Longer text still loads, with a warning, but may
be cut short with "…" on screen. Radio lines (hails) should stay within 1.3 times the length of the English.

### Fonts

If your language needs letters the game's font doesn't have, put a `.woff2` or `.ttf` font file (up to 2 MiB)
in the pack folder and name it in `font` in `pack.json`. The game loads it for you. If the font can't be used,
your text still loads and the MODS screen says what went wrong. Check that the font's license allows you to
share it. Marglar doesn't need one.

### Keeping up with game updates

`pack.template.json` includes a `sourceHashes` list: a fingerprint of the English text behind every key. Keep it
in your `pack.json`. When a game update changes some English text, the MODS screen lists those entries as
**stale**, so you know which ones to look at again. Stale entries still load in the meantime.

### What the MODS screen tells you

The MODS screen lists every pack it found, with its language, version, how much of the game it covers, and a
count of problems. Select a pack to see the details.

- **Dropped** entries never show: unknown keys, text with markup, entries that add a parameter, and plurals
  without `other`.
- **Warnings** still show, but are worth a look: missing parameters, missing plural forms, text over its length
  limit, and long radio lines.
- **Stale** entries show; the English has changed since you translated them.
- **Cannot be used** means the whole pack is off: `pack.json` is missing or invalid, no entries are usable, the
  `id` is already taken, or the pack is too large (a pack's text files can total 4 MiB).

A file that isn't valid JSON is reported by name.

### Rules for the folder

- Only `.json` files directly inside the pack folder are read, not those in subfolders.
- Files whose names start with `.` are ignored (macOS sometimes creates `._` files on USB drives).
- Shortcuts and symbolic links are never followed, so copy the real files in.

### Tips

- Start with the menus and the main screen, then the ship's log, then the story text.
- Play a short game with your pack on. Crowded screens show text that's too long.
- Keep a copy of your pack somewhere outside the mods folder.
- Translate the meaning, not the words. The English sets what each line says, not how your sentence is built.
- An editor that checks JSON as you type saves a lot of time.

## How Marglar was made

Nobody typed the real Marglar pack by hand. [`tools/marglar.mjs`](tools/marglar.mjs) reads an exported template
and writes the pack. It swaps whole words, keeps `{parameters}` intact, matches capitals (MARGLAR, Marglar,
marglar), swaps the same word in every plural form, and never makes a line longer than its limit. Some of what
it produced:

| Key | English | Marglar |
| --- | --- | --- |
| `station.shell.game.shipLost.title` | SHIP LOST | MARGLAR LOST |
| `log.hostilesCleared` | Hostiles cleared — standing down from red alert | Hostiles cleared — standing down marglar red alert |
| `view.lobby.launch.crewed` | {seated} OF {count} STATIONS CREWED · {ready} READY | {seated} OF {count} STATIONS MARGLAR · {ready} READY |

To rebuild it from your own export:

```sh
node tools/marglar.mjs "<your mods folder>/_english-template" packs/marglar
```

It needs [Node.js](https://nodejs.org) 18 or newer. The choice of words is seeded by each key, so running it again
on the same template gives the same pack. It's also a starting point if you want to script your own pack.

## Sharing your pack

Until Workshop support arrives, share a pack as a zipped folder; whoever installs it follows the steps above.

To add a pack to this repository, open a pull request that adds your folder under `packs/`. Keep `sourceHashes`
in your `pack.json` so the pack can be kept up to date. Corrections to the German and Italian packs are welcome
the same way, and if you'd rather not touch JSON, an issue that quotes the wrong line is enough.

To find a line in the files, search the pack folder for the text you saw on screen. Each file covers one part of
the game: `hail.json` is radio conversations, `log.json` the ship's log, `station.json` the phone consoles,
`view.json` the main screen, and so on.

## License

Everything in this repository, the packs and the tool, is under the [MIT License](LICENSE). Packs you contribute
are shared under the same license.
