<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="loading" class="text-center py-20">Загрузка...</div>
    <div v-else-if="user" class="bg-white rounded-2xl p-6 shadow-xl">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="text-2xl font-bold">{{ user.username }}</h1>
          <p class="text-gray-500">{{ user.email }}</p>
          <p class="text-sm text-orange-600 font-medium mt-1">{{ user.role === 'admin' ? 'Администратор' : 'Пользователь' }}</p>
        </div>
      </div>

      <div class="mt-8">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">Мои рецепты</h2>
    <router-link to="/admin/recipes/new" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
      + Создать рецепт
    </router-link>
  </div>
  <div v-if="myRecipes.length === 0" class="text-gray-400">Вы ещё не создали ни одного рецепта</div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="recipe in myRecipes" :key="recipe.id" class="border rounded-lg p-3 flex justify-between items-center">
            <div>
              <router-link :to="`/recipe/${recipe.id}`" class="font-medium text-orange-600 hover:underline">
                {{ recipe.title }}
              </router-link>
              <div class="text-sm text-gray-500">{{ recipe.cooking_time_minutes }} мин • {{ recipe.servings }} порц.</div>
            </div>
            <div class="space-x-2">
              <router-link :to="`/admin/recipes/edit/${recipe.id}`" class="text-blue-600 text-sm hover:underline">✏️</router-link>
              <button @click="deleteRecipe(recipe.id)" class="text-red-600 text-sm hover:underline">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref(null)
const myRecipes = ref([])
const loading = ref(true)

async function fetchMyRecipes(userId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await axios.get(`http://localhost:8080/api/recipes?authorId=${userId}`, { headers })
  myRecipes.value = res.data
}

async function deleteRecipe(id) {
  if (!confirm('Удалить этот рецепт?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchMyRecipes(user.value.id, token)
  } catch (err) {
    alert('Ошибка удаления')
  }
}

onMounted(async () => {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) throw new Error('Not logged in')
    user.value = JSON.parse(userStr)
    const token = localStorage.getItem('token')
    await fetchMyRecipes(user.value.id, token)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>