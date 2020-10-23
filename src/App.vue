<template>
  <div id="app">
    <Navigation :user="user" @logout="logout"/>
    <router-view 
     class="container" 
     :user="user"
     :sessions="sessions"
     :error = "error"
     @logout="logout" 
     @addSession="addSession"
     @deleteSession = "deleteSession"
     @checkIn = "checkIn"
     />
     
  </div>
</template>

<script>
/*eslint-disable no-unused-vars*/
import Navigation from "@/components/Navigation.vue";
import Firebase from "firebase";
import db from "./db.js";

export default {
  name: "App",
  data: function(){
    return {
      user: null,
      error: null,
      sessions: []
    };
  },
  methods: {
    logout: function() {
      Firebase.auth().signOut().then( () => {
        this.user = null,
        this.$router.push("login");
      });
    },
    addSession: function(payload) {
      db.collection("users")
      .doc(this.user.uid)
      .collection("sessions")
      .add({
        name: payload,
        createdAt: Firebase.firestore.FieldValue.serverTimestamp()
      });
    },
    deleteSession: function(payload) {
      db.collection("users")
      .doc(this.user.uid)
      .collection("sessions")
      .doc(payload)
      .delete();
    },
    checkIn: function(payload) {
      db.collection("users")
      .doc(payload.userID)
      .collection("sessions")
      .doc(payload.sessionID)
      .get()
      .then(doc => {
        if (doc.exists) {
          db.collection("users")
          .doc(payload.userID)
          .collection("sessions")
          .doc(payload.sessionID)
          .collection("client")
          .add({
            displayName: payload.displayName,
            email: payload.email,
            createdAt: Firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => this.$router.push("/client/" + payload.userID + '/' + payload.sessionID));
        } else {
          this.error = "Sorry, no such session"
        }
      })
    }
    
  },

  mounted() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        
        db.collection("users")
        .doc(this.user.uid)
        .collection("sessions")
        .onSnapshot(snapshot => {
          const snapData = [];
          snapshot.forEach( doc => {
            snapData.push({
              id: doc.id,
              name: doc.data().name
            });
          });
          this.sessions = snapData/*.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
              return -1;
            } else {
              return 1;
            }
          });*/
        });

      }
    });
    //db.collection("users")
    //.doc("users_doc")
    //.get()
    //.then(snapshot => {
     // this.user = snapshot.data().name;
    //});
  
},
  components: {
    Navigation
  }
};
</script>


<style lang="scss">

$primary: gray;
$secondary: lightgray;
$body-bg: black;
@import "node_modules/bootstrap/scss/bootstrap";
@import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:wght@700&display=swap');
.logo {
  font-family: 'Old Standard TT', serif;
  color: black;
  margin: 0px;
  padding: 0px;
}
</style>
