<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <button @click="router.back()" class="mb-6 text-orange-500 hover:text-orange-700 flex items-center gap-1 font-medium">
      ← Назад
    </button>

    <div v-if="loading" class="text-center py-20">Загрузка...</div>
    <div v-else-if="recipe" class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ recipe.title }}</h1>
      <div class="flex flex-wrap gap-3 mb-5 text-sm text-gray-500">
        <span>⏱️ {{ recipe.cooking_time_minutes }} мин</span>
        <span>🍽️ {{ recipe.servings }} порции</span>
        <span class="capitalize">🏷️ {{ recipe.difficulty === 'easy' ? 'Лёгкий' : recipe.difficulty === 'medium' ? 'Средний' : 'Сложный' }}</span>
        <span v-if="recipe.category?.name">📁 {{ recipe.category.name }}</span>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">📝 Инструкция</h2>
        <p class="text-gray-600 whitespace-pre-line">{{ recipe.instructions }}</p>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">🥕 Ингредиенты</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <li v-for="ri in recipe.ingredients" :key="ri.id" class="flex justify-between border-b border-gray-200 py-2">
            <span class="text-gray-700">
              {{ ri.name }}
              <span v-if="ri.recipe_ingredient">
                ({{ ri.recipe_ingredient.quantity }} {{ ri.recipe_ingredient.unit_override || ri.unit }})
              </span>
              <span v-else-if="ri.quantity">
                ({{ ri.quantity }} {{ ri.unit_override || ri.unit }})
              </span>
              <span v-else>
                (количество не указано)
              </span>
            </span>
            <span class="text-gray-500 text-sm">
              <template v-if="ri.calories_per_unit">
                {{ Math.round((ri.recipe_ingredient?.quantity || ri.quantity) * ri.calories_per_unit) }} ккал
              </template>
              <template v-else>— ккал</template>
            </span>
          </li>
        </ul>
      </div>

      <div v-if="nutrition" class="bg-orange-50 rounded-xl p-4 border border-orange-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">📊 Пищевая ценность (на порцию)</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div><div class="text-orange-600 text-lg font-bold">{{ Math.round(nutrition.calories_per_serving || 0) }}</div><div class="text-xs text-gray-500">ккал</div></div>
          <div><div class="text-orange-600 text-lg font-bold">{{ Math.round(nutrition.total_protein || 0) }} г</div><div class="text-xs text-gray-500">белки</div></div>
          <div><div class="text-orange-600 text-lg font-bold">{{ Math.round(nutrition.total_fat || 0) }} г</div><div class="text-xs text-gray-500">жиры</div></div>
          <div><div class="text-orange-600 text-lg font-bold">{{ Math.round(nutrition.total_carbs || 0) }} г</div><div class="text-xs text-gray-500">углеводы</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const recipe = ref(null)
const nutrition = ref(null)
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id
  try {
    const [recipeRes, nutritionRes] = await Promise.all([
      axios.get(`http://localhost:8080/api/recipes/${id}`),
      axios.get(`http://localhost:8080/api/analytics/recipe-nutrition/${id}`)
    ])
    recipe.value = recipeRes.data
    nutrition.value = nutritionRes.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>