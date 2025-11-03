Instrukcja przygotowania środowiska na warsztat: Advanced Unit Testing: From Basics to Test Routine Pattern

Aby przygotować się do udziału w warsztacie, proszę postępować zgodnie z poniższymi krokami. Warsztat obejmuje ćwiczenia praktyczne z pisania testów jednostkowych, więc środowisko musi umożliwiać uruchamianie testów w języku JavaScript/TypeScript (używając Jest). Jeśli uczestnik preferuje inne środowisko (np. Java z JUnit), jest to możliwe, jednak prosimy o przygotowanie go na własną odpowiedzialność.

1. Edytor kodu  
   Zalecany edytor: Visual Studio Code:  
   - Pobierz z code.visualstudio.com.  
   - Opcjonalnie zainstaluj rozszerzenia do JavaScript/TypeScript, takie jak "ESLint", "Prettier" i "Jest Runner" (dla ułatwienia uruchamiania testów).

2. Dostęp do repozytorium kodu  
   GitHub:  
   - Załóż konto na GitHubie, jeśli go nie masz.  
   - Sprawdź, czy masz zainstalowany Git:  
     `git --version`  
     Jeśli nie, pobierz Git z oficjalnej strony i zainstaluj.

3. Środowisko lokalne  
   Na potrzeby szkolenia będziemy używać środowiska Node.js (dla JavaScript/TypeScript z Jest). Instrukcja instalacji:  
   - Pobierz Node.js z nodejs.org (zalecana wersja LTS).  
   - Po instalacji sprawdź wersję:  
     `node --version`  
     `npm --version`  
   - Zainstaluj Jest globalnie (jeśli nie używasz projektu z package.json):  
     `npm install -g jest`  

4. Docker i Docker Compose
   Warsztat wykorzystuje Docker do uruchomienia zewnętrznych serwisów (baza danych PostgreSQL, serwisy HTTP):
   - Windows/macOS: Pobierz i zainstaluj Docker Desktop z docker.com/products/docker-desktop
   - Linux: Zainstaluj Docker Engine i Docker Compose zgodnie z instrukcją dla swojej dystrybucji (docs.docker.com/engine/install)
   - Po instalacji wykonaj:
     `sudo usermod -aG docker $USER`
     `sudo systemctl start docker && sudo systemctl enable docker`
     Następnie wyloguj się i zaloguj ponownie (lub uruchom `newgrp docker`)
   - Po instalacji sprawdź:
     `docker --version`
     `docker compose version`
   - Upewnij się, że Docker Compose jest w wersji V2 (polecenie `docker compose`, nie `docker-compose`)

Po przygotowaniu środowiska prosimy o sprawdzenie dostępu do GitHub oraz upewnienie się, że wszystkie narzędzia są poprawnie zainstalowane. Jeśli masz pytania, skontaktuj się z prowadzącym.
