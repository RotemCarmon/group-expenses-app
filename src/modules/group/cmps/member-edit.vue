<template>
  <section class="member-edit-container container">
    <main>
      <button @click="$emit('close')" class="close-btn">
        <img :src="require('@/assets/icons/close.svg')" />
      </button>
      <div class="page-header">
        <div class="title">Add Member</div>
      </div>
      <input type="text" class="form-input" placeholder="Enter Name" />
      <input type="text" class="form-input" placeholder="Enter Email" />
    </main>
    <button class="btn dark buttom-btn create-btn">Save</button>
  </section>
</template>

<script>
export default {};
</script>

<style>
</style>