import assert from "node:assert/strict";
import { sanitizeSvg } from "../src/lib/svg.ts";

const cases: Array<[string, string, (out: string | null) => boolean]> = [
  [
    "script inline",
    `<svg viewBox="0 0 10 10"><script>alert(1)</script><circle cx="5" cy="5" r="4" fill="#A51C30"/></svg>`,
    (o) => !!o && !o.includes("script") && o.includes("circle"),
  ],
  [
    "handler onload",
    `<svg viewBox="0 0 10 10" onload="alert(1)"><rect width="10" height="10"/></svg>`,
    (o) => !!o && !o.toLowerCase().includes("onload"),
  ],
  [
    "handler dans un attribut avec > dans la valeur",
    `<svg viewBox="0 0 10 10"><path d="M0 0 L10 10" onclick="if(a>b)alert(1)" fill="#161A1D"/></svg>`,
    (o) => !!o && !o.includes("onclick") && o.includes("M0 0 L10 10"),
  ],
  [
    "foreignObject avec HTML",
    `<svg viewBox="0 0 10 10"><foreignObject><body><img src=x onerror=alert(1)></body></foreignObject><circle r="1"/></svg>`,
    (o) => !!o && !o.toLowerCase().includes("foreignobject") && !o.includes("onerror"),
  ],
  [
    "lien javascript:",
    `<svg viewBox="0 0 10 10"><a href="javascript:alert(1)"><text x="0" y="5">Hi</text></a></svg>`,
    (o) => !!o && !o.includes("javascript") && !o.includes("<a"),
  ],
  [
    "image externe",
    `<svg viewBox="0 0 10 10"><image href="https://evil.tld/x.png"/><rect width="2" height="2"/></svg>`,
    (o) => !!o && !o.includes("<image") && !o.includes("evil.tld"),
  ],
  [
    "url() externe dans un fill",
    `<svg viewBox="0 0 10 10"><rect width="10" height="10" fill="url(https://evil.tld/x)"/></svg>`,
    (o) => !!o && !o.includes("evil.tld"),
  ],
  [
    "url(#local) conservée",
    `<svg viewBox="0 0 10 10"><defs><linearGradient id="g"><stop offset="0" stop-color="#A51C30"/></linearGradient></defs><rect width="10" height="10" fill="url(#g)"/></svg>`,
    (o) => !!o && o.includes("url(#g)") && o.includes("linearGradient"),
  ],
  [
    "balises non fermées",
    `<svg viewBox="0 0 10 10"><g><circle cx="1" cy="1" r="1"/>`,
    (o) => !!o && o.endsWith("</svg>") && o.includes("</g>"),
  ],
  [
    "clôture markdown",
    "```svg\n<svg viewBox=\"0 0 10 10\"><rect width=\"5\" height=\"5\"/></svg>\n```",
    (o) => !!o && o.startsWith("<svg") && o.endsWith("</svg>"),
  ],
  [
    "viewBox préservé en casse exacte",
    `<svg viewbox="0 0 24 24"><rect width="1" height="1"/></svg>`,
    (o) => !!o && o.includes('viewBox="0 0 24 24"'),
  ],
  [
    "xmlns ajouté si absent",
    `<svg viewBox="0 0 10 10"><rect width="1" height="1"/></svg>`,
    (o) => !!o && o.includes('xmlns="http://www.w3.org/2000/svg"'),
  ],
  [
    "animate supprimé",
    `<svg viewBox="0 0 10 10"><rect width="1" height="1"><animate attributeName="x" to="5"/></rect></svg>`,
    (o) => !!o && !o.includes("animate"),
  ],
  ["entrée vide", "", (o) => o === null],
  ["texte sans svg", "Voici un logo, désolé.", (o) => o === null],
  [
    "texte injectant du markup",
    `<svg viewBox="0 0 10 10"><text x="0" y="5">A &lt; B &amp; C</text></svg>`,
    (o) => !!o && !o.includes("<b>"),
  ],
];

let failures = 0;
for (const [name, input, check] of cases) {
  const output = sanitizeSvg(input);
  const ok = check(output);
  if (!ok) {
    failures += 1;
    console.error(`✗ ${name}\n  →`, output);
  } else {
    console.log(`✓ ${name}`);
  }
}

assert.equal(failures, 0, `${failures} cas en échec`);
console.log(`\n${cases.length} cas passés.`);
