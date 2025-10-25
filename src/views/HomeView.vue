<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-wrapper">
        <svg
          class="logo-icon"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
        <h1 class="title">SQL BLOCK</h1>
      </div>

      <p class="subtitle">Aprenda banco de dados usando blocos!</p>

      <div class="button-group">
        <button class="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          <span>Entrar</span>
        </button>

        <button class="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Cadastrar</span>
        </button>

        <button class="btn btn-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Experimente</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginScreen',
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
}

.login-box {
  text-align: center;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.logo-icon {
  color: #3b82f6;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
}

.subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin-top: 8px;
  margin-bottom: 40px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn-primary {
  background-color: #3b82f6;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-success {
  background-color: #10b981;
}

.btn-success:hover {
  background-color: #059669;
}
</style>
