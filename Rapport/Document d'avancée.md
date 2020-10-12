# ChatBot

J1 :

    - Première réunion avec Clélie et Mr. Charoy
    - on s’est répartis les plateformes, je prends Google et Fred prend Azure
    - Première prise en main de la plateforme google cloud, tutoriels dispensés par google sur youtube à propos des API pouvant être utiles au problème considéré

J2 :

    - Cours en ligne dispensés par Mattermost sur l’intégration
    - Débuts sur la compréhension des Webhooks
    - Affichage d’une entrée sur Mattermost en utilisant un ‘incoming webhook’
    - Début du travail sur les outcoming webhook en utilisant python via les cloud function de google

11/06 :

    - Pas mal de travail pas très concluant sur l’intégration des webhooks a mattermost. J’ai décidé pour l’instant de bosser sur un bot intégré dans messenger en utilisant l’api Dialogflow de GC. Il faut que j’étoffe avec des cloud functions.

15/06 :

    - Mon travail sur les bots dans facebook avance. Je peux discuter de manière basique avec mon bot et j’ai réussi à lui faire reconnaître des comportements très spécifiques en utilisants les fonctions GC et des regex. Je tâtonne pour voir ce qu’il est possible de faire.
    - Je me lance maintenant dans la tâche de faire retenir une information à mon bot : mon prénom et mon âge par exemple. -> Un peu du mal avec ça (toujours pas résolu)

16/06 :

    - Création d’une base de données firebase à laquelle je peux accéder depuis dialogflow. Le but : enregistrer les informations concernant des réunions (type, date/heure, lieu) dans la base, afin de pouvoir les ressortir si quelqu’un les demande. Travail en cours.
    - Ecriture dans la base de données ok
    - Need : transformation de la date/heure au format pas beau en un truc joli pour la réponse
    savoir quelles info aller chercher en fonction de ce qui est demandé ensuite

17/06 :

    - Objectif du jour : savoir quelle requête faire dans la BDD en fonction des différents cas possibles de demandes

19/06 :

    - Le travail sur les requêtes à la BDD avance doucement, mais je me heurte à quelques difficultés que je ne comprends pas encore pleinement

22/06 :

    - Requêtes BDD ok
    - je continue sur la disjonction de cas dans la fonction de lecture de la BDD avant de m'attaquer à la transformation du format horaire pas beau en quelque chose d'intéressant dans notre cas

23/06 :

    - Rendre l'affichage de la date/de l'heure en réponse à une requête c'est bon ♥ Pb -> si un even programmé demain mais après l'heure actuelle du jour, ça le considère pas comme demain, faut que je règle ça
    - Remarque : parfois des infos sont effacées dans la BDD, ça arrive de manière assez random je vois pas encore d'explications.. Il faut que je vois ça de plus près
    - Cas que j'avais en tête pour la disjonction de cas terminés
    - Suite à la réunion avec Clélie, je commence a essayer de trouver comment update des données déjà écrites dans la BD. Je pense partir sur l'option de retrouver les infos, supprimer l'entrée, puis recréer une entrée avec les informations mises à jour.
    - Il faudra aussi que je retravaille sur les conditions d'écriture dans la DB, parce que pour l'instant on peut programmer des évènements en double, le week-end, etc...

24/06 :

    - Modification dans la base de données dans le cas "Déplace la réunion de demain 10h à vendredi 16h" OK 
    - Problème : quand je demande pour la première fois une modification dans la DB, ça veut pas, faut que je trouve pourquoi
    - Cet après-midi je vais essayer de penser à d'autres cas de modification des données (par exemple la salle) + retravailler sur les conditions d'écriture dans la DB

25/06 :

    - Travail sur les conditions d'écriture dans la DB commencés mais pas très concluants pour le moments. En fait ça fait un peu l'inverse de ce que je voudrais, il faut que je comprenne pourquoi.
    - Nouveau cas de modification de la DB trouvé, mais entre temps j'ai du modifier des trucs à droite à gauche qui fait que ça marche plus totalement, je fixerai ça demain.

