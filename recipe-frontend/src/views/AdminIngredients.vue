<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Управление ингредиентами</h2>
      <button @click="openForm()" class="bg-green-600 text-white px-4 py-2 rounded-lg">+ Новый ингредиент</button>
    </div>

    <div v-if="loading" class="text-center py-10">Загрузка...</div>
    <div v-else class="overflow-x-auto">
      <table class="w-full bg-white rounded-xl shadow">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">Название</th>
            <th class="p-2 text-left">Ед.</th>
            <th class="p-2 text-right">ккал/ед</th>
            <th class="p-2 text-center">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ing in ingredients" :key="ing.id" class="border-t">
            <td class="p-2">{{ ing.name }}</td>
            <td class="p-2">{{ ing.unit }}</td>
            <td class="p-2 text-right">{{ ing.calories_per_unit }}</td>
            <td class="p-2 text-center">
              <button @click="openForm(ing)" class="text-blue-600 mr-2">✏️</button>
              <button @click="deleteIngredient(ing.id)" class="text-red-600">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center" @click.self="showModal = false">
      <div class="bg-white p-6 rounded-xl w-96">
        <h3 class="text-lg font-bold mb-4">{{ editing ? 'Редактировать' : 'Новый ингредиент' }}</h3>
        <input v-model="form.name" placeholder="Название" class="w-full border p-2 rounded mb-2" />
        <input v-model="form.unit" placeholder="Единица (г, мл, шт)" class="w-full border p-2 rounded mb-2" />
        <input type="number" step="0.1" v-model="form.calories_per_unit" placeholder="ккал на единицу" class="w-full border p-2 rounded mb-2" />
        <input type="number" step="0.1" v-model="form.protein_per_unit" placeholder="белки на единицу" class="w-full border p-2 rounded mb-2" />
        <input type="number" step="0.1" v-model="form.fat_per_unit" placeholder="жиры на единицу" class="w-full border p-2 rounded mb-2" />
        <input type="number" step="0.1" v-model="form.carbs_per_unit" placeholder="углеводы на единицу" class="w-full border p-2 rounded mb-4" />
        <div class="flex justify-end gap-2">
          <button @click="showModal = false" class="px-4 py-1 bg-gray-300 rounded">Отмена</button>
          <button @click="saveIngredient" class="px-4 py-1 bg-blue-600 text-white rounded">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const ingredients = ref([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref(false)
const form = ref({ name: '', unit: '', calories_per_unit: 0, protein_per_unit: 0, fat_per_unit: 0, carbs_per_unit: 0 })
let editId = null

const fetchIngredients = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/ingredients')
    ingredients.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openForm = (ing = null) => {
  if (ing) {
    editing.value = true
    editId = ing.id
    form.value = { ...ing }
  } else {
    editing.value = false
    form.value = { name: '', unit: '', calories_per_unit: 0, protein_per_unit: 0, fat_per_unit: 0, carbs_per_unit: 0 }
  }
  showModal.value = true
}

const saveIngredient = async () => {
  try {
    if (editing.value) {
      await axios.put(`http://localhost:8080/api/ingredients/${editId}`, form.value)
    } else {
      await axios.post('http://localhost:8080/api/ingredients', form.value)
    }
    showModal.value = false
    await fetchIngredients()
  } catch (err) {
    alert('Ошибка сохранения')
  }
}

const deleteIngredient = async (id) => {
  if (confirm('Удалить ингредиент?')) {
    try {
      await axios.delete(`http://localhost:8080/api/ingredients/${id}`)
      await fetchIngredients()
    } catch (err) {
      alert('Ошибка удаления')
    }
  }
}

onMounted(fetchIngredients)
</script>