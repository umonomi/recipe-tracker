import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SearchPage from '../views/SearchPage.vue'
import RecipeDetail from '../views/RecipeDetail.vue'
import AdminCategories from '../views/AdminCategories.vue'
import AdminIngredients from '../views/AdminIngredients.vue'
import AdminRecipes from '../views/AdminRecipes.vue'
import RecipeForm from '../views/RecipeForm.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'

// Проверка администратора
const requireAdmin = (to, from, next) => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  if (!token || !userStr) return next('/login')
  try {
    const user = JSON.parse(userStr)
    if (user.role === 'admin') return next()
    else return next('/login')
  } catch {
    return next('/login')
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Публичные маршруты
    { path: '/', name: 'home', component: HomePage },
    { path: '/search', name: 'search', component: SearchPage },
    { path: '/recipe/:id', name: 'recipe', component: RecipeDetail },
    
    // Аутентификация и профиль
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/profile', name: 'profile', component: Profile },

    // Форма рецепта (доступна всем авторизованным)
    { path: '/admin/recipes/new', name: 'recipe-form', component: RecipeForm },
    { path: '/admin/recipes/edit/:id', name: 'recipe-edit', component: RecipeForm },

    // Админские разделы (только для админов)
    { path: '/admin/recipes', name: 'admin-recipes', component: AdminRecipes, beforeEnter: requireAdmin },
    { path: '/admin/categories', name: 'admin-categories', component: AdminCategories, beforeEnter: requireAdmin },
    { path: '/admin/ingredients', name: 'admin-ingredients', component: AdminIngredients, beforeEnter: requireAdmin },
    
    // Перенаправление при неверном адресе
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router