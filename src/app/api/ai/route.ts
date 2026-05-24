import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { generate } from '@/lib/ai';

export async function POST(req: Request) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const { kind, payload } = await req.json();

  if (kind === 'review_reply') {
    const { author, stars, text } = payload;
    const fallback = stars >= 4
      ? `${author}様\n\nこの度は温かいお言葉をいただきありがとうございます。スタッフ一同とても嬉しく感じております。次回のご来店も心よりお待ちしております。`
      : `${author}様\n\n貴重なご意見をお寄せいただきありがとうございます。ご不便をおかけし申し訳ございませんでした。いただいたご意見を真摯に受け止め、改善に努めて参ります。`;
    const r = await generate({
      system: 'あなたはサロンの店長です。口コミへの返信を丁寧で誠実な日本語で書きます。星4以上は感謝中心、3以下は謝意と改善姿勢を示します。300字程度。',
      user: `口コミ: 「${text}」(${stars}星, ${author}様)\n適切な返信を書いてください。`,
      fallback,
    });
    return NextResponse.json(r);
  }

  if (kind === 'blog') {
    const { topic, tone, trait } = payload;
    const fallback =
`# ${topic}\n\nこんにちは、サロンスタッフです。今日は「${topic}」についてお話しします。\n\n## 背景\n季節やライフスタイルの変化で、お悩みが増えるタイミングがあります。${trait ? `当店（${trait}）でも、ご相談が増える時期です。` : ''}\n\n## ご自宅でできる対策\n1. 基本のケアを毎日続ける\n2. 製品は少量を必要な箇所に\n3. 睡眠前のリラックス習慣を持つ\n\n## サロンでできること\n専門メニューで内部から整え、表面の質感を引き上げます。気になる方はお気軽にご相談ください。`;
    const r = await generate({
      system: `あなたは美容サロンのブログライターです。トーン: ${tone}。見出し(##)入りの1000字程度の日本語記事を書きます。`,
      user: `テーマ:「${topic}」\nサロン特徴:「${trait || '特になし'}」\n読者は20-40代女性。最後に来店誘導の一文を入れてください。`,
      fallback,
      maxTokens: 1800,
    });
    return NextResponse.json(r);
  }

  if (kind === 'instagram') {
    const { desc, target, goal } = payload;
    const fallback = `${desc}に挑戦されたお客様。\n\n仕上がりに合わせて、ご自宅でのケアもアドバイスしました。\n気になる方はDMでお気軽にどうぞ。\n\n#${target} #ヘアスタイル #サロン #${goal}`;
    const r = await generate({
      system: 'あなたはサロンのInstagram運用担当です。改行を多めに、絵文字は控えめに、最後にハッシュタグを10個前後付けます。',
      user: `写真の内容: ${desc}\nターゲット: ${target}\n目的: ${goal}\nキャプションをハッシュタグ込みで日本語で作ってください。`,
      fallback,
    });
    return NextResponse.json(r);
  }

  return NextResponse.json({ error: 'unknown kind' }, { status: 400 });
}
