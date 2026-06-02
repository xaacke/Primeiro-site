import Navbar from '../components/Navbar'
import styles from './CuriosidadesPage.module.css'

export default function CuriosidadesPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.titulo}>Curiosidades</h1>
        <p className={styles.sub}>Em breve — conteúdo em construção.</p>
      </main>
    </div>
  )
}
