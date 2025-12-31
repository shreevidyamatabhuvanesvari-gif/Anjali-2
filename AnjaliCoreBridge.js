// IdentityGuard.js
// Responsibility: Safe & respectful identity resolution

import { AppIdentity } from "./AppIdentity.js";

export function getSafeLoverName() {
  const name = AppIdentity?.loverName;
  if (typeof name === "string" && name.trim().length > 0) {
    return name.trim();
  }
  return "प्रिय"; // कभी undefined/null नहीं
}

export function getSafeAppName() {
  const name = AppIdentity?.appName;
  if (typeof name === "string" && name.trim().length > 0) {
    return name.trim();
  }
  return "मैं";
}
