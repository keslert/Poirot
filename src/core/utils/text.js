export function getTextString(obj) {
  return `${obj.fontFamily} ${getWeightString(obj.fontWeight)} ${obj.fontSize}`
}

export function getWeightString(weight) {
  switch(weight) {
    case 100:
    case '100':
      return 'Thin (100)'
    case 200:
    case '200':
      return 'Extra Light (200)'
    case 300:
    case '300':
      return 'Light (300)'
    case 400:
    case '400':
      return 'Regular (400)'
    case 500:
    case '500':
      return 'Medium (500)'
    case 600:
    case '600':
      return 'Semi Bold (600)'
    case 700:
    case '700':
      return 'Bold (700)'
    case 800:
    case '800':
      return 'Extra Bold (800)'
    case 900:
    case '900':
      return 'Black (900)'
    default:
      return 'Default (400)'
  }
}