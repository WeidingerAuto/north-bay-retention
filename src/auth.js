import * as msal from '@azure/msal-browser';

const CLIENT_ID = 'b6276d2a-579e-477b-90a8-d4a25d1da9b9';
const TENANT_ID = 'a7909e90-bb02-46e4-8538-57cd8a2d66f9';
const TOKEN_SCOPES = ['openid', 'profile', 'User.Read'];

export const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'sessionStorage' },
});

export async function initAuth() {
  await msalInstance.initialize();
  const result = await msalInstance.handleRedirectPromise();
  if (result?.account) msalInstance.setActiveAccount(result.account);
  let account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];
  if (!account) {
    // Seamless entry from the portal: it passes the signed-in user's email as
    // ?login_hint=… so we can silently reuse the Entra session they already have
    // (no account picker). Falls back to a hinted redirect if the silent iframe
    // is blocked (3rd-party cookies) — still no picker thanks to the hint.
    const loginHint = new URLSearchParams(window.location.search).get('login_hint') || undefined;
    try {
      const silent = await msalInstance.ssoSilent({ scopes: TOKEN_SCOPES, loginHint });
      msalInstance.setActiveAccount(silent.account);
      account = silent.account;
    } catch {
      await msalInstance.loginRedirect({ scopes: TOKEN_SCOPES, loginHint });
      return false;
    }
  }
  if (!msalInstance.getActiveAccount()) msalInstance.setActiveAccount(account);
  return true;
}

export async function apiFetch(url, options = {}) {
  const account = msalInstance.getActiveAccount();
  const { accessToken } = await msalInstance.acquireTokenSilent({ scopes: TOKEN_SCOPES, account });
  return fetch(url, {
    ...options,
    headers: { ...options.headers, 'X-Access-Token': accessToken },
  });
}

export function getUserName() {
  const account = msalInstance.getActiveAccount();
  return account?.name || account?.username || '';
}

export function signOut() {
  // Full sign-out for a shared showroom machine. A hidden-iframe hop to Entra's
  // logout endpoint canNOT end the Entra SSO session: browsers withhold Entra's
  // cookies from a third-party iframe, so the request no-ops and the next
  // ssoSilent logs the same user right back in (the "sign-out does nothing" bug).
  // Only a TOP-LEVEL redirect to the logout endpoint clears the Entra session
  // cookie. logoutRedirect does exactly that (and clears MSAL's local cache
  // first); postLogoutRedirectUri is the registered app origin, so the browser
  // lands back on a fresh sign-in. No strand risk now that the origin is a
  // registered post-logout redirect URI.
  msalInstance.logoutRedirect({ postLogoutRedirectUri: window.location.origin + '/' });
}
