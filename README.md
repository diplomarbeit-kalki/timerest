# TimeManager RESTful Web Service

Dieser RESTful Web Service dient als Backend für die TimeManager Anwendung. Er ermöglicht die Verwaltung von Zeiterfassungsdaten und bietet Schnittstellen für verschiedene Funktionen der Anwendung.

## Installation

1. Stellen Sie sicher, dass Node.js auf Ihrem System installiert ist.

2. Klone dieses Repository:

    ```bash
    git clone https://github.com/diplomarbeit-kalki/timerest
    cd timerest
    ```

3. Installieren Sie die Abhängigkeiten:

    ```bash
    npm install
    ```

4. Starten Sie den Web Service:

    ```bash
    npm run dev
    ```

Der Web Service läuft standardmäßig unter [http://localhost:3001](http://localhost:3001).

## API-Endpunkte
Alle Funktionen geben einen Array mit den Ergebnisobjekten zurück.

### Employees

- **GET /employees** Gibt alle Employees zurück.
- **GET /employees/byId/ID** Gibt alle Employees mit der gesuchten ID zurück.
- **GET /employees/byPsnr/PSNR** Gibt alle Employees mit der gesuchten PSNR zurück.
- **GET /employees/byUsername/USERNAME** Gibt alle Employees mit dem gesuchten USERNAME zurück.
- **GET /employees/byFirstname/FIRSTNAME** Gibt alle Employees mit dem gesuchten FIRSTNAME zurück.
- **GET /employees/byLastname/LASTNAME** Gibt alle Employees mit dem gesuchten LASTNAME zurück.
- **GET /employees/numberOfPages/QUERY/ITEMSPERPAGE** Gibt die Anzahl der Pages zurück mit dem suchbegriff QUERY und einer fixen Itemanzal von ITEMSPERPAGE.
- **GET /employees/nextFreePsnr** Gibt die nächste freie Personalnummer zurück (Personalnummern von gelöschten Personen ausgeschlossen).
- **GET /employees/filtered/QUERY/ITEMSPERPAGE/CURRENTPAGE** Gibt alle Employees zurück mit dem suchbegriff QUERY und einer fixen Itemanzal von ITEMSPERPAGE, wie auch der aktuellen Seite.

### Timestamps

- **GET /timestamps** Gibt alle Timestamps zurück.
- **GET /timestamps/byId/ID** Gibt alle Timestamps mit der gesuchten ID zurück.

### UnregisteredTags

- **GET /unregisteredtags** Gibt alle nicht registrierten Tags zurück.

