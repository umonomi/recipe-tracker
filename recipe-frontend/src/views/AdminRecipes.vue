<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Управление рецептами</h2>
      <router-link to="/admin/recipes/new" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
        + Новый рецепт
      </router-link>
    </div>
    <div v-if="loading" class="text-center py-10">Загрузка...</div>
    <div v-else class="grid gap-4">
      <div v-for="recipe in recipes" :key="recipe.id" class="bg-white p-4 rounded-xl shadow flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold">{{ recipe.title }}</h3>
          <p class="text-gray-500 text-sm">{{ recipe.cooking_time_minutes }} мин • {{ recipe.servings }} порции</p>
        </div>
        <div class="space-x-2">
          <router-link :to="`/admin/recipes/edit/${recipe.id}`" class="text-blue-600 hover:underline">Редактировать</router-link>
          <button @click="deleteRecipe(recipe.id)" class="text-red-600 hover:underline">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const recipes = ref([])
const loading = ref(true)

const fetchRecipes = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/recipes')
    recipes.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const deleteRecipe = async (id) => {
  if (confirm('Удалить рецепт?')) {
    try {
      await axios.delete(`http://localhost:8080/api/recipes/${id}`)
      await fetchRecipes()
    } catch (err) {
      alert('Ошибка удаления')
    }
  }
}

onMounted(fetchRecipes)
</script>