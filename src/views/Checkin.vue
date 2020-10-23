<template>
  <form class="mt-3" @submit.prevent="handleCheckIn">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <div class="card bg-light">
            <div class="card-body">
              <h3 class="font-weight-light mb-3">Check in</h3>
              <section class="form-group">
                <div class="col-12 alert alert-danger px-3"
                v-if="error">
                  error
                </div>
                <label
                  class="form-control-label sr-only"
                  for="displayName"
                >Name</label>
                <input
                  required
                  class="form-control"
                  type="text"
                  placeholder="Name"
                  v-model="displayName"
                />
              </section>
              <section class="form-group">
                <label
                  class="form-control-label sr-only"
                  for="Email"
                >Email</label>
                <input
                  required
                  class="form-control"
                  type="email"
                  placeholder="Email"
                  v-model="email"
                />
              </section>
              <div class="form-group text-right mb-0">
                <button
                  class="btn btn-primary"
                  type="submit"
                >Check in</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
/*eslint-disable no-unused-vars*/
/*eslint no-unused-labels: 1*/
/*eslint-disable no-undef*/
export default {
    data: function() {
        return {
        displayName: null,
        email: null
        };
        
    },
    props: ["error"],
    methods: {
        handleCheckIn: function() {
            this.$emit("checkIn", {
              userID: this.$route.params.userID,
              sessionID: this.$route.params.sessionID,
              displayName: this.displayName,
              email: this.email
            })
            this.displayName = null;
            this.email = null;
        }
    }
}
</script>
