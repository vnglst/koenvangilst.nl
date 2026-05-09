export function sluggify(str: string) {
  return str.trim().toLowerCase().split(' ').join('-');
}

export function desluggify(str: string) {
  return str.trim().split('-').join(' ');
}
