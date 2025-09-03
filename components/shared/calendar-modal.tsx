"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Cake, Calendar as CalendarIcon, BookOpen } from 'lucide-react'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

interface CalendarEvent {
  date: Date
  title: string
  type: 'birthday' | 'event' | 'reminder'
  description?: string
}

export function CalendarModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Función para verificar si una fecha es mi cumpleaños (8 de junio de cualquier año)
  const isBirthday = (date: Date) => {
    return date.getMonth() === 5 && date.getDate() === 8 // Junio es mes 5 (0-indexado)
  }

  // Función para verificar si una fecha es inicio de clases (8 de septiembre de cualquier año)
  const isBackToSchool = (date: Date) => {
    return date.getMonth() === 8 && date.getDate() === 8 // Septiembre es mes 8 (0-indexado)
  }

  // Función para calcular la edad en una fecha específica
  const calculateAge = (birthYear: number, currentDate: Date) => {
    const currentYear = currentDate.getFullYear()
    const birthMonth = 5 // Junio
    const birthDay = 8
    
    let age = currentYear - birthYear
    
    // Si aún no ha llegado el cumpleaños este año, restar 1
    if (currentDate.getMonth() < birthMonth || 
        (currentDate.getMonth() === birthMonth && currentDate.getDate() < birthDay)) {
      age--
    }
    
    return age
  }

  // Función para generar el evento de cumpleaños para una fecha específica
  const getBirthdayEvent = (date: Date): CalendarEvent => {
    // 🎂 PERSONALIZA AQUÍ: Cambia este año por tu año de nacimiento real
    const birthYear = 2004 // ← Modifica este año por el tuyo
    const age = calculateAge(birthYear, date)
    
    return {
      date: date,
      title: `Mi Cumpleaños 🎂`,
      type: "birthday" as const,
      description: `¡Cumpliendo ${age} años! Día especial para celebrar 🎉`
    }
  }

  // Función para generar el evento de inicio de clases para una fecha específica
  const getBackToSchoolEvent = (date: Date): CalendarEvent => {
    return {
      date: date,
      title: "Vuelvo a clase 📚",
      type: "event" as const,
      description: "¡Nuevo curso académico! Hora de aprender cosas nuevas 🎓"
    }
  }

  // Eventos para el año actual (para la lista de eventos destacados)
  const currentYear = new Date().getFullYear()
  const currentYearBirthday = getBirthdayEvent(new Date(currentYear, 5, 8))
  const currentYearBackToSchool = getBackToSchoolEvent(new Date(currentYear, 8, 8))
  const events: CalendarEvent[] = [currentYearBirthday, currentYearBackToSchool]

  // Función para verificar si una fecha tiene eventos
  const hasEvent = (date: Date) => {
    return isBirthday(date) || isBackToSchool(date)
  }

  // Función para obtener eventos de una fecha específica
  const getEventsForDate = (date: Date) => {
    const eventsForDate: CalendarEvent[] = []
    
    if (isBirthday(date)) {
      eventsForDate.push(getBirthdayEvent(date))
    }
    
    if (isBackToSchool(date)) {
      eventsForDate.push(getBackToSchoolEvent(date))
    }
    
    return eventsForDate
  }

  // Personalizar el estilo de los días con eventos usando una función personalizada
  const modifiers = {
    birthday: (date: Date) => isBirthday(date),
    event: (date: Date) => isBackToSchool(date),
  }

  const modifiersStyles = {
    birthday: {
      backgroundColor: '#ff69b4',
      color: 'white',
      borderRadius: '50%',
      fontWeight: 'bold',
    },
    event: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '50%',
    },
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="focus:outline-none opacity-0 pointer-events-none absolute"
          data-calendar-trigger
        >
          <CalendarIcon className="w-12 h-12 text-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 border border-border bg-gradient-to-b from-background to-muted/50 dark:from-slate-900 dark:to-black rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <VisuallyHidden.Root>
          <DialogTitle>Calendario Personal</DialogTitle>
        </VisuallyHidden.Root>
        
        {/* Barra superior estilo macOS */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 h-12 flex-shrink-0 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200"
                title="Cerrar"
              />
              <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-colors duration-200" title="Minimizar" />
              <div className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors duration-200" title="Maximizar" />
            </div>
          </div>
          <div className="text-foreground text-sm font-medium">
            Calendario Personal
          </div>
          <div className="w-16"></div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-full">
            
            {/* Calendario principal */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center h-full">
              <div className="bg-background dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-border w-full max-w-md h-fit">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
                  weekStartsOn={1}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  classNames={{
                    months: "flex flex-col space-y-4",
                    month: "space-y-4 w-full",
                    caption: "flex justify-center pt-1 relative items-center mb-4",
                    caption_label: "text-lg font-semibold text-foreground",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-accent rounded-md transition-colors",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex mb-2",
                    head_cell: "text-muted-foreground rounded-md w-10 font-medium text-sm flex-1 text-center",
                    row: "flex w-full mt-1",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                    day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground transition-colors rounded-md mx-auto",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground font-semibold",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-25",
                  }}
                />
              </div>
            </div>

            {/* Panel de eventos */}
            <div className="lg:col-span-1 flex flex-col h-full">
              <div className="bg-background dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-border h-full flex flex-col">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Eventos
                </h3>
                
                <div className="flex-1 flex flex-col">
                  {selectedEvents.length > 0 ? (
                    <div className="space-y-3 flex-shrink-0">
                      {selectedEvents.map((event, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            {event.type === 'birthday' && <Cake className="w-4 h-4 text-pink-500" />}
                            {event.type === 'event' && <BookOpen className="w-4 h-4 text-blue-500" />}
                            <Badge variant={event.type === 'birthday' ? 'default' : 'secondary'}>
                              {event.type === 'birthday' ? 'Cumpleaños' : 'Inicio de clases'}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 flex-shrink-0">
                      <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {selectedDate 
                          ? `No hay eventos para ${selectedDate.toLocaleDateString('es-ES')}`
                          : 'Selecciona una fecha para ver eventos'
                        }
                      </p>
                    </div>
                  )}

                  {/* Lista de todos los eventos próximos */}
                  <div className="flex-1 flex flex-col mt-6 pt-4 border-t border-border min-h-0">
                    <h4 className="font-medium text-foreground mb-3 flex-shrink-0">Eventos destacados</h4>
                    <div className="space-y-2 flex-1 overflow-y-auto">
                      {events.map((event, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors">
                          {event.type === 'birthday' && <Cake className="w-4 h-4 text-pink-500" />}
                          {event.type === 'event' && <BookOpen className="w-4 h-4 text-blue-500" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.date.toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}