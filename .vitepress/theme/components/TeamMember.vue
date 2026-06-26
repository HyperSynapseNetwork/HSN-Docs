<template>
  <div class="team-grid">
    <div
      v-for="m in members"
      :key="m.login"
      class="team-card"
    >
      <div class="card-glow"></div>

      <!-- Avatar -->
      <div class="card-avatar-wrap">
        <img
          class="card-avatar"
          :src="avatarUrl(m)"
          :alt="m.name"
          loading="lazy"
          @error="onImgError"
        />
      </div>

      <!-- Info -->
      <div class="card-body">
        <div class="card-name-row">
          <span class="card-name">{{ m.name }}</span>
          <a
            v-for="lk in m.links"
            :key="lk.url"
            :href="lk.url"
            class="card-link-icon"
            target="_blank"
            rel="noopener noreferrer"
            :title="lk.url"
          >
            <template v-if="lk.icon === 'github'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </template>
            <template v-else-if="lk.icon === 'globe'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </template>
          </a>
        </div>

        <div class="card-role">{{ m.role }}</div>

        <div class="card-projects">
          <span class="card-projects-label">项目</span>
          <div class="card-projects-list">
            <a
              v-for="p in m.projects"
              :key="p.url"
              :href="p.url"
              class="card-project-link"
              target="_blank"
              rel="noopener noreferrer"
            >{{ p.text }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ProjectLink {
  text: string
  url: string
}

export interface SocialLink {
  icon: 'github' | 'globe'
  url: string
}

export interface TeamMember {
  name: string
  login: string
  avatar: string
  role: string
  projects: ProjectLink[]
  links: SocialLink[]
}

defineProps<{
  members: TeamMember[]
}>()

function avatarUrl(m: TeamMember) {
  // Append s=160 for a reasonably sized avatar
  return m.avatar.includes('?') ? `${m.avatar}&s=160` : `${m.avatar}?s=160`
}

// Fallback on broken avatar images
function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  margin: 1.5rem 0;
}

/* ── Card ────────────────────────────────────────────── */
.team-card {
  position: relative;
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.3s, transform 0.2s;
  overflow: hidden;
}

.team-card:hover {
  border-color: rgba(0, 212, 255, 0.35);
  transform: translateY(-2px);
}

/* ── Glow ────────────────────────────────────────────── */
.card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s;
  background:
    radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(0, 212, 255, 0.06),
      transparent 60%);
}

.team-card:hover .card-glow {
  opacity: 1;
}

/* ── Avatar ──────────────────────────────────────────── */
.card-avatar-wrap {
  flex-shrink: 0;
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
}

.card-avatar-wrap::before {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.4), rgba(124, 58, 237, 0.4));
  z-index: 0;
  transition: opacity 0.3s;
}

.team-card:hover .card-avatar-wrap::before {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.7), rgba(124, 58, 237, 0.7));
}

.card-avatar {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  background: var(--vp-c-bg);
}

/* ── Body ────────────────────────────────────────────── */
.card-body {
  flex: 1;
  min-width: 0;
}

.card-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.card-link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}

.card-link-icon:hover {
  color: var(--vp-c-brand-1);
}

.card-role {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  margin-top: 0.125rem;
}

.card-projects {
  margin-top: 0.625rem;
}

.card-projects-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.25rem;
}

.card-projects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.card-project-link {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}

.card-project-link:hover {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  text-decoration: none;
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 640px) {
  .team-grid {
    grid-template-columns: 1fr;
  }

  .team-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .card-name-row {
    justify-content: center;
  }

  .card-projects-list {
    justify-content: center;
  }
}
</style>
