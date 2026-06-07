import { useState } from 'react'
import Navbar from '../components/Navbar'
import styles from './ShopPage.module.css'

const categorias = ['Todos', 'IoT', 'IA', 'Segurança', 'Hardware', 'DevOps']

const artigos = [
  {
    id: 1, titulo: 'Internet das Coisas: o futuro conectado', categoria: 'IoT',
    autor: 'Jackeline Martins', data: '20 Mai 2026',
    resumo: 'Entenda como dispositivos conectados estão transformando casas, cidades e indústrias inteiras ao redor do mundo.',
    imagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', destaque: true,
  },
  {
    id: 2, titulo: 'Inteligência Artificial no dia a dia', categoria: 'IA',
    autor: 'Tamires Martins', data: '15 Mai 2026',
    resumo: 'Como os algoritmos de machine learning estão presentes em produtos que usamos todo dia.',
    imagem: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80', destaque: false,
  },
  {
    id: 3, titulo: 'Segurança digital: proteja seus dados', categoria: 'Segurança',
    autor: 'Fernanda Oliveira', data: '10 Mai 2026',
    resumo: 'Dicas práticas para manter suas informações seguras na era da hiperconectividade.',
    imagem: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80', destaque: false,
  },
  {
    id: 4, titulo: 'Hardware 2026: os lançamentos do ano', categoria: 'Hardware',
    autor: 'Jackeline Martins', data: '05 Mai 2026',
    resumo: 'Os processadores, GPUs e periféricos mais esperados do ano e o que eles prometem.',
    imagem: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&q=80', destaque: false,
  },
  {
    id: 5, titulo: 'DevOps na prática: CI/CD do zero', categoria: 'DevOps',
    autor: 'Tamires Martins', data: '01 Mai 2026',
    resumo: 'Aprenda a montar uma esteira completa de integração e entrega contínua com GitHub Actions.',
    imagem: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&q=80', destaque: false,
  },
]

export default function ShopPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')

  const filtrados = categoriaAtiva === 'Todos'
    ? artigos
    : artigos.filter(a => a.categoria === categoriaAtiva)

  const destaque = filtrados.find(a => a.destaque) ?? filtrados[0]
  const demais = filtrados.filter(a => a.id !== destaque?.id)

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>✦ Blog de Tecnologia</span>
          <h1 className={styles.heroTitle}>Fique por dentro do mundo tech</h1>
          <p className={styles.heroSub}>IoT, IA, segurança, hardware e muito mais — por quem vive tecnologia.</p>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.filtros} role="group" aria-label="Filtrar por categoria">
          {categorias.map(cat => (
            <button
              key={cat}
              className={categoriaAtiva === cat ? styles.filtroBtnAtivo : styles.filtroBtn}
              onClick={() => setCategoriaAtiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {destaque && (
          <article className={styles.destaque}>
            <img src={destaque.imagem} alt={destaque.titulo} className={styles.destaqueImg} />
            <div className={styles.destaqueBody}>
              <span className={styles.categoria}>{destaque.categoria}</span>
              <h2 className={styles.destaqueTitle}>{destaque.titulo}</h2>
              <p className={styles.destaqueResumo}>{destaque.resumo}</p>
              <div className={styles.cardFooter}>
                <span className={styles.autor}>✍ {destaque.autor}</span>
                <span className={styles.data}>{destaque.data}</span>
              </div>
              <button className={styles.lerMaisBtn}>Ler artigo completo →</button>
            </div>
          </article>
        )}

        <div className={styles.grid}>
          {demais.map(artigo => (
            <article key={artigo.id} className={styles.card}>
              <img src={artigo.imagem} alt={artigo.titulo} className={styles.cardImg} />
              <div className={styles.cardBody}>
                <span className={styles.categoria}>{artigo.categoria}</span>
                <h2 className={styles.cardTitle}>{artigo.titulo}</h2>
                <p className={styles.cardResumo}>{artigo.resumo}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.autor}>✍ {artigo.autor}</span>
                  <span className={styles.data}>{artigo.data}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
