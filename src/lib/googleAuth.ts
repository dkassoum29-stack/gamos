const URL_AUTORISATION = "https://accounts.google.com/o/oauth2/v2/auth";
const URL_JETON = "https://oauth2.googleapis.com/token";
const URL_INFOS_UTILISATEUR = "https://openidconnect.googleapis.com/v1/userinfo";

export function urlAutorisationGoogle(redirectUri: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  });
  return `${URL_AUTORISATION}?${params.toString()}`;
}

export async function profilDepuisCodeGoogle(
  code: string,
  redirectUri: string
): Promise<{ email: string; nom: string } | null> {
  const reponseJeton = await fetch(URL_JETON, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!reponseJeton.ok) return null;
  const jetons = (await reponseJeton.json()) as { access_token?: string };
  if (!jetons.access_token) return null;

  const reponseInfos = await fetch(URL_INFOS_UTILISATEUR, {
    headers: { Authorization: `Bearer ${jetons.access_token}` },
  });
  if (!reponseInfos.ok) return null;

  const infos = (await reponseInfos.json()) as {
    email?: string;
    email_verified?: boolean;
    name?: string;
  };
  if (!infos.email || !infos.email_verified) return null;

  return { email: infos.email, nom: infos.name ?? infos.email.split("@")[0] };
}
