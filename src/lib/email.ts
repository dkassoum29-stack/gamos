import { Resend } from "resend";

export async function envoyerEmailReinitialisation(email: string, lien: string) {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    console.warn(
      "RESEND_API_KEY absente : email de réinitialisation non envoyé. Lien :",
      lien
    );
    return;
  }

  const resend = new Resend(cle);
  await resend.emails.send({
    from: "Gamos <onboarding@resend.dev>",
    to: email,
    subject: "Réinitialise ton mot de passe Gamos",
    html: `
      <p>Tu as demandé à réinitialiser ton mot de passe sur Gamos.</p>
      <p><a href="${lien}">Clique ici pour choisir un nouveau mot de passe</a></p>
      <p>Ce lien expire dans 1 heure. Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>
    `,
  });
}
