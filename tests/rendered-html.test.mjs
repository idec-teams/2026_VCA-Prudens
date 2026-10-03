import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const routes = [
  "/", "/team", "/members", "/descriptions", "/attributions", "/work-distribution",
  "/description", "/methods", "/design", "/model", "/engineering", "/experiment", "/analysis",
  "/results", "/contribution", "/notebook", "/protocol", "/mutation-selection", "/safety", "/supplement-files",
];

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("all wiki routes server-render successfully", async () => {
  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /class="site-header"/, route);
    assert.match(html, /class="[^"]*(?:home-story|ppt-deck|team-members-page)/, route);
  }
});

test("team pages render one member title and interactive profile cards", async () => {
  const membersResponse = await render("/members");
  const membersHtml = await membersResponse.text();
  assert.equal((membersHtml.match(/>Team Members</g) ?? []).length, 1);
  assert.equal((membersHtml.match(/class="member-card"/g) ?? []).length, 20);
  assert.match(membersHtml, /Open Haotian, Lu profile/);
  assert.match(membersHtml, /Open Shiya, Da profile/);
  assert.match(membersHtml, /Open Jian, Mo profile/);
  assert.match(membersHtml, /Open Zedong, Jin profile/);
  assert.match(membersHtml, /Open Zhiheng, Xu profile/);
  assert.match(membersHtml, /Open Zimeng Jessie, Yu profile/);
  assert.equal((membersHtml.match(/>TEAM LEADER</g) ?? []).length, 4);
  assert.equal((membersHtml.match(/>ADVISOR</g) ?? []).length, 2);
  assert.ok(membersHtml.indexOf('id="supervisor-heading"') < membersHtml.indexOf('>Advisors<'));
  assert.ok(membersHtml.indexOf('>Advisors<') < membersHtml.indexOf('>Team Leaders<'));
  assert.ok(membersHtml.indexOf('>Team Leaders<') < membersHtml.indexOf('>Team Members<'));
  assert.doesNotMatch(membersHtml, /member-mountains/);
  assert.doesNotMatch(membersHtml, /iGEM/);

  const supervisorResponse = await render("/descriptions");
  const supervisorHtml = await supervisorResponse.text();
  assert.match(supervisorHtml, />Team Supervisor</);
  assert.match(supervisorHtml, /Open Jian, Mo profile/);
  assert.doesNotMatch(supervisorHtml, /Mo Jian/);
});

