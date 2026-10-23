function randomSegment(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export function generateCertificateCode(projectTitle?: string) {
  const year = new Date().getFullYear();
  const slug = (projectTitle || "WKF")
    .replace(/[^A-Za-z0-9]+/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
  return `WKF-${year}-${slug}-${randomSegment(6)}`;
}

export function displayDonorName(name: string, isAnonymous: boolean) {
  if (!isAnonymous) return name;
  const parts = name.trim().split(/\s+/);
  const first = parts[0] || "Hamba";
  return `${first.charAt(0).toUpperCase()}*** (Anonim)`;
}
