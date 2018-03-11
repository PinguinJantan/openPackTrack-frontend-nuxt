<template>
  <div>
    <h1>List of item</h1>
  </div>
</template>
<script>
export default {
  middleware: ['auth'],
  data: () => {
    return {
      items: []
    }
  },
  created() {
    this.fetchItems()
  },
  methods: {
    fetchItems() {
      this.$axios.$get('/api/item/all').then(items => {
        console.log('items : ', items)
        if (items) {
         this.items = items 
        }
      }).catch(err => {
        this.$store.commit('setAlert', err.message)
      })
    }
  }
}
</script>
