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
    <div class="row justify-content-center">
      <h1>TEST</h1>

    


    </div>
<div class="row justify-content-center" id="outerContainer">
  <h1>Step 1: Target Zone</h1>
</div>
<div class="row">
    <label class="toggle-control">
      <input type="checkbox" checked="unchecked" @change="toggleSex()" />
      <span class="control"></span>
    </label>
</div>




<div class="row justify-content-center" id="container">
<div id="target_item">
</div>  

<template v-if="isBoy">
      <img
        class="man_back"
        src="./man_back.png"
        width="600"
        height="900"
        alt="man back"
      />
    </template>
    <template v-else>
      <img
        class="man_back"
        src="./girl_back.png"
        width="600"
        height="900"
        alt="girl back"
      />
    </template>
</div>


  </div>
</template>
<script>
/*eslint-disable no-unused-vars*/
/* eslint-disable vue/no-unused-components */
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import Moveable from "vue-moveable";
import db from "../db.js"
export default {
    name: "Client",
    data: function() {
        return {
            client: [],
            searchQuery: "",
            userID: this.$route.params.userID,
            sessionID: this.$route.params.sessionID,
            isBoy: true
        }
    },
    components: {
      FontAwesomeIcon,
      Moveable
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
      },
      toggleSex: function() {
      var checkBox = document.getElementsByClassName("toggle-control");
      var container = document.getElementById("container");
      this.isBoy = !this.isBoy;
    },
   /*######################################################################
     ################# DRAG-N-DROP NOT WORKING ############################
     ######################################################################
     get_X_Position: function(clientID) { //please help me with this
       const ref = db
          .collection("users")
          .doc(this.user.uid)
          .collection("sessions")
          .doc(this.sessionID)
          .collection("client")
          .doc(clientID);

          ref.get().then(doc => {
            return doc.data().currentX;
            }); 
     },*/
   /*######################################################################
     ################# DRAG-N-DROP NOT WORKING ############################
     ######################################################################
      get_Y_Position: function(clientID) { //please help me with this
       const ref = db
          .collection("users")
          .doc(this.user.uid)
          .collection("sessions")
          .doc(this.sessionID)
          .collection("client")
          .doc(clientID);

          ref.get().then(doc => {
            return doc.data().currentY;
            }); 
     }*/
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
                    star: doc.data().star,
                    //sex: doc.data().sex, // should this be boolean? ie. - isboy: doc.data().isboy,
                    currentX: doc.data().currentX,
                    currentY: doc.data().currentY
                });
            });
            this.client = snapData;
        });
        /*##################################################*/
        /*#########  Drag-and-drop Vanilla JS code #########*/
        /*##################################################*/
        var dragItem = document.querySelector("#target_item");
        var container = document.querySelector("#container");
    
        var active = false;
        var currentX;  //this.client.get_X_Position();
        var currentY;  //this.client.get_Y_Position();
        var initialX;
        var initialY;
        var xOffset = 0;
        var yOffset = 0;
    
        container.addEventListener("touchstart", dragStart, false);
        container.addEventListener("touchend", dragEnd, false);
        container.addEventListener("touchmove", drag, false);
    
        container.addEventListener("mousedown", dragStart, false);
        container.addEventListener("mouseup", dragEnd, false);
        container.addEventListener("mousemove", drag, false);
    
        function dragStart(e) {
          if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
          } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
          }
    
          if (e.target === dragItem) {
            active = true;
          }
        }
    
        function dragEnd(e) {
          initialX = currentX;
          initialY = currentY;
    
          active = false;
        }
    
        function drag(e) {
          if (active) {
          
            //e.preventDefault();
          
            if (e.type === "touchmove") {
              e.preventDefault();
              currentX = e.touches[0].clientX - initialX;
              currentY = e.touches[0].clientY - initialY;
            } else {
              currentX = e.clientX - initialX;
              currentY = e.clientY - initialY;
            }
    
            xOffset = currentX;
            yOffset = currentY;
    
            setTranslate(currentX, currentY, dragItem);
          }
        }
    
        function setTranslate(xPos, yPos, el) {
          el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }
        /*##################################################*/
        /* ###### End of drag-and-drop Vanilla JS code #####*/
        /*##################################################*/
    }
}
</script>
<style scoped>
/*Moveable target_item*/
#target_item {
    width: 80px;
    height: 80px;
    background-color: lightgrey;
    border: 10px solid rgba(136, 136, 136, .5);
    border-radius: 50%;
    touch-action: none;
    user-select: none;
    box-sizing: border-box;
    justify-self: center;
    float: right;
  }
  #target_item:active {
    background-color: rgba(168, 218, 220, 1.00);
  }
  #target_item:hover {
    cursor: pointer;
    border-width: 16px;
  }


/*Sex Toggle Switch*/
.toggle-control {
  display: flex;
  position: relative;
  align-self: flex-start;
  justify-items: flex-start;
  top: 50px;
  left: 50px;
  padding-left: 100px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.toggle-control input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.toggle-control input:checked ~ .control {
 
  background-color: dodgerblue;
}
.toggle-control input:checked ~ .control:after {
  left: 55px;
}
.toggle-control .control {
  position: absolute;
  top: 0;
  left: 0;
  height: 50px;
  width: 100px;
  border-radius: 25px;
  
   background-color: lightpink;
  -webkit-transition: background-color 0.15s ease-in;
  transition: background-color 0.15s ease-in;
}
.toggle-control .control:after {
  content: "";
  position: absolute;
  left: 5px;
  top: 5px;
  width: 40px;
  height: 40px;
  border-radius: 25px;
  background: white;
  -webkit-transition: left 0.15s ease-in;
  transition: left 0.15s ease-in;
}
</style>