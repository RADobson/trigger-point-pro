<template>
  <div class="container mt-4">
    <div  class="row justify-content-center">
  <div class="col-md-8"
    v-if="user !== null && user.uid == userID"
  >

    <h1 class="font-weight-light text-center">Client</h1>

    <div class="card bg-light mb-4">
      <div class="card-body text-center">
        <div class="input-group input-group-lg">
          <input
            type="text"
            placeholder="Search Attendees"
            class="form-control"
            v-model="searchQuery"
          />
          <div class="input-group-append">
            <button
              class="btn btn-sm btn-outline-info"
              title="Pick a random attendee"
            >
              <font-awesome-icon icon="random"></font-awesome-icon>
            </button>
            <button
              class="btn btn-sm btn-outline-info"
              title="Reset Search"
            >
              <font-awesome-icon icon="undo"></font-awesome-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    <div class="row justify-content-center">
      <div
        class="col-8 col-sm-6 col-md-4 col-lg-3 mb-2 p-0 px-1"
        v-for="item in filteredClient" 
        :key="item.id"
      >
        <div class="card">
          <div class="card-body px-3 py-2 d-flex align-items-center justify-content-center">
            <div class="btn-group pr-2"
             v-if="user !== null && user.uid == userID">
             <button
              class="btn btn-sm"
              :class="[
                item.star ? 'text-danger': '', ' btn-outline-secondary'
              ]"
              title="Give user a Star"
              @click="toggleStar(item.id)"
              >
              <font-awesome-icon icon="star"></font-awesome-icon>
               </button>
              <a
              class="btn btn-sm btn-outline-secondary"
              title="Send user an email"
              :href="'mailto:' + item.email"
              >
              <font-awesome-icon icon="envelope"></font-awesome-icon>
               </a>
              <button
              class="btn btn-sm btn-outline-secondary"
              title="Remove Client from session"
              @click="deleteClient(item.id)"
              >
              <font-awesome-icon icon="trash"></font-awesome-icon>
              </button>
             </div>
            <div>{{item.displayName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*eslint-disable no-unused-vars*/
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import db from "../db.js"
export default {
    name: "Client",
    data: function() {
        return {
            client: [],
            searchQuery: "",
            userID: this.$route.params.userID,
            sessionID: this.$route.params.sessionID,
        }
    },
    components: {
      FontAwesomeIcon
    },
    computed: {
      filteredClient: function() {
        const dataFilter = item => item.displayName.toLowerCase().match(this.searchQuery.toLowerCase()) && true;
        return this.client.filter(dataFilter);
      }
    },
    methods: {
      toggleStar: function(clientID) {
        if (this.user && this.user.uid==this.userID) {
          const ref = db
          .collection("users")
          .doc(this.user.uid)
          .collection("sessions")
          .doc(this.sessionID)
          .collection("client")
          .doc(clientID);

          ref.get().then(doc => {
            const star = doc.data().star;
            if(star) {
              ref.update({
                star: !star
              });
            } else {
              ref.update({
                star: true
              });
            }
          });
        }
      },
      deleteClient: function(clientID) {
        if (this.user && this.user.uid==this.userID) {
          db.collection("users")
          .doc(this.user.uid)
          .collection("sessions")
          .doc(this.sessionID)
          .collection("client")
          .doc(clientID)
          .delete();
        }
      }
    },
    props: ["user"],
    mounted() {
        db.collection("users")
        .doc(this.userID)
        .collection("sessions")
        .doc(this.sessionID)
        .collection("client")
        .onSnapshot(snapshot => {
            const snapData = [];
            snapshot.forEach(doc => {
                snapData.push({
                    id: doc.id,
                    email: doc.data().email,
                    displayName: doc.data().displayName,
                    star: doc.data().star
                });
            });
            this.client = snapData;
        });
    }
}
</script>