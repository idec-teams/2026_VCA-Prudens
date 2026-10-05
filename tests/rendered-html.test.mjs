import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const routes = [
  "/", "/members", "/descriptions", "/attributions", "/work-distribution",
  "/description", "/methods", "/design", "/model", "/engineering", "/experiment", "/analysis",
  "/results", "/contribution", "/notebook", "/protocol", "/mutation-selection", "/safety", "/supplement-files",
];

test("shared page introductions preserve titles and use the two-font design system", async () => {
  for (const slug of ["description", "design", "methods", "engineering", "results", "analysis", "safety", "supplement-files", "contribution"]) {
    const html = await (await render("/" + slug)).text();
    assert.match(html, /class="page-hero"/);
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
    assert.match(html, /class="wiki-theme antialiased"/);
  }
  const description = await (await render("/description")).text();
  assert.match(description, /Dive deep into our project/);
  const css = readFileSync(new URL("../app/design-system.css", import.meta.url), "utf8");
  assert.match(css, /--font-display: Georgia, serif/);
  assert.match(css, /--font-body: Arial, sans-serif/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /motion-paused/);
});

test("Notebook and Protocol preserve the full supplied documents with scoped layouts", async () => {
  const data = JSON.parse(readFileSync(new URL('../app/lab-documents.json', import.meta.url), 'utf8'));
  const audit = JSON.parse(readFileSync(new URL('../docs/lab-documents-source-audit-20261004.json', import.meta.url), 'utf8'));
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  for (const [slug, page] of Object.entries(data)) {
    assert.deepEqual([page.title, page.subtitle, page.intro, ...page.sections.flatMap(s => [s.sourceHeading, ...s.paragraphs])], audit[slug].paragraphs);
    assert.equal(page.sections.length, 7);
    const html = await (await render('/' + slug)).text();
    assert.ok(html.includes(escape(page.title)));
    assert.ok(html.includes(escape(page.subtitle)));
    assert.ok(html.includes(escape(page.intro)));
    for (const section of page.sections) {
      assert.ok(html.includes(`id="${section.id}" tabindex="-1"`));
      assert.ok(html.includes(escape(section.title)));
      if (slug === 'notebook') {
        assert.equal(section.date + '  ' + section.title, section.sourceHeading);
        assert.ok(html.includes(`href="#${section.id}"`));
        assert.ok(html.includes(escape(section.date)));
      } else {
        assert.equal(section.title, section.sourceHeading.replace(/^\d+\s+/, ''));
        assert.doesNotMatch(section.title, /^\d+\s/);
      }
      for (const p of section.paragraphs) assert.ok(html.includes(`<p>${escape(p)}</p>`));
    }
    assert.equal((html.match(new RegExp('class="' + (slug === 'notebook' ? 'lab-notebook-entry' : 'lab-protocol-note') + '"', 'g')) ?? []).length, 7);
    assert.doesNotMatch(html, /XXXXXX|protocol直接跳转/);
  }
});

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
  assert.match(membersHtml, /id="team-intro-title">Our Team<br\/><span>Members<\/span><\/h1>/);
  assert.equal((membersHtml.match(/<h1/g) ?? []).length, 1);
  assert.equal((membersHtml.match(/<h2 id="members-heading">Team Members<\/h2>/g) ?? []).length, 1);
  assert.equal((membersHtml.match(/class="member-card"/g) ?? []).length, 20);
  assert.match(membersHtml, /Open Haotian, Lu profile/);
  assert.match(membersHtml, /Open Shiya, Da profile/);
  assert.match(membersHtml, /Open Jian, Mo profile/);
  assert.match(membersHtml, /Open Zedong, Jin profile/);
  assert.match(membersHtml, /Open Zhiheng, Xu profile/);
  assert.match(membersHtml, /Open Zimeng Jessie, Yu profile/);
  assert.equal((membersHtml.match(/>TEAM LEADER</g) ?? []).length, 4);
  assert.equal((membersHtml.match(/>ADVISOR</g) ?? []).length, 2);
  assert.ok(membersHtml.indexOf('id="supervisor-heading"') < membersHtml.indexOf('id="advisors-heading"'));
  assert.ok(membersHtml.indexOf('id="advisors-heading"') < membersHtml.indexOf('id="leaders-heading"'));
  assert.ok(membersHtml.indexOf('id="leaders-heading"') < membersHtml.indexOf('id="members-heading"'));
  assert.doesNotMatch(membersHtml, /member-mountains/);
  assert.doesNotMatch(membersHtml, /iGEM/);

  const supervisorResponse = await render("/descriptions");
  const supervisorHtml = await supervisorResponse.text();
  assert.match(supervisorHtml, />Team Supervisor</);
  assert.match(supervisorHtml, /Open Jian, Mo profile/);
  assert.doesNotMatch(supervisorHtml, /Mo Jian/);
});

test("retired Team overview is absent and Home retains accessible motion controls", async () => {
  const response = await render('/team');
  assert.equal(response.status, 404);
  const html = await (await render('/')).text();
  assert.doesNotMatch(html, /href="\/team"|Meet ISCro4\./);
  assert.match(html, />Meet ISCro4<\/h2>/);
  assert.match(html, /Pause motion/);
  assert.match(html, /class="hero-orbit" aria-hidden="true"/);
  const motion = readFileSync(new URL('../app/HomeExperience.tsx', import.meta.url), 'utf8');
  assert.match(motion, /prefers-reduced-motion/);
  assert.match(motion, /Skip intro/);
  assert.match(motion, /setTimeout\(stop, 3500\)/);
});

