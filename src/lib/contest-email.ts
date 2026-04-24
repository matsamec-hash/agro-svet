// Resend wrapper with named template IDs. All emails go through sendContestEmail().
import { Resend } from 'resend';

const FROM = 'Fotosoutěž Agro-svět <fotosoutez@mail.agro-svet.cz>';
const BASE_URL = 'https://agro-svet.cz';

export type ContestEmailKind =
  | 'upload_pending'
  | 'upload_approved'
  | 'upload_rejected'
  | 'voting_started'
  | 'voting_ending'
  | 'winner_result'
  | 'finalist_notify'
  | 'magic_link';

interface BaseVars {
  to: string;
  display_name?: string;
}

interface MagicLinkVars extends BaseVars {
  verification_url: string;
  voting_ends_at: string;
  entry_title?: string;
  entry_author?: string;
}

interface UploadApprovedVars extends BaseVars {
  entry_title: string;
  share_url: string;
  round_title: string;
}

interface UploadRejectedVars extends BaseVars {
  entry_title: string;
  reason: string;
  round_title: string;
}

export type ContestEmailVars =
  | ({ kind: 'magic_link' } & MagicLinkVars)
  | ({ kind: 'upload_approved' } & UploadApprovedVars)
  | ({ kind: 'upload_rejected' } & UploadRejectedVars)
  | ({ kind: 'upload_pending' } & BaseVars & { entry_title: string })
  | ({ kind: 'voting_started' } & BaseVars & { round_title: string; entry_title: string; share_url: string })
  | ({ kind: 'voting_ending' } & BaseVars & { round_title: string; share_url: string })
  | ({ kind: 'winner_result' } & BaseVars & { round_title: string; placement: 1 | 2 | 3 | null; prize?: string })
  | ({ kind: 'finalist_notify' } & BaseVars & { round_title: string; placement: 1 | 2 | 3 });

interface Rendered {
  subject: string;
  html: string;
}

function render(vars: ContestEmailVars): Rendered {
  switch (vars.kind) {
    case 'magic_link':
      return {
        subject: 'Potvrďte svůj hlas ve Fotosoutěži Agro-svět',
        html: `
          <h1>Potvrzení hlasu</h1>
          <p>Ahoj${vars.display_name ? ' ' + vars.display_name : ''},</p>
          <p>kliknutím na tlačítko níže potvrdíte svůj hlas${vars.entry_title ? ` pro fotografii <strong>${vars.entry_title}</strong>` : ''}${vars.entry_author ? ` od ${vars.entry_author}` : ''}.</p>
          <p>Po ověření budete moci hlasovat <strong>1× za hodinu</strong> po celý zbytek kola (do ${vars.voting_ends_at}).</p>
          <p><a href="${vars.verification_url}" style="display:inline-block;background:#FFFF00;color:#000;padding:16px 32px;font-weight:bold;border-radius:10px;text-decoration:none">Potvrdit hlas</a></p>
          <p>Pokud jste o hlasování nežádali, email ignorujte.</p>
          <hr>
          <p style="font-size:12px;color:#666">Agro-svět, ${BASE_URL}</p>
        `,
      };
    case 'upload_pending':
      return {
        subject: 'Děkujeme za fotku — čeká na schválení',
        html: `<p>Ahoj ${vars.display_name ?? ''},</p>
          <p>děkujeme za nahrání fotky <strong>${vars.entry_title}</strong>. Náš admin ji zkontroluje a obvykle schválí do 24 hodin.</p>
          <p>Pošleme e-mail, jakmile bude fotka v galerii.</p>`,
      };
    case 'upload_approved':
      return {
        subject: `Vaše fotka "${vars.entry_title}" je schválena!`,
        html: `<p>Hurá! Vaše fotka je v galerii.</p>
          <p><a href="${vars.share_url}">${vars.share_url}</a></p>
          <p>Teď je čas sdílet s přáteli a získat co nejvíce hlasů 💪</p>`,
      };
    case 'upload_rejected':
      return {
        subject: 'Vaše fotka nebyla přijata',
        html: `<p>Omlouváme se, vaše fotka <strong>${vars.entry_title}</strong> nebyla přijata do ${vars.round_title}.</p>
          <p>Důvod: ${vars.reason}</p>
          <p>Můžete nahrát jinou fotku.</p>`,
      };
    case 'voting_started':
      return {
        subject: `Hlasování začalo — ${vars.round_title}`,
        html: `<p>Hlasovací fáze je otevřená. Sdílejte svůj odkaz pro získání hlasů:</p>
          <p><a href="${vars.share_url}">${vars.share_url}</a></p>`,
      };
    case 'voting_ending':
      return {
        subject: `Zbývá 24 hodin — ${vars.round_title}`,
        html: `<p>Hlasování končí za 24 h. Posledních pár hlasů dokáže zázraky — sdílejte:</p>
          <p><a href="${vars.share_url}">${vars.share_url}</a></p>`,
      };
    case 'winner_result': {
      const headline = vars.placement
        ? `Vyhráli jste ${vars.placement}. místo!`
        : 'Děkujeme za účast v soutěži';
      return {
        subject: `${vars.round_title} — výsledky`,
        html: `<h1>${headline}</h1>${vars.prize ? `<p>Výhra: ${vars.prize}</p>` : ''}`,
      };
    }
    case 'finalist_notify':
      return {
        subject: 'Postupujete do Grande Finále!',
        html: `<p>Gratulujeme — vaše fotka z ${vars.round_title} postoupila jako ${vars.placement}. místo do prosincového finále.</p>`,
      };
  }
}

export async function sendContestEmail(apiKey: string, vars: ContestEmailVars): Promise<void> {
  if (!apiKey) {
    console.warn('[contest-email] RESEND_API_KEY missing — skipping send', vars.kind, vars.to);
    return;
  }
  const resend = new Resend(apiKey);
  const { subject, html } = render(vars);
  const { error } = await resend.emails.send({
    from: FROM,
    to: vars.to,
    subject,
    html,
  });
  if (error) {
    console.error('[contest-email] send failed', vars.kind, vars.to, error);
    throw error;
  }
}
