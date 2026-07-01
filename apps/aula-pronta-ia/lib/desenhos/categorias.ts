export type Subcategoria = {
  label: string;
  emoji: string;
  promptEn: string;
};

export type Categoria = {
  id: string;
  label: string;
  emoji: string;
  gradiente: string;
  corBorda: string;
  corTexto: string;
  subcategorias: Subcategoria[];
};

export const CATEGORIAS: Categoria[] = [
  {
    id: "animais",
    label: "Animais",
    emoji: "🐶",
    gradiente: "from-amber-400 to-orange-500",
    corBorda: "border-amber-400",
    corTexto: "text-amber-700",
    subcategorias: [
      { label: "Domésticos", emoji: "🏠", promptEn: "cute domestic pet, friendly dog or cat or rabbit, sitting and smiling" },
      { label: "Silvestres", emoji: "🌿", promptEn: "wild animal, cute lion or elephant or giraffe or zebra in nature" },
      { label: "Fazenda", emoji: "🐄", promptEn: "farm animal, cute cow or pig or chicken or horse or sheep on a farm" },
      { label: "Marinhos", emoji: "🐟", promptEn: "sea animal, cute fish or dolphin or sea turtle or octopus underwater" },
      { label: "Insetos", emoji: "🦋", promptEn: "cute insect, butterfly or bee or ladybug or caterpillar on a flower" },
      { label: "Dinossauros", emoji: "🦕", promptEn: "cute friendly dinosaur, T-Rex or brachiosaurus or triceratops, cartoon style" },
      { label: "Filhotes", emoji: "🐣", promptEn: "baby animal, cute puppy or kitten or chick or bear cub, very fluffy and adorable" },
    ],
  },
  {
    id: "natureza",
    label: "Natureza",
    emoji: "🌿",
    gradiente: "from-green-400 to-emerald-500",
    corBorda: "border-green-400",
    corTexto: "text-green-700",
    subcategorias: [
      { label: "Árvores", emoji: "🌳", promptEn: "cute tree, oak or apple tree with fruit or palm tree or pine tree with big leaves" },
      { label: "Flores", emoji: "🌸", promptEn: "cute flower, sunflower or rose or daisy or tulip with stem and leaves" },
      { label: "Frutas", emoji: "🍓", promptEn: "cute fruit with face, apple or strawberry or banana or bunch of grapes smiling" },
      { label: "Legumes", emoji: "🥕", promptEn: "cute vegetable with face, carrot or pumpkin or corn or broccoli smiling" },
      { label: "Meio ambiente", emoji: "🌍", promptEn: "cute nature scene, smiling sun with clouds and rainbow, mountains, river and trees" },
    ],
  },
  {
    id: "cotidiano",
    label: "Cotidiano",
    emoji: "🚗",
    gradiente: "from-blue-400 to-indigo-500",
    corBorda: "border-blue-400",
    corTexto: "text-blue-700",
    subcategorias: [
      { label: "Profissões", emoji: "👨‍⚕️", promptEn: "cute cartoon child in uniform, doctor or teacher or firefighter or chef or police officer" },
      { label: "Transportes", emoji: "🚌", promptEn: "cute cartoon vehicle with face, school bus or car or airplane or boat or bicycle" },
      { label: "Escola", emoji: "🏫", promptEn: "cute school items with face, backpack or pencil or notebook or ruler or globe smiling" },
      { label: "Esportes", emoji: "⚽", promptEn: "cute cartoon child playing sport, soccer or basketball or swimming or gymnastics" },
    ],
  },
  {
    id: "datas",
    label: "Datas Comemorativas",
    emoji: "🎄",
    gradiente: "from-red-400 to-pink-500",
    corBorda: "border-red-400",
    corTexto: "text-red-700",
    subcategorias: [
      { label: "Natal", emoji: "🎅", promptEn: "Christmas scene, cute Santa Claus or decorated Christmas tree or reindeer or snowman with presents" },
      { label: "Páscoa", emoji: "🐰", promptEn: "Easter scene, cute Easter bunny with basket of colorful eggs or baby chick among flowers" },
      { label: "Festa Junina", emoji: "🎉", promptEn: "Brazilian June festival, cute children dancing around bonfire with colorful triangle flags" },
      { label: "Carnaval", emoji: "🎭", promptEn: "Brazilian carnival, cute character in colorful feathered costume with confetti and masks" },
      { label: "Dia das Mães", emoji: "💐", promptEn: "Mother's Day, cute cartoon mom and child hugging with flowers and hearts around them" },
      { label: "Dia dos Pais", emoji: "👨‍👧", promptEn: "Father's Day, cute cartoon dad and child playing together with hearts and smiles" },
    ],
  },
  {
    id: "educacao",
    label: "Educação",
    emoji: "📚",
    gradiente: "from-purple-400 to-violet-500",
    corBorda: "border-purple-400",
    corTexto: "text-purple-700",
    subcategorias: [
      { label: "Alfabeto", emoji: "🔤", promptEn: "single large alphabet block letter from A to Z, bubble letter style with cute decorations" },
      { label: "Vogais", emoji: "📝", promptEn: "vowel letter A E I O U, large decorative bubble letter with cute face or decorations" },
      { label: "Números", emoji: "🔢", promptEn: "single large cartoon number from 1 to 10, bubble number with cute face and decorations" },
      { label: "Formas geométricas", emoji: "⬛", promptEn: "geometric shape with cute smiling face, circle or square or triangle or rectangle or star" },
      { label: "Cores", emoji: "🎨", promptEn: "cute art supplies, crayons or paintbrush or color palette or rainbow with smiling face" },
      { label: "Corpo humano", emoji: "🧍", promptEn: "simple cute cartoon child body showing body parts, arms legs head hands feet with labels" },
      { label: "Emoções", emoji: "😊", promptEn: "cute round face showing emotion, happy or sad or angry or surprised or scared or excited" },
    ],
  },
];

export type FaixaEtaria = {
  value: string;
  label: string;
  desc: string;
  complexidade: string;
};

export const FAIXAS_ETARIAS: FaixaEtaria[] = [
  {
    value: "2-3",
    label: "2 a 3 anos",
    desc: "Traços muito simples e formas grandes",
    complexidade: "very simple outline, minimal details, very large shapes, single centered subject, extremely simple coloring book for toddlers",
  },
  {
    value: "4-5",
    label: "4 a 5 anos",
    desc: "Simples com poucos detalhes",
    complexidade: "simple outline, few details, large areas to color, friendly cute expression, preschool coloring book style",
  },
  {
    value: "6-7",
    label: "6 a 7 anos",
    desc: "Alguns detalhes, maior desafio",
    complexidade: "moderate detail, clear thick outlines, some interior details to color, elementary school coloring book quality",
  },
];

export const QUANTIDADES = [1, 4, 6, 10] as const;
export type Quantidade = (typeof QUANTIDADES)[number];
