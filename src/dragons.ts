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
      'https://static.wikia.nocookie.net/wingsoffire/images/2/2c/GloryTemplateSkyla.png/revision/latest/top-crop/width/200/height/200?cb=20210705133124',
    description: 'RainWing queen and former dragonet of destiny',
  },
  {
    id: 2,
    name: 'Peril',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/a/a0/Peril_GN_Cover.jpg/revision/latest/top-crop/width/200/height/200?cb=20240621022914',
    description: 'SkyWing with dangerous firescales',
  },
  {
    id: 3,
    name: 'Sunny',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/1/17/SE_box_set_Sunny.jpg/revision/latest/top-crop/width/200/height/200?cb=20250604225439',
    description: 'SandWing-NightWing hybrid and former dragonet of destiny',
  },
  {
    id: 4,
    name: 'Qibli',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/3/36/QibliTopShot.png/revision/latest/top-crop/width/200/height/200?cb=20251116195403',
    description: 'SandWing student at Jade Mountain Academy',
  },
  {
    id: 5,
    name: 'Winter',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/2/20/WinterTemplateSSE.png/revision/latest/top-crop/width/200/height/200?cb=20210528041430',
    description: 'IceWing prince and former student',
  },
  {
    id: 6,
    name: 'Moonwatcher',
    imageUrl:
      'https://static.wikia.nocookie.net/wingsoffire/images/4/4d/MoonwatcherTopShot.png/revision/latest/top-crop/width/200/height/200?cb=20210518165516',
    description: 'NightWing with mind-reading and prophetic powers',
  },
];
