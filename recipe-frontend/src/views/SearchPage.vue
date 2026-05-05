<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Поиск рецептов по ингредиентам</h2>
    <div class="flex gap-3 mb-8">
      <input type="text" v-model="query" placeholder="Например: яйцо, сыр, молоко"
             class="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
             @keyup.enter="search" />
      <button @click="search"
              class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition font-semibold shadow-sm">
        Найти
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">Поиск...</div>
    <div v-else-if="results.length === 0 && searched" class="text-center py-10 text-gray-400">
      Ничего не найдено
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="recipe in results" :key="recipe.id"
           class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl cursor-pointer transition-all hover:-translate-y-1"
           @click="$router.push(`/recipe/${recipe.id}`)">
        <div class="p-5">
          <h3 class="text-xl font-semibold text-gray-800">{{ recipe.title }}</h3>
          <div class="flex justify-between items-center mt-3 text-sm text-gray-400">
            <span>⏱️ {{ recipe.cooking_time_minutes || '?' }} мин</span>
            <span>⭐ {{ recipe.total_ingredients || 0 }} ингр.</span>
          </div>
          <div v-if="recipe.matched_ingredients" class="mt-2 text-xs text-gray-500">
            Найдено: {{ recipe.matched_ingredients }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const query = ref('')
const results = ref([])
const loading = ref(false)
const searched = ref(false)
const router = useRouter()

const search = async () => {
  if (!query.value.trim()) return
  loading.value = true
  searched.value = true
  try {
    const res = await axios.get('http://localhost:8080/api/analytics/search', {
      params: { ingredients: query.value }
    })
    results.value = res.data.found_recipes || []
  } catch (err) {
    console.error(err)
    results.value = []
  } finally {
    loading.value = false
  }
}
</script>