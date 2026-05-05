<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
    <h2 class="text-2xl font-bold mb-4">Вход</h2>
    <input v-model="username" placeholder="Логин" class="w-full border p-2 mb-2 rounded" />
    <input v-model="password" type="password" placeholder="Пароль" class="w-full border p-2 mb-4 rounded" />
    <button @click="login" class="w-full bg-blue-600 text-white py-2 rounded">Войти</button>
    <p class="mt-3 text-center">Нет аккаунта? <router-link to="/register" class="text-blue-500">Регистрация</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await axios.post('http://localhost:8080/api/auth/login', {
      username: username.value,
      password: password.value
    })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify({
      id: res.data.id,
      username: res.data.username,
      role: res.data.role
    }))
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    
    // Уведомляем приложение об изменении статуса
    window.dispatchEvent(new CustomEvent('auth-changed'))
    
    if (res.data.role === 'admin') {
      router.push('/admin/recipes')
    } else {
      router.push('/')
    }
  } catch (err) {
    alert('Ошибка входа. Проверьте логин/пароль.')
    console.error(err)
  }
}
</script>