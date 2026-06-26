import type { TeamMember } from './TeamMember.vue'

export const members: TeamMember[] = [
  {
    name: 'Firefly',
    login: 'FireflyF09',
    avatar: 'https://github.com/FireflyF09.png',
    role: '前端開發者',
    projects: [
      { text: 'HSNPhira 前端', url: 'http://phira.htadiy.com/' },
      { text: 'Phira-mp +', url: 'https://github.com/HyperSynapseNetwork/Phira-mp-plus' },
    ],
    links: [
      { icon: 'github', url: 'https://github.com/FireflyF09' },
    ],
  },
  {
    name: 'htadiy',
    login: 'htadiy',
    avatar: 'https://github.com/htadiy.png',
    role: '開發者 / 維運',
    projects: [
      { text: 'cpp-phira-mp', url: 'https://github.com/HyperSynapseNetwork/cpp-phira-mp' },
      { text: 'HSNBot', url: 'https://github.com/HyperSynapseNetwork/HSNBot' },
    ],
    links: [
      { icon: 'github', url: 'https://github.com/htadiy' },
      { icon: 'globe', url: 'http://blog.htadiy.com/' },
    ],
  },
  {
    name: 'ExplodingKonjac',
    login: 'ExplodingKonjac',
    avatar: 'https://github.com/ExplodingKonjac.png',
    role: '開發者',
    projects: [
      { text: 'phira-mp', url: 'https://github.com/HyperSynapseNetwork/phira-mp' },
      { text: 'phira-web-monitor', url: 'https://github.com/HyperSynapseNetwork/phira-web-monitor' },
    ],
    links: [
      { icon: 'github', url: 'https://github.com/ExplodingKonjac' },
    ],
  },
  {
    name: 'LY-Xiang',
    login: 'LY-Xiang',
    avatar: 'https://github.com/LY-Xiang.png',
    role: '開發者',
    projects: [
      { text: 'phira-mp-logprocessor', url: 'https://github.com/HyperSynapseNetwork/phira-mp-logprocessor' },
    ],
    links: [
      { icon: 'github', url: 'https://github.com/LY-Xiang' },
    ],
  },
]
