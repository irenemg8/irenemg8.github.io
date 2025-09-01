// Generador de audio mejorado con melodías para demostración
export class AudioGenerator {
  private audioContext: AudioContext | null = null
  private currentNodes: AudioNode[] = []
  private melodyInterval: NodeJS.Timeout | null = null
  private isPlaying: boolean = false
  private currentSongId: string = ''

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  // Melodías definidas para cada canción (notas en Hz)
  private getMelodyForSong(songId: string): number[] {
    const melodies = {
      '1': [440, 494, 523, 587, 523, 494, 440], // Reality - Escala ascendente y descendente
      '2': [523, 587, 659, 523, 659, 587, 523], // Call Me Maybe - Melodía pop alegre
      '3': [523, 659, 784, 659, 523, 440, 523], // Mr. Blue Sky - Melodía optimista
      '4': [587, 523, 659, 784, 659, 523, 587], // Dancing in the Moonlight - Ritmo de baile
      '5': [659, 784, 880, 784, 659, 587, 523], // Sugar - Melodía dulce
      '6': [440, 523, 659, 784, 659, 523, 440], // Blinding Lights - Synthwave
      '7': [784, 659, 523, 659, 784, 880, 784], // Levitating - Melodía flotante
      '8': [523, 659, 784, 880, 784, 659, 523], // Good 4 U - Melodía enérgica
      '9': [659, 587, 523, 494, 523, 587, 659], // As It Was - Melodía nostálgica
      '10': [880, 784, 659, 523, 659, 784, 880], // Stay - Melodía persistente
      '11': [523, 494, 440, 494, 523, 587, 523], // Anti-Hero - Melodía introspectiva
      '12': [659, 698, 784, 698, 659, 587, 523], // Bad Habit - Melodía adictiva
      '13': [523, 587, 659, 698, 784, 698, 659], // Flowers - Melodía que florece
      '14': [440, 494, 523, 440, 370, 440, 523], // Unholy - Melodía misteriosa
      '15': [587, 659, 698, 784, 698, 659, 587], // Something In The Way You Move
      '16': [698, 784, 880, 784, 698, 659, 587], // Watermelon Sugar - Melodía dulce
      '17': [523, 587, 659, 523, 659, 587, 523], // Heat Waves - Melodía ondulante
      '18': [880, 784, 659, 587, 523, 587, 659], // Circles - Melodía circular
      '19': [659, 698, 784, 880, 784, 698, 659], // Peaches - Melodía suave
      '20': [523, 659, 784, 880, 1047, 880, 784], // Perfect - Melodía perfecta
    }
    
    return melodies[songId as keyof typeof melodies] || [440, 494, 523, 587, 523, 494, 440]
  }

  // Crear una nota con envolvente ADSR más musical
  private createNote(frequency: number, duration: number, volume: number, startTime: number): void {
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      const filterNode = this.audioContext.createBiquadFilter()

      // Conectar nodos
      oscillator.connect(filterNode)
      filterNode.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Configurar oscilador con forma de onda más musical
      oscillator.type = 'triangle' // Sonido más suave que sine
      oscillator.frequency.setValueAtTime(frequency, startTime)

      // Configurar filtro para sonido más cálido
      filterNode.type = 'lowpass'
      filterNode.frequency.setValueAtTime(2000, startTime)
      filterNode.Q.setValueAtTime(1, startTime)

      // Envolvente ADSR para sonido más natural
      const attackTime = 0.1
      const decayTime = 0.2
      const sustainLevel = 0.6
      const releaseTime = 0.3

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(volume * 0.15, startTime + attackTime)
      gainNode.gain.linearRampToValueAtTime(volume * 0.15 * sustainLevel, startTime + attackTime + decayTime)
      gainNode.gain.setValueAtTime(volume * 0.15 * sustainLevel, startTime + duration - releaseTime)
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)

      this.currentNodes.push(oscillator)
      this.currentNodes.push(gainNode)
      this.currentNodes.push(filterNode)

      // Limpiar nodos después de que termine la nota
      setTimeout(() => {
        try {
          oscillator.disconnect()
          gainNode.disconnect()
          filterNode.disconnect()
        } catch (e) {
          // Ignorar errores de desconexión
        }
      }, (duration + 0.1) * 1000)
    } catch (error) {
      console.log('Error creando nota:', error)
    }
  }

  play(songId: string, volume: number = 0.1): void {
    if (!this.audioContext) return

    this.stop() // Detener cualquier audio anterior
    this.currentSongId = songId

    try {
      const melody = this.getMelodyForSong(songId)
      const noteDuration = 0.4 // Duración de cada nota en segundos
      const pauseDuration = 0.1 // Pausa entre notas
      let currentTime = this.audioContext.currentTime

      // Reproducir la melodía inicial
      melody.forEach((frequency, index) => {
        this.createNote(frequency, noteDuration, volume, currentTime)
        currentTime += noteDuration + pauseDuration
      })

      // Repetir la melodía cada 4 segundos
      this.melodyInterval = setInterval(() => {
        if (this.isPlaying && this.audioContext) {
          let repeatTime = this.audioContext.currentTime
          melody.forEach((frequency, index) => {
            this.createNote(frequency, noteDuration, volume, repeatTime)
            repeatTime += noteDuration + pauseDuration
          })
        }
      }, 4000)

      this.isPlaying = true
    } catch (error) {
      console.log('Audio no disponible en este navegador:', error)
    }
  }

  stop(): void {
    // Detener el intervalo de repetición de melodía
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval)
      this.melodyInterval = null
    }

    // Desconectar todos los nodos actuales
    this.currentNodes.forEach(node => {
      try {
        node.disconnect()
      } catch (error) {
        // Ignorar errores de desconexión
      }
    })
    this.currentNodes = []
    
    this.isPlaying = false
  }

  setVolume(volume: number): void {
    // El volumen se aplicará a las nuevas notas que se creen
    // Para las notas existentes, el volumen ya está establecido
    if (this.isPlaying && this.currentSongId) {
      // Reiniciar la canción con el nuevo volumen
      const songId = this.currentSongId
      this.stop()
      setTimeout(() => {
        this.play(songId, volume)
      }, 100)
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying
  }
}

let audioGenerator: AudioGenerator | null = null

export const getAudioGenerator = (): AudioGenerator => {
  if (!audioGenerator) {
    audioGenerator = new AudioGenerator()
  }
  return audioGenerator
}
