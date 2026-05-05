<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
    <h2 class="text-2xl font-bold mb-4">Регистрация</h2>
    <input v-model="username" placeholder="Логин" class="w-full border p-2 mb-2 rounded" />
    <input v-model="email" placeholder="Email" class="w-full border p-2 mb-2 rounded" />
    <input v-model="password" type="password" placeholder="Пароль" class="w-full border p-2 mb-4 rounded" />
    <button @click="register" class="w-full bg-green-600 text-white py-2 rounded">Зарегистрироваться</button>
    <p class="mt-3 text-center">Уже есть аккаунт? <router-link to="/login" class="text-blue-500">Войти</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    await axios.post('http://localhost:8080/api/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    alert('Регистрация успешна, теперь войдите')
    window.dispatchEvent(new CustomEvent('auth-changed'))
    router.push('/login')
  } catch (err) {
    alert('Ошибка регистрации')
    console.error(err)
  }
}
</script>