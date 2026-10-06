'use client';

import { useId, useState, type ReactNode } from 'react';
import type { Product, ProductShape } from '@/types';

/* ───────────── utilidades de color ───────────── */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}
function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
const tint = (hex: string, t: number) => mix(hex, '#ffffff', t);
const shade = (hex: string, t: number) => mix(hex, '#000000', t);

interface Ctx {
  c1: string;
  c2: string;
  dk: string;
  brand: string;
}

const W = '#ffffff';

/* Etiqueta con el nombre de la marca (va dentro del arte del envase) */
function Label({ x, y, w, h, ctx, rx = 6, bar = true }: { x: number; y: number; w: number; h: number; ctx: Ctx; rx?: number; bar?: boolean }) {
  const text = ctx.brand.toUpperCase().slice(0, 12);
  // el tamaño de letra se ajusta para que el nombre siempre quepa dentro de la etiqueta
  const fs = Math.min(8.5, (w - 8) / (text.length * 0.68));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={W} opacity={0.95} />
      <text x={x + w / 2} y={y + h / 2 + (bar ? 1 : 3)} textAnchor="middle" fontSize={fs} fontWeight={800} letterSpacing={0.3} fill={ctx.dk}>
        {text}
      </text>
      {bar && <rect x={x + w / 2 - 12} y={y + h / 2 + 7} width={24} height={2.5} rx={1.25} fill={ctx.c2} />}
    </g>
  );
}

