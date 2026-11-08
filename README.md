# Meryem HR Game — code

Een zelfstandige quizwebsite met hoofdstukken 1 tot en met 6 en een apart terminologielevel. Gebouwd met HTML, CSS en JavaScript: Visual Studio Code is niet nodig om het spel te spelen.

## Starten

1. Pak het ZIP-bestand volledig uit.
2. Open de map `Meryem_HR_Game_CODE`.
3. Dubbelklik op `index.html` en open het bestand in Chrome, Edge of Firefox. Op een webserver kan je de volledige map uploaden (bijv. GitHub Pages).

## Wat is aangepast

- Iedere vraag is meerkeuze, met vier opties, waarvan er precies één juist is. Geen schrijfdefinities.
- Vraagvolgorde én antwoordvolgorde worden willekeurig gemengd. De vier opties worden bij elke nieuwe vraag opnieuw opgebouwd, zodat oude antwoorden niet blijven staan.
- De knop `Volgende vraag` staat direct onder de antwoordopties en blijft kort zichtbaar bij scrollen.
- Feedback geeft een correcte, korte uitleg van de cursusinhoud.
- Per hoofdstuk: 10 punten per juist antwoord, een percentage, een overzicht van de zwakke onderwerpen en een herhalingsronde met foute vragen. De voortgang wordt lokaal opgeslagen in de browser.
- Een eigen rood-oranje-geel Fire-thema en zes andere zachte gradients.
- Geen overbodige slogan, soundboardknoppen of hintscherm.
- Achtergrondmuziek: 75 seconden rustige muziek, daarna 42 seconden Rat Dance, daarna weer rustig. De geluidseffecten spelen op een apart audiokanaal. Met de knop `Muziek` zet je alleen de achtergrondmuziek uit. Browsers beginnen pas na de eerste klik met audio.
- Grote, kort zichtbare meme-reacties op goede en foute antwoorden.

## Bronnen en nauwkeurigheid

- H1: gebaseerd op de eerder besproken begrippen en oefeningen; de volledige cursuspresentatie van hoofdstuk 1 was niet beschikbaar.
- H2: het model van Ulrich, klassiek en vernieuwd.
- H3: strategisch management, SWOT, missie, visie en HR-fit.
- H4: Michigan, Harvard, Employee Lifecycle en talentmanagement.
- H5: de oefencases Fresh@Work en BrightWay; de volledige theoriepresentatie van hoofdstuk 5 was niet beschikbaar.
- H6: arbeidsmarkt en actoren, inclusief VDAB-gastles.
- Terminologie: de geüploade HR-terminologielijst.

## Zelf aanpassen

- `questions.js`: inhoud van de vragen. Elk object heeft `chapter` (1 t/m 7), `tag`, `question`, `options` (precies vier), `answer` (index 0, 1, 2 of 3) en `explanation`.
- `style.css`: kleuren en lay-out.
- `script.js`: quiz-, score-, herhalings-, muziek- en memelogica.
- `assets/`: afbeeldingen en audio.

De game is een hulpmiddel om de cursus in te studeren, geen officiële toets.
