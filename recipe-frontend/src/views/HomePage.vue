<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Все рецепты</h2>
    
    <!-- Блок фильтров -->
    <div class="bg-white p-4 rounded-xl shadow mb-8 flex flex-wrap gap-4 items-end">    
      <div class="w-40">
        <label class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
        <select v-model="filters.categoryId" class="w-full px-3 py-2 border rounded-lg" @change="fetchRecipes">
          <option :value="null">Все</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>
      
      <div class="w-40">
        <label class="block text-sm font-medium text-gray-700 mb-1">Сложность</label>
        <select v-model="filters.difficulty" class="w-full px-3 py-2 border rounded-lg" @change="fetchRecipes">
          <option :value="null">Любая</option>
          <option value="easy">Лёгкий</option>
          <option value="medium">Средний</option>
          <option value="hard">Сложный</option>
        </select>
      </div>
      
      <div class="w-48">
        <label class="block text-sm font-medium text-gray-700 mb-1">Макс. время (мин)</label>
        <input 
          type="number" 
          v-model.number="filters.maxTime" 
          placeholder="Например: 30"
          class="w-full px-3 py-2 border rounded-lg"
          @input="fetchRecipes"
        />
      </div>
      
      <button @click="resetFilters" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
        Сбросить
      </button>
    </div>

    <!-- Список рецептов -->
    <div v-if="loading" class="text-center py-10">Загрузка...</div>
    <div v-else-if="recipes.length === 0" class="text-center py-10 text-gray-500">
      Рецептов не найдено
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="recipe in recipes" :key="recipe.id"
           class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl cursor-pointer transition-all hover:-translate-y-1"
           @click="$router.push(`/recipe/${recipe.id}`)">
        <div class="p-5">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-semibold text-gray-800">{{ recipe.title }}</h3>
            <span class="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
              {{ difficultyText(recipe.difficulty) }}
            </span>
          </div>
          <p class="text-gray-500 mt-2 line-clamp-2">{{ recipe.description || 'Вкусный рецепт' }}</p>
          <div class="flex justify-between items-center mt-4 text-sm text-gray-400">
            <span>⏱️ {{ recipe.cooking_time_minutes || '?' }} мин</span>
            <span>🍽️ {{ recipe.servings || '?' }} порц.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const recipes = ref([])
const categories = ref([])
const loading = ref(true)

const filters = ref({
  title: '',
  categoryId: null,
  difficulty: null,
  maxTime: null
})

const difficultyText = (diff) => {
  if (diff === 'easy') return 'Лёгкий'
  if (diff === 'medium') return 'Средний'
  if (diff === 'hard') return 'Сложный'
  return diff
}

const fetchRecipes = async () => {
  loading.value = true
  try {
    const params = {}
    // Добавляем параметры только если они заданы
    if (filters.value.title) params.title = filters.value.title
    if (filters.value.categoryId) params.categoryId = filters.value.categoryId
    if (filters.value.difficulty) params.difficulty = filters.value.difficulty
    if (filters.value.maxTime) params.maxTime = filters.value.maxTime

    const res = await axios.get('http://localhost:8080/api/recipes', { params })
    recipes.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки рецептов:', err)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки категорий:', err)
  }
}

const resetFilters = () => {
  filters.value = { title: '', categoryId: null, difficulty: null, maxTime: null }
  fetchRecipes()
}

onMounted(() => {
  fetchCategories()
  fetchRecipes()
})
</script>