test("navigation keeps real href fallbacks for Safari", async () => {
  const response = await render("/");
  const html = await response.text();
  const canvaNavRoutes = ["/members", "/description", "/methods", "/design", "/model", "/engineering", "/experiment", "/analysis", "/results", "/contribution", "/notebook", "/protocol"];
  for (const route of canvaNavRoutes) {
    assert.match(html, new RegExp(`href=["']${route}["']`), route);
  }
  assert.doesNotMatch(html, /href=["']\/attributions["']/);
  assert.doesNotMatch(html, /href=["']\/work-distribution["']/);
  assert.doesNotMatch(html, /href=["']\/descriptions["']/);
  assert.doesNotMatch(html, /href=["']#["']/);
});

test("document articles keep every paragraph and heading-only native anchor navigation", async () => {
  const articles = JSON.parse(readFileSync(new URL('../app/wiki-articles.json', import.meta.url), 'utf8'));
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  for (const [slug, article] of Object.entries(articles)) {
    const html = await (await render("/description")).text();
    const ids = new Set();
    for (const section of article.sections) {
      assert.ok(!ids.has(section.id)); ids.add(section.id);
      assert.ok(html.includes(`href="#${section.id}">${escape(section.title)}</a>`));
      assert.ok(html.includes(`id="${section.id}" tabindex="-1">${escape(section.title)}</h2>`));
      for (const paragraph of section.paragraphs) assert.ok(html.includes(`<p>${escape(paragraph)}</p>`), section.title);
    }
    const nav = html.match(/<nav class="project-outline wiki-article-outline"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav);
    assert.doesNotMatch(nav, /<p|<span|<h[1-6]/);
    assert.equal((nav.match(/<a /g) ?? []).length, 8);
  }
});

test("Word source text is complete without rewriting or omissions", () => {
  const articles = JSON.parse(readFileSync(new URL('../app/wiki-articles.json', import.meta.url), 'utf8'));
  const audit = JSON.parse(readFileSync(new URL('../docs/content-source-audit.json', import.meta.url), 'utf8'));
  const sections = Object.values(articles).flatMap(page => page.sections);
  assert.equal(sections.length, audit.sections.length);
  for (const source of audit.sections) {
    const section = sections.find(s => s.number === source.number);
    assert.equal(section.heading, source.heading);
    const text = section.paragraphs.join('').replace(/\s+/g, '');
    assert.equal(text.length, source.nonWhitespaceCharacters);
    assert.equal(createHash('sha256').update(text).digest('hex'), source.sha256, source.heading);
  }
});

test("home has one navigation bar and keeps interactive actions", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.equal((html.match(/class="site-header"/g) ?? []).length, 1);
  assert.match(html, /class="home-hero"/);
  assert.match(html, /href="\/description">Explore the project/);
  assert.match(html, /href="\/team">Meet the team/);
  assert.match(html, /href="#slide-2">Scroll to discover/);
  assert.doesNotMatch(html, /slides\/slide-01\.png/);
});

test("revised manuscript pages preserve assigned text and every embedded figure", async () => {
  const data = JSON.parse(readFileSync(new URL('../app/paper-articles.json', import.meta.url), 'utf8'));
  const audit = JSON.parse(readFileSync(new URL('../docs/revised-paper-audit.json', import.meta.url), 'utf8'));
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  const used = [];
  for (const [slug, page] of Object.entries(data.pages)) {
    const html = await (await render(`/${slug}`)).text();
    const stillRendered = ["model", "experiment"].includes(slug);
    for (const section of page.sections) {
      if (stillRendered) {
        assert.ok(html.includes(`href="#${section.id}">${escape(section.title)}</a>`));
        assert.ok(html.includes(`id="${section.id}" tabindex="-1">${escape(section.title)}</h2>`));
      }
      for (const block of section.blocks) {
        if (block.type === 'paragraph') {
          assert.equal(block.text, audit.paragraphs[block.sourceParagraph]);
          if (stillRendered) assert.ok(html.includes(`<p>${escape(block.text)}</p>`));
        } else if (block.type === 'figure') {
          used.push(block.figure);
          const fig = data.figures[block.figure];
          if (stillRendered) assert.ok(html.includes(`<figcaption>${escape(fig.caption)}</figcaption>`));
          if (fig.src) {
            if (stillRendered) assert.ok(html.includes(`src="${fig.src}"`));
            const bytes = readFileSync(new URL(`../public${fig.src}`, import.meta.url));
            assert.equal(createHash('sha256').update(bytes).digest('hex'), audit.figures[block.figure].sha256);
          }
        }
      }
    }
  }
  assert.deepEqual(used.sort((a,b)=>a-b), Array.from({length:12}, (_,i)=>i+1));
  assert.equal(Object.values(data.figures).filter(f=>f.src).length, 11);
  assert.equal(data.figures[2].src, null);
});

test("home diagrams are real elements and reading controls exist on every route", async () => {
  const html = await (await render("/")).text();
  for (const name of ["editing-flow", "host-transfer", "track-cards", "evidence-flow"]) assert.ok(html.includes(name), name);
  assert.match(html, /class="question-photo"/);
  assert.match(html, /src="\/assets\/petri-dish.jpeg"/);
  assert.match(html, /Can mutation stacking and accessory proteins jointly improve ISCro4\/MM168 inversion activity in/);
  assert.match(html, /class="story-footer-link" href="\/members"/);
  assert.match(html, /class="story-footer-link" href="\/description"><h3>About Topic<\/h3>/);
  assert.match(html, /href="mailto:mo202505@163.com">mo202505@163.com/);
  assert.match(html, /class="flow-current"/);
  assert.doesNotMatch(html, /slides\/slide-0[2356]\.png/);
  assert.match(html, /A225S/);
  assert.match(html, /3 independent colonies × 2 technical replicates/);
  assert.doesNotMatch(html, /≥2×|host optimization|Inversion assay|3 technical replicates/);
  for (const route of routes) {
    const page = await (await render(route)).text();
    assert.match(page, /aria-label="Page reading progress"/, route);
    assert.match(page, /aria-label="Back to top"/, route);
  }
});

test("uploaded reports preserve all source text and images with native section links", async () => {
  const data = JSON.parse(readFileSync(new URL('../app/report-articles.json', import.meta.url), 'utf8'));
  const audit = JSON.parse(readFileSync(new URL('../docs/report-source-audit-20261004.json', import.meta.url), 'utf8'));
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  let imageCount = 0;
  for (const [slug, page] of Object.entries(data)) {
    const html = await (await render(`/${slug}`)).text();
    const blocks = page.sections.flatMap(section => section.blocks);
    for (const section of page.sections) {
      assert.ok(html.includes(`href="#${section.id}">${escape(section.title)}</a>`));
      assert.ok(html.includes(`id="${section.id}" tabindex="-1">${escape(section.title)}</h2>`));
    }
    for (const source of audit[slug].paragraphs) {
      if (source.paragraph === 0) { assert.equal(page.title, source.text); continue; }
      if (source.role === 'heading') { assert.ok(page.sections.some(s => s.title === source.display)); continue; }
      if (source.role === 'editorial-placeholder-replaced-by-requested-heading') continue;
      if (source.text) {
        const matched = blocks.filter(b => b.sourceParagraph === source.paragraph && b.text !== undefined);
        assert.equal(matched.length, 1);
        assert.equal(matched[0].text, source.text);
        assert.ok(html.includes(escape(source.text)), `${slug} paragraph ${source.paragraph}`);
      }
      for (const image of source.images) {
        imageCount++;
        assert.equal(blocks.filter(b => b.src === image.src).length, 1);
        assert.ok(html.includes(`src="${image.src}"`));
        assert.equal(createHash('sha256').update(readFileSync(new URL(`../public${image.src}`, import.meta.url))).digest('hex'), image.sha256);
      }
    }
  }
  assert.equal(imageCount, 13);
  assert.equal(data.analysis.sections.length, 6);
});

test("Project order, relocated Method, and new Documents pages match the requested scope", async () => {
  const html = await (await render("/description")).text();
  const copy = html.slice(html.indexOf('<article'));
  assert.ok(copy.indexOf('id="challenge"') < copy.indexOf('id="method"'));
  assert.ok(copy.indexOf('id="method"') < copy.indexOf('id="plasmid-construction-and-verification"'));
  assert.ok(copy.indexOf('id="qpcr-inversion-detection"') < copy.indexOf('id="project-description"'));
  const menu = html.match(/id="project-menu"[^>]*>([\s\S]*?)<\/div>/)[1];
  const order = [...menu.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(order, ["/description", "/design", "/methods", "/engineering", "/results", "/analysis", "/model", "/experiment"]);
  for (const slug of ["safety", "supplement-files"]) {
    assert.ok(html.includes(`href="/${slug}"`));
    const page = await (await render(`/${slug}`)).text();
    assert.match(page, /class="document-cover"/);
    assert.doesNotMatch(page, /<p>/);
  }
});
