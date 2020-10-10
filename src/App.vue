<template>
  <div id="app">
    <Navigation />
    <router-view class="container" :user="user" />
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
      user: null
    };
  },
  mounted() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user.email;
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
