import { drizzle } from "drizzle-orm/mysql2";
import { products } from "../drizzle/schema.ts";
import mysql from "mysql2/promise";

const productsData = [
  {
    name: "Caneca Tradicional + Tirantes",
    category: "Canecas de Alumínio",
    description: "Caneca cilíndrica clássica com gravação a laser e acompanhamento de tirantes personalizados.",
    price: "Consultar",
    stock: 100,
    imageUrl: "https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-1_1770642782000_na1fn_Y2FuZWNhLWFsdW1pbmlvLXRyYWRpY2lvbmFs.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTFfMTc3MDY0Mjc4MjAwMF9uYTFmbl9ZMkZ1WldOaExXRnNkVzFwYm1sdkxYUnlZV1JwWTJsdmJtRnMucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=lSdpqD3QwtQ~VGbr59R2fgJK-g6YcA2QsXFAOZGRCfnWst6irSx6zsU5zxzYa~ztw2XutI6F~M3avK8QXC7P2VG5y-Ow0TKQJD1nU-2cUsTHce1AvwoLX~34LysY610POyt2jVGzl1KUVTpWq-y0Uf-Nye6gBMmknLyX21VoOWXLvyySniLNDhaYJpTUQ7WMnxAR7eCL6ZjXV61AABhF3YHZowZ9y4fraQavhMqHr6wxEDVV5bIh87LYeD9QxQ1hI5kd36SZ2Ud8yzpQz9HzEtjRG~CuGJd4hQzPTZwj-8D-UZT1TBVgDXv7LRfpCivwbdZ7JhAbhGTtf9dZN7E0kg__",
    colors: JSON.stringify([
      { name: "Vermelha", hex: "#FF4444" },
      { name: "Azul", hex: "#0099FF" },
      { name: "Preta", hex: "#1a1a1a" },
      { name: "Branca", hex: "#FFFFFF" },
    ]),
    specifications: JSON.stringify({
      material: "Alumínio",
      capacity: "500ml",
      features: ["Gravação a laser", "Personalização sem limite de cores", "Acompanha tirantes"],
    }),
    status: "active",
  },
  {
    name: "Garrafa Térmica em Aço Inox",
    category: "Linha Premium",
    description: "Garrafa térmica premium que mantém bebidas quentes por 12h e geladas por 24h. Gravação a laser.",
    price: "Consultar",
    stock: 50,
    imageUrl: "https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-2_1770642782000_na1fn_Z2FycmFmYS10ZXJtaWNhLWlub3g.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTJfMTc3MDY0Mjc4MjAwMF9uYTFmbl9aMkZ5Y21GbVlTMTBaWEp0YVdOaExXbHViM2cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=bP9M~K3A9j~58sgWEUHT4fcm9RiDRetd4twqgD5JZkVta0viVorvF36gycExtnLYyr7sEOvKYZDNKTwlhfIw9qa1L7TGPlpTPQqKxXJRDnOQS1PDLjsKIEqP9Qzi6mgFxGnff8odEZ1TfPZGHtiJYR-cPaNDRQnLDyHj4a-c5ODLm2d37nqyvVo2rjxiZrsUtM8N5WyGwX1djO0vHweSriAFrurwQ0tMvu~96jTW32~cBC2UnMY4HZgFybZF9oL6UQmvHpD9rG0AGCc7VKpa1Wj0hMVm9iX6rPSHem7XVyjx56R5W2SVhmVNlqENJALHZlpwPi-QWoZlIpFlvkjNsA__",
    sizes: JSON.stringify(["500ml"]),
    colors: JSON.stringify([
      { name: "Prata", hex: "#C0C0C0" },
      { name: "Preta", hex: "#1a1a1a" },
      { name: "Dourada", hex: "#FFD700" },
    ]),
    specifications: JSON.stringify({
      material: "Aço Inox",
      capacity: "500ml",
      features: ["Quente por 12h", "Gelado por 24h", "Gravação a laser", "Tampa rosqueável"],
    }),
    status: "active",
  },
  {
    name: "Copo Térmico 475ml + Tampa e Abridor",
    category: "Linha Premium",
    description: "Estilo Stanley com tampa e abridor integrado. Disponível em 8 cores.",
    price: "Consultar",
    stock: 75,
    imageUrl: "https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-3_1770642786000_na1fn_Y29wby1zdGFubGV5LXByZW1pdW0.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTNfMTc3MDY0Mjc4NjAwMF9uYTFmbl9ZMjl3YnkxemRHRnViR1Y1TFhCeVpXMXBkVzAucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=p9x3S3-8WcxUoMgAQtxNE-u5WUv6C3Sxp6WXbFEjCVwi6BWqNMkwIIuobYbMfNnnM50fAVyM5s4POMgg0zdYHTk2mnEP5jGU59zLOoHkwuT3KzLM7KWW8Ut1AORoO~VICJ18QkcmG3R78K5F3u~kkd6rf6G3S0kRJKuM~QaPIYFNo0cVUg8DLis6xaRgIZky4rEU-UFVh47PPSiuMG6fgHSUqBR6K8SWm14-ZIlU7NbAnp7-r3Gh6lQ8E5r7R9X97pM5IPzQZ5C8b~0lpVNxzI7ESzYXqU0HdkUb4Ik9APl-1GW-hiCqwos8B9k7SLxUIRvpcFAtMmYbTTXVqjHOeA__",
    sizes: JSON.stringify(["475ml"]),
    colors: JSON.stringify([
      { name: "Rosa Pink", hex: "#FF1493" },
      { name: "Branco", hex: "#FFFFFF" },
      { name: "Preto", hex: "#1a1a1a" },
      { name: "Laranja", hex: "#FF8C00" },
      { name: "Roxo", hex: "#9933FF" },
      { name: "Verde", hex: "#00CC00" },
      { name: "Azul", hex: "#0099FF" },
      { name: "Rosa", hex: "#FFB6C1" },
    ]),
    specifications: JSON.stringify({
      material: "Aço Inox",
      capacity: "475ml",
      features: ["Tampa integrada", "Abridor integrado", "Gravação a laser", "Isolamento térmico"],
    }),
    status: "active",
  },
  {
    name: "Caneca Mágica de Porcelana 325ml",
    category: "Porcelanas",
    description: "Caneca que muda de cor com a temperatura. Arte aparece com mudança térmica.",
    price: "Consultar",
    stock: 40,
    imageUrl: "https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-4_1770642783000_na1fn_Y2FuZWNhLXBvcmNlbGFuYS1tYWdpY2E.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTRfMTc3MDY0Mjc4MzAwMF9uYTFmbl9ZMkZ1WldOaExYQnZjbU5sYkdGdVlTMXRZV2RwWTJFLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=YXqThhWXZ9h0L6H0tXMcGh9P6If1vdbO45xJBWHhKhkWpOhiosTyy8-0YBygEhhFjAxH2QMwMOJME6hTGzZeh7HpXVRqA6FkO3ycyaVBk1BCR411RUuU-Pw2I9CJDjT1OkButh4w5P9GnBoXvAmgwrsZ4ICPkSVBD~qe7apctbb4wOMhgANKZtLPpq8xHDQuaOpIuaquuKCukL56WVPUF5BHGP-X5hmvgKVnDAPBeB6PQiNZx~1qZlvSpns3mJ9Zt~KGo1hCg9t0LtBVJUEPhdraMzbTI4CubbUz5H8TzAsC3W6YtIE-NPKrkKkCQh9dIrJzBCfEKL0APEdiI61F2g__",
    sizes: JSON.stringify(["325ml"]),
    colors: JSON.stringify([
      { name: "Branco", hex: "#FFFFFF" },
    ]),
    specifications: JSON.stringify({
      material: "Porcelana",
      capacity: "325ml",
      features: ["Muda de cor com temperatura", "Arte aparece com calor", "Personalização criativa"],
    }),
    status: "active",
  },
  {
    name: "Faca Tática",
    category: "Linha Premium",
    description: "Faca tática com bainha, bússola, amolador e pederneira. Gravação a laser no cabo.",
    price: "Consultar",
    stock: 25,
    imageUrl: "https://private-us-east-1.manuscdn.com/sessionFile/qyVspyyysz6SOvt0TQI77v/sandbox/1gF0kbnxkfpSvUDH9rpLAL-img-5_1770642785000_na1fn_ZmFjYS10YXRpY2EtcHJlbWl1bQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcXlWc3B5eXlzejZTT3Z0MFRRSTc3di9zYW5kYm94LzFnRjBrYm54a2ZwU3ZVREg5cnBMQUwtaW1nLTVfMTc3MDY0Mjc4NTAwMF9uYTFmbl9abUZqWVMxMFlYUnBZMkV0Y0hKbGJXbDFiUS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=R3TMHQ0vzAxUbew36jrhYMIgP6i7AJjCPpuon4fFpXUChyY~WFpDWx9B1Lg3kFbHuG4krtGYQNqfcgJI1DPREUEqS6lip-YZ~etea0SrK8NM0cUzlTTMQCz7WKZKzYyQIyU-Zs13OBpJsyq33rvFlspXXtuhxPBAtGq4W5bKSuSDZ5lgXUP1WnfaJK-m6DqVeBojouvRSA96KL0jwAh2ao624fqYOmepkeLytxf1u5DTUMzxk~rLXbWjYI~5fs1hfHcF7O-Uwk-qmBOsQ5mx-LRrTp7ILRlQD00cDULB73Z5ion6zYo7E6t40rbizDBASMD8wjD7B8jfjOnKzOJhpg__",
    colors: JSON.stringify([
      { name: "Preta", hex: "#1a1a1a" },
      { name: "Cinza", hex: "#808080" },
    ]),
    specifications: JSON.stringify({
      material: "Aço Inox / Polímero",
      features: ["Acompanha bainha", "Bússola integrada", "Amolador", "Pederneira", "Gravação a laser"],
    }),
    status: "active",
  },
];

async function seedProducts() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);

    console.log("Iniciando migração de produtos...");
    
    for (const product of productsData) {
      await db.insert(products).values(product);
      console.log(`✓ Produto inserido: ${product.name}`);
    }

    console.log(`\n✅ ${productsData.length} produtos migrados com sucesso!`);
    await connection.end();
  } catch (error) {
    console.error("Erro ao migrar produtos:", error);
    process.exit(1);
  }
}

seedProducts();
