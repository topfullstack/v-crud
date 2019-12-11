<template>
  <div>
    test com
  </div>
</template>
<scrip>
export default {
  created(){
    console.log(this.$http)
  }
}
</scrip>

<script lang="ts">
// export default {
//   created(){
//     console.log(this.$http)
//   }
// }

import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({})
export default class TestCom extends Vue {

  created(){
    console.log(this.$http)
  }
}
</script>