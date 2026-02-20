export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  imageUrl?: string; // Múltiplas imagens separadas por |
  colors: Array<{
    name: string;
    hex: string;
  }>;
  sizes?: string[];
  specifications: {
    material: string;
    capacity?: string;
    dimensions?: string;
    features: string[];
  };
  price: string;
  line: 'traditional' | 'premium' | 'porcelain' | 'acrylic';
}

export const products: Product[] = [
  // LINHA TRADICIONAL - CANECAS DE ALUMÍNIO
  {
    id: 'caneca-tradicional',
    name: 'Caneca Tradicional + Tirantes',
    category: 'Canecas de Alumínio',
    description: 'Caneca cilíndrica clássica com gravação a laser e acompanhamento de tirantes personalizados.',
    image: 'https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-1_1770642782000_na1fn_Y2FuZWNhLWFsdW1pbmlvLXRyYWRpY2lvbmFs.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTFfMTc3MDY0Mjc4MjAwMF9uYTFmbl9ZMkZ1WldOaExXRnNkVzFwYm1sdkxYUnlZV1JwWTJsdmJtRnMucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=lSdpqD3QwtQ~VGbr59R2fgJK-g6YcA2QsXFAOZGRCfnWst6irSx6zsU5zxzYa~ztw2XutI6F~M3avK8QXC7P2VG5y-Ow0TKQJD1nU-2cUsTHce1AvwoLX~34LysY610POyt2jVGzl1KUVTpWq-y0Uf-Nye6gBMmknLyX21VoOWXLvyySniLNDhaYJpTUQ7WMnxAR7eCL6ZjXV61AABhF3YHZowZ9y4fraQavhMqHr6wxEDVV5bIh87LYeD9QxQ1hI5kd36SZ2Ud8yzpQz9HzEtjRG~CuGJd4hQzPTZwj-8D-UZT1TBVgDXv7LRfpCivwbdZ7JhAbhGTtf9dZN7E0kg__',
    colors: [
      { name: 'Vermelha', hex: '#FF4444' },
      { name: 'Azul', hex: '#0099FF' },
      { name: 'Preta', hex: '#1a1a1a' },
      { name: 'Branca', hex: '#FFFFFF' },
    ],
    specifications: {
      material: 'Alumínio',
      capacity: '500ml',
      features: ['Gravação a laser', 'Personalização sem limite de cores', 'Acompanha tirantes'],
    },
    price: 'Consultar',
    line: 'traditional',
  },
  {
    id: 'caneca-conica',
    name: 'Caneca Cônica + Tirantes',
    category: 'Canecas de Alumínio',
    description: 'Design afunilado moderno com gravação a laser e tirantes personalizados.',
    image: 'https://via.placeholder.com/400x400?text=Caneca+Cônica',
    colors: [
      { name: 'Vermelha', hex: '#FF4444' },
      { name: 'Amarela', hex: '#FFD700' },
      { name: 'Verde', hex: '#00CC00' },
      { name: 'Preta', hex: '#1a1a1a' },
    ],
    specifications: {
      material: 'Alumínio',
      capacity: '450ml',
      features: ['Design afunilado', 'Gravação a laser', 'Personalização sem limite de cores'],
    },
    price: 'Consultar',
    line: 'traditional',
  },
  {
    id: 'caneca-barril',
    name: 'Caneca Barril + Tirantes',
    category: 'Canecas de Alumínio',
    description: 'Formato robusto de barril com gravação a laser e tirantes personalizados.',
    image: 'https://via.placeholder.com/400x400?text=Caneca+Barril',
    colors: [
      { name: 'Vermelha', hex: '#FF4444' },
      { name: 'Preta', hex: '#1a1a1a' },
      { name: 'Azul', hex: '#0099FF' },
      { name: 'Branca', hex: '#FFFFFF' },
    ],
    specifications: {
      material: 'Alumínio',
      capacity: '600ml',
      features: ['Formato robusto', 'Gravação a laser', 'Personalização sem limite de cores'],
    },
    price: 'Consultar',
    line: 'traditional',
  },

  // LINHA PREMIUM - GARRAFAS TÉRMICAS
  {
    id: 'garrafa-inox-500ml',
    name: 'Garrafa Térmica em Aço Inox',
    category: 'Linha Premium',
    description: 'Garrafa térmica premium que mantém bebidas quentes por 12h e geladas por 24h. Gravação a laser.',
    image: 'https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-2_1770642782000_na1fn_Z2FycmFmYS10ZXJtaWNhLWlub3g.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTJfMTc3MDY0Mjc4MjAwMF9uYTFmbl9aMkZ5Y21GbVlTMTBaWEp0YVdOaExXbHViM2cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=bP9M~K3A9j~58sgWEUHT4fcm9RiDRetd4twqgD5JZkVta0viVorvF36gycExtnLYyr7sEOvKYZDNKTwlhfIw9qa1L7TGPlpTPQqKxXJRDnOQS1PDLjsKIEqP9Qzi6mgFxGnff8odEZ1TfPZGHtiJYR-cPaNDRQnLDyHj4a-c5ODLm2d37nqyvVo2rjxiZrsUtM8N5WyGwX1djO0vHweSriAFrurwQ0tMvu~96jTW32~cBC2UnMY4HZgFybZF9oL6UQmvHpD9rG0AGCc7VKpa1Wj0hMVm9iX6rPSHem7XVyjx56R5W2SVhmVNlqENJALHZlpwPi-QWoZlIpFlvkjNsA__',
    colors: [
      { name: 'Prata', hex: '#C0C0C0' },
      { name: 'Preta', hex: '#1a1a1a' },
      { name: 'Dourada', hex: '#FFD700' },
    ],
    sizes: ['500ml'],
    specifications: {
      material: 'Aço Inox',
      capacity: '500ml',
      features: ['Quente por 12h', 'Gelado por 24h', 'Gravação a laser', 'Tampa rosqueável'],
    },
    price: 'Consultar',
    line: 'premium',
  },
  {
    id: 'garrafa-500ml-copinhos',
    name: 'Garrafa Térmica 500ml + Copinhos',
    category: 'Linha Premium',
    description: 'Conjunto premium com garrafa térmica e 2 copinhos que funcionam como tampa. Cores disponíveis.',
    image: 'https://via.placeholder.com/400x400?text=Garrafa+500ml+Copinhos',
    colors: [
      { name: 'Cinza', hex: '#808080' },
      { name: 'Preto', hex: '#1a1a1a' },
      { name: 'Rosa', hex: '#FFB6C1' },
      { name: 'Prata', hex: '#C0C0C0' },
      { name: 'Azul', hex: '#0099FF' },
      { name: 'Verde', hex: '#00CC00' },
    ],
    sizes: ['500ml'],
    specifications: {
      material: 'Aço Inox',
      capacity: '500ml',
      features: ['Acompanha 2 copinhos', 'Copinhos funcionam como tampa', 'Gravação a laser', 'Isolamento térmico'],
    },
    price: 'Consultar',
    line: 'premium',
  },
  {
    id: 'garrafa-900ml-canudo',
    name: 'Garrafa Térmica 900ml + Canudo',
    category: 'Linha Premium',
    description: 'Garrafa térmica grande com canudo reutilizável. Perfeita para dias inteiros.',
    image: 'https://via.placeholder.com/400x400?text=Garrafa+900ml+Canudo',
    colors: [
      { name: 'Branco', hex: '#FFFFFF' },
      { name: 'Preto', hex: '#1a1a1a' },
      { name: 'Laranja', hex: '#FF8C00' },
      { name: 'Azul', hex: '#0099FF' },
      { name: 'Rosa', hex: '#FFB6C1' },
    ],
    sizes: ['900ml'],
    specifications: {
      material: 'Aço Inox',
      capacity: '900ml',
      features: ['Acompanha canudo reutilizável', 'Gravação a laser', 'Isolamento térmico duplo'],
    },
    price: 'Consultar',
    line: 'premium',
  },
  {
    id: 'copo-475ml-stanley',
    name: 'Copo Térmico 475ml + Tampa e Abridor',
    category: 'Linha Premium',
    description: 'Estilo Stanley com tampa e abridor integrado. Disponível em 8 cores.',
    image: 'https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-3_1770642786000_na1fn_Y29wby1zdGFubGV5LXByZW1pdW0.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTNfMTc3MDY0Mjc4NjAwMF9uYTFmbl9ZMjl3YnkxemRHRnViR1Y1TFhCeVpXMXBkVzAucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=p9x3S3-8WcxUoMgAQtxNE-u5WUv6C3Sxp6WXbFEjCVwi6BWqNMkwIIuobYbMfNnnM50fAVyM5s4POMgg0zdYHTk2mnEP5jGU59zLOoHkwuT3KzLM7KWW8Ut1AORoO~VICJ18QkcmG3R78K5F3u~kkd6rf6G3S0kRJKuM~QaPIYFNo0cVUg8DLis6xaRgIZky4rEU-UFVh47PPSiuMG6fgHSUqBR6K8SWm14-ZIlU7NbAnp7-r3Gh6lQ8E5r7R9X97pM5IPzQZ5C8b~0lpVNxzI7ESzYXqU0HdkUb4Ik9APl-1GW-hiCqwos8B9k7SLxUIRvpcFAtMmYbTTXVqjHOeA__',
    colors: [
      { name: 'Rosa Pink', hex: '#FF1493' },
      { name: 'Branco', hex: '#FFFFFF' },
      { name: 'Preto', hex: '#1a1a1a' },
      { name: 'Laranja', hex: '#FF8C00' },
      { name: 'Roxo', hex: '#9933FF' },
      { name: 'Verde', hex: '#00CC00' },
      { name: 'Azul', hex: '#0099FF' },
      { name: 'Rosa', hex: '#FFB6C1' },
    ],
    sizes: ['475ml'],
    specifications: {
      material: 'Aço Inox',
      capacity: '475ml',
      features: ['Tampa integrada', 'Abridor integrado', 'Gravação a laser', 'Isolamento térmico'],
    },
    price: 'Consultar',
    line: 'premium',
  },
  {
    id: 'copo-360-graus',
    name: 'Copo Térmico 360°',
    category: 'Linha Premium',
    description: 'Copo com gravação em 360°. Solte a imaginação e personalize toda a área útil.',
    image: 'https://via.placeholder.com/400x400?text=Copo+360',
    colors: [
      { name: 'Preto', hex: '#1a1a1a' },
      { name: 'Branco', hex: '#FFFFFF' },
      { name: 'Vermelho', hex: '#FF4444' },
      { name: 'Verde', hex: '#00CC00' },
    ],
    sizes: ['500ml'],
    specifications: {
      material: 'Aço Inox',
      capacity: '500ml',
      features: ['Gravação 360°', 'Personalização em toda a área', 'Isolamento térmico', 'Tampa de silicone'],
    },
    price: 'Consultar',
    line: 'premium',
  },

  // LINHA PREMIUM - FACAS E CANIVETES
  {
    id: 'faca-tatica',
    name: 'Faca Tática',
    category: 'Linha Premium',
    description: 'Faca tática com bainha, bússola, amolador e pederneira. Gravação a laser no cabo.',
    image: 'https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-5_1770642785000_na1fn_ZmFjYS10YXRpY2EtcHJlbWl1bQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTVfMTc3MDY0Mjc4NTAwMF9uYTFmbl9abUZqWVMxMFlYUnBZMkV0Y0hKbGJXbDFiUS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=R3TMHQ0vzAxUbew36jrhYMIgP6i7AJjCPpuon4fFpXUChyY~WFpDWx9B1Lg3kFbHuG4krtGYQNqfcgJI1DPREUEqS6lip-YZ~etea0SrK8NM0cUzlTTMQCz7WKZKzYyQIyU-Zs13OBpJsyq33rvFlspXXtuhxPBAtGq4W5bKSuSDZ5lgXUP1WnfaJK-m6DqVeBojouvRSA96KL0jwAh2ao624fqYOmepkeLytxf1u5DTUMzxk~rLXbWjYI~5fs1hfHcF7O-Uwk-qmBOsQ5mx-LRrTp7ILRlQD00cDULB73Z5ion6zYo7E6t40rbizDBASMD8wjD7B8jfjOnKzOJhpg__',
    colors: [
      { name: 'Preta', hex: '#1a1a1a' },
      { name: 'Cinza', hex: '#808080' },
    ],
    specifications: {
      material: 'Aço Inox / Polímero',
      features: ['Acompanha bainha', 'Bússola integrada', 'Amolador', 'Pederneira', 'Gravação a laser'],
    },
    price: 'Consultar',
    line: 'premium',
  },
  {
    id: 'canivete-bolso',
    name: 'Canivete de Bolso',
    category: 'Linha Premium',
    description: 'Canivete compacto com gravação a laser no cabo. Perfeito para chaveiro.',
    image: 'https://via.placeholder.com/400x400?text=Canivete+Bolso',
    colors: [
      { name: 'Preto', hex: '#1a1a1a' },
      { name: 'Marrom', hex: '#8B4513' },
    ],
    specifications: {
      material: 'Aço Inox / Madeira',
      features: ['Compacto', 'Gravação a laser', 'Múltiplas funções', 'Ideal para chaveiro'],
    },
    price: 'Consultar',
    line: 'premium',
  },

  // PORCELANAS
  {
    id: 'caneca-porcelana-branca',
    name: 'Caneca Branca de Porcelana 325ml',
    category: 'Porcelanas',
    description: 'Caneca de porcelana branca com personalização sem limitação de cores.',
    image: 'https://via.placeholder.com/400x400?text=Caneca+Porcelana+Branca',
    colors: [
      { name: 'Branco', hex: '#FFFFFF' },
    ],
    sizes: ['325ml'],
    specifications: {
      material: 'Porcelana',
      capacity: '325ml',
      features: ['Personalização sem limite de cores', 'Gravação profissional', 'Acabamento premium'],
    },
    price: 'Consultar',
    line: 'porcelain',
  },
  {
    id: 'caneca-magica-porcelana',
    name: 'Caneca Mágica de Porcelana 325ml',
    category: 'Porcelanas',
    description: 'Caneca que muda de cor com a temperatura. Arte aparece com mudança térmica.',
    image: 'https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-4_1770642783000_na1fn_Y2FuZWNhLXBvcmNlbGFuYS1tYWdpY2E.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTRfMTc3MDY0Mjc4MzAwMF9uYTFmbl9ZMkZ1WldOaExYQnZjbU5sYkdGdVlTMXRZV2RwWTJFLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=YXqThhWXZ9h0L6H0tXMcGh9P6If1vdbO45xJBWHhKhkWpOhiosTyy8-0YBygEhhFjAxH2QMwMOJME6hTGzZeh7HpXVRqA6FkO3ycyaVBk1BCR411RUuU-Pw2I9CJDjT1OkButh4w5P9GnBoXvAmgwrsZ4ICPkSVBD~qe7apctbb4wOMhgANKZtLPpq8xHDQuaOpIuaquuKCukL56WVPUF5BHGP-X5hmvgKVnDAPBeB6PQiNZx~1qZlvSpns3mJ9Zt~KGo1hCg9t0LtBVJUEPhdraMzbTI4CubbUz5H8TzAsC3W6YtIE-NPKrkKkCQh9dIrJzBCfEKL0APEdiI61F2g__',
    colors: [
      { name: 'Branco', hex: '#FFFFFF' },
    ],
    sizes: ['325ml'],
    specifications: {
      material: 'Porcelana',
      capacity: '325ml',
      features: ['Muda de cor com temperatura', 'Arte aparece com calor', 'Personalização criativa'],
    },
    price: 'Consultar',
    line: 'porcelain',
  },
  {
    id: 'caneca-tarja-branca',
    name: 'Caneca de Porcelana Tarja Branca 325ml',
    category: 'Porcelanas',
    description: 'Caneca com tarja branca na base. Maior destaque para arte feita com fundo preto.',
    image: 'https://via.placeholder.com/400x400?text=Caneca+Tarja+Branca',
    colors: [
      { name: 'Branco com Tarja', hex: '#FFFFFF' },
    ],
    sizes: ['325ml'],
    specifications: {
      material: 'Porcelana',
      capacity: '325ml',
      features: ['Tarja branca na base', 'Ideal para fundo preto', 'Contraste visual'],
    },
    price: 'Consultar',
    line: 'porcelain',
  },
  {
    id: 'torre-xicaras',
    name: 'Torre de Xícaras Porcelana 200ml',
    category: 'Porcelanas',
    description: 'Conjunto de 4 xícaras empilháveis com personalização individual.',
    image: 'https://via.placeholder.com/400x400?text=Torre+Xicaras',
    colors: [
      { name: 'Branco', hex: '#FFFFFF' },
    ],
    sizes: ['200ml cada'],
    specifications: {
      material: 'Porcelana',
      capacity: '200ml cada',
      features: ['4 xícaras empilháveis', 'Personalização individual', 'Acompanha suporte'],
    },
    price: 'Consultar',
    line: 'porcelain',
  },

  // VIDROS
  {
    id: 'caneca-chopp-vidro',
    name: 'Caneca de Chopp Vidro 340ml',
    category: 'Vidros',
    description: 'Caneca de vidro transparente para chopp ou bebidas. Gravação a laser.',
    image: 'https://via.placeholder.com/400x400?text=Caneca+Chopp+Vidro',
    colors: [
      { name: 'Transparente', hex: '#E8F4F8' },
    ],
    sizes: ['340ml'],
    specifications: {
      material: 'Vidro',
      capacity: '340ml',
      features: ['Transparente', 'Gravação a laser', 'Ideal para chopp'],
    },
    price: 'Consultar',
    line: 'porcelain',
  },
  {
    id: 'caneca-jateada-vidro',
    name: 'Caneca Jateada Vidro 340ml',
    category: 'Vidros',
    description: 'Caneca de vidro com acabamento jateado. Acompanha tampa e canudo.',
    image: 'https://via.placeholder.com/400x400?text=Caneca+Jateada',
    colors: [
      { name: 'Fosco', hex: '#D3D3D3' },
    ],
    sizes: ['340ml'],
    specifications: {
      material: 'Vidro',
      capacity: '340ml',
      features: ['Acabamento jateado', 'Acompanha tampa', 'Acompanha canudo', 'Gravação a laser'],
    },
    price: 'Consultar',
    line: 'porcelain',
  },
  {
    id: 'copo-vidro-parede-dupla',
    name: 'Copo de Vidro Parede Dupla 80ml',
    category: 'Vidros',
    description: 'Copo com parede dupla, perfeito para café ou chá. Caixa com 6 unidades.',
    image: 'https://via.placeholder.com/400x400?text=Copo+Parede+Dupla',
    colors: [
      { name: 'Transparente', hex: '#E8F4F8' },
    ],
    sizes: ['80ml'],
    specifications: {
      material: 'Vidro',
      capacity: '80ml',
      features: ['Parede dupla', 'Isolamento térmico', 'Caixa com 6 unidades', 'Gravação a laser'],
    },
    price: 'Consultar',
    line: 'porcelain',
  },
  {
    id: 'tacas-vidro',
    name: 'Taças de Vidro Personalizadas',
    category: 'Vidros',
    description: 'Taças de vidro em diversos modelos: Copo Americano, Taça Tulipa. Gravação a laser.',
    image: 'https://via.placeholder.com/400x400?text=Taças+Vidro',
    colors: [
      { name: 'Transparente', hex: '#E8F4F8' },
    ],
    specifications: {
      material: 'Vidro',
      features: ['Múltiplos modelos', 'Gravação a laser', 'Personalização criativa'],
    },
    price: 'Consultar',
    line: 'porcelain',
  },

  // ACRÍLICOS
  {
    id: 'caneca-acrilica',
    name: 'Caneca Acrílica',
    category: 'Acrílicos',
    description: 'Caneca em acrílico resistente e durável. Excelente opção de brinde.',
    image: 'https://via.placeholder.com/400x400?text=Caneca+Acrílica',
    colors: [
      { name: 'Branco', hex: '#FFFFFF' },
      { name: 'Preto', hex: '#1a1a1a' },
      { name: 'Azul', hex: '#0099FF' },
      { name: 'Vermelho', hex: '#FF4444' },
      { name: 'Verde', hex: '#00CC00' },
    ],
    sizes: ['300ml', '400ml', '500ml'],
    specifications: {
      material: 'Acrílico',
      capacity: '300ml a 500ml',
      features: ['Resistente e durável', 'Personalização sem limite de cores', 'Ideal para brindes'],
    },
    price: 'Consultar',
    line: 'acrylic',
  },

  // OUTROS PRODUTOS
  {
    id: 'caneca-chopp-vidro-340',
    name: 'Caneca de Chopp Vidro 340ml',
    category: 'Vidros',
    description: 'Caneca de vidro para chopp com gravação a laser. Capacidade 340ml.',
    image: 'https://via.placeholder.com/400x400?text=Caneca+Chopp+340',
    colors: [
      { name: 'Transparente', hex: '#E8F4F8' },
    ],
    sizes: ['340ml'],
    specifications: {
      material: 'Vidro',
      capacity: '340ml',
      features: ['Gravação a laser', 'Transparente', 'Ideal para chopp'],
    },
    price: 'Consultar',
    line: 'porcelain',
  },
];

export const categories = [
  'Canecas de Alumínio',
  'Linha Premium',
  'Porcelanas',
  'Vidros',
  'Acrílicos',
];
