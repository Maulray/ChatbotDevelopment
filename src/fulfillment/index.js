// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');

var ID = 0;
const week = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
const year = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

//Connexion to firebase database
//TODO : replace Firebase project ID
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL : 'ws://[Firebase-projet-ID].firebaseio.com/'
});


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  //sysdate exemple "2020-06-18T14:00:00+02:00"  -> to transform into something understandable for the user
  function sysDateToReadable(date,agent){
    var res = "";
    var currentDate = new Date(); //"Tue Jun 23 2020 09:36:56 GMT+0200 (heure d’été d’Europe centrale)"
    var usedDate = new Date(date); // transform "2020-06-18T14:00:00+02:00" into "Thu Jun 18 2020 14:00:00 GMT+0200 (heure d’été d’Europe centrale)"
    // if (usedDate<currentDate){
    //   agent.add("Cette date est déjà passée, je ne peux rien programmer.");
    //   return res;
    // }

    const diffTime = Math.abs(usedDate-currentDate);
    const diffDays = Math.ceil(diffTime/(1000*60*60*24));
    //agent.add("Current : " + currentDate.getDate() + "| Used : " + usedDate.getDate());

    const hour = usedDate.getHours()+2;
    const min = usedDate.getMinutes();

    var adj = "";
    if (diffDays==0){
      adj = "aujourd'hui";
      if (min<10){
        res = adj + " à " + hour +"h0"+min;
      }else{
        res = adj + " à " + hour +"h"+min;
      }
      return res;
    }else if (diffDays==1){
      adj = "demain";
      if (min<10){
        res = adj + " à " + hour +"h0"+min;
      }else{
        res = adj + " à " + hour +"h"+min;
      }
      return res;
    }else{
      var usedDay = usedDate.getDay();
      if (usedDay == 0 || usedDay == 6){
          agent.add("Aucun évènement ne peut être programmé un weeekend.");
          return res;
      }
      if (diffDays<7){
        if (min<10){
          res = week[usedDay] + " à " + hour +"h0"+min;
        }else{
          res = week[usedDay] + " à " + hour +"h"+min;
        }
        return res;
      }else{
        var usedMonth = usedDate.getMonth();
        if (min<10){
          res = week[usedDay] + " " + usedDate.getDate() + " " + year[usedMonth] + " à " + hour +"h0"+min;
        }else{
          res = week[usedDay] + " " + usedDate.getDate() + " " + year[usedMonth] + " à " + hour +"h"+min;
        }
        return res;
      }
    }
  }

  //saving an Event in the firebase database
  //Version qui fonctionne mais qui ne vérifie pas l'unicité de l'event avant de l'entrer dans la BDD
  function savingEvent(agent){
    ID++;
    const type = request.body.queryResult.parameters.event;
    const time = request.body.queryResult.parameters.time;
    const place = request.body.queryResult.parameters.lieux;
    return admin.database().ref('Event').child(ID).set({
      Type: type,
      Time: time,
      Place: place
    });
  }

  //ébauche de version pour vérifier l'unicité de l'event, la validité de la date, la disponibilité de la salle...
  //problème : JS est un langage asynchrone et en codant de manière séquentielle, le programme ajoutait l'évènement à la base de données
  //avant de vérifier qu'on a le droit de le faire. Pour palier à ce problème j'ai essayé de travailler sur les callbacks -> fonctionne
  //en partie -> mais l'exec de mon if est trop long et donc le callback ne résout pas totalement le problème (mais ça le résout si on met
  // une instruction toute simple à la place)

  // function savingEvent(agent){
  //   const type = request.body.queryResult.parameters.event;
  //   const time = request.body.queryResult.parameters.time;
  //   const place = request.body.queryResult.parameters.lieux;
  //   agent.add("tour "+ID);
  //   agent.add("Test1");
  //
  //   let y = function(callback){
  //     var ref = admin.database().ref('Event');
  //     if (ID!=0){
  //       ref.on("value", function(snapshot){
  //         agent.add("Test2");
  //         for (let i = 1; i < ID; i++){
  //           //agent.add("Requête "+i);
  //           agent.add("Test3");
  //           const value = snapshot.child(i).val();
  //           const date = new Date(time.date_time);
  //           if (date.getDay()== 0 || date.getDay()==6){
  //             agent.add("Aucun évènement ne peut être programmé un weeekend.");
  //             return;
  //           }else if (value.Type==type && value.Time.date_time==time.date_time && value.Place==place){
  //             agent.add(value.Type+ " " +type);
  //             agent.add(value.Time+ " " +time);
  //             agent.add(value.Place+ " " +place);
  //             agent.add("Cet évènement a déjà été ajouté au calendrier.");
  //             return;
  //           }else if (value.Time.date_time==time.date_time && value.Place==place){
  //             agent.add("Un évènement a déjà été programmé à cet endroit à ce moment-là.");
  //             return;
  //           }
  //         }
  //         agent.add("Test4");
  //       });
  //     }
  //     callback();
  //   };
  //   let x = function(){
  //     DBwriting(agent,type,time,place);
  //   };
  //   y(x);
  // }
  //
  // function DBwriting(agent,type,time,place){
  //   ID++;
  //   agent.add("Test5");
  //   var ref = admin.database().ref('Event');
  //   return ref.child(ID).set({
  //     Type: type,
  //     Time: time,
  //     Place: place
  //   });
  // }

  //request information about event(s) written in the firebase database
  function readEvent(agent){//TODO
    //A faire : voir en fonction du nombre d'arguments passés ce que l'on doit renvoyer
    const type = request.body.queryResult.parameters.event;
    const time = request.body.queryResult.parameters.jour;
    const place =  request.body.queryResult.parameters.lieux;
    const isRequested = request.body.queryResult.parameters.any;

    if (ID==0){
      agent.add("Il n'y a pas encore d'événement ajouté au calendrier. Pour en programmer un, essayez 'Prévois une réunion demain à 10h en B038' par exemple.");
      return;
    }//else{
    //   agent.add("Il y a "+ID+" requêtes à analyser");
    // }

    if (Object.entries(time).length==0 && place==""){ //OK
      //"Quand est la prochaine réunion?" figure case
       return admin.database().ref('Event').once('value').then((snapshot) => {
         var soonerDate = new Date(2500,11,31);
         var res = "";
         for (let i = 1; i<ID+1; i++){
            //agent.add("Requête "+i);
            const value = snapshot.child(i).val();
            const wanted_place = value.Place;
            const wanted_time = value.Time;
            const wanted_type = value.Type;
            const date_to_compare = new Date(wanted_time.date_time);
     				if (wanted_type==type && soonerDate-date_to_compare>0){
              const date = sysDateToReadable(wanted_time.date_time,agent);
              res = "La prochaine "+wanted_type+" est prévue "+date+" en "+wanted_place;
              soonerDate = date_to_compare;
            }
          }
          agent.add(res + ".");
        });
    }else if(type=="" && place==""){ //TODO : à mettre dans l'ordre chronologique
       //"Qu'est-ce qui est prévu demain?" figure case
       return admin.database().ref('Event').once('value').then((snapshot) => {
         for (let i = 1; i<ID+1; i++){
            //agent.add("Requête "+i);
            const splitTime = time.split("T");
            const value = snapshot.child(i).val();
            const wanted_place = value.Place;
            const wanted_time = value.Time;
            const wanted_type = value.Type;
            const wanted_date = wanted_time.date_time.split("T");
            if (wanted_date[0]==splitTime[0]){
              const date = sysDateToReadable(wanted_time.date_time,agent);
              agent.add("Une "+wanted_type+" est prévue "+date+" en "+wanted_place+".");
            }
          }
        });
    }else if(type==""){
      //"Est-ce que la salle B038 est libre demain à 10h?" figure case -> OK
      return admin.database().ref('Event').once('value').then((snapshot) => {
        for (let i = 1; i<ID+1; i++){
           //agent.add("Requête "+i);
           const value = snapshot.child(i).val();
           const wanted_place = value.Place;
           const wanted_time = value.Time;
           const wanted_type = value.Type;
           if (wanted_time.date_time==time.date_time && wanted_place==place){
             const date = sysDateToReadable(wanted_time.date_time,agent);
             agent.add("Une "+wanted_type+" est prévue "+date+" en "+wanted_place+".");
           }else if(i==ID){
             agent.add("Il n'y a aucun évènement enregistré correspondant à ces informations. Vous pouvez en programmer un en me demandant 'Crée une réunion/conférence/... en B038/amphithéâtre sud/... demain/mardi/le 13/07 à 14h30' par exemple");
           }
         }
       });
    }else if (isRequested!=""){
      //"A quelle heure/dans quelle salle est la réunion de demain?" figure case -> OK
      return admin.database().ref('Event').once('value').then((snapshot) => {
        for (let i = 1; i<ID+1; i++){
           //agent.add("Requête "+i);
           const value = snapshot.child(i).val();
           const wanted_place = value.Place;
           const wanted_time = value.Time; //surtout à ce niveau là parce que là on veut juste comparer les dates
           const wanted_type = value.Type;
           const splitTime = time.split("T");
           const splitwTime = wanted_time.date_time.split("T");
           if (wanted_type==type && splitTime[0]==splitwTime[0]){
             const date = sysDateToReadable(wanted_time.date_time,agent);
             agent.add("Une "+wanted_type+" est prévue "+date+" en "+wanted_place+".");
           }else if(i==ID){
             agent.add("Il n'y a aucun évènement enregistré correspondant à ces informations. Vous pouvez en programmer un en me demandant 'Crée une réunion/conférence/... en B038/amphithéâtre sud/... demain/mardi/le 13/07 à 14h30' par exemple");
           }
         }
       });
    }else{
      agent.add("Je n'ai pas bien compris cette demande. Essaie de la reformuler s'il te plait.");
    }
  }

  //modify pieces of information already saved in the database :
  function modifyEvent(agent){
    const type = request.body.queryResult.parameters.event;
    const previousDate = request.body.queryResult.parameters.previousdate.date_time;
    const newDate = request.body.queryResult.parameters.newdate;
    const previousPlace = request.body.queryResult.parameters.previousplace;
    const newPlace = request.body.queryResult.parameters.newplace;

    var idToDelete = 0;
    var ref = admin.database().ref('Event');

    if (Object.entries(newDate).length!=0){
      //"Déplace la conférence de demain 16h à jeudi 10h" exemple case
      var dataPlace = "";
      //step 1 : trouver l'identifiant de l'entrée dans la BDD
      //agent.add("Il y a "+ID+" requêtes à analyser");
      ref.on("value", function(snapshot){
        for (let i = 1; i <= ID; i++){
          //agent.add("Requête "+i);
          const value = snapshot.child(i).val();
          if (value.Type==type && value.Time.date_time==previousDate){
            //step 2 : garder en mémoire les infos + la modif
            idToDelete = i;
            dataPlace = value.Place;
          }
        }
      });
      //step 3 : supprimer la mauvaise version et créer une nouvelle entrée dans la BDD
      if (idToDelete!=0){
        ref.child(idToDelete).remove();
        ref.child(idToDelete).set({
          Type : type,
          Time : newDate,
          Place : dataPlace
        });
        agent.add("Modification bien enregistrée!");
      }else{
        agent.add("Il n'y a aucun évènement enregistré correspondant à ces informations. Vous pouvez en programmer un en me demandant 'Crée une réunion/conférence/... en B038/amphithéâtre sud/... demain/mardi/le 13/07 à 14h30' par exemple");
      }
    }else if(newPlace!=""){ //OK jusqu'à la partie supression, mais pas de ré-écriture dans la DB ensuite
        //"Déplace la conférence de jeudi 14h de la salle B022 à la salle B038" exemple case
        //step 1 : trouver l'identifiant de l'entrée dans la BDD
        agent.add("Il y a "+ID+" requêtes à analyser");
        ref.on("value", function(snapshot){
          for (let i = 1; i <= ID; i++){
            agent.add("Requête "+i);
            const value = snapshot.child(i).val();
            if (value.Type==type && value.Time.date_time==previousDate){
              //step 2 : garder en mémoire les infos + la modif
              idToDelete = i;
            }
          }
        });
        //step 3 : supprimer la mauvaise version et créer une nouvelle entrée dans la BDD
        if (idToDelete!=0){
          ref.child(idToDelete).remove(); //-> OK jusque là
          ref.child(idToDelete).set({
            Type : type,
            Time : previousDate,
            Place : newPlace
          });
          agent.add("Modification bien enregistrée!");
        }else{
          agent.add("Il n'y a aucun évènement enregistré correspondant à ces informations. Vous pouvez en programmer un en me demandant 'Crée une réunion/conférence/... en B038/amphithéâtre sud/... demain/mardi/le 13/07 à 14h30' par exemple");
        }
      }
    }


  let intentMap = new Map();
  intentMap.set("EventHandling",savingEvent);
  intentMap.set("ReadFromDB",readEvent);
  intentMap.set("ModifyDB", modifyEvent);
  agent.handleRequest(intentMap);
});