const Shine = ({ x, y, h, w = 8 }: { x: number; y: number; h: number; w?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={W} opacity={0.28} />
);

/* ───────────── formas de producto (viewBox 240 x 240, base ≈ y 206) ───────────── */
const shapes: Record<ProductShape, (c: Ctx) => ReactNode> = {
  perfume: (c) => (
    <g>
      <rect x={76} y={96} width={88} height={110} rx={16} fill={c.c1} />
      <Shine x={84} y={106} h={90} w={9} />
      <Label x={98} y={134} w={56} h={42} ctx={c} rx={5} />
      <rect x={106} y={78} width={28} height={20} rx={3} fill={c.dk} />
      <rect x={96} y={44} width={48} height={38} rx={7} fill={c.c2} />
      <Shine x={102} y={50} h={26} w={6} />
    </g>
  ),
  pump: (c) => (
    <g>
      <rect x={84} y={100} width={72} height={106} rx={20} fill={c.c1} />
      <Shine x={91} y={110} h={86} />
      <Label x={92} y={130} w={56} h={52} ctx={c} rx={8} />
      <rect x={108} y={88} width={24} height={16} rx={3} fill={c.dk} />
      <rect x={114} y={62} width={12} height={16} rx={3} fill={c.dk} />
      <rect x={100} y={72} width={40} height={18} rx={5} fill={c.c2} />
      <rect x={128} y={76} width={26} height={9} rx={4.5} fill={c.c2} />
    </g>
  ),
  tube: (c) => (
    <g>
      <path d="M82 50 H158 L150 170 Q150 176 144 176 H96 Q90 176 90 170 Z" fill={c.c1} />
      <rect x={82} y={44} width={76} height={10} rx={2} fill={c.dk} />
      <path d="M86 98 H154 L152 128 H88 Z" fill={c.c2} />
      <text x={120} y={118} textAnchor="middle" fontSize={8.5} fontWeight={800} letterSpacing={0.5} fill={c.dk}>
        {c.brand.toUpperCase().slice(0, 11)}
      </text>
      <rect x={96} y={176} width={48} height={30} rx={6} fill={c.c2} />
      <Shine x={93} y={62} h={84} w={7} />
    </g>
  ),
  jar: (c) => (
    <g>
      <rect x={62} y={122} width={116} height={84} rx={16} fill={c.c1} />
      <Shine x={70} y={132} h={64} w={8} />
      <Label x={82} y={142} w={84} h={46} ctx={c} rx={8} />
      <rect x={58} y={96} width={124} height={32} rx={10} fill={c.c2} />
      <rect x={68} y={102} width={104} height={5} rx={2.5} fill={W} opacity={0.35} />
    </g>
  ),
  spray: (c) => (
    <g>
      <rect x={82} y={106} width={76} height={100} rx={16} fill={c.c1} />
      <path d="M90 106 L102 88 H138 L150 106 Z" fill={c.c1} />
      <Shine x={90} y={114} h={82} />
      <Label x={90} y={132} w={60} h={54} ctx={c} rx={8} />
      <rect x={106} y={76} width={28} height={14} fill={c.dk} />
      <rect x={94} y={56} width={56} height={24} rx={8} fill={c.c2} />
      <rect x={146} y={62} width={20} height={10} rx={4} fill={c.c2} />
      <path d="M96 72 Q78 74 78 92 Q88 84 100 86 Z" fill={c.dk} />
    </g>
  ),
  jug: (c) => (
    <g>
      <path d="M172 98 Q202 98 202 126 V150 Q202 172 176 172" fill="none" stroke={c.c1} strokeWidth={12} strokeLinecap="round" />
      <rect x={64} y={76} width={112} height={130} rx={20} fill={c.c1} />
      <Shine x={72} y={88} h={106} w={9} />
      <Label x={86} y={112} w={80} h={72} ctx={c} rx={10} />
      <rect x={92} y={50} width={56} height={30} rx={6} fill={c.c2} />
      <rect x={98} y={56} width={44} height={6} rx={3} fill={W} opacity={0.35} />
    </g>
  ),
  box: (c) => (
    <g>
      <path d="M168 70 L190 84 V194 L168 206 Z" fill={c.dk} />
      <path d="M56 70 L78 56 H190 L168 70 Z" fill={tint(c.c1, 0.3)} />
      <rect x={56} y={70} width={112} height={136} rx={6} fill={c.c1} />
      <rect x={56} y={108} width={112} height={46} fill={c.c2} />
      <text x={112} y={135} textAnchor="middle" fontSize={9.5} fontWeight={800} letterSpacing={0.6} fill={c.dk}>
        {c.brand.toUpperCase().slice(0, 11)}
      </text>
      <circle cx={112} cy={180} r={13} fill={W} opacity={0.9} />
      <path d="M106 180 l5 5 l9 -10" fill="none" stroke={c.c1} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Shine x={64} y={78} h={22} w={6} />
    </g>
  ),
  bag: (c) => (
    <g>
      <path d="M66 62 Q120 50 174 62 L184 196 Q120 212 56 196 Z" fill={c.c1} />
      <path d="M66 62 Q120 50 174 62 L175 78 Q120 66 65 78 Z" fill={c.dk} opacity={0.35} />
      {Array.from({ length: 11 }).map((_, i) => (
        <rect key={i} x={72 + i * 9.6} y={62 - Math.sin((i / 10) * Math.PI) * 6} width={2} height={14} fill={W} opacity={0.35} />
      ))}
      <path d="M60 128 Q90 112 120 128 T182 128 V166 Q150 150 120 166 T58 166 Z" fill={c.c2} />
      <ellipse cx={120} cy={146} rx={42} ry={25} fill={W} opacity={0.96} />
      <text x={120} y={150} textAnchor="middle" fontSize={9.5} fontWeight={800} letterSpacing={0.5} fill={c.dk}>
        {c.brand.toUpperCase().slice(0, 11)}
      </text>
      <Shine x={72} y={92} h={96} w={7} />
    </g>
  ),
  can: (c) => (
    <g>
      <rect x={86} y={70} width={68} height={134} rx={12} fill={c.c1} />
      <ellipse cx={120} cy={72} rx={34} ry={7} fill={tint(c.c1, 0.55)} />
      <ellipse cx={120} cy={71} rx={22} ry={4} fill={c.dk} />
      <rect x={86} y={118} width={68} height={46} fill={c.c2} />
      <text x={120} y={146} textAnchor="middle" fontSize={9.5} fontWeight={800} letterSpacing={0.5} fill={W}>
        {c.brand.toUpperCase().slice(0, 9)}
      </text>
      <Shine x={94} y={84} h={108} w={7} />
    </g>
  ),
  drink: (c) => (
    <g>
      <rect x={106} y={42} width={28} height={16} rx={4} fill={c.c2} />
      <path d="M108 58 H132 V76 Q154 84 154 106 V198 Q154 208 144 208 H96 Q86 208 86 198 V106 Q86 84 108 76 Z" fill={c.c1} />
      <Label x={86} y={124} w={68} h={54} ctx={c} rx={0} />
      <path d="M90 190 Q105 182 120 190 T154 190 V198 Q154 206 144 206 H96 Q90 206 90 198 Z" fill={W} opacity={0.25} />
      <Shine x={94} y={96} h={90} w={7} />
    </g>
  ),
  wine: (c) => (
    <g>
      <path d="M110 40 H130 V52 L128 64 V92 Q154 108 154 136 V200 Q154 208 146 208 H94 Q86 208 86 200 V136 Q86 108 112 92 V64 L110 52 Z" fill={c.c1} />
      <rect x={108} y={38} width={24} height={36} rx={3} fill={c.dk} />
      <rect x={94} y={142} width={52} height={54} rx={4} fill={c.c2} />
      <text x={120} y={166} textAnchor="middle" fontSize={7.5} fontWeight={800} letterSpacing={0.4} fill={c.dk}>
        {c.brand.toUpperCase().slice(0, 12)}
      </text>
      <rect x={104} y={174} width={32} height={2} fill={c.dk} opacity={0.5} />
      <rect x={110} y={181} width={20} height={2} fill={c.dk} opacity={0.35} />
      <Shine x={93} y={116} h={22} w={5} />
    </g>
  ),
  headphones: (c) => (
    <g>
      <path d="M64 146 V124 A56 56 0 0 1 176 124 V146" fill="none" stroke={c.dk} strokeWidth={15} strokeLinecap="round" />
      <path d="M64 146 V124 A56 56 0 0 1 176 124 V146" fill="none" stroke={c.c1} strokeWidth={8} strokeLinecap="round" />
      <rect x={46} y={128} width={44} height={74} rx={20} fill={c.c1} />
      <rect x={55} y={142} width={26} height={46} rx={13} fill={c.c2} />
      <rect x={150} y={128} width={44} height={74} rx={20} fill={c.c1} />
      <rect x={159} y={142} width={26} height={46} rx={13} fill={c.c2} />
      <Shine x={52} y={134} h={14} w={5} />
    </g>
  ),
  speaker: (c) => (
    <g>
      <path d="M84 86 Q120 38 156 86" fill="none" stroke={c.dk} strokeWidth={7} strokeLinecap="round" />
      <rect x={60} y={84} width={120} height={122} rx={28} fill={c.c1} />
      <circle cx={120} cy={152} r={42} fill={c.dk} />
      <circle cx={120} cy={152} r={33} fill="none" stroke={W} strokeOpacity={0.2} strokeWidth={2} />
      <circle cx={120} cy={152} r={23} fill="none" stroke={W} strokeOpacity={0.2} strokeWidth={2} />
      <circle cx={120} cy={152} r={11} fill={c.c2} />
      <circle cx={120} cy={106} r={7} fill={c.c2} />
      <Shine x={68} y={96} h={30} w={6} />
    </g>
  ),
  watch: (c) => (
    <g>
      <rect x={94} y={30} width={52} height={66} rx={14} fill={c.c2} />
      <rect x={94} y={146} width={52} height={66} rx={14} fill={c.c2} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={120} cy={164 + i * 14} r={2.6} fill={c.dk} opacity={0.5} />
      ))}
      <rect x={172} y={116} width={8} height={24} rx={3} fill={c.c1} />
      <rect x={66} y={78} width={108} height={108} rx={30} fill={c.dk} />
      <rect x={75} y={87} width={90} height={90} rx={24} fill="#0d0d1c" />
      <circle cx={120} cy={132} r={33} fill="none" stroke={c.c1} strokeWidth={5} strokeDasharray="150 60" strokeLinecap="round" />
      <text x={120} y={139} textAnchor="middle" fontSize={20} fontWeight={800} fill={W}>
        10:09
      </text>
    </g>
  ),
  mug: (c) => (
    <g>
      <path d="M156 118 Q198 118 198 150 Q198 184 154 182" fill="none" stroke={c.c1} strokeWidth={13} strokeLinecap="round" />
      <path d="M66 100 H156 V176 Q156 206 126 206 H96 Q66 206 66 176 Z" fill={c.c1} />
      <ellipse cx={111} cy={100} rx={45} ry={9} fill={tint(c.c1, 0.5)} />
      <ellipse cx={111} cy={101} rx={38} ry={6} fill={c.dk} />
      <rect x={66} y={140} width={90} height={32} fill={c.c2} opacity={0.9} />
      <text x={111} y={161} textAnchor="middle" fontSize={9} fontWeight={800} letterSpacing={0.5} fill={c.dk}>
        {c.brand.toUpperCase().slice(0, 10)}
      </text>
      <path d="M92 82 q-8 -12 0 -24 M112 82 q-8 -12 0 -24 M132 82 q-8 -12 0 -24" fill="none" stroke={c.c2} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <Shine x={74} y={112} h={26} w={6} />
    </g>
  ),
  lamp: (c) => (
    <g>
      <path d="M76 58 H164 L186 126 H54 Z" fill={c.c2} />
      <path d="M76 58 H164 L168 70 H72 Z" fill={W} opacity={0.4} />
      <rect x={116} y={126} width={8} height={66} rx={4} fill={c.dk} />
      <ellipse cx={120} cy={198} rx={40} ry={9} fill={c.dk} />
      <ellipse cx={120} cy={194} rx={36} ry={8} fill={c.c1} />
    </g>
  ),
  blocks: (c) => {
    const third = '#ffcf3a';
    const stud = (x: number, y: number, col: string) => <rect key={`${x}-${y}`} x={x} y={y} width={20} height={9} rx={3} fill={col} />;
    return (
      <g>
        <rect x={56} y={142} width={74} height={64} rx={8} fill={c.c1} />
        {stud(66, 134, c.c1)}
        {stud(98, 134, c.c1)}
        <rect x={122} y={152} width={66} height={54} rx={8} fill={c.c2} />
        {stud(132, 144, c.c2)}
        {stud(158, 144, c.c2)}
        <rect x={80} y={86} width={66} height={58} rx={8} fill={third} />
        {stud(90, 78, third)}
        {stud(116, 78, third)}
        <Shine x={64} y={150} h={24} w={6} />
      </g>
    );
  },
  powerbank: (c) => (
    <g>
      <rect x={70} y={58} width={100} height={148} rx={18} fill={c.c1} />
      <rect x={80} y={70} width={80} height={72} rx={10} fill={c.dk} opacity={0.45} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={89 + i * 18} y={80} width={12} height={6} rx={3} fill={c.c2} />
      ))}
      <path d="M124 100 l-14 22 h12 l-4 18 l18 -26 h-12 l6 -14 z" fill={c.c2} />
      <text x={120} y={170} textAnchor="middle" fontSize={9} fontWeight={800} letterSpacing={0.6} fill={W}>
        {c.brand.toUpperCase().slice(0, 10)}
      </text>
      <text x={120} y={184} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={W} opacity={0.75}>
        20000 mAh
      </text>
      <rect x={106} y={194} width={28} height={6} rx={3} fill={c.dk} />
      <Shine x={77} y={70} h={110} w={5} />
    </g>
  ),
  bowl: (c) => (
    <g>
      <rect x={84} y={198} width={72} height={8} rx={4} fill={c.dk} />
      <path d="M52 124 H188 Q184 192 120 200 Q56 192 52 124 Z" fill={c.c1} />
      <ellipse cx={120} cy={124} rx={68} ry={12} fill={c.c2} />
      <ellipse cx={120} cy={125} rx={60} ry={8} fill={c.dk} opacity={0.55} />
      <path d="M70 122 Q90 96 120 102 Q150 96 170 122 Z" fill="#b8743a" />
      {[[96, 110], [118, 104], [142, 110], [108, 116], [132, 116]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4} fill="#d99a58" />
      ))}
      <Label x={94} y={150} w={52} h={26} ctx={c} rx={6} bar={false} />
    </g>
  ),
  lipstick: (c) => (
    <g>
      <path d="M104 104 V70 Q104 58 122 52 L136 48 V104 Z" fill={c.c1} />
      <rect x={100} y={100} width={40} height={30} rx={4} fill={c.dk} />
      <rect x={96} y={128} width={48} height={78} rx={6} fill={c.c2} />
      <rect x={96} y={124} width={48} height={10} rx={3} fill={tint(c.c2, 0.45)} />
      <text x={0} y={0} transform="translate(124 192) rotate(-90)" fontSize={8} fontWeight={800} letterSpacing={0.8} fill={W}>
        {c.brand.toUpperCase().slice(0, 10)}
      </text>
      <Shine x={102} y={142} h={50} w={5} />
    </g>
  ),
  compact: (c) => {
    const pans = [c.c1, tint(c.c1, 0.35), shade(c.c1, 0.25), '#ffcf3a', '#fb4b32', '#7b45f5'];
    return (
      <g>
        <rect x={52} y={84} width={136} height={118} rx={18} fill={c.c2} />
        <rect x={52} y={84} width={136} height={14} rx={7} fill={c.dk} opacity={0.5} />
        {pans.map((col, i) => (
          <rect key={i} x={64 + (i % 3) * 42} y={108 + Math.floor(i / 3) * 38} width={34} height={30} rx={8} fill={col} />
        ))}
        <text x={120} y={192} textAnchor="middle" fontSize={8.5} fontWeight={800} letterSpacing={0.6} fill={W}>
          {c.brand.toUpperCase().slice(0, 10)}
        </text>
      </g>
    );
  },
  plush: (c) => (
    <g>
      <circle cx={88} cy={72} r={17} fill={c.c1} />
      <circle cx={152} cy={72} r={17} fill={c.c1} />
      <circle cx={88} cy={72} r={9} fill={c.c2} />
      <circle cx={152} cy={72} r={9} fill={c.c2} />
      <ellipse cx={76} cy={160} rx={14} ry={27} transform="rotate(20 76 160)" fill={c.c1} />
      <ellipse cx={164} cy={160} rx={14} ry={27} transform="rotate(-20 164 160)" fill={c.c1} />
      <ellipse cx={120} cy={168} rx={46} ry={42} fill={c.c1} />
      <ellipse cx={120} cy={176} rx={28} ry={29} fill={c.c2} />
      <ellipse cx={98} cy={206} rx={19} ry={10} fill={c.c1} />
      <ellipse cx={142} cy={206} rx={19} ry={10} fill={c.c1} />
      <circle cx={120} cy={98} r={42} fill={c.c1} />
      <ellipse cx={120} cy={112} rx={19} ry={14} fill={c.c2} />
      <ellipse cx={120} cy={106} rx={7} ry={5} fill={c.dk} />
      <circle cx={104} cy={90} r={4} fill={c.dk} />
      <circle cx={136} cy={90} r={4} fill={c.dk} />
      <path d="M104 140 l16 8 l16 -8 v16 l-16 -8 l-16 8 z" fill="#fb4b32" />
    </g>
  ),
  pillow: (c) => (
    <g>
      <path d="M52 120 Q52 94 84 92 Q120 84 156 92 Q188 94 188 120 V172 Q188 200 156 204 Q120 212 84 204 Q52 200 52 172 Z" fill={c.c1} />
      <path d="M64 122 Q120 110 176 122" fill="none" stroke={W} strokeOpacity={0.35} strokeWidth={3} />
      <ellipse cx={100} cy={112} rx={30} ry={8} fill={W} opacity={0.25} />
      <Label x={94} y={148} w={52} h={28} ctx={c} rx={6} bar={false} />
    </g>
  ),
  pot: (c) => (
    <g>
      <rect x={44} y={128} width={24} height={10} rx={5} fill={c.dk} />
      <rect x={172} y={128} width={24} height={10} rx={5} fill={c.dk} />
      <rect x={62} y={112} width={116} height={90} rx={14} fill={c.c1} />
      <Label x={62} y={148} w={116} h={30} ctx={c} rx={0} bar={false} />
      <path d="M56 112 Q56 84 120 82 Q184 84 184 112 Z" fill={c.c2} />
      <rect x={112} y={70} width={16} height={14} rx={3} fill={c.dk} />
      <circle cx={120} cy={70} r={9} fill={c.dk} />
      <Shine x={72} y={118} h={26} w={6} />
    </g>
  ),
  rolls: (c) => {
    const roll = (cx: number, y0: number, h: number, key: string) => (
      <g key={key}>
        <ellipse cx={cx} cy={y0 + h} rx={24} ry={9} fill="#e9e6f2" />
        <rect x={cx - 24} y={y0} width={48} height={h} fill={W} />
        <rect x={cx - 24} y={y0 + h * 0.42} width={48} height={h * 0.22} fill={c.c1} />
        <ellipse cx={cx} cy={y0} rx={24} ry={9} fill={W} stroke="#e1deee" strokeWidth={1.5} />
        <ellipse cx={cx} cy={y0} rx={9} ry={3.6} fill="#cfcbe0" />
      </g>
    );
    return (
      <g>
        {roll(96, 82, 60, 'b1')}
        {roll(144, 82, 60, 'b2')}
        {roll(72, 138, 62, 'f1')}
        {roll(120, 138, 62, 'f2')}
        {roll(168, 138, 62, 'f3')}
        <text x={120} y={178} textAnchor="middle" fontSize={7.5} fontWeight={800} letterSpacing={0.4} fill={W}>
          {c.brand.toUpperCase().slice(0, 8)}
        </text>
      </g>
    );
  },
  sheets: (c) => (
    <g>
      <rect x={54} y={152} width={132} height={46} rx={10} fill={c.c1} />
      <rect x={60} y={120} width={120} height={44} rx={10} fill={tint(c.c1, 0.4)} />
      <rect x={66} y={90} width={108} height={42} rx={10} fill={tint(c.c1, 0.7)} />
      <rect x={54} y={176} width={132} height={4} fill={W} opacity={0.4} />
      <rect x={60} y={146} width={120} height={4} fill={W} opacity={0.4} />
      <rect x={108} y={84} width={24} height={118} fill={c.c2} opacity={0.9} />
      <Label x={86} y={140} w={68} h={26} ctx={c} rx={5} bar={false} />
    </g>
  ),
  mouse: (c) => (
    <g>
      <path d="M120 54 C160 54 178 96 178 140 C178 182 154 206 120 206 C86 206 62 182 62 140 C62 96 80 54 120 54 Z" fill={c.c1} />
      <path d="M120 56 V116" stroke={c.dk} strokeWidth={3} strokeLinecap="round" />
      <path d="M64 118 Q120 130 176 118" fill="none" stroke={c.dk} strokeWidth={3} opacity={0.6} />
      <rect x={112} y={76} width={16} height={30} rx={8} fill={c.c2} />
      <path d="M82 104 Q90 72 112 64" fill="none" stroke={W} strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round" />
      <text x={120} y={172} textAnchor="middle" fontSize={8.5} fontWeight={800} letterSpacing={0.6} fill={W}>
        {c.brand.toUpperCase().slice(0, 10)}
      </text>
    </g>
  ),
  rollon: (c) => (
    <g>
      <rect x={90} y={96} width={60} height={110} rx={24} fill={c.c1} />
      <Label x={96} y={130} w={48} h={50} ctx={c} rx={8} />
      <rect x={92} y={92} width={56} height={10} rx={5} fill={c.dk} />
      <path d="M96 96 V76 Q96 46 120 46 Q144 46 144 76 V96 Z" fill={c.c2} />
      <Shine x={103} y={56} h={26} w={6} />
      <Shine x={97} y={112} h={80} w={6} />
    </g>
  ),
  bottle: (c) => (
    <g>
      <rect x={82} y={102} width={76} height={104} rx={18} fill={c.c1} opacity={0.9} />
      <rect x={86} y={140} width={68} height={62} rx={14} fill={W} opacity={0.78} />
      {[118, 130, 142].map((y) => (
        <rect key={y} x={138} y={y} width={12} height={2.2} rx={1} fill={W} opacity={0.8} />
      ))}
      <text x={120} y={176} textAnchor="middle" fontSize={8.5} fontWeight={800} letterSpacing={0.5} fill={c.dk}>
        {c.brand.toUpperCase().slice(0, 10)}
      </text>
      <rect x={78} y={90} width={84} height={18} rx={7} fill={c.c2} />
      <path d="M104 90 V76 Q104 52 120 46 Q136 52 136 76 V90 Z" fill={tint(c.c2, 0.25)} />
      <circle cx={120} cy={49} r={5} fill={c.dk} opacity={0.6} />
    </g>
  ),
};

