import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays, addDays, isAfter } from "date-fns"
import { Plant } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWateringStatus(plant: Plant) {
  if (!plant.lastWatered) {
    return {
      status: 'unknown',
      message: 'Never watered',
      daysOverdue: 0,
      nextWateringDate: new Date(),
    }
  }

  const today = new Date()
  const lastWatered = new Date(plant.lastWatered)
  const nextWateringDate = addDays(lastWatered, plant.wateringFrequency)
  
  const daysUntilNextWatering = differenceInDays(nextWateringDate, today)
  const daysOverdue = daysUntilNextWatering < 0 ? Math.abs(daysUntilNextWatering) : 0
  
  if (daysOverdue > 0) {
    return {
      status: 'overdue',
      message: `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`,
      daysOverdue,
      nextWateringDate,
    }
  } else if (daysUntilNextWatering === 0) {
    return {
      status: 'due',
      message: 'Due today',
      daysOverdue: 0,
      nextWateringDate,
    }
  } else {
    return {
      status: 'ok',
      message: `Due in ${daysUntilNextWatering} day${daysUntilNextWatering !== 1 ? 's' : ''}`,
      daysOverdue: 0,
      nextWateringDate,
    }
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'overdue':
      return 'text-red-500'
    case 'due':
      return 'text-yellow-500'
    case 'ok':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}