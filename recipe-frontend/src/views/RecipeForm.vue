<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <h1 class="text-2xl font-bold mb-6">{{ isEdit ? 'Редактировать рецепт' : 'Новый рецепт' }}</h1>
    <form @submit.prevent="saveRecipe" class="space-y-4">
      <input v-model="form.title" type="text" placeholder="Название" class="w-full p-2 border rounded" required />
      <textarea v-model="form.description" placeholder="Описание" class="w-full p-2 border rounded"></textarea>
      <textarea v-model="form.instructions" placeholder="Инструкция" class="w-full p-2 border rounded" required></textarea>
      <div class="grid grid-cols-3 gap-4">
        <input v-model.number="form.cooking_time_minutes" type="number" placeholder="Время (мин)" class="p-2 border rounded" />
        <input v-model.number="form.servings" type="number" placeholder="Порции" class="p-2 border rounded" />
        <select v-model="form.difficulty" class="p-2 border rounded">
          <option value="easy">Лёгкий</option>
          <option value="medium">Средний</option>
          <option value="hard">Сложный</option>
        </select>
      </div>
      <select v-model="form.categoryId" class="w-full p-2 border rounded">
        <option :value="null">Без категории</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>

      <h3 class="font-semibold">Ингредиенты</h3>
      <div v-for="(item, idx) in form.ingredients" :key="idx" class="flex gap-2 items-end border-b pb-2">
        <select v-model="item.ingredientId" class="p-2 border rounded flex-1">
          <option :value="null">-- Выберите ингредиент --</option>
          <option v-for="ing in ingredientsList" :key="ing.id" :value="ing.id">
            {{ ing.name }} ({{ ing.unit }}, {{ ing.calories_per_unit }} ккал/ед)
          </option>
        </select>
        <input v-model.number="item.quantity" type="number" placeholder="Кол-во" class="p-2 border rounded w-24" />
        <input v-model="item.unit_override" placeholder="Ед. изм. (опц)" class="p-2 border rounded w-28" />
        <button type="button" @click="removeIngredient(idx)" class="text-red-500">✖</button>
      </div>
      <button type="button" @click="addIngredient" class="text-blue-500">+ Добавить ингредиент</button>

      <div class="flex gap-4 pt-4">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Сохранить</button>
        <button type="button" @click="$router.back()" class="bg-gray-400 px-4 py-2 rounded">Отмена</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

const form = ref({
  title: '',
  description: '',
  instructions: '',
  cooking_time_minutes: null,
  servings: null,
  difficulty: 'medium',
  categoryId: null,
  ingredients: []
})

const categories = ref([])
const ingredientsList = ref([])

const addIngredient = () => {
  form.value.ingredients.push({ ingredientId: null, quantity: null, unit_override: '' })
}
const removeIngredient = (idx) => {
  form.value.ingredients.splice(idx, 1)
}

async function loadCategories() {
  try {
    const res = await axios.get('http://localhost:8080/api/categories')
    categories.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки категорий:', err)
  }
}

async function loadIngredients() {
  try {
    const res = await axios.get('http://localhost:8080/api/ingredients')
    ingredientsList.value = res.data
  } catch (err) {
    console.error('Ошибка загрузки ингредиентов:', err)
  }
}

async function loadRecipe(id) {
  try {
    const res = await axios.get(`http://localhost:8080/api/recipes/${id}`)
    const recipe = res.data
    form.value = {
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      cooking_time_minutes: recipe.cooking_time_minutes,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      categoryId: recipe.categoryId,
      ingredients: recipe.ingredients.map(ing => ({
        ingredientId: ing.id,
        quantity: ing.recipe_ingredient?.quantity,
        unit_override: ing.recipe_ingredient?.unit_override || ''
      }))
    }
  } catch (err) {
    console.error(err)
  }
}

async function saveRecipe() {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    let recipeId
    if (isEdit.value) {
      await axios.put(`http://localhost:8080/api/recipes/${route.params.id}`, {
        title: form.value.title,
        description: form.value.description,
        instructions: form.value.instructions,
        cooking_time_minutes: form.value.cooking_time_minutes,
        servings: form.value.servings,
        difficulty: form.value.difficulty,
        categoryId: form.value.categoryId
      })
      recipeId = route.params.id
    } else {
      const res = await axios.post('http://localhost:8080/api/recipes', {
        title: form.value.title,
        description: form.value.description,
        instructions: form.value.instructions,
        cooking_time_minutes: form.value.cooking_time_minutes,
        servings: form.value.servings,
        difficulty: form.value.difficulty,
        categoryId: form.value.categoryId,
        authorId: user.id   // 🔥 важно: берем ID из залогиненного пользователя
      })
      recipeId = res.data.id
    }

    // Обновляем ингредиенты
    await axios.delete(`http://localhost:8080/api/recipe-ingredients/recipe/${recipeId}`)
    for (const ing of form.value.ingredients) {
      if (ing.ingredientId && ing.quantity) {
        await axios.post('http://localhost:8080/api/recipe-ingredients', {
          recipeId: recipeId,
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit_override: ing.unit_override || null
        })
      }
    }
    router.push('/profile')
  } catch (err) {
    console.error('Ошибка сохранения:', err)
    alert('Ошибка сохранения рецепта: ' + (err.response?.data?.message || err.message))
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Необходимо войти в систему')
    router.push('/login')
    return
  }
  await loadCategories()
  await loadIngredients()
  if (isEdit.value) {
    await loadRecipe(route.params.id)
  } else {
    if (form.value.ingredients.length === 0) addIngredient()
  }
})
</script>