/* ───────────── componente ───────────── */
type ImgProduct = Pick<Product, 'id' | 'name' | 'brand' | 'shape' | 'colors' | 'images'>;

interface Props {
  product: ImgProduct;
  /** 0 = frente, 1-3 = vistas alternativas (galería) */
  view?: number;
  className?: string;
  /** Solo el envase, sin fondo (para banners y tarjetas de categoría) */
  bare?: boolean;
  alt?: string;
}

export default function ProductImage({ product, view = 0, className = 'h-full w-full', bare = false, alt }: Props) {
  const uid = useId().replace(/:/g, '');
  const [failed, setFailed] = useState(false);
  const src = product.images?.[view] ?? product.images?.[0];

  if (src && !failed && !bare) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? product.name} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
  }

  const [c1, c2] = product.colors;
  const ctx: Ctx = { c1, c2, dk: shade(c1, 0.38), brand: product.brand };
  const v = ((view % 4) + 4) % 4;
  const draw = shapes[product.shape](ctx);

  const transform =
    v === 1 ? 'translate(-14 -22) scale(1.16)' : v === 2 ? 'rotate(-7 120 150)' : v === 3 ? 'translate(0 -4)' : undefined;

  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label={alt ?? product.name}
      preserveAspectRatio={bare ? 'xMidYMid meet' : 'xMidYMid slice'}
      style={bare ? { overflow: 'visible' } : undefined}
    >
      {!bare && (
        <>
          <defs>
            <linearGradient id={`${uid}bg`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={tint(c1, 0.86)} />
              <stop offset="1" stopColor={tint(c1, 0.95)} />
            </linearGradient>
            <pattern id={`${uid}stripes`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <rect width="16" height="16" fill={tint(c1, 0.88)} />
              <rect width="7" height="16" fill={tint(c1, 0.8)} />
            </pattern>
            <pattern id={`${uid}dots`} width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill={tint(c2, 0.78)} />
              <circle cx="5" cy="5" r="2.6" fill={tint(c2, 0.55)} />
              <circle cx="15" cy="15" r="2.6" fill={tint(c2, 0.55)} />
            </pattern>
          </defs>
          {v === 0 && (
            <>
              <rect width="240" height="240" fill={`url(#${uid}bg)`} />
              <circle cx="120" cy="124" r="88" fill={tint(c1, 0.76)} opacity={0.7} />
            </>
          )}
          {v === 1 && <rect width="240" height="240" fill={`url(#${uid}stripes)`} />}
          {v === 2 && <rect width="240" height="240" fill={`url(#${uid}dots)`} />}
          {v === 3 && (
            <>
              <rect width="240" height="240" fill="#ffffff" />
              <path d="M40 240 V120 A80 80 0 0 1 200 120 V240 Z" fill={tint(c1, 0.8)} />
              <circle cx="196" cy="42" r="6" fill={tint(c2, 0.35)} />
              <circle cx="44" cy="64" r="4" fill={tint(c1, 0.5)} />
            </>
          )}
          <ellipse cx="120" cy="208" rx="62" ry="6.5" fill="#14122b" opacity={0.13} />
        </>
      )}
      <g transform={transform}>{draw}</g>
    </svg>
  );
}
