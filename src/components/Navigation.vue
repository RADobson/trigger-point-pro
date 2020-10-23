<template>
  <div>
    <nav class="site-nav navbar navbar-expand bg-primary navbar-dark">
      <div class="container-fluid">
        <router-link 
         class="navbar-brand"  
         to="/"
         >
         <h1 class="logo"
         >TriggerPoint.Pr<img src="../assets/tppr.png" alt="logo" width="35" height="35" />
         </h1>
         </router-link>
        <div class="navbar-nav ml-auto">
          <router-link 
           class="nav-item nav-link" 
           to="/sessions" 
           v-if="user"
           >sessions</router-link>
          <router-link 
           class="nav-item nav-link" 
           to="/login" 
           v-if="!user"
           >log in</router-link>
          <router-link 
           class="nav-item nav-link" 
           to="/register" 
           v-if="!user"
           >register</router-link>
          <button class="nav-item nav-link btn btn-link"
           v-if="user"
          @click="$emit('logout')">logout</button>
        </div>
      </div>
    </nav>


  </div>
</template>
<script>
export default {
  name: "navigation",
  props: ["user"]
}
</script>