import format from 'tinydate'

const Minute = 1000 /* s */ * 60 /* m */
const Hour = Minute * 60 /* h */
const Week = Hour * 24 /* d */ * 7 /* week */

export default function elapsed(date: string | Date | undefined): string {
  if (typeof date === 'undefined') {
    return ''
  }

  if (typeof date === 'string') {
    date = new Date(date)
  }

  let diff = new Date().getTime() - date.getTime()

  // if more than a week has elapsed
  if (diff > Week) {
    return format('on the {DD}/{MM}/{YYYY}')(date)
  }

  // if less than a minute has elapsed
  if (diff < Minute) {
    const seconds = Math.floor(diff / 1000)
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`
  }

  // if less than an hour has elapsed
  if (diff < Hour) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }

  diff /= 1000
  const hours = Math.floor(diff / 3600)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${
      hours > 1 ? 's' : ''
    } ago`
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }
}
