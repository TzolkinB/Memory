export interface Dragon {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

export const dragons: Dragon[] = [
  {
    id: 1,
    name: 'Glory',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/8/8a/GloryTopShot.png',
    description: 'RainWing queen and former dragonet of destiny',
  },
  {
    id: 2,
    name: 'Peril',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/4/4d/PerilTopShot.png',
    description: 'SkyWing with dangerous firescales',
  },
  {
    id: 3,
    name: 'Sunny',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/c/c3/SunnyTopShot.png',
    description: 'SandWing-NightWing hybrid and former dragonet of destiny',
  },
  {
    id: 4,
    name: 'Qibli',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/3/36/QibliTopShot.png',
    description: 'SandWing student at Jade Mountain Academy',
  },
  {
    id: 5,
    name: 'Winter',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/6/6b/WinterTopShot.png',
    description: 'IceWing prince and former student',
  },
  {
    id: 6,
    name: 'Tsunami',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/6/60/TsunamiTopShot.png',
    description: ' SeaWing and the main protagonist of The Lost Heir.',
  },
];
