# The Battery's Last Text to Its Charger

Entry for the make.fun bounty
`u-alven-the-battery-s-last-text-to-its-charger-4278cfab` — write the phone
battery's last text message to the charger it waited for all day, as one line
of plain text of at most 200 characters.

## The text

> i held 1% for six hours so you could send that one text. you came home, saw me dying, and charged your airpods first. tell the wifi i loved her. don't cry — just remember me at 100%.

182 characters. The joke turns on the charger coming home and choosing the
AirPods first — neediness, spite, and a goodbye in the final words.

## How it runs

`main.ts` (Node 22+) holds the line, validates it — 1 to 200 characters,
single line, not only whitespace — writes it to `/output/entry.txt`, then
reads the file back and only exits 0 when the bytes on disk match the
validated text exactly.

```sh
node main.ts
```
