# **YoshiV3**
Discord Bot of Yoshi Family (Mario Kart 8 Deluxe) team  
  
Version : 3.0  
Creator : PillouMK (https://github.com/PillouMK)  

# FR : 

## Contexte :
Créé initialement en 2019, ceci est la troisième version du Bot Discord de la team Yoshi Family, ce bot est privé et ne peux être pleinement utilisé sur un autre serveur Discord que celui de la team.  
Le bot a été pensé et développé dans le but d'automatiser certaines tâches en lien avec Mario Kart sur le serveur de l'équipe. Il fonctionne via commande, dont le tag est "!".  
Le bot utilise l'API (https://github.com/PillouMK/yf-api) pour la gestion des données.  
Le bot a été créé avec la librairie Discord.js (https://github.com/discordjs/discord.js/)
  
La team Yoshi Family est une équipe Mario Kart 8 Deluxe composée de deux roster (Galaxy, Odyssey).  
Galaxy : https://www.mariokartcentral.com/mkc/registry/teams/21  
Odyssey : https://www.mariokartcentral.com/mkc/registry/teams/290

  
Aucune données sensibles n'est utilisée par le bot.

## Fonctionnalités :

### Bot-war :
La fonctionnalité Bot-War permet de calculer les scores d'un match Mario Kart (6 contre 6) selon les placements des joueurs de l'équipe à l'issue d'une course. Un match dure (en général) 12 courses, le bot permet de voir l'évolution du match tout du long.  
Dans le cas où l'équipe alignée réuni au minimum 5 joueurs d'un même roster, les données du match sont sauvegardée grâce à l'API.

la fonctionnalité est composée de 5 commandes :
- **startwar** : Pour commencer un match
- **stopwar** : Pour terminer un match
- **race** : Pour ajouter une nouvelles course au match
- **er** (edit race) : Pour modifier un résultat en cas d'erreur
- **pena** : Pour ajouter une pénalité de 20 pts à une équipe
  
**Exemple :**   
<img src="https://user-images.githubusercontent.com/74309535/210672354-2e04f1bb-3049-4604-b7b3-70b1bee46825.PNG" height="400">
***
### Timetrial :
Cette fonctionnalité gère les contre-la-montre de la team (classement par course, classement général, ajout de nouveaux temps).  
Dans le cas des classements par courses, il est possible de filtrer les classement par roster, par mode (avec ou sans items), il est également possible de switch entre une vue Mobile ou PC, tout ceci à l'aide de boutons.  

la fonctionnalité est composée de 2 commandes :
- **set_tt** : Pour ajouter ou modifier un nouveau temps sur une course
- **classement** : Pour afficher un classement d'une course choisie
  
**Exemple : (classement d'une course)**  
<img src="https://user-images.githubusercontent.com/74309535/210673126-d2a0dc7b-7dea-49a6-911d-9c854807fbee.png" height="350">
***
### Line-up :
Cette troisième fonctionnalité à pour but d'enregistrer et afficher les joueurs disponible pour certains horaires (dans le but d'organiser des matchs).  
Les joueurs peuvent donc s'ajouter ou se retirer, ils peuvent même préciser s'il ne sont pas certains de pouvoir jouer ou bien s'ils auront un micro pour jouer.  
Par défaut l'affichage des line-up est filtré par roster, mais il est possible via un bouton d'afficher en mixte.

la fonctionnalité est composée de 4 commandes :
- **can** : Pour s'ajouter à un horaire
- **maybe** : Pour s'ajouter à un horaire en précisant qu'on est pas certain de pouvoir jouer
- **drop** : Pour se désister d'un horaire
- **lu** : Pour afficher la line-up d'un horaire  
  
**Exemple : (Line-up de 21h)**  
<img src="https://user-images.githubusercontent.com/74309535/210673696-06ad6a76-6a0c-4838-9c5f-9712c8c93c97.png" height="300">
***
### Divers : 
Le bot possède également d'autres fonctionnalités mineures :
- **fc** : Permet d'afficher le code-ami Switch d'un joueur
- **set_fc** : Permet d'ajouter son code-ami à la BDD
- **help** : Affiche en message privé la liste des différentes commandes du bot
- **gif** : Affiche un gif au hasard
- **kpop** : Affiche un gif de Kpop au hasard

# EN:
## Context:
Originally created in 2019, this is the third version of the Yoshi Family Discord Bot, this bot is private and can only be fully used on the team's Discord server.  
The bot was designed and developed to automate certain tasks related to Mario Kart on the team's server. It works through commands, whose tag is "!".  
The bot uses the API (https://github.com/PillouMK/yf-api) for data management.  
The bot was created with the Discord.js library (https://github.com/discordjs/discord.js/).  
  
The Yoshi Family team is a Mario Kart 8 Deluxe team consisting of two rosters (Galaxy, Odyssey).  
Galaxy: https://www.mariokartcentral.com/mkc/registry/teams/21  
Odyssey: https://www.mariokartcentral.com/mkc/registry/teams/290  
  
No sensitive data is used by the bot.

## Features:
### Bot-war:
The Bot-War feature allows calculating the scores of a Mario Kart match (6 against 6) based on the placements of the team players at the end of a race. A match usually lasts 12 races, the bot allows you to see the evolution of the match throughout.  
If the lined up team has at least 5 players from the same roster, the match data is saved using the API.  

The feature consists of 5 commands:  

- **startwar** : To start a match
- **stopwar** : To end a match
- **race** : To add a new race to the match
- **er** (edit race) : To modify a result in case of error
- **pena** : To add a 20 point penalty to a team  
  
**Example:**    
<img src="https://user-images.githubusercontent.com/74309535/210672354-2e04f1bb-3049-4604-b7b3-70b1bee46825.PNG" height="400">
***
### Timetrial:
This feature manages the team's time trials (ranking by race, overall ranking, adding new times).  
In the case of rankings by races, it is possible to filter the rankings by roster, by mode (with or without items), it is also possible to switch between a Mobile or PC view, all this using buttons.  

The feature consists of 2 commands:  

- **set_tt** : To add or modify a new time on a race
- **ranking**: To display a ranking of a chosen race  
  
**Example: (ranking of a race)**  
<img src="https://user-images.githubusercontent.com/74309535/210673126-d2a0dc7b-7dea-49a6-911d-9c854807fbee.png" height="350">

***
### Line-up:
This third feature aims to register and display the players available for certain times (in order to organize matches).  
Players can therefore add themselves or withdraw, they can even specify that they are not sure if they can play or if they will have a microphone to play.  
By default, the line-up display is filtered by roster, but it is possible through a button to display mixed.  

The feature consists of 4 commands:  
- **can** : To add oneself to a schedule
- **maybe** : To add oneself to a schedule specifying that one is not sure if they can play
- **drop** : To withdraw from a schedule
- **lu** : To display the line-up of a schedule  
  
**Example: (Line-up of 9pm)**  
<img src="https://user-images.githubusercontent.com/74309535/210673696-06ad6a76-6a0c-4838-9c5f-9712c8c93c97.png" height="300">
***
### Miscellaneous:
The bot also has other minor features:  

- **fc** : Displays a player's Switch friend code
- **set_fc** : Adds one's friend code to the database
- **help** : Displays a list of the bot's different commands in a private message
- **gif** : Displays a random gif
- **kpop** : Displays a random Kpop gif
