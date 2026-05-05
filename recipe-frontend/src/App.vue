<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
    <nav class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-2">
        <h1 class="text-2xl font-bold text-orange-600">🍳 Recipe Tracker</h1>
        
        <div class="flex items-center space-x-4 flex-wrap gap-2">
          <!-- Публичные ссылки -->
          <router-link to="/" class="text-gray-700 hover:text-orange-600">Рецепты</router-link>
          <router-link to="/search" class="text-gray-700 hover:text-orange-600">Поиск</router-link>

          <!-- Для залогиненных пользователей -->
          <template v-if="isLoggedIn">
            <router-link to="/admin/recipes/new" class="text-gray-700 hover:text-orange-600">Создать рецепт</router-link>
            <router-link to="/profile" class="text-gray-700 hover:text-orange-600">Профиль</router-link>
            <!-- Админские ссылки -->
            <template v-if="isAdmin">
              <router-link to="/admin/recipes" class="text-gray-700 hover:text-orange-600">Рецепты (админ)</router-link>
              <router-link to="/admin/categories" class="text-gray-700 hover:text-orange-600">Категории</router-link>
              <router-link to="/admin/ingredients" class="text-gray-700 hover:text-orange-600">Ингредиенты</router-link>
            </template>
            <button @click="logout" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
              Выйти
            </button>
          </template>

          <!-- Если не залогинен — показываем ссылку на вход -->
          <router-link v-if="!isLoggedIn" to="/login" class="text-gray-700 hover:text-orange-600">Вход</router-link>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const isAdmin = ref(false)

// Функция обновления состояния по localStorage
const updateAuthState = () => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  isLoggedIn.value = !!token
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      isAdmin.value = user.role === 'admin'
    } catch {
      isAdmin.value = false
    }
  } else {
    isAdmin.value = false
  }
}

// Обработчик кастомного события
const handleAuthChange = () => {
  updateAuthState()
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  updateAuthState()
  router.push('/')
}

onMounted(() => {
  updateAuthState()
  window.addEventListener('auth-changed', handleAuthChange)
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', handleAuthChange)
})
</script>