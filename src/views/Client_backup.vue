<template>
  <div class="container mt-4">
    <div  class="row justify-content-center">
  <div class="col-md-8"
    v-if="user !== null && user.uid == userID "
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
  
      <h1>Step 1: Target Zone</h1>
    <section class="zone"><!-- Target Zone content -->
      
    <div id="outerContainer">
      <label class="toggle-control">
        <input type="checkbox" checked="unchecked" @change="myFunction()">
        <span class="control"></span>
      </label>
      
        <div id="container"        class='drop-zone'
   
      @dragover.prevent
      @dragenter.prevent >
           
          <template  v-if="isBoy">
            <img id="man_back" src="./man_back.png" width="600" height ="900" alt="man back"/>
          </template>
          <template v-else>
            <img id="man_back" src="./girl_back.png"  width="600" height ="900" alt="girl back" />
          </template>
            <div id="item" @dragstart="dragStart($event)">

            </div>
        </div>
    </div>
    </section>
  
  
  
  
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
          isBoy: true,
            client: [],
            searchQuery: "",
            userID: this.$route.params.userID,
            sessionID: this.$route.params.sessionID,
            active: false,
            currentX:null,
            currentY: null,
          initialX: null,
          initialY: null,
          xOffset: 0,
          yOffset: 0
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
      mounted: function(){
        var dragItem = document.querySelector("#item");
        var container = document.querySelector("#container");

    
        container.addEventListener("touchstart", this.dragStart, false);
        container.addEventListener("touchend", this.dragEnd, false);
        container.addEventListener("touchmove", this.drag, false);
    
        container.addEventListener("mousedown", this.dragStart, false);
        container.addEventListener("mouseup", this.dragEnd, false);
        container.addEventListener("mousemove", this.drag, false);
    
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
      

       
      
      },
      dragEnd:(e)=>{
          this.initialX = this.currentX;
          this.initialY = this.currentY;
    
          this.active = false;
        },
      drag:(e)=>{
            if (this.active) {
          
            //e.preventDefamyFunctiult();
          
            if (e.type === "touchmove") {
              e.preventDefault();
              this.currentX = e.touches[0].clientX - this.initialX;
              this.currentY = e.touches[0].clientY - this.initialY;
            } else {
              this.currentX = e.clientX - this.initialX;
              this.currentY = e.clientY - this.initialY;
            }
    
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            var dragItem = document.querySelector("#item");
            this.setTranslate(this.currentX, this.currentY, dragItem);
          }
      },
        setTranslate:(xPos, yPos, el) =>{
          el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        },
      dragStart:(e) =>{
        console.log(e)
          if (e.type === "touchstart") {
            this.initialX = e.touches[0].clientX - this.xOffset;
            this.initialY = e.touches[0].clientY - this.yOffset;
          } else {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
          }
    var dragItem = document.querySelector("#item");
          if (e.target === dragItem) {
            this.active = true;
          }
        },
      myFunction: function() {
          var checkBox = document.getElementsByClassName("toggle-control");
          var container = document.getElementById("container");
          this.isBoy=!this.isBoy;
    },
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

}
</script>

<style scoped>
body{
    margin: 0 auto;
    background-color: black;
}
.main_container{
    width: 900px;
    height: auto;
    
    margin: auto;
}
.main_container > header{
    background-color: #626368;
}

.main_container > header > .logo > img{
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.nav > ul{
    padding: 0px;
    margin: 0px;
    list-style-type: none;
    text-align: center;
    
}
.nav > ul > li{
    display: inline-block;
    text-decoration-line: underline;
    
}
.nav > ul > li > a{
    color: silver;
    text-decoration: none;
    display: block;
    padding: 15px;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: x-large;
}
nav > ul > li > a:hover{
    background-color: gray;
}
.clearfix{
    clear: both;
}

#man_back{
    /*display: none;*/
    align-items: center;
}
#girl_back{
    display: none;
    align-items: center;
}
#container {
    width: auto;
    height: 865px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 600px, 860px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    border-radius: 7px;
    touch-action: none;
  }

#item {
    width: 80px;
    height: 80px;
    background-color: lightgrey;
    border: 10px solid rgba(136, 136, 136, .5);
    border-radius: 50%;
    touch-action: none;
    user-select: none;
    box-sizing: border-box;
    justify-self: center;
  }
  #item:active {
    background-color: rgba(168, 218, 220, 1.00);
  }
  #item:hover {
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
    background-color: lightpink;
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
    background-color: dodgerblue;
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

.direction {
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 1em;
  grid-auto-rows: minmax(130px; auto);
  justify-items: center;
  align-items: center;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  padding-bottom: 60px;
}


#up_arrow {
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  justify-self: center;
  align-self: center;
  grid-column: 1 / span 3;
  grid-row: 1;

}


#left_arrow {
  margin-top: 20px;
  margin-left: auto;
  margin-right: 0px;
  justify-self: right;
  align-self: center;
  grid-column: 1;
  grid-row: 2;
}
#right_arrow {
  margin-top: 20px;
  margin-left: 0px;
  margin-right: auto;
  justify-self: left;
  align-self: center;
  grid-column: 3;
  grid-row: 2;
}
#down_arrow {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  justify-self: center;
  align-self: center;
  grid-column: 1 / span 3;
  grid-row: 3;
}
#red_button {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  justify-self: left;
  align-self: center;
  grid-column: 2;
  grid-row: 2;
} 

.pressure {
  background: white;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 1em;
  grid-auto-rows: minmax(130px; auto);
  justify-items: center;
  align-items: center;
  width: 700px;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  padding-bottom: 60px;
}

#foo {
  grid-column: 1 / span 3;
  grid-row: 1 / span 3;
}

#down {
  height: 50px;
  width: 50px;
  justify-self: left;
}

#up {
  height: 50px;
  width: 50px;
  justify-self: left;
}

#copyright {
  color: white;
}

h1 {
  color: lightgrey;
}
</style>