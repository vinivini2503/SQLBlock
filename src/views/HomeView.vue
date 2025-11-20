<template>
  <div class="container">
    <div class="logo-area">
      <img :src="logo" alt="Logo SQL Block" class="logo" />
      <h1>SQL BLOCK</h1>
      <p class="subtitle">Aprenda banco de dados usando blocos!</p>
    </div>

    <div class="buttons">
      <button class="btn enter" @click="goToLogin">
        <img :src="loginIcon" alt="Login" class="icon" />
        Entrar
      </button>

      <button class="btn register" @click="goToRegister">
        <img :src="accountIcon" alt="Cadastro" class="icon" />
        Cadastrar
      </button>

      <button class="btn try" @click="goToWorkspace">
        <img :src="playIcon" alt="Experimentar" class="icon" />
        Experimentar
      </button>
    </div>
  </div>
</template>

<script>
 import '../assets/css/home.css'
 import logo from '../assets/images/logo.png'
 import loginIcon from '../assets/images/login.png'
 import accountIcon from '../assets/images/account.png'
 import playIcon from '../assets/images/play.png'

 export default {
   name: 'HomePage',
   data () {
     return {
       logo,
       loginIcon,
       accountIcon,
       playIcon
     }
   },
   methods: {
     goToLogin () {
       this.$router.push('/login')
     },
     goToRegister () {
       this.$router.push('/register')
     },
     goToWorkspace () {
       this.$router.push('/workspace')
     }
   }
 }
</script>
