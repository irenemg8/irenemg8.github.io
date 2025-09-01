// Generador de audio simple para demostración
export class AudioGenerator {
  private audioContext: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private isPlaying: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  // Generar frecuencias únicas basadas en el ID de la canción
  private getFrequencyForSong(songId: string): number {
    const frequencies = {
      '1': 440,  // A4 - Reality
      '2': 493.88, // B4 - Call Me Maybe
      '3': 523.25, // C5 - Mr. Blue Sky
      '4': 587.33, // D5 - Dancing in the Moonlight
      '5': 659.25, // E5 - Sugar
      '6': 698.46, // F5 - Blinding Lights
      '7': 783.99, // G5 - Levitating
      '8': 880,    // A5 - Good 4 U
      '9': 987.77, // B5 - As It Was
      '10': 1046.50, // C6 - Stay
      '11': 1174.66, // D6 - Anti-Hero
      '12': 1318.51, // E6 - Bad Habit
      '13': 1396.91, // F6 - Flowers
      '14': 1567.98, // G6 - Unholy
      '15': 1760,    // A6 - Something In The Way You Move
      '16': 1975.53, // B6 - Watermelon Sugar
      '17': 2093,    // C7 - Heat Waves
      '18': 2349.32, // D7 - Circles
      '19': 2637.02, // E7 - Peaches
      '20': 2793.83, // F7 - Perfect
    }
    
    return frequencies[songId as keyof typeof frequencies] || 440
  }

  play(songId: string, volume: number = 0.1): void {
    if (!this.audioContext) return

    this.stop() // Detener cualquier audio anterior

    try {
      this.oscillator = this.audioContext.createOscillator()
      this.gainNode = this.audioContext.createGain()

      this.oscillator.connect(this.gainNode)
      this.gainNode.connect(this.audioContext.destination)

      this.oscillator.type = 'sine'
      this.oscillator.frequency.setValueAtTime(
        this.getFrequencyForSong(songId), 
        this.audioContext.currentTime
      )

      this.gainNode.gain.setValueAtTime(volume * 0.1, this.audioContext.currentTime)

      this.oscillator.start()
      this.isPlaying = true
    } catch (error) {
      console.log('Audio no disponible en este navegador')
    }
  }

  stop(): void {
    if (this.oscillator) {
      try {
        this.oscillator.stop()
        this.oscillator.disconnect()
      } catch (error) {
        // Ignorar errores al parar
      }
      this.oscillator = null
    }
    if (this.gainNode) {
      this.gainNode.disconnect()
      this.gainNode = null
    }
    this.isPlaying = false
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume * 0.1, this.audioContext?.currentTime || 0)
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
