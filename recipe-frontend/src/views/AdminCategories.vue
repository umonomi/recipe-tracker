<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Управление категориями</h2>
      <button @click="openForm()" class="bg-green-600 text-white px-4 py-2 rounded-lg">+ Новая категория</button>
    </div>

    <div v-if="loading" class="text-center py-10">Загрузка...</div>
    <div v-else class="grid gap-3">
      <div v-for="cat in categories" :key="cat.id" class="bg-white p-3 rounded-xl shadow flex justify-between items-center">
        <div>
          <span class="text-xl mr-2">{{ cat.icon || '📁' }}</span>
          <strong>{{ cat.name }}</strong>
          <span class="text-gray-500 text-sm ml-2">{{ cat.description }}</span>
        </div>
        <div>
          <button @click="openForm(cat)" class="text-blue-600 mr-2">✏️</button>
          <button @click="deleteCategory(cat.id)" class="text-red-600">🗑️</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно для добавления/редактирования -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center" @click.self="showModal = false">
      <div class="bg-white p-6 rounded-xl w-96">
        <h3 class="text-lg font-bold mb-4">{{ editing ? 'Редактировать' : 'Новая категория' }}</h3>
        <input v-model="form.name" placeholder="Название" class="w-full border p-2 rounded mb-2" />
        <input v-model="form.icon" placeholder="Иконка (эмодзи)" class="w-full border p-2 rounded mb-2" />
        <textarea v-model="form.description" placeholder="Описание" class="w-full border p-2 rounded mb-4"></textarea>
        <div class="flex justify-end gap-2">
          <button @click="showModal = false" class="px-4 py-1 bg-gray-300 rounded">Отмена</button>
          <button @click="saveCategory" class="px-4 py-1 bg-blue-600 text-white rounded">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref(false)
const form = ref({ name: '', icon: '', description: '' })
let editId = null

const fetchCategories = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/categories')
    categories.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openForm = (cat = null) => {
  if (cat) {
    editing.value = true
    editId = cat.id
    form.value = { name: cat.name, icon: cat.icon, description: cat.description }
  } else {
    editing.value = false
    form.value = { name: '', icon: '', description: '' }
  }
  showModal.value = true
}

const saveCategory = async () => {
  try {
    if (editing.value) {
      await axios.put(`http://localhost:8080/api/categories/${editId}`, form.value)
    } else {
      await axios.post('http://localhost:8080/api/categories', form.value)
    }
    showModal.value = false
    await fetchCategories()
  } catch (err) {
    alert('Ошибка сохранения')
  }
}

const deleteCategory = async (id) => {
  if (confirm('Удалить категорию?')) {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`)
      await fetchCategories()
    } catch (err) {
      alert('Ошибка удаления')
    }
  }
}

onMounted(fetchCategories)
</script>