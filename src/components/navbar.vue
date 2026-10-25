<script setup>
import { ref } from 'vue'


</script>

<template>

    <nav class="navigation">

        <RouterLink to="/" class="navButton-home">
            <h1 class="navButton">Icon</h1>
        </RouterLink>

        <RouterLink to="/gallery" class="navButton">
            <h1 class="navButton">Gallery</h1>
        </RouterLink>

        <RouterLink to="/about" class="navButton">
            <h1 class="navButton">About</h1>
        </RouterLink>

        <RouterLink to="/blog" class="navButton">
            <h1 class="navButton">Blog</h1>
        </RouterLink>

    </nav>
</template>

<style scoped>
.navigation {
    display: flex;
    align-self: center;
}

.navButton-home {
    margin-right: 32em;
}

.navigation a {
    text-decoration: none;
    color: inherit;
    padding: 2em;
    justify-content: center;
    display: flex;
    flex-direction: column;
    width: 16.4em;
    height: 2.8em;
    margin-left: 2em;
    border-style: none;
    background-color: white;
}
</style>
