<template>
 <div class="mt-3">
   <div class="text-secondary text-center">
     <div v-if="user" class="text-center">
       Welcome back
     <span class="font-weight-bold text-info">{{user.displayName}}</span>, 
     <a href="#" role="button" class="text-primary" @click="$emit('logout')"
     >logout</a>
     </div>
     </div>
  <div class="container text-center">
    <div class="row justify-content-center">
      <div class="col-10 col-md-10 col-lg-8 col-xl-7">
        <h4 class="display-4 text-primary mb-2">Trigger Point Pro</h4>
        <p class="lead text-secondary">
          This simple app facilitates communication between therapist and client
          during a therapy session when the client is lying prone - to assist the therapist
          to find trigger points, target sensitive zones, and adjust therapuetic pressure accordingly.
        </p>

        <router-link
          class="btn btn-outline-primary mr-2"
          to="/register"
          v-if="!user"
        >Register</router-link>
        <router-link
          class="btn btn-outline-primary mr-2"
          to="/login"
          v-if="!user"
        >Log In</router-link>
        <router-link
          class="btn btn-primary"
          to="/sessions"
          v-if="user"
        >Sessions</router-link>
      </div>
    </div>
  </div>
 </div>

</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";


export default {
  name: "Home",
  props: ["user"]
};
</script>
