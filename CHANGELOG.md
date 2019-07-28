# Changelog
Todos los cambios destacables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto usa [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.0.0 [yyyy/mm/dd]
## Added
- API completamente nueva.

## Removed
- API de herencia dada de baja.

## LEGACY CHANGELOG:

## 1.6.1 [06/26/2019]
### Fixes
- Fixed mobile players not disconnecting.
- Made game mobile friendly.

### Known Bugs
- The player's hand shifts up slightly on hover.

## 1.6.0 [06/25/2019]
### Additions
- Added API documentation.
### Fixes
- Now using `pagehide` for disconnect testing. Better than `beforeunload`.
- Fixed toggle all decks not instantly displaying on other clients.
- Fixed Toggle All button being available to press on clients other than the host.

### Known Bugs
- The player's hand shifts up slightly on hover.
- Mobile players are still kept in game even after leaving due to the way `pagehide` works.
- The game is not mobile friendly.

## 1.5.0 [06/25/2019]
### Additions
- REST API. Documentation coming soon!

### Fixes
- Fixed kill game not working properly.

### Known Bugs
- The player's hand shifts up slightly on hover.
- Mobile players are still kept in game even after leaving due to the way `beforeunload` works.

## 1.4.0 [06/24/2019]
### Additions
- New server and client rewrite. Stabler server.

### Known Bugs
- The player's hand shifts up slightly on hover.
- Kill game does not work.

## 1.3.0 [04/16/2019]
### Additions
- Timer showing how much time is left for the turn.
- Logging System
  - You can export the logs via a text file you can download at the end of the game.

### Known Bugs
- There is an inconsistency with players leaving making the game playable after a game ended.

## 1.2.0 [04/14/2019]
### Additions
- Sound
  - Playing a card.
  - When the Czar picks a card.
  - When someone wins.
  - When a dialog pops up.
  - Animations when playing a card and recieving a card.
- Custom sets!
  - You can now import a JSON file (documentation coming soon) to load custom cards that you want to play with.
- Extended the Programmer Pack.
- Displays name in the top right corner.
- Black cards show how many white cards must be picked.
- Usernames show in the white cards after the Czar has picked, revealing everyone's cards.

### Changes
- New cards are drawn after the Czar picks.
- Changed the ">" indicator to "(Czar)".
- Scoreboard table is no longer full width.
- Some cards are hoverable (played cards), while others (instructions and black cards) are not.
- The contained buttons have been replaced with outlined buttons, and the outlined buttons have been replaced with contained buttons.

### Fixes
- Fixed players can't join a game in progress.
- Dialog doesn't remove it's contents on close.
- Fixed the deck will run out and could have unintended consequences.
- Fixed AFK players will softlock the game.

### Known Bugs
- There is an inconsistency with players leaving making the game playable after a game ended.

## 1.1.0 [04/10/2019]
### Additions
- Connected players list in pre-game lobby.
- Shows everyone's picked cards once the Czar is ready.
- '>' indicator showing who the Czar is on the leaderboard.
- Added an "Admin Panel" where the host can kill the game if it stops working.
- More sets.
  - All sets labeled official on [JSON Against Humanity](https://crhallberg.com/cah/).
  - Sets I made including Programming Pack and Red Rising Pack.

### Changes
- The font of the cards more closely resembles the font on the actual card. It sill looks funky and I might change it later.
- The color of text on the white card is an off-black (#383838). Pure black looked weird.

### Known Bugs
- AFK players will softlock the game.
- The deck will run out and could have unintended consequences.
- Players can't join a game in progress.
- There is an inconsistency with players leaving making the game playable after a game ended.

## 1.0.0 [04/01/2019]
### Additions
- Initial game.
