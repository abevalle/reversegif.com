import Head from 'next/head';
import styles from '../styles/Home.module.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Row, Col, Container } from 'react-bootstrap'
import DropZone from './DropZone.js';

export default function Home() {
  return (
    <div className={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet"/> 
        <DropZone></DropZone>
    </div>
  )
}
