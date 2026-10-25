<script setup>
import { ref } from 'vue'


</script>

<template>

    <nav class="navigation">

        <button class="navButton-home">
            <h1 class="navButton">Icon</h1>
        </button>

        <button class="navButton">
            <h1 class="navButton">Gallery</h1>
        </button>

        <button class="navButton">
            <h1 class="navButton">About</h1>
        </button>

        <button class="navButton">
            <h1 class="navButton">Blog</h1>
        </button>

        <button class="navButton">
            <h1 class="navButton">Contact</h1>
        </button>

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

button[class^=navButton] {
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

/* button[class^=navButton]:hover {} */
</style>
