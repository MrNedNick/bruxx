import { describe, expect, it } from 'vitest'
import { parseHTML } from 'linkedom'
import { captureWrites, parseDailyMenu, parseQuantity, parseStandardMenu, splitDishes } from '../lib/menubot'

const root = (html) => parseHTML(`<!doctype html><html><body>${html}</body></html>`).document.body
const N = '&nbsp;'

describe('parseQuantity', () => {
  it('reads size, price and allergens of a dish', () => {
    expect(parseQuantity(`800 g ${N} ${N} ${N} 430,– ${N} ${N} ${N} 1, 7, 9, 10, 14`.replace(/&nbsp;/g, ' '))).toEqual({
      abv: null,
      variants: [{ size: '800 g', price: 430 }],
      allergens: [1, 7, 9, 10, 14],
      isNew: false,
    })
  })

  it('reads strength and two sizes of a beer', () => {
    const q = parseQuantity('5 %    0,33 l      75,–      0,5 l      109,–     ')
    expect(q.abv).toBe(5)
    expect(q.variants).toEqual([
      { size: '0,33 l', price: 75 },
      { size: '0,5 l', price: 109 },
    ])
  })

  it('flags new items and keeps a size without unit', () => {
    const q = parseQuantity('6,5%    0,33 l      149,–      new')
    expect(q).toMatchObject({ abv: 6.5, isNew: true, variants: [{ size: '0,33 l', price: 149 }] })
    expect(parseQuantity('0,04      149,–').variants).toEqual([{ size: '0,04', price: 149 }])
  })

  it('reads the daily menu format', () => {
    expect(parseQuantity('0,25 l     49,–     1,7')).toMatchObject({
      variants: [{ size: '0,25 l', price: 49 }],
      allergens: [1, 7],
    })
  })

  it('reads a price with no size', () => {
    expect(parseQuantity('72,–       7').variants).toEqual([{ size: null, price: 72 }])
  })
})

const STANDARD = `<div class="standardmenu">
<div class="dm-cat-header"><div class="dm-cat-title"><h2 id="musle">mušle</h2></div></div>
<div class="dm-item"><div class="dm-content"><h3>moules Bruxx<br />slávky Bruxx</h3><span class="mnoz">800 g ${N} ${N} 430,– ${N} ${N} 1, 7</span><p>mušle s&nbsp;česnekem</p></div></div>
<div class="dm-cat-header"><div class="dm-cat-title"><h2 id="ustrice">ústřice</h2></div></div>
<div class="dm-item"><div class="dm-content"><h3></h3><span class="mnoz"></span><p>Ústřice podáváme na ledu.</p></div></div>
<div class="dm-item"><div class="dm-content"><h3>huîtres fraîches<br />čerstvé ústřice</h3><span class="mnoz">1 ks ${N} ${N} 105,– ${N} ${N} 14</span><p></p></div></div>
<div class="dm-cat-header"><div class="dm-cat-title"><h2 id="nealkoholickenapoje">nápoje</h2></div></div>
<div class="dm-item"><div class="dm-content"><h3>Green Killer IPA ${N}<img src="new.png"></h3><span class="mnoz">0,33 l ${N} ${N} 149,– ${N} new</span><p></p></div></div>
<div class="dm-cat-header"><div class="dm-cat-title"><h2 id=""></h2></div></div>
<div class="dm-item"><div class="dm-content"><h3>Rouge Cherry</h3><span class="mnoz">205,– ${N}</span></div></div>
<div class="dm-cat-header"><div class="dm-cat-title"><h2 id="rozlevanavina">vína</h2></div></div>
<div class="dm-item"><div class="dm-content"><h3>Riesling</h3><span class="mnoz">0,15 l ${N} ${N} 129,– ${N} 12</span><p></p></div></div>
</div>`

describe('parseStandardMenu', () => {
  const cats = parseStandardMenu(root(STANDARD))

  it('splits French name and Czech translation', () => {
    expect(cats[0].items[0]).toMatchObject({ name: 'moules Bruxx', sub: 'slávky Bruxx', desc: 'mušle s česnekem' })
  })

  it('turns a nameless item into the category note', () => {
    expect(cats[1].note).toBe('Ústřice podáváme na ledu.')
    expect(cats[1].items).toHaveLength(1)
  })

  it('marks new items and folds an untitled header into the previous category', () => {
    const drinks = cats.find((c) => c.id === 'nealkoholickenapoje')
    expect(drinks.items.map((i) => i.name)).toEqual(['Green Killer IPA', 'Rouge Cherry'])
    expect(drinks.items[0].isNew).toBe(true)
  })

  it('separates food, drinks and wine', () => {
    const { food, drinks, wine } = splitDishes(cats)
    expect(food.map((c) => c.id)).toEqual(['musle', 'ustrice'])
    expect(drinks.map((c) => c.id)).toEqual(['nealkoholickenapoje'])
    expect(wine.map((c) => c.id)).toEqual(['rozlevanavina'])
  })
})

const DAILY = `<h1>Pondělí 5/10</h1>
<div class="dm-cat hideweek"><div class="dm-cat-header"><div class="dm-cat-title"><h2>polévky</h2></div></div>
<div class="dm-item"><div class="dm-content"><h3>Bramborový krém${N}${N}<span class="dm-replace mnoz">0,25${N}l${N}${N}${N}${N} 49,–${N}${N}${N}${N} 1,7</span></h3><p>lehká polévka</p></div></div></div>
<div class="dm-cat hideweek"><div class="dm-item"><div class="dm-content"><h3>Smažené kuře${N}${N}<span class="dm-replace mnoz">400${N}g${N}${N}${N}${N} 185,–${N}${N}${N}${N} 1, 7</span></h3><p>řízek</p></div></div></div>
<p>V sobotu denní nabídku nepřipravujeme.</p>
<div id="mbcontent"><h4>chci dostávat polední menu</h4><form id="menubotsub" method="post" action="https://www.menubot.cz/app/users/emailadd.php?hash=x">
<input type="text" name="email" /><input type="hidden" name="mblang" value="_a" /><input type="email" name="mbtext" /><input type="hidden" name="mbtc" value="123" /><input type="hidden" name="mbth" value="abc" /></form></div>
<div id="popupgdpr"><h1>Podmínky</h1><p>GDPR text</p></div>`

describe('parseDailyMenu', () => {
  const d = parseDailyMenu(root(DAILY))

  it('reads the day and items, attaching untitled blocks to the previous category', () => {
    expect(d.day).toBe('Pondělí 5/10')
    expect(d.categories).toHaveLength(1)
    expect(d.categories[0].items.map((i) => i.name)).toEqual(['Bramborový krém', 'Smažené kuře'])
    expect(d.categories[0].items[0].variants).toEqual([{ size: '0,25 l', price: 49 }])
  })

  it('keeps only the closing note, not the GDPR popup', () => {
    expect(d.note).toBe('V sobotu denní nabídku nepřipravujeme.')
  })

  it('keeps the subscription endpoint and its hidden fields', () => {
    expect(d.subscribe.action).toContain('emailadd.php')
    expect(d.subscribe.fields).toEqual({ mblang: '_a', mbtc: '123', mbth: 'abc' })
  })
})

describe('captureWrites', () => {
  it('collects what an export script writes and survives its browser-only tail', () => {
    const src = `document.write("<h1>Ahoj</h1>");if(window.location.search.indexOf("x")>=0){};document.getElementById("a").value=1`
    expect(captureWrites(src)).toBe('<h1>Ahoj</h1>')
  })
})
