
![logo](https://user-images.githubusercontent.com/20563761/111907089-176f7b00-8a54-11eb-832a-7d3a595bcb03.png)
# mimpf - Mission Impfpossible

Mission Impfpossible ist eine Echtzeit-Webanwendung, welche den Empfangs- und Warteprozess von Impfzentren unterstützen soll. Impflinge mit Impftermin kommen am Impfzentrum an und werden von einem Mitarbeiter ("Parkplatzwart") mit einem Piepser (Pager) - ähnlich wie in Restaurants - ausgestattet. Die Piepser haben jeweils eindeutige Nummern und können von einer zentralen Dockingstation aus aufgerufen werden. Ziel von mimpf ist es, die Piepser termingerecht zu ordnen und den Verwaltungsmitarbeitern im Impfzentrum die richtige Reihenfolge anzuzeigen, sodass nach und nach die Impflinge aufgerufen und durch den Impfprozess geführt werden können.

## Anforderungen
- Übersicht ausstehender Impftermine
- Importieren der Impftermine über csv Datei
  - Uhrzeit
  - Name
  - Kategorisierung der Impflinge in Erstimpfung, Zweitimpfung und Frage/Problem
  - Impfstoff
- dynamische Warteschlange in Echtzeit
  - Uhrzeit des Termins gewichtiger als Ankunftszeit
  - "Vorziehen" von Personen (z.B. Rollstuhlfahrer, Krankentransporte)
- Registrierung eines Impflings in der Warteschlange
  - Zuordnung eines optionalen Piepsers

Mimpf sollte möglichst lightweight sein und z.B. auf einem RaspberryPI laufen können. Netzwerkkommunikation erfolgt ausschließlich lokal über ein getrenntes (W-)Lan.

## Vorstellung / Anregung
![ClickDummy](https://user-images.githubusercontent.com/20563761/111907138-54d40880-8a54-11eb-99a9-933300650a51.png)


## Lizenz
![GNU General Public License v3.0](LICENSE.md)
