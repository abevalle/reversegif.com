import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useEffect, useState } from 'react';
const ffmpeg = createFFmpeg({log: true})

export default function Reverse() {
    const [ready, setReady] = useState(false)

    const load = async () => {
        await ffmpeg.load()
        setReady(true)
    }

    useEffect(() => {
        load();
    }, [])
    
  return (
    <div>

    </div>
  )
}