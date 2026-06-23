export const TANPURA_NOTES: Record<string, { file: string; frequency: string }> = {
  C: { file: '/tanpura/tanpura-c.mp3', frequency: '261.6 Hz' },
  'C#': { file: '/tanpura/tanpura-c-sharp.mp3', frequency: '277.2 Hz' },
  D: { file: '/tanpura/tanpura-d.mp3', frequency: '293.7 Hz' },
  'D#': { file: '/tanpura/tanpura-d-sharp.mp3', frequency: '311.1 Hz' },
  E: { file: '/tanpura/tanpura-e.mp3', frequency: '329.6 Hz' },
  F: { file: '/tanpura/tanpura-f.mp3', frequency: '349.2 Hz' },
  'F#': { file: '/tanpura/tanpura-f-sharp.mp3', frequency: '370.0 Hz' },
  G: { file: '/tanpura/tanpura-g.mp3', frequency: '392.0 Hz' },
  'G#': { file: '/tanpura/tanpura-g-sharp.mp3', frequency: '415.3 Hz' },
  A: { file: '/tanpura/tanpura-a.mp3', frequency: '440.0 Hz' },
  'A#': { file: '/tanpura/tanpura-a-sharp.mp3', frequency: '466.2 Hz' },
  B: { file: '/tanpura/tanpura-b.mp3', frequency: '493.9 Hz' },
}

export const TANPURA_NOTES_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const SWARA_NAMES: Record<string, string> = {
  C: 'Sa',
  'C#': 'Komal Re',
  D: 'Re',
  'D#': 'Komal Ga',
  E: 'Ga',
  F: 'Ma',
  'F#': 'Tivra Ma',
  G: 'Pa',
  'G#': 'Komal Dha',
  A: 'Dha',
  'A#': 'Komal Ni',
  B: 'Ni',
}

export const TANPURA_NOTES_GRID = [
  ['C', 'C#', 'D', 'D#'],
  ['E', 'F', 'F#', 'G'],
  ['G#', 'A', 'A#', 'B'],
]
