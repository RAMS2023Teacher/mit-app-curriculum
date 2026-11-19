import type { BadgeDef, Manifest, PartDef, UnlockRule } from './types'

/** Personal XP for each event. Tuned in a real class (Maker Lab); change with care. */
export const XP: Manifest['xp'] = { start: 10, step: 10, quiz: 30, perfect: 20, first: 10, bonus: 25, ship: 50, done: 50, badge: 25 }

/** 12 personal levels: a career ladder inside your company. */
export const LEVELS: Manifest['levels'] = [
  { min: 0, title: 'Intern' },
  { min: 100, title: 'Junior Dev' },
  { min: 250, title: 'App Builder' },
  { min: 450, title: 'Bug Hunter' },
  { min: 700, title: 'Block Wrangler' },
  { min: 1000, title: 'Screen Designer' },
  { min: 1350, title: 'Feature Lead' },
  { min: 1750, title: 'Senior Dev' },
  { min: 2200, title: 'Tech Lead' },
  { min: 2700, title: 'App Architect' },
  { min: 3250, title: 'Chief Tech Officer' },
  { min: 3850, title: 'Founder Legend' },
]

const CAPSTONES = ['games-capstone', 'media-capstone', 'tools-capstone']

export const BADGES: BadgeDef[] = [
  { id: 'first-steps', icon: '👣', name: 'First Steps', desc: 'Finish 5 build steps', rule: { type: 'steps', n: 5 } },
  { id: 'step-machine', icon: '⚙️', name: 'Step Machine', desc: 'Finish 50 build steps', rule: { type: 'steps', n: 50 } },
  { id: 'hello', icon: '📱', name: 'Hello, World!', desc: 'Complete Hello, App Inventor', rule: { type: 'lesson', id: 'core-hello' } },
  { id: 'warm', icon: '🔥', name: 'Warming Up', desc: 'Complete 3 lessons', rule: { type: 'lessons', n: 3 } },
  { id: 'roll', icon: '🎳', name: 'On a Roll', desc: 'Complete 7 lessons', rule: { type: 'lessons', n: 7 } },
  { id: 'quiz-whiz', icon: '🧠', name: 'Quiz Whiz', desc: 'Get a perfect quiz score', rule: { type: 'perfect', n: 1 } },
  { id: 'brainiac', icon: '💡', name: 'Brainiac', desc: 'Get 5 perfect quiz scores', rule: { type: 'perfect', n: 5 } },
  { id: 'sharpshooter', icon: '🎯', name: 'Sharpshooter', desc: 'Get 3 perfect quizzes on the first try', rule: { type: 'first', n: 3 } },
  { id: 'remix', icon: '🎨', name: 'Remix Artist', desc: 'Get a bonus quest approved', rule: { type: 'bonus', n: 1 } },
  { id: 'extra-mile', icon: '🏃', name: 'Extra Mile', desc: 'Get 3 bonus quests approved', rule: { type: 'bonus', n: 3 } },
  { id: 'shipped', icon: '🚀', name: 'Shipped It!', desc: 'Get your first build approved', rule: { type: 'shipped', n: 1 } },
  { id: 'release', icon: '📦', name: 'Release Manager', desc: 'Get 5 builds approved', rule: { type: 'shipped', n: 5 } },
  { id: 'team', icon: '🤝', name: 'Team Player', desc: 'Complete a lesson with a partner', rule: { type: 'team' } },
  { id: 'style', icon: '😎', name: 'Looking Sharp', desc: 'Customize your App Buddy', rule: { type: 'avatar' } },
  { id: 'capstone', icon: '🏆', name: 'Capstone Crusher', desc: 'Complete a capstone app', rule: { type: 'anyLesson', ids: CAPSTONES } },
  { id: 'launch', icon: '🎤', name: 'Launch Legend', desc: 'Complete Launch Day', rule: { type: 'lesson', id: 'launch-day' } },
  { id: 'master', icon: '🎓', name: 'Master Builder', desc: 'Complete Launch Day and the Solo Challenge', rule: { type: 'allLessons', ids: ['launch-day', 'solo-build'] } },
  { id: 'teacher', icon: '🍎', name: "Teacher's Pick", desc: 'Given by your teacher', rule: { type: 'gift', id: 'teacher' } },
]

export const SLOTS = ['body', 'color', 'eyes', 'mouth', 'top', 'extra', 'bg'] as const
export type Slot = (typeof SLOTS)[number]
export const SLOT_LABEL: Record<Slot, string> = { body: 'Body', color: 'Color', eyes: 'Eyes', mouth: 'Mouth', top: 'On top', extra: 'Extra', bg: 'Background' }

