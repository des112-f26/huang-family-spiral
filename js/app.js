'use strict';

class Component extends DCLogic {
  componentDidMount() {
    const mq = window.matchMedia('(max-width: 1120px)');
    const sync = () => { this.narrow = mq.matches; this.setState({}); };
    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync); else mq.addListener(sync);
  }

  data() {
    if (this._d) return this._d;
    const C = { paper: '#FFFEFA', card: '#FFFFFF', deep: '#F3E3BE', before: '#F7EFE6', dim: '#EEE7DA', red: '#9E2B25', green: '#1E6A44', brown: '#6A4628', ink: '#33261D', muted: '#6B5745' };
    const genColor = { elder: C.red, parent: C.brown, young: C.green };
    const members = [
      { id: 'agong', ch: '公', name: 'Agong', born: 1946, bd: [1946, 2, 8], gen: 'elder', unit: 'YEARS',
        p1: 'I count time in years. 2001, the year we crossed. 2002, the year the bakery opened on Clement Street. 2019, the year I turned the sign over for good.',
        p2: 'The ovens taught me the rest. The dough was ready at four, so I was there at half past three. If you’re on time, you’re late.',
        zh: '準時就是遲到。', quote: 'If you’re on time, you’re late.' },
      { id: 'ama', ch: '嬤', name: 'Ama', born: 1949, bd: [1949, 3, 26], gen: 'elder', unit: 'MILESTONES',
        p1: 'I remember by milestones, not dates: a wedding in Taipei, eight suitcases at the airport, a granddaughter born under the Mid-Autumn moon.',
        p2: 'The ordinary days in between run together. So I tell the children: time doesn’t wait for you. Say it now, cook it now, call your mother now.',
        zh: '歲月不等人。', quote: 'Time doesn’t wait for you.' },
      { id: 'dad', ch: '爸', name: 'Dad', born: 1973, bd: [1973, 5, 12], gen: 'parent', unit: 'SUMMERS LEFT',
        p1: 'At twenty, time felt endless. I thought there would always be another year to learn English, to go back, to start over.',
        p2: 'Now I’m the one asking for more: one more hour after night class, one more summer before the kids leave, one more New Year with everyone at the table.',
        zh: '時間永遠不夠。', quote: 'There’s never enough of it. Spend it on people.' },
      { id: 'mom', ch: '媽', name: 'Mom', born: 1975, bd: [1975, 10, 20], gen: 'parent', unit: 'DEADLINES',
        p1: 'My parents talk in years and my kids talk in days. I live in deadlines: tax season, the school year, the CPA exam I passed in 2007 between cleaning shifts.',
        p2: 'Somebody has to keep the family calendar, so I do, and I translate between the generations.',
        zh: '一寸光陰一寸金。', quote: 'An inch of time is an inch of gold.' },
      { id: 'mei', ch: '美', name: 'Mei', born: 2008, bd: [2008, 8, 14], gen: 'young', unit: 'DAYS',
        p1: 'Ama thinks in years. I think in days: what’s due tomorrow, whose birthday is Friday, how many days until winter break.',
        p2: 'Time still feels endless, like there’s always a later. Maybe that’s why Agong says I’m late even when I’m on time.',
        zh: '今天先過好。', quote: 'Get through today first. Next year can wait.' },
      { id: 'leo', ch: '樂', name: 'Leo', born: 2014, bd: [2014, 1, 3], gen: 'young', unit: 'SLEEPS',
        p1: 'I count in sleeps. Seventy-seven sleeps until my birthday, eighty until red envelopes.',
        p2: 'A whole year is basically forever. Agong says one day it won’t feel that way. I don’t believe him.',
        zh: '還有幾天過年?', quote: 'How many more sleeps until New Year?' }
    ];
    members.forEach(function (m) { m.color = genColor[m.gen]; m.radius = m.gen === 'young' ? '50%' : '4px'; });
    const animals = ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'];
    const animalsEn = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
    const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const terms = ['立春','雨水','驚蟄','春分','清明','穀雨','立夏','小滿','芒種','夏至','小暑','大暑','立秋','處暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至','小寒','大寒'];
    const termsEn = ['Start of Spring','Rain Water','Awakening of Insects','Spring Equinox','Clear and Bright','Grain Rain','Start of Summer','Grain Buds','Grain in Ear','Summer Solstice','Minor Heat','Major Heat','Start of Autumn','End of Heat','White Dew','Autumn Equinox','Cold Dew','Frost’s Descent','Start of Winter','Minor Snow','Major Snow','Winter Solstice','Minor Cold','Major Cold'];
    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monLong = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const wk = ['日','一','二','三','四','五','六'];
    const wkEn = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const zi = function (y) { return ((y - 4) % 12 + 12) % 12; };
    const ganzhi = function (y) { return stems[((y - 4) % 10 + 10) % 10] + branches[zi(y)]; };
    const ym = function (k) { return { y: 1998 + Math.floor(k / 12), m: k % 12 }; };
    const mLen = function (k) { const o = ym(k); return new Date(Date.UTC(o.y, o.m + 1, 0)).getUTCDate(); };
    const wday = function (k, j) { const o = ym(k); return new Date(Date.UTC(o.y, o.m, j + 1)).getUTCDay(); };
    const scales = {
      days: {
        id: 'days', zh: '日', en: 'DAYS', n: 31, count: 396, C: 346, nowT: 17.5 / 31,
        valid: function (k, j) { return j < mLen(k); },
        loopLabel: function (k) { const o = ym(k); return mon[o.m] + ' ' + o.y; },
        loopYear: function (k) { return ym(k).y; },
        cellYear: function (k) { return ym(k).y; },
        zodiacYear: function (k) { return ym(k).y; },
        cellNum: function (k, j) { return String(j + 1); },
        cellSub: function (k, j) { return j === 0 ? mon[ym(k).m] : wk[wday(k, j)]; },
        cellName: function (k, j) { return mon[ym(k).m] + ' ' + (j + 1); },
        short: function (k, j) { const o = ym(k); return (mon[o.m] + ' ' + (j + 1) + ', ' + o.y).toUpperCase(); },
        trad: {
          0: { g: '家', name: 'First-of-the-month dim sum', short: 'Dim sum' },
          14: { g: '月', name: 'The mid-month walk', short: 'Walk' },
          27: { g: '信', name: 'A postcard to Ama', short: 'Postcard' }
        }
      },
      years: {
        id: 'years', zh: '年', en: 'YEARS', n: 24, count: 86, C: 80, nowT: 0.786,
        valid: function () { return true; },
        loopLabel: function (k) { return String(1946 + k); },
        loopYear: function (k) { return 1946 + k; },
        cellYear: function (k) { return 1946 + k; },
        zodiacYear: function (k) { return 1946 + k; },
        cellNum: function (k, j) { return String(j + 1); },
        cellSub: function (k, j) { return j === 0 ? String(1946 + k) : terms[j]; },
        cellName: function (k, j) { return (1946 + k) + ' · ' + terms[j]; },
        short: function (k, j) { return terms[j] + ' · ' + termsEn[j].toUpperCase() + ' · ' + (1946 + k); },
        trad: {
          0: { g: '春', name: 'Lunar New Year', short: 'New Year' },
          4: { g: '清', name: 'Qingming', short: 'Qingming' },
          5: { g: '壽', name: 'Ama’s birthday', short: 'Ama’s day' },
          8: { g: '端', name: 'Dragon Boat', short: 'Dragon Boat' },
          15: { g: '秋', name: 'Mid-Autumn', short: 'Mid-Autumn' },
          21: { g: '冬', name: 'Winter Solstice', short: 'Solstice' }
        }
      },
      decades: {
        id: 'decades', zh: '十年', en: 'DECADES', n: 10, count: 10, C: 8, nowT: 0.688,
        valid: function () { return true; },
        loopLabel: function (k) { return (1940 + 10 * k) + 's'; },
        loopYear: function (k) { return 1940 + 10 * k + 9; },
        cellYear: function (k, j) { return 1940 + 10 * k + j; },
        zodiacYear: function (k) { return 1940 + 10 * k; },
        cellNum: function (k, j) { return '’' + String(1940 + 10 * k + j).slice(2); },
        cellSub: function (k, j) { return j === 0 ? (1940 + 10 * k) + 's' : animals[zi(1940 + 10 * k + j)]; },
        cellName: function (k, j) { return String(1940 + 10 * k + j); },
        short: function (k, j) { const y = 1940 + 10 * k + j; return y + ' · ' + ganzhi(y) + '年'; },
        trad: { 0: { g: '照', name: 'The decade portrait', short: 'Portrait' } }
      }
    };
    const raw = [
      ['years', 1946, 13, 'agong', 'm', 'Born in Tainan, the year after the war ended.'],
      ['years', 1949, 6, 'ama', 'm', 'Born in Taichung, the youngest of five sisters.'],
      ['years', 1971, 17, 'ama', 'm', 'We married in Taichung. Your Agong wore a borrowed suit.'],
      ['years', 1973, 9, 'dad', 'm', 'Born in Kaohsiung, a few streets from the harbor.'],
      ['years', 1975, 11, 'ama', 'm', 'Wei-Ling was born in Taipei, our first.'],
      ['years', 1990, 0, 'mom', 's', '家和萬事興 — When the family is at peace, everything flourishes.'],
      ['years', 1998, 15, 'mom', 'm', 'Met David at a Mid-Autumn picnic. He brought far too many pomelos.'],
      ['years', 2000, 0, 'agong', 'm', 'Our last New Year in Taiwan, though we did not know it yet.'],
      ['years', 2001, 3, 'mom', 'm', 'Married David in Taipei. It rained, which Ama says is lucky.'],
      ['years', 2001, 13, 'agong', 'm', 'All four of us crossed the ocean together. Two suitcases each, and Ama’s rice cooker.'],
      ['years', 2001, 14, 'dad', 'm', 'First morning in San Francisco. Fog, and the smell of the sea. We had nothing yet, and everything to build.'],
      ['years', 2001, 21, 'ama', 'm', 'Our first winter here. We made tangyuan in a borrowed kitchen, round so we would stay together.'],
      ['years', 2002, 4, 'agong', 'm', 'Opened a tiny bakery on Clement Street. Up at four every morning, pineapple cakes by six.'],
      ['years', 2003, 10, 'dad', 'm', 'English classes at night after delivery shifts. I fell asleep on the bus with my books.'],
      ['years', 2004, 18, 'mom', 's', '吃苦耐勞 — Swallow the bitter, keep working. Cleaning offices at night, accounting classes by day.'],
      ['years', 2006, 0, 'ama', 'm', 'Our first New Year in a house of our own. Red paper on every door.'],
      ['years', 2007, 8, 'mom', 'm', 'Passed my CPA exam. Called Ama from the parking lot, crying.'],
      ['years', 2008, 15, 'ama', 'm', 'Mei arrived at Mid-Autumn, the first of us born here. We ate mooncakes in the hospital.'],
      ['years', 2010, 0, 'agong', 's', '落地生根 — Where the seed falls, it grows roots.'],
      ['years', 2019, 17, 'agong', 'm', 'Closed the bakery after seventeen years. Kept the recipe book for Mei and Leo.'],
      ['years', 2014, 0, 'dad', 'm', 'Leo was born just after New Year, a little Horse.'],
      ['years', 2016, 8, 'mei', 'm', 'Ama taught me to fold zongzi. Mine fell apart.'],
      ['years', 2020, 4, 'leo', 'm', 'Video calls with Agong every night we couldn’t visit.'],
      ['years', 2023, 15, 'leo', 'm', 'Made paper lanterns with Agong. His was the best one.'],
      ['years', 2026, 0, 'ama', 's', '本命年 — Leo, wear red this year. It keeps you safe.'],
      ['years', 2026, 5, 'mom', 'm', 'Ama’s 77th: longevity noodles for everyone.'],
      ['years', 2026, 13, 'agong', 'm', 'Twenty-five years since we landed. We ate at the same noodle shop as that first week.'],
      ['years', 2026, 15, 'mei', 'm', 'First week at college. Called home every night.'],
      ['years', 2026, 18, 'agong', 's', '慢慢來 — Slowly, slowly. You are not behind.'],
      ['years', 2026, 18, 'ama', 'm', 'Knitted Mei a scarf for her first winter away.'],
      ['years', 2027, 0, 'ama', 'm', 'Everyone home for New Year. I will make the turnip cake.'],
      ['years', 2027, 4, 'agong', 'm', 'Qingming. Incense for our parents, across the ocean, as always.'],
      ['years', 2030, 10, 'agong', 'm', 'Mei graduates. Save me a seat in the front row.'],
      ['days', '1998-10-05', 0, 'mom', 'm', 'Mid-Autumn picnic in Da’an Park. David brought too many pomelos.'],
      ['days', '2001-01-24', 0, 'agong', 'm', 'Last New Year in our old house in Taipei.'],
      ['days', '2001-03-18', 0, 'mom', 'm', 'Our wedding day. It rained, which Ama says is lucky.'],
      ['days', '2001-08-20', 0, 'ama', 'm', 'Packed eight suitcases. The rice cooker rode on my lap.'],
      ['days', '2001-08-21', 0, 'agong', 'm', 'Landed at dawn. Four of us, one new country.'],
      ['days', '2001-08-22', 0, 'dad', 'm', 'First morning here. Fog, and the smell of the sea.'],
      ['days', '2001-10-01', 0, 'ama', 'm', 'First Mid-Autumn away. We shared one mooncake four ways.'],
      ['days', '2002-01-14', 0, 'agong', 'm', 'The bakery opened. We sold eleven pineapple cakes.'],
      ['days', '2006-01-29', 0, 'ama', 'm', 'Lunar New Year in our own house at last.'],
      ['days', '2008-09-14', 0, 'ama', 'm', 'Mei is born. The Mid-Autumn moon was in the hospital window.'],
      ['days', '2014-02-03', 0, 'dad', 'm', 'Leo is born, a little Horse.'],
      ['days', '2026-02-17', 0, 'ama', 'm', 'Lunar New Year! Red envelopes for Mei and Leo.'],
      ['days', '2026-06-12', 0, 'mei', 'm', 'High school graduation. Ama cried first.'],
      ['days', '2026-09-24', 0, 'mei', 'm', 'First day of classes. Wore Ama’s jade bracelet.'],
      ['days', '2026-09-25', 0, 'ama', 'm', 'Mid-Autumn. Mooncakes mailed to Mei’s dorm.'],
      ['days', '2026-10-28', 0, 'agong', 's', '吃飯了嗎? — Have you eaten? (It means I love you.)'],
      ['days', '2026-11-01', 0, 'mom', 'm', 'Dim sum day. Leo ate six egg tarts.'],
      ['days', '2026-11-14', 0, 'leo', 'm', 'Scored my first goal! Agong cheered the loudest.'],
      ['days', '2026-11-15', 0, 'ama', 'm', 'Sunday dinner: steamed fish. Everyone came.'],
      ['days', '2026-11-18', 0, 'mei', 'm', 'Last midterm done. Calling Ama tonight.'],
      ['days', '2026-11-26', 0, 'mom', 'm', 'Thanksgiving at Ama’s. Mei comes home.'],
      ['days', '2026-12-20', 0, 'dad', 'm', 'Winter break begins. Mei is home for three weeks.'],
      ['decades', 1946, 0, 'agong', 'm', 'Born in Tainan.'],
      ['decades', 1949, 0, 'ama', 'm', 'Born in Taichung.'],
      ['decades', 1971, 0, 'ama', 'm', 'Agong and Ama married in Taichung.'],
      ['decades', 1973, 0, 'dad', 'm', 'David born in Kaohsiung.'],
      ['decades', 1975, 0, 'ama', 'm', 'Wei-Ling born in Taipei.'],
      ['decades', 1998, 0, 'mom', 'm', 'Wei-Ling and David meet.'],
      ['decades', 2001, 0, 'agong', 'm', 'A wedding in spring, an ocean crossed in summer.'],
      ['decades', 2002, 0, 'agong', 'm', 'The bakery on Clement Street opens.'],
      ['decades', 2006, 0, 'ama', 'm', 'A house of our own.'],
      ['decades', 2008, 0, 'ama', 'm', 'Mei born at Mid-Autumn, the first born here.'],
      ['decades', 2010, 0, 'agong', 's', '落地生根 — Where the seed falls, it grows roots.'],
      ['decades', 2014, 0, 'dad', 'm', 'Leo born, Year of the Horse.'],
      ['decades', 2019, 0, 'agong', 'm', 'The bakery closes. The recipe book stays.'],
      ['decades', 2020, 0, 'ama', 's', '飲水思源 — When you drink water, remember the spring.'],
      ['decades', 2026, 0, 'mei', 'm', 'Left for college, and still home every Sunday.'],
      ['decades', 2031, 0, 'agong', 'm', 'Our 60th anniversary. Everyone dances.']
    ];
    const pins = raw.map(function (r) {
      let loop, cell;
      if (r[0] === 'years') { loop = r[1] - 1946; cell = r[2]; }
      else if (r[0] === 'decades') { loop = Math.floor((r[1] - 1940) / 10); cell = r[1] % 10; }
      else { const p = r[1].split('-').map(Number); loop = (p[0] - 1998) * 12 + (p[1] - 1); cell = p[2] - 1; }
      return { scale: r[0], loop: loop, cell: cell, who: r[3], kind: r[4], text: r[5] };
    });
    const fest = {};
    const LNYD = {1998:[0,28],1999:[1,16],2000:[1,5],2001:[0,24],2002:[1,12],2003:[1,1],2004:[0,22],2005:[1,9],2006:[0,29],2007:[1,18],2008:[1,7],2009:[0,26],2010:[1,14],2011:[1,3],2012:[0,23],2013:[1,10],2014:[0,31],2015:[1,19],2016:[1,8],2017:[0,28],2018:[1,16],2019:[1,5],2020:[0,25],2021:[1,12],2022:[1,1],2023:[0,22],2024:[1,10],2025:[0,29],2026:[1,17],2027:[1,6],2028:[0,26],2029:[1,13],2030:[1,3]};
    const MAFD = {1998:[9,5],1999:[8,24],2000:[8,12],2001:[9,1],2002:[8,21],2003:[8,11],2004:[8,28],2005:[8,18],2006:[9,6],2007:[8,25],2008:[8,14],2009:[9,3],2010:[8,22],2011:[8,12],2012:[8,30],2013:[8,19],2014:[8,8],2015:[8,27],2016:[8,15],2017:[9,4],2018:[8,24],2019:[8,13],2020:[9,1],2021:[8,21],2022:[8,10],2023:[8,29],2024:[8,17],2025:[9,6],2026:[8,25],2027:[8,15],2028:[9,3],2029:[8,22],2030:[8,12]};
    for (let y = 1998; y <= 2030; y++) {
      fest[y + '-' + LNYD[y][0] + '-' + LNYD[y][1]] = 'Lunar New Year';
      fest[y + '-' + MAFD[y][0] + '-' + MAFD[y][1]] = 'Mid-Autumn';
      fest[y + '-11-' + ((y % 4 === 2 || y % 4 === 3) ? 22 : 21)] = 'Winter Solstice';
      fest[y + '-3-26'] = 'Ama’s birthday';
    }
    this._d = { C: C, members: members, scales: scales, pins: pins, animals: animals, animalsEn: animalsEn, terms: terms, wk: wk, ganzhi: ganzhi, zi: zi, fest: fest, ym: ym };
    return this._d;
  }

  curScale() { const s = this.state || {}; return this.data().scales[s.scale || 'days']; }
  curZ() { const s = this.state || {}; const sc = this.curScale(); return s.z != null ? s.z : sc.C + 1; }
  zoomTo(t) {
    const sc = this.curScale();
    this.target = Math.max(1, Math.min(sc.count + 0.5, t));
    if (!this.raf) this.raf = requestAnimationFrame(() => this.tick());
  }
  tick() {
    this.raf = null;
    const cur = this.curZ();
    let nx = cur + (this.target - cur) * 0.24;
    if (Math.abs(this.target - nx) < 0.004) nx = this.target;
    this.setState({ z: nx, moving: nx !== this.target });
    if (nx !== this.target) this.raf = requestAnimationFrame(() => this.tick());
  }
  componentWillUnmount() { if (this.raf) cancelAnimationFrame(this.raf); clearTimeout(this.tearT); clearTimeout(this.mvT); }

  renderVals() {
    const D = this.data(), K = D.C, s = this.state || {};
    const scaleId = s.scale || 'days';
    const sc = D.scales[scaleId];
    const n = sc.n, ink = K.red, accent = K.green;
    const z = this.curZ();
    const sel = s.sel || { loop: sc.C, cell: Math.floor(sc.nowT * n) };
    const lens = D.members.find(function (m) { return m.id === (s.lens || 'mei'); });
    const showThreads = this.props.showThreads ?? true;
    const moving = !!s.moving;
    const SEG = moving ? 0 : 4, STEPS = moving ? 16 : 48;
    const G = Math.max(1.25, Math.min(2.4, this.props.growth ?? 1.6));
    const CX = 400, CY = 400, R = 338, M = 122, A = R - M, TAU = Math.PI * 2;
    const A_END = 125 * Math.PI / 180;
    const clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
    const f1 = function (v) { return Math.round(v * 10) / 10; };
    const rr = function (v) { return M + A * Math.pow(G, v); };
    const ang = function (t) { return A_END - TAU + TAU * t; };
    const P = function (t, r) { const a = ang(t); return f1(CX + r * Math.cos(a)) + ' ' + f1(CY + r * Math.sin(a)); };
    const stripPath = function (k, steps) {
      let d = '';
      for (let i = 0; i <= steps; i++) { const t = i / steps; d += (i ? 'L' : 'M') + P(t, rr(k + t - z)) + ' '; }
      for (let i = steps; i >= 0; i--) { const t = i / steps; d += 'L' + P(t, rr(k + t - z - 1)) + ' '; }
      return d + 'Z';
    };
    const bandAt = function (k, t) { return rr(k + t - z) - rr(k + t - z - 1); };
    const fadeIn = function (k) { return clamp((bandAt(k, 0.5) - 3) / 9, 0, 1); };
    const futOp = function () { return 1; };
    const visible = function (k) { return rr(k - z - 1) < R + 1 && bandAt(k, 1) > 3.5; };
    const pinsAll = D.pins.concat(s.added || []).filter(function (p) { return p.scale === scaleId; });
    const byCell = {};
    pinsAll.forEach(function (p) { const key = p.loop + ':' + p.cell; (byCell[key] = byCell[key] || []).push(p); });
    const memberOf = function (id) { return D.members.find(function (m) { return m.id === id; }); };
    const textUnits = function (str) { let u = 0; for (const ch of String(str)) u += /[　-鿿]/.test(ch) ? 1 : 0.56; return Math.max(u, 0.6); };

    const circ = function (x, y, r) { return 'M' + f1(x - r) + ' ' + f1(y) + 'a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(2 * r) + ' 0a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(-2 * r) + ' 0Z'; };
    let laneD = '', ornD = '';
    const laneKs = [];
    for (let k = -10; k < 0; k++) laneKs.push(k);
    let laneFD = '';
    if (scaleId !== 'decades') for (let k = sc.count; k <= sc.count + 1; k++) laneKs.push(k);
    else for (let k = sc.count; k <= sc.count + 1; k++) if (visible(k)) laneFD += stripPath(k, STEPS);
    laneKs.forEach(function (k) {
      if (!visible(k)) return;
      laneD += stripPath(k, STEPS);
      if (k < 0) return;
      let t = 0, guard = 0;
      while (t < 1 && guard++ < 80) {
        const rin = rr(k + t - z - 1), rout = Math.min(R - 1, rr(k + t - z)), w = rout - rin;
        if (w > 9) { const rc = (rin + rout) / 2, a = ang(t), ox = CX + rc * Math.cos(a), oy = CY + rc * Math.sin(a); ornD += circ(ox, oy, w * 0.3) + circ(ox, oy, w * 0.11); t += (w * 0.62) / (TAU * rc); } else t += 0.02;
      }
    });
    const tl = { paper: '', before: '', future: '', dim: '', sel: '', fest: '', pinned: '', trad: '' };
    const pinD = { red: '', brown: '', green: '' };
    const PINKEY = { elder: 'red', parent: 'brown', young: 'green' };
    let stripD = '', tabD = '', tabZD = '', glyphD = '';

    const txt = [];
    const tAt = function (x, y, rot, fs, text, fill, op, font, w) { const dist = Math.hypot(x - CX, y - CY); if (dist > R + fs * 0.7 || dist < M + fs * 0.4) return; txt.push({ l: f1(x / 8 * 100) / 100, t: f1(y / 8 * 100) / 100, rot: f1(rot), fs: Math.round(fs * 0.125 * 1000) / 1000, sc: Math.round(fs * 0.125 / 4 * 1000) / 1000, text: text, fill: fill, op: op, font: font, w: w }); };
    let firstVis = null, lastVis = null, selPath = '';
    for (let k = 0; k < sc.count; k++) {
      if (!visible(k)) continue;
      const op = 1;
      if (firstVis === null) firstVis = k;
      lastVis = k;
      stripD += stripPath(k, STEPS);
      const future = k > sc.C;
      const beforeLens = scaleId !== 'days' && sc.loopYear(k) < lens.born;
      const ARC = (moving ? 1 : 3) + (n < 20 ? 2 : 0);
      for (let j = 0; j < n; j++) {
        const t0 = j / n, t1 = (j + 1) / n, tm = (t0 + t1) / 2;
        const rin = rr(k + tm - z - 1), rout = rr(k + tm - z), band = rout - rin;
        const gap = clamp(band * 0.055, 0.7, 3.4);
        const rIn = function (t) { return rr(k + t - z - 1) + gap; };
        const rOut = function (t) { return rr(k + t - z) - gap; };
        const rmid = (rin + rout) / 2, dt = gap / (TAU * rmid), a0 = t0 + dt, a1 = t1 - dt;
        let d = 'M' + P(a0, rOut(a0));
        for (let i = 1; i <= ARC; i++) { const t = a0 + (a1 - a0) * i / ARC; d += 'L' + P(t, rOut(t)); }
        for (let i = ARC; i >= 0; i--) { const t = a0 + (a1 - a0) * i / ARC; d += 'L' + P(t, rIn(t)); }
        d += 'Z';
        const valid = sc.valid(k, j);
        const isSel = valid && sel.loop === k && sel.cell === j;
        if (isSel) selPath = d;
        let grp = !valid ? 'dim' : (isSel ? 'sel' : (future ? 'future' : (beforeLens ? 'before' : 'paper')));
        if (valid && !isSel) {
          if (scaleId === 'days') { const o = D.ym(k); if (D.fest[o.y + '-' + o.m + '-' + (j + 1)]) grp = 'fest'; }
          if (grp !== 'fest') { if (byCell[k + ':' + j]) grp = 'pinned'; else if (sc.trad[j] && j !== 0) grp = 'trad'; }
        }
        tl[grp] += d;
        if (!valid || band < 7) continue;
        const a = ang(tm), cwIn = rin * TAU / n - 2 * gap, cwMid = rmid * TAU / n - 2 * gap;
        const th = band * 0.24, num = sc.cellNum(k, j), tw = Math.min(cwIn * 0.62, th * 1.9);
        const rT = rin + gap + th * 0.55 + band * 0.02, rot = a * 180 / Math.PI - 90;
        const tx = CX + rT * Math.cos(a), ty = CY + rT * Math.sin(a);
        const tf = 'translate(' + f1(tx) + ' ' + f1(ty) + ') rotate(' + f1(rot) + ')';
        const isZero = j === 0;
        const fsNum = Math.min(th * 0.82, tw * 0.6 / textUnits(num));
        const bodyTop = rin + gap + th * 1.1 + band * 0.02, L = rout - gap - bodyTop;
        const sub = sc.cellSub(k, j), fsSub = Math.min(L * 0.3, cwMid * 0.8 / textUnits(sub), 20);
        const tr = sc.trad[j], cp = byCell[k + ':' + j] || [];
        const nP = Math.min(cp.length, 3);
        const gr = Math.min(L * 0.3, cwMid * 0.24, 17);
        const ps = Math.min(L * 0.24, cwMid / (nP * 2.4 + (tr && !isZero ? 2.8 : 0) + 0.4), 14);
        const hasPins = cp.length > 0 && ps >= 2.6, hasGlyph = !!tr && !isZero && gr >= 3.5;
        const yS = bodyTop + L * 0.3 - rT, yG = bodyTop + L * (isZero ? 0.74 : 0.5) - rT;
        const W = (hasGlyph && hasPins ? 2 * gr + 4 : 0) + (hasPins ? nP * 2.25 * ps : 0);
        const gx = hasPins ? -W / 2 + gr : 0;
        const pin0 = -W / 2 + (hasGlyph ? 2 * gr + 4 : 0) + 1.125 * ps;
        const rr2 = rot * Math.PI / 180, cs = Math.cos(rr2), sn = Math.sin(rr2);
        const LX = function (x, y) { return tx + x * cs - y * sn; }, LY = function (x, y) { return ty + x * sn + y * cs; };
        if (th >= 3.5 && fsNum >= 3) tAt(tx, ty, rot, fsNum, num, isZero ? K.card : ink, op, "'Coustard', serif", 900);
        if (isZero && fsSub >= 6) tAt(LX(0, yS), LY(0, yS), rot, fsSub, sub, isZero ? accent : K.muted, op, isZero ? "'Coustard', serif" : "'Noto Serif TC', serif", isZero ? 900 : 700);
        if (hasGlyph && gr >= 6) tAt(LX(gx, yG), LY(gx, yG), rot, gr * 1.05, tr.g, accent, op, "'Noto Serif TC', serif", 900);
        const quad = function (cx0, cy0, hw, hh) { return 'M' + f1(LX(cx0 - hw, cy0 - hh)) + ' ' + f1(LY(cx0 - hw, cy0 - hh)) + 'L' + f1(LX(cx0 + hw, cy0 - hh)) + ' ' + f1(LY(cx0 + hw, cy0 - hh)) + 'L' + f1(LX(cx0 + hw, cy0 + hh)) + ' ' + f1(LY(cx0 + hw, cy0 + hh)) + 'L' + f1(LX(cx0 - hw, cy0 + hh)) + ' ' + f1(LY(cx0 - hw, cy0 + hh)) + 'Z'; };
        if (th >= 3.5) { if (isZero) tabZD += quad(0, 0, tw / 2, th / 2); else tabD += quad(0, 0, tw / 2, th / 2); }
        if (hasGlyph) glyphD += circ(LX(gx, yG), LY(gx, yG), gr);
        if (hasPins) {
          cp.slice(0, 3).forEach(function (p, i) {
            const mem = memberOf(p.who), px = pin0 + i * ps * 2.25, young = mem.gen === 'young';
            pinD[PINKEY[mem.gen]] += young ? circ(LX(px, yG), LY(px, yG), ps) : quad(px, yG, ps, ps);
            if (ps >= 5.5) tAt(LX(px, yG), LY(px, yG), rot, ps * 1.2, mem.ch, '#FFFEFA', op, "'Noto Serif TC', serif", 900);
          });
        }
      }
    }

    const cellAt = function (e) {
      const rc = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rc.left) / rc.width * 800, y = (e.clientY - rc.top) / rc.height * 800;
      const r = Math.hypot(x - CX, y - CY);
      if (r <= M + 2 || r >= R) return null;
      let t0 = ((Math.atan2(y - CY, x - CX) - (A_END - TAU)) / TAU) % 1; if (t0 < 0) t0 += 1;
      const v = Math.log((r - M) / A) / Math.log(G);
      const k = Math.ceil(v + z - t0), j = Math.min(n - 1, Math.floor(t0 * n));
      if (k < 0 || k >= sc.count || !sc.valid(k, j)) return null;
      return { loop: k, cell: j };
    };
    let tip = { show: false, l: 0, t: 0, tf: 'none', title: '', items: [] };
    const hv = s.hover;
    if (!moving && hv && hv.scale === scaleId && byCell[hv.loop + ':' + hv.cell]) {
      const tmH = (hv.cell + 0.5) / n, aH = ang(tmH), rH = rr(hv.loop + tmH - z - 0.5);
      if (rH > M && rH < R) {
        const xH = CX + rH * Math.cos(aH), yH = CY + rH * Math.sin(aH), above = yH > 230;
        tip = { show: true, l: clamp(Math.round(xH / 8 * 100) / 100, 22, 78), t: Math.round(yH / 8 * 100) / 100,
          tf: above ? 'translate(-50%, calc(-100% - 16px))' : 'translate(-50%, 16px)', title: sc.cellName(hv.loop, hv.cell).toUpperCase(),
          items: byCell[hv.loop + ':' + hv.cell].slice(0, 3).map(function (p, i) { const m = memberOf(p.who); return { name: m.name, kind: p.kind === 's' ? 'a saying' : 'a milestone', text: p.text, rot: i % 2 ? 1.5 : -1.5 }; }) };
      }
    }
    const spokes = Object.keys(sc.trad).map(function (key) { const a = ang((Number(key) + 0.5) / n); return { x1: f1(CX + M * Math.cos(a)), y1: f1(CY + M * Math.sin(a)), x2: f1(CX + R * Math.cos(a)), y2: f1(CY + R * Math.sin(a)) }; });
    const vOf = function (y, mo, d) {
      if (scaleId === 'days') return y < 1998 ? 0 : (y - 1998) * 12 + mo + (d - 0.5) / 31;
      const ms = Date.UTC(y, mo, d);
      if (scaleId === 'years') { let yy = y; if (ms < Date.UTC(y, 1, 4)) yy = y - 1; return (yy - 1946) + (ms - Date.UTC(yy, 1, 4)) / (365.2422 * 864e5); }
      return (y - 1940 + (ms - Date.UTC(y, 0, 1)) / (365.2422 * 864e5)) / 10;
    };
    const vBirth = Math.max(0, vOf(lens.bd[0], lens.bd[1], lens.bd[2])), vNow = vOf(2026, 10, 18);
    const thrR = function (v) { const ri = rr(v - z - 1), ro = rr(v - z); return { r: ri + (ro - ri) * 0.84, w: ro - ri }; };
    let threadD = '';
    const vLo = Math.max(vBirth, z - 14), vHi = Math.min(vNow, z + 1);
    if (scaleId === 'decades' && vHi > vLo) {
      const N = Math.min(1200, Math.ceil((vHi - vLo) * (moving ? 28 : 72)) + 1);
      let pen = false;
      for (let i = 0; i <= N; i++) {
        const v = vLo + (vHi - vLo) * i / N, q = thrR(v);
        if (q.w < 2.5 || q.r > R - 1) { pen = false; continue; }
        threadD += (pen ? 'L' : 'M') + P(v, q.r); pen = true;
      }
    }
    const bq = thrR(vBirth), sealOn = scaleId === 'decades' && vBirth > 0 && vBirth >= z - 14 && bq.r < R - 4 && bq.w > 5;
    const sealS = clamp(bq.w * 0.3, 7, 15), aB = ang(vBirth);
    const seal = { show: sealOn, x: f1(CX + bq.r * Math.cos(aB) - sealS), y: f1(CY + bq.r * Math.sin(aB) - sealS), s: f1(sealS * 2), cx: f1(CX + bq.r * Math.cos(aB)), cy: f1(CY + bq.r * Math.sin(aB)), rot: f1(aB * 180 / Math.PI - 90) };
    if (sealOn && sealS >= 7) tAt(CX + bq.r * Math.cos(aB), CY + bq.r * Math.sin(aB), aB * 180 / Math.PI - 90, sealS * 1.25, lens.ch, '#FFFEFA', 1, "'Noto Serif TC', serif", 900);
    const story = { name: lens.name.toUpperCase(), ch: lens.ch, color: lens.color, radius: lens.radius, p1: lens.p1, p2: lens.p2, unit: lens.unit, zh: lens.zh, quote: lens.quote, cls: s.lensFlip ? 'unfoldB' : 'unfoldA', born: String(lens.born) };
    const rN = rr(sc.C + sc.nowT - z), aN = ang(sc.nowT), nowR = clamp(bandAt(sc.C, sc.nowT) * 0.22, 11, 16);
    const now = { show: rN > M + 12 && rN < R - 4, x: f1(CX + rN * Math.cos(aN)), y: f1(CY + rN * Math.sin(aN)), ex: f1(CX + R * Math.cos(aN)), ey: f1(CY + R * Math.sin(aN)), r: f1(nowR), r2: f1(nowR + 5),
      lx: Math.round((CX + (R + 66) * Math.cos(aN)) / 8 * 100) / 100, ly: Math.round((CY + (R + 66) * Math.sin(aN)) / 8 * 100) / 100 };
    now.ex2 = f1(CX + (R + 50) * Math.cos(aN)); now.ey2 = f1(CY + (R + 50) * Math.sin(aN));
    if (this.narrow) { now.lx = clamp(now.lx, 16, 84); now.ly = clamp(now.ly, 4, 96); }
    const ringDots = [], ringTxt = [];
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + i * TAU / 12;
      ringDots.push({ x: f1(CX + 369 * Math.cos(a)), y: f1(CY + 369 * Math.sin(a)), r: 11.5, fill: '#FFFEFA', sw: 0 });
      ringTxt.push({ ch: D.animals[i], l: Math.round((CX + 369 * Math.cos(a)) / 8 * 100) / 100, t: Math.round((CY + 369 * Math.sin(a)) / 8 * 100) / 100, rot: f1(a * 180 / Math.PI + 90) });
    }
    if (now.show) tAt(CX + rN * Math.cos(aN), CY + rN * Math.sin(aN), 0, nowR * 1.15, '今', '#FFFEFA', 1, "'Noto Serif TC', serif", 900);

    const focusK = clamp(Math.round(z - 1), 0, sc.count - 1);
    const selYear = sc.cellYear(sel.loop, sel.cell);
    const zy = scaleId === 'decades' ? selYear : sc.zodiacYear(focusK);
    const zIdx = ((zy - 4) % 12 + 12) % 12;
    const zop = {}; for (let i = 0; i < 12; i++) zop['o' + i] = i === zIdx ? 1 : 0;
    const med = { r: M, r2: M - 9, halo: M + 4 };
    const flower = function (x, y, s2, r2) { return { tf: 'translate(' + x + ' ' + y + ') rotate(' + r2 + ') scale(' + s2 + ')' }; };
    const corner = [];
    [[0, 0, 1, 1], [800, 0, -1, 1], [0, 800, 1, -1], [800, 800, -1, -1]].forEach(function (c) {
      corner.push(flower(c[0] + c[2] * 44, c[1] + c[3] * 40, 1.05, c[2] * c[3] * 15));
      corner.push(flower(c[0] + c[2] * 18, c[1] + c[3] * 92, 0.6, c[2] * c[3] * -20));
      corner.push(flower(c[0] + c[2] * 94, c[1] + c[3] * 16, 0.56, c[2] * c[3] * 40));
    });
    const outerK = clamp(Math.round(z - 1), 0, sc.count - 1), innerK = firstVis === null ? outerK : firstVis;
    const rangeText = sc.loopLabel(innerK) + ' – ' + sc.loopLabel(Math.min(outerK, lastVis === null ? outerK : lastVis)) + (outerK > sc.C ? ' (ahead)' : '');

    const DOT = { elder: '#F1CBC3', parent: '#E9DCCB', young: '#CFE2D5' };
    const lensList = D.members.map((m) => {
      const on = m.id === lens.id, a = selYear - m.born;
      return { ch: m.ch, name: m.name, radius: m.radius, tag: on ? ' · these loops' : '', born: String(m.born), zodiac: D.animals[D.zi(m.born)],
        age: a < 0 ? '—' : String(a), pressed: on ? 'true' : 'false',
        bg: on ? K.green : '#FFFEFA', dot: on ? 'rgba(255,254,250,0.22)' : DOT[m.gen], border: on ? K.green : K.red, fg: on ? '#FBFAF5' : K.ink,
        sealBg: on ? '#FBFAF5' : m.color, sealFg: on ? K.green : '#FBFAF5', ageColor: on ? '#FBFAF5' : K.red,
        chipBg: on ? K.green : 'transparent', chipFg: on ? '#FBFAF5' : K.ink, chipSealBg: on ? '#FBFAF5' : m.color, chipSealFg: on ? K.green : '#FBFAF5',
        pick: () => { if (m.id !== lens.id) this.setState({ lens: m.id, lensFlip: !(this.state || {}).lensFlip }); } };
    });
    const lensLine = scaleId === 'days' ? 'Each loop is one month of ' + lens.name + '’s everyday. Ages show for the year you’re viewing.' : lens.name + '’s loops begin in ' + lens.born + '. Ages show for the year you’re viewing.';
    const tradList = Object.keys(sc.trad).map(function (key) { const t = sc.trad[key], z0 = key === '0'; return { g: t.g, name: t.name, short: t.short, bg: z0 ? K.green : '#FFFEFA', fg: z0 ? '#FBFAF5' : K.green }; });
    const scaleBtns = ['days', 'years', 'decades'].map((id) => {
      const o = D.scales[id], on = id === scaleId;
      return { zh: o.zh, en: o.en, pressed: on ? 'true' : 'false', cls: on ? 'riso' : '', bg: on ? K.red : '#FFFEFA', fg: on ? '#FBFAF5' : K.red, pick: () => {
        if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
        this.target = o.C + 1;
        this.setState({ scale: id, z: o.C + 1, sel: { loop: o.C, cell: Math.floor(o.nowT * o.n) }, hover: null });
      } };
    });

    const splitZh = function (t) { const m = /^([㐀-鿿]+[?？]?)\s*—\s*(.*)$/.exec(t); return m ? { zh: m[1], en: m[2] } : null; };
    const cellPins = byCell[sel.loop + ':' + sel.cell] || [];
    const SL = [[-1.8, 0, 22], [2.4, 22, 0], [-1, 8, 14]];
    const slips = cellPins.length ? cellPins.map(function (p, i) {
      const m = memberOf(p.who), sp = splitZh(p.text), g = SL[i % 3];
      return { hasZh: !!sp, zh: sp ? sp.zh : '', text: sp ? sp.en : p.text, from: 'from ' + m.name, hasSeal: true, ch: m.ch, color: m.color, radius: m.radius, kindLabel: '· ' + (p.kind === 's' ? 'a saying' : 'a milestone'), rot: g[0], ml: g[1], mr: g[2], mt: i ? -6 : 0, zi: 10 - i };
    }) : [{ hasZh: false, zh: '', text: 'Nothing pinned to this moment yet.', from: 'a quiet day on the spiral', hasSeal: false, ch: '', color: '', radius: '0', kindLabel: '', rot: -1.4, ml: 0, mr: 18, mt: 0, zi: 1 }];
    const trS = sc.trad[sel.cell];
    const selTrad = trS ? { show: true, g: trS.g, name: trS.name } : { show: false, g: '', name: '' };

    const DAY = 864e5, TODAY = Date.UTC(2026, 10, 18);
    let selMs;
    if (scaleId === 'days') selMs = Date.UTC(1998 + Math.floor(sel.loop / 12), sel.loop % 12, sel.cell + 1);
    else if (scaleId === 'years') { selMs = Date.UTC(1946 + sel.loop, 1, 4) + Math.round(sel.cell * 365.2422 / 24) * DAY; const nx = Date.UTC(1946 + sel.loop, 1, 4) + Math.round((sel.cell + 1) * 365.2422 / 24) * DAY; if (TODAY >= selMs && TODAY < nx) selMs = TODAY; }
    else { selMs = Date.UTC(1940 + 10 * sel.loop + sel.cell, 0, 1); if (1940 + 10 * sel.loop + sel.cell === 2026) selMs = TODAY; }
    const sd = new Date(selMs), sy = sd.getUTCFullYear();
    const MONU = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const WKU = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    const LNY = {2024:[1,10],2025:[0,29],2026:[1,17],2027:[1,6],2028:[0,26],2029:[1,13],2030:[1,3],2031:[0,23],2032:[1,11]};
    const MAF = {2024:[8,17],2025:[9,6],2026:[8,25],2027:[8,15],2028:[9,3],2029:[8,22],2030:[8,12],2031:[9,1],2032:[8,19]};
    const DBF = {2024:[5,10],2025:[4,31],2026:[5,19],2027:[5,9],2028:[4,28],2029:[5,16],2030:[5,5],2031:[5,24],2032:[5,12]};
    const festOf = function (y) {
      const f = function (tbl, dflt) { const v = tbl[y]; return { ms: Date.UTC(y, (v || dflt)[0], (v || dflt)[1]), approx: !v }; };
      const q = (y % 4 === 0 || y % 4 === 1) ? 4 : 5, w = (y % 4 === 2 || y % 4 === 3) ? 22 : 21;
      return [Object.assign(f(LNY, [1, 4]), { zh: '春節', en: 'LUNAR NEW YEAR' }), { ms: Date.UTC(y, 3, q), approx: false, zh: '清明', en: 'QINGMING' }, { ms: Date.UTC(y, 3, 26), approx: false, zh: '壽', en: 'AMA’S BIRTHDAY' },
        Object.assign(f(DBF, [5, 10]), { zh: '端午', en: 'DRAGON BOAT' }), Object.assign(f(MAF, [8, 20]), { zh: '中秋', en: 'MID-AUTUMN' }), { ms: Date.UTC(y, 11, w), approx: false, zh: '冬至', en: 'WINTER SOLSTICE' }];
    };
    const up = festOf(sy).concat(festOf(sy + 1)).filter(function (e) { return e.ms >= selMs; }).sort(function (a, b) { return a.ms - b.ms; })[0];
    const dd = Math.round((up.ms - selMs) / DAY);
    const festText = dd === 0 ? '今天 · ' + up.zh + ' · ' + up.en + ' · TODAY' : up.zh + ' · ' + up.en + ' · ' + (dd === 1 ? 'TOMORROW' : 'IN ' + (up.approx ? 'ABOUT ' : '') + dd + ' DAYS');
    const doy = Math.floor((selMs - Date.UTC(sy, 0, 1)) / DAY);
    const GOOD = ['calling home, slow dinners, writing a letter', 'visiting Ama, folding dumplings, long walks', 'sharing old photos, asking Agong a question', 'cooking together, saying thank you', 'resting, tea in the afternoon, a nap', 'writing it down, keeping a promise'];
    const AVOID = ['rushing, skipping meals, comparing', 'staying up too late, worrying ahead', 'arguing over small things', 'forgetting to call back', 'doing everything alone', 'saying “later” to someone you love'];
    const termIdx = scaleId === 'years' ? sel.cell : Math.floor(((selMs - Date.UTC(sy, 1, 4)) / DAY + 365.2422) % 365.2422 / (365.2422 / 24));
    const barRight = D.terms[((termIdx % 24) + 24) % 24] + ' · 星期' + D.wk[sd.getUTCDay()];
    const stepSel = (dir) => {
      let k = sel.loop, j = sel.cell;
      for (let g = 0; g < 40; g++) { j += dir; if (j >= n) { j = 0; k++; } if (j < 0) { j = n - 1; k--; } if (k < 0 || k >= sc.count) return false; if (sc.valid(k, j)) break; }
      if (k !== sel.loop) this.zoomTo(k + 1);
      this.setState({ sel: { loop: k, cell: j } });
      return true;
    };
    const alm = { isToday: selMs === TODAY, year: String(sy), month: MONU[sd.getUTCMonth()], day: String(sd.getUTCDate()), weekday: WKU[sd.getUTCDay()], barRight: barRight,
      good: GOOD[doy % GOOD.length], avoid: AVOID[(doy + 2) % AVOID.length], fest: festText, aria: MONU[sd.getUTCMonth()] + ' ' + sd.getUTCDate() + ', ' + sy };
    alm.inCls = s.drop ? (s.drop % 2 ? 'dropA' : 'dropB') : '';
    alm.prev = () => { if (stepSel(-1)) this.setState({ drop: ((this.state || {}).drop || 0) + 1, tear: null }); };
    alm.next = () => {
      const snap = { year: alm.year, month: alm.month, day: alm.day, weekday: alm.weekday, barRight: alm.barRight, good: alm.good, avoid: alm.avoid, fest: alm.fest, isToday: alm.isToday };
      if (stepSel(1)) { const nn = ((this.state || {}).tearN || 0) + 1; this.setState({ tear: { n: nn, snap: snap }, tearN: nn }); clearTimeout(this.tearT); this.tearT = setTimeout(() => this.setState({ tear: null }), 850); }
    };
    const tear = s.tear ? Object.assign({ show: true, cls: s.tear.n % 2 ? 'tearA' : 'tearB' }, s.tear.snap) : { show: false, cls: '', year: '', month: '', day: '', weekday: '', barRight: '', good: '', avoid: '', fest: '', isToday: false };

    return {
      threadD: threadD, seal: seal, story: story,
      lensList: lensList, lensLine: lensLine, tradList: tradList, scaleBtns: scaleBtns, rangeText: rangeText, showThreads: showThreads,
      spiralAria: 'Family spiral, ' + scaleId + ' scale, showing ' + rangeText,
      laneD: laneD, laneFD: laneFD, ornD: ornD, stripD: stripD, tl: tl, tabD: tabD, tabZD: tabZD, glyphD: glyphD, pinD: pinD, spokes: spokes, hasSel: !!selPath, selPath: selPath,
      spiralClick: (e) => { const c = cellAt(e); if (c) this.setState({ sel: c }); },
      spiralMove: (e) => { const c = cellAt(e), h = (this.state || {}).hover; const has = c && byCell[c.loop + ':' + c.cell]; if (has) { if (!h || h.loop !== c.loop || h.cell !== c.cell || h.scale !== scaleId) this.setState({ hover: { scale: scaleId, loop: c.loop, cell: c.cell } }); } else if (h) this.setState({ hover: null }); },
      spiralLeave: () => { if ((this.state || {}).hover) this.setState({ hover: null }); },
      now: now, med: med, tip: tip, txt: txt, cornerFlowers: corner, zop: zop,
      z: z, zmax: sc.count + 0.5, ringDots: ringDots, ringTxt: ringTxt,
      onWheel: (e) => { const base = this.raf ? this.target : z; this.zoomTo(base + e.deltaY * 0.011); },
      onSlide: (e) => { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } const v = parseFloat(e.target.value); this.target = v; this.setState({ z: v, moving: true }); clearTimeout(this.mvT); this.mvT = setTimeout(() => this.setState({ moving: false }), 180); },
      spiralCls: '',
      zoomIn: () => this.zoomTo((this.raf ? this.target : z) - 1),
      zoomOut: () => this.zoomTo((this.raf ? this.target : z) + 1),
      toNow: () => { this.zoomTo(sc.C + 1); this.setState({ sel: { loop: sc.C, cell: Math.floor(sc.nowT * n) } }); },
      alm: alm, tear: tear, slips: slips, selTrad: selTrad, info: { short: sc.short(sel.loop, sel.cell), future: sel.loop > sc.C || (sel.loop === sc.C && (sel.cell + 0.5) / n > sc.nowT) },
      pinAsList: D.members.map((m) => { const on = m.id === (s.pinAs || 'ama'); return { ch: m.ch, name: m.name, radius: m.radius, color: m.color, pressed: on ? 'true' : 'false', bg: on ? m.color : '#FFFEFA', fg: on ? '#FFFEFA' : m.color, pick: () => this.setState({ pinAs: m.id }) }; }),
      kindList: [['m', 'MILESTONE'], ['s', 'SAYING']].map((kv) => { const on = kv[0] === (s.kind || 'm'); return { label: kv[1], pressed: on ? 'true' : 'false', bg: on ? K.red : '#FFFEFA', fg: on ? '#FBFAF5' : K.red, pick: () => this.setState({ kind: kv[0] }) }; }),
      draft: s.draft || '', noDraft: !(s.draft || '').trim(), pinBtnOp: (s.draft || '').trim() ? 1 : 0.5,
      pinPrompt: (sel.loop > sc.C || (sel.loop === sc.C && (sel.cell + 0.5) / n > sc.nowT)) ? 'A hope, a plan, or a promise for this day ahead' : ((s.kind || 'm') === 's' ? 'A saying to keep on the spiral' : 'What happened here?'),
      onDraft: (e) => this.setState({ draft: e.target.value }),
      addPin: () => { const st = this.state || {}; const t = (st.draft || '').trim(); if (!t) return; this.setState({ added: (st.added || []).concat([{ scale: scaleId, loop: sel.loop, cell: sel.cell, who: st.pinAs || 'ama', kind: st.kind || 'm', text: t }]), draft: '' }); }
    };
  }
}

mountDC(Component, document.getElementById('app'), document.getElementById('app-template'), { growth: 1.6, showThreads: true });