test("navigation keeps real href fallbacks for Safari", async () => {
  const response = await render("/");
  const html = await response.text();
  const canvaNavRoutes = ["/members", "/description", "/methods", "/design", "/engineering", "/analysis", "/results", "/contribution", "/notebook", "/protocol"];
  for (const route of canvaNavRoutes) {
    assert.match(html, new RegExp(`href=["']${route}["']`), route);
  }
  assert.doesNotMatch(html, /href=["']\/attributions["']/);
  assert.doesNotMatch(html, /href=["']\/work-distribution["']/);
  assert.doesNotMatch(html, /href=["']\/descriptions["']/);
  assert.doesNotMatch(html, /href=["']\/(?:model|experiment)["']/);
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
      const level = slug === 'methods' ? 'h3' : 'h2';
      assert.ok(html.includes(`id="${section.id}" tabindex="-1">${escape(section.title)}</${level}>`));
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
  assert.match(html, /href="\/members">Meet the team/);
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
  assert.deepEqual(order, ["/description", "/design", "/methods", "/engineering", "/results", "/analysis"]);
  for (const slug of ["safety", "supplement-files"]) {
    assert.ok(html.includes(`href="/${slug}"`));
    const page = await (await render(`/${slug}`)).text();
    assert.match(page, /class="page-hero"/);
    assert.match(page, /Open full PDF/);
  }
});

test("Safety preserves the complete Word text and both original PDFs remain byte-identical", async () => {
  const data = JSON.parse(readFileSync(new URL('../app/safety-article.json', import.meta.url), 'utf8'));
  const audit = JSON.parse(readFileSync(new URL('../docs/documents-source-audit-20261004.json', import.meta.url), 'utf8'));
  assert.deepEqual([data.title, ...data.sections.flatMap(s => [s.title, ...s.paragraphs])], audit.safety.paragraphs);
  assert.equal(data.sections.length, 7);
  assert.equal(data.sections.flatMap(s => s.paragraphs).length, 16);
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  const safetyHtml = await (await render("/safety")).text();
  for (const section of data.sections) {
    assert.ok(safetyHtml.includes(`href="#${section.id}"`));
    assert.ok(safetyHtml.includes(`id="${section.id}" tabindex="-1">${escape(section.title)}</h2>`));
    for (const p of section.paragraphs) assert.ok(safetyHtml.includes(`<p>${escape(p)}</p>`));
  }
  assert.ok(safetyHtml.indexOf('id="ethical-considerations"') < safetyHtml.indexOf('id="responsible-research-form"'));
  for (const pdf of audit.pdfs) {
    const bytes = readFileSync(new URL(`../public${pdf.src}`, import.meta.url));
    assert.equal(bytes.length, pdf.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), pdf.sha256);
  }
  const supplementHtml = await (await render("/supplement-files")).text();
  assert.match(supplementHtml, /<iframe[^>]*src="\/assets\/documents-20261004\/supplementary-material.pdf#view=FitH"/);
  assert.equal((supplementHtml.match(/<figure id="supplement-page-/g) ?? []).length, 8);
  for (let page = 1; page <= 8; page++) {
    assert.ok(supplementHtml.includes(`href="#supplement-page-${page}"`));
    assert.ok(readFileSync(new URL(`../public/assets/documents-20261004/supplementary-page-${page}.jpg`, import.meta.url)).length > 0);
  }
});

test("Method outline has an accessible disclosure and subordinate body headings", async () => {
  const html = await (await render("/description")).text();
  assert.match(html, /aria-label="Expand Method subsections" aria-expanded="false" aria-controls="outline-method"/);
  assert.match(html, /class="outline-children" id="outline-method" hidden=""/);
  assert.equal((html.match(/class="method-subsection"/g) ?? []).length, 4);
  assert.equal((html.match(/<h3 id="/g) ?? []).length, 4);
});

test("Contribution preserves every source cell, flower position, and guidance paragraph", async () => {
  const data = JSON.parse(readFileSync(new URL('../app/contribution-data.json', import.meta.url), 'utf8'));
  const audit = JSON.parse(readFileSync(new URL('../docs/contribution-source-audit-20261004.json', import.meta.url), 'utf8'));
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  assert.deepEqual(data, audit.original);
  assert.equal(data.members.length, 17);
  assert.equal(data.columns.length, 11);
  const html = await (await render("/contribution")).text();
  for (const column of data.columns) assert.ok(html.includes(escape(column.label)));
  for (const member of data.members) {
    assert.ok(html.includes(`<th scope="row">${escape(member.name)}</th>`));
    for (const column of data.columns) {
      const marker = `data-member="${escape(member.name)}" data-role="${column.id}">`;
      const start = html.indexOf(marker);
      assert.ok(start > 0, marker);
      const cell = html.slice(start + marker.length, html.indexOf('</td>', start));
      assert.equal(cell.includes('class="contribution-flower"'), member.roles.includes(column.id), marker);
    }
  }
  assert.equal((html.match(/class="contribution-flower"/g) ?? []).length, data.members.reduce((sum, member) => sum + member.roles.length, 0));
  for (const section of data.guidance) {
    assert.ok(html.includes(escape(section.heading)));
    assert.ok(html.includes(`<p>${escape(section.text)}</p>`));
  }
  assert.equal(createHash('sha256').update(readFileSync(new URL(`../public${data.flower}`, import.meta.url))).digest('hex'), audit.flowerSha256);
});
