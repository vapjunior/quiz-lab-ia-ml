<script setup>
defineProps({
  title: { type: String, required: true },
  phase: { type: String, required: true },
  roundKind: { type: String, required: true },
  answeredCount: { type: Number, required: true },
  roundTotal: { type: Number, required: true },
})
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner layout-width">
      <div class="site-header__identity">
        <img src="/quizlab.svg" width="38" height="38" alt="" />
        <span class="site-header__brand">QuizLab</span>
      </div>
      <p class="site-header__title" :title="title">
        {{
          roundKind === 'review' && phase !== 'intro'
            ? 'Revisão de erros'
            : 'Aprendizagem de Máquina'
        }}
      </p>
      <div v-if="roundTotal > 0 && phase !== 'intro' && phase !== 'error'" class="round-progress">
        <label for="round-progress">
          <strong>{{ answeredCount }} de {{ roundTotal }}</strong>
          <span>respondidas</span>
        </label>
        <progress id="round-progress" :value="answeredCount" :max="roundTotal" />
      </div>
    </div>
  </header>
</template>
