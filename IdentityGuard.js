// IdentityGuard.js
// Responsibility: Safe & respectful identity resolution

import { AppIdentity } from "./AppIdentity.js";

export function getSafeLoverName() {
  const name = AppIdentity?.loverName;

  if (typeof name === "string" && name.trim().length > 0) {
    return name.trim();
  }

  // ❗ कभी भी undefined / null नहीं बोलेगा
  return "प्रिय";
}

export function getSafeAppName() {
  const name = AppIdentity?.appName;

  if (typeof name === "string" && name.trim().length > 0) {
    return name.trim();
  }

  return "मैं";
}