const free: UnlockRule = { type: 'none' }
const lvl = (n: number): UnlockRule => ({ type: 'level', n })
const cost = (n: number): UnlockRule => ({ type: 'cost', n })
const badge = (id: string): UnlockRule => ({ type: 'badge', id })
const P = (slot: Slot, id: string, name: string, rule: UnlockRule): PartDef => ({ slot, id, name, rule })

/** The first free part of each slot is the default. */
export const PARTS: PartDef[] = [
  P('body', 'phone', 'Phone', free),
  P('body', 'tablet', 'Tablet', free),
  P('body', 'round', 'Round bot', lvl(3)),
  P('body', 'watch', 'Smart watch', cost(120)),
  P('body', 'retro', 'Retro flip', lvl(7)),

  P('color', 'blue', 'Blue', free),
  P('color', 'green', 'Green', free),
  P('color', 'red', 'Red', free),
  P('color', 'purple', 'Purple', free),
  P('color', 'orange', 'Orange', lvl(2)),
  P('color', 'pink', 'Pink', lvl(2)),
  P('color', 'teal', 'Teal', cost(40)),
  P('color', 'midnight', 'Midnight', cost(80)),
  P('color', 'gold', 'Gold', cost(150)),
  P('color', 'rainbow', 'Rainbow', lvl(8)),

  P('eyes', 'dots', 'Dots', free),
  P('eyes', 'happy', 'Happy', free),
  P('eyes', 'big', 'Big eyes', free),
  P('eyes', 'wink', 'Wink', cost(40)),
  P('eyes', 'sleepy', 'Sleepy', cost(40)),
  P('eyes', 'shades', 'Shades', cost(60)),
  P('eyes', 'stars', 'Star eyes', lvl(4)),
  P('eyes', 'pixel', 'Pixel eyes', badge('quiz-whiz')),

  P('mouth', 'smile', 'Smile', free),
  P('mouth', 'grin', 'Big grin', free),
  P('mouth', 'oh', 'Oh!', free),
  P('mouth', 'tongue', 'Tongue out', cost(40)),
  P('mouth', 'stache', 'Moustache', cost(70)),
  P('mouth', 'zigzag', 'Zigzag', lvl(5)),

  P('top', 'none', 'Nothing', free),
  P('top', 'antenna', 'Antenna', free),
  P('top', 'bow', 'Bow', cost(50)),
  P('top', 'cap', 'Cap', cost(80)),
  P('top', 'party', 'Party hat', cost(60)),
  P('top', 'headphones', 'Headphones', cost(90)),
  P('top', 'propeller', 'Propeller hat', cost(100)),
  P('top', 'grad', 'Grad cap', badge('master')),
  P('top', 'crown', 'Crown', lvl(10)),

  P('extra', 'none', 'Nothing', free),
  P('extra', 'bowtie', 'Bow tie', cost(50)),
  P('extra', 'coffee', 'Hot cocoa', cost(60)),
  P('extra', 'wrench', 'Wrench', badge('first-steps')),
  P('extra', 'rocket', 'Rocket pack', badge('shipped')),
  P('extra', 'medal', 'Medal', badge('capstone')),
  P('extra', 'cape', 'Cape', lvl(6)),

  P('bg', 'plain', 'Plain', free),
  P('bg', 'sky', 'Sky', free),
  P('bg', 'grid', 'Blueprint', lvl(3)),
  P('bg', 'sunset', 'Sunset', cost(70)),
  P('bg', 'space', 'Space', cost(120)),
  P('bg', 'confetti', 'Confetti', badge('team')),
]

/** Power-ups are for the arcade (coming in a later update). Prices per level. */
export const POWERUPS: Manifest['powerups'] = {
  turbo: { name: 'Turbo', icon: '⚡', desc: 'Go faster', prices: [100, 200, 350] },
  shield: { name: 'Shield', icon: '🛡️', desc: 'Blocks one hit per level', prices: [120, 240, 400] },
  magnet: { name: 'Magnet', icon: '🧲', desc: 'Pulls pickups toward you', prices: [80, 160, 300] },
  rocket: { name: 'Rocket dash', icon: '🚀', desc: 'A boost at the start of each race', prices: [100, 200, 350] },
  overtime: { name: 'Overtime', icon: '⏱️', desc: '+5 seconds per level', prices: [150, 300] },
  grip: { name: 'Grip tires', icon: '🛞', desc: 'Less slowdown off the track', prices: [90, 180, 320] },
}
