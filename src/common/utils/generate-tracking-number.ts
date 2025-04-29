// utils/generate-tracking-number.ts

function getRandomLetter(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
}

export function generateTrackingNumber(): string {
  const letters = getRandomLetter() + getRandomLetter(); // 2 random letters
  const numbers = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0'); // 4-digit number, zero-padded
  return letters + numbers;
}
