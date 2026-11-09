export function getRank(accuracy) {
  if (accuracy >= 100) return 'X';
  if (accuracy >= 95) return 'S';
  if (accuracy >= 90) return 'A';
  if (accuracy >= 70) return 'B';
  return 'C';
}
