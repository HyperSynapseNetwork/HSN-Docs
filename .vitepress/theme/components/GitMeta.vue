<template>
  <div v-if="modifier || modTime" class="git-meta">
    <hr class="git-meta-divider" />
    <div class="git-meta-info">
      <span v-if="modifier" class="git-meta-item">
        <span class="git-meta-label">Last modified by</span>
        <span class="git-meta-value">{{ modifier }}</span>
      </span>
      <span v-if="modTime" class="git-meta-item">
        <span class="git-meta-label">on</span>
        <span class="git-meta-value">{{ modTime }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()

const modifier = frontmatter.value.lastModifier as string | undefined
const modTime  = frontmatter.value.lastModTime  as string | undefined
</script>

<style scoped>
.git-meta {
  margin-top: 3rem;
  padding-top: 0.5rem;
}

.git-meta-divider {
  border: none;
  border-top: 1px solid var(--vp-c-divider);
  margin-bottom: 0.75rem;
}

.git-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.git-meta-item {
  display: inline-flex;
  gap: 0.25rem;
}

.git-meta-label {
  opacity: 0.75;
}

.git-meta-value {
  font-weight: 500;
  color: var(--vp-c-text-1);
}
</style>