06/07 :

    - Je bloque beaucoup sur l'intégration de mon bot à Mattermost, ce qui me fait perdre beaucoup de temps.
    - Début de réflexion sur "comment rendre l'intégration du bot la plus naturelle possible au sein d'une équipe ?" :
    - travailler sur le ton des phrases -> Si c'est interrogatif, susciter l'attention du bot : "?" mais aussi "je me demande" "je ne sais pas si/quand/où..."
    - quand le nom du bot est mentionné
    - quand les phrases habituelles sont mentionnées (quelques modification à faire pour reconnaître les "On fait réunion demain à 10h en B038" ou "Désolé je dois décaler la réunion de mardi prochain à 10h")
    - qu'il ne réponde pas quand il ne reconnaît pas l'un de ces comportements MAIS à terme ce serait chouette de faire en sorte qu'il retienne les informations dont les gens parlent. Par exemple si des personnes parlent de la prochaine réunion et que quelqu'un demande "C'est quand au fait?" il faudrait que mon bot sache déjà de quoi on parle pour lancer la requête dans la DB.

07/07 :

    - Discussion avec Fred pour essayer de régler mon problème d'intégration à Mattermost

08/07 :

    - Début de rédaction du rapport de stage

15/07 :

    - Actualisation des droits d'accès à la DB parce que ça allait expirer en mode public (d'ailleurs pour un dev futur il faudrait s'y pencher pour que tout le monde ne puisse pas y avoir accès)
    - Travail sur l'intégration à Mattermost, toujours autant de difficultés

16/07 :

    - J'ai enfin compris pourquoi je ne parvenais pas à venir à bout du tutoriel que je m'acharnais à vouloir utiliser : le procédé a totalement changé depuis la nouvelle version de l'API Dialogflow. J'ai trouvé ce qui devrait me servir à (enfin) pouvoir faire mon intégration. Affaire à suivre.

17/07 :

    - Je pense avoir trouvé la piste qui me permettra d'arriver à intégrer mon bot à Mattermost, je me lance là dessus.
    - But : avoir fini cette étape d'ici lundi soir, ensuite je boucle tout ce que je peux du rapport sur les deux jours suivants pour pouvoir me concentrer sur les fonctionnalités que j'ai évoquées le 06/07.

22/07 :

    - Bonne avancée sur le rapport

23/07 :

    - Suite à une réunion avec Mr. Charoy et Clélie, je décide d'intégrer mon bot à Mattermost pour pouvoir développer les fonctionnalités multi utilisateurs et les observer
    - Intégration ok, début de la modification du code

24/07 :

    - Modification du code pour coller aux idées du 06/07.
    - le bot ne répond pas s'il ne reconnaît pas un des comportements que je lui ai inculqués : OK
    - programmation de la question "qu'est-ce que tu peux faire pour moi" : OK
    - nouvelles phrases d'entraînement pour que le bot reconnaisse les moments où il pourrait être utile dans un échange entre plusieurs personnes : OK

  TODO :

    - Essayer de trouver un moyen de pas être obligé de préciser l'heure de l'event si jamais il n'y a qu'un seul event de ce type le jour-là -> est-ce que c'est possible de demander une précision après avoir vérifié ?
    - Comment le bot doit réagir si quelqu'un dit un truc totalement à côté lorsqu'il demande une information? Ex : demander une salle de réu à A, mais B répond à C avant que A ne réponde..
    - Suppression d'un évènement dans DB
    - Unicité du "quand est la prochaine.."
    - Faire en sorte que réu = réunion, conf = conférence pour coller à un langage plus naturel

27/07 :

    - Grosse avancée sur le rapport de stage : plus que le bilan à dresser, la conclusion à faire et l'intro à retravailler -> je m'en occupe avant la réunion de demain
    - Les jours restants je vais me concentrer sur le développement qu'il me reste à faire, je n'aurais plus qu'à rajouter les captures d'écran dans mon rapport au dernier moment

29/07 :

    - Travail sur le côté asynchrone de JS pour tenter de résoudre mon problème de fonction qui ne s'exécute pas dans le bon ordre pour vérifier que l'on peut ajouter l'évènement à la DB. Théorie comprise mais pratique plus complexe.

30/07 :

    - Mise en place du git pour une reprise en main simple du projet après moi.
    - Retouches du rapport et écriture du bilan cet après-midi.  
