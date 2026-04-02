import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SCHOLAR_URL =
	'https://scholar.google.com/citations?user=jBejY7cAAAAJ&hl=en&view_op=list_works&sortby=pubdate';
const OPENALEX_URL = 'https://api.openalex.org/works';
const PUBMED_ESEARCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_EFETCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'publications.ts');
const MAX_PUBLICATIONS = 20;
const REQUEST_RETRIES = 3;

function decodeHtmlEntities(value) {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&ndash;/g, '-')
		.replace(/&nbsp;/g, ' ')
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripTags(value) {
	return decodeHtmlEntities(value.replace(/<[^>]+>/g, ' '))
		.replace(/\s+/g, ' ')
		.trim();
}

function normalizeTitle(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

function reconstructAbstract(invertedIndex) {
	if (!invertedIndex) {
		return '';
	}

	const words = [];
	for (const [word, positions] of Object.entries(invertedIndex)) {
		for (const position of positions) {
			words[position] = word;
		}
	}

	return words.join(' ').replace(/\s+/g, ' ').trim();
}

function cleanText(value) {
	return value.replace(/\s+/g, ' ').trim();
}

async function fetchText(url) {
	let lastError;

	for (let attempt = 1; attempt <= REQUEST_RETRIES; attempt += 1) {
		try {
			const response = await fetch(url, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; LabWebsitePrototype/1.0)',
				},
			});

			if (!response.ok) {
				throw new Error(`Request failed: ${response.status} ${response.statusText} for ${url}`);
			}

			return response.text();
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError;
}

async function fetchJson(url) {
	let lastError;

	for (let attempt = 1; attempt <= REQUEST_RETRIES; attempt += 1) {
		try {
			const response = await fetch(url, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (compatible; LabWebsitePrototype/1.0)',
					Accept: 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`Request failed: ${response.status} ${response.statusText} for ${url}`);
			}

			return response.json();
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError;
}

function extractPubMedAbstract(xml) {
	const matches = [...xml.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)];
	if (!matches.length) {
		return '';
	}

	return matches
		.map((match) => {
			const attrs = match[1] ?? '';
			const label = attrs.match(/Label="([^"]+)"/)?.[1];
			const text = cleanText(stripTags(match[2] ?? ''));

			if (!text) {
				return '';
			}

			return label ? `${label}: ${text}` : text;
		})
		.filter(Boolean)
		.join(' ');
}

function extractScholarDescription(html) {
	const match = html.match(
		/<div class="gsc_oci_field">Description<\/div><div class="gsc_oci_value"[^>]*>([\s\S]*?)<\/div><\/div>/,
	);

	if (!match) {
		return '';
	}

	return cleanText(stripTags(match[1]));
}

async function fetchPubMedAbstract(title) {
	try {
		const searchTerms = [`"${title}"[Title]`, `${title}[Title]`];

		for (const term of searchTerms) {
			const searchUrl = `${PUBMED_ESEARCH_URL}?db=pubmed&retmode=json&term=${encodeURIComponent(term)}`;
			const searchResponse = await fetchJson(searchUrl);
			const pubmedId = searchResponse?.esearchresult?.idlist?.[0];

			if (!pubmedId) {
				continue;
			}

			const fetchUrl = `${PUBMED_EFETCH_URL}?db=pubmed&id=${encodeURIComponent(pubmedId)}&retmode=xml`;
			const fetchResponse = await fetchText(fetchUrl);
			const abstract = extractPubMedAbstract(fetchResponse);

			if (abstract) {
				return abstract;
			}
		}
	} catch (error) {
		console.warn(`PubMed lookup failed for "${title}": ${error.message}`);
	}

	return '';
}

async function fetchScholarDescription(scholarUrl) {
	if (!scholarUrl) {
		return '';
	}

	try {
		const html = await fetchText(scholarUrl);
		return extractScholarDescription(html);
	} catch (error) {
		console.warn(`Google Scholar description lookup failed for "${scholarUrl}": ${error.message}`);
		return '';
	}
}

function parseScholarPublications(html) {
	const rows = [...html.matchAll(/<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g)];

	return rows.slice(0, MAX_PUBLICATIONS).map((row) => {
		const block = row[1];
		const titleMatch = block.match(/class="gsc_a_at">([\s\S]*?)<\/a>/);
		const hrefMatch = block.match(/<a href="([^"]+)"[^>]*class="gsc_a_at"/);
		const metadataMatches = [...block.matchAll(/<div class="gs_gray">([\s\S]*?)<\/div>/g)];
		const yearMatch = block.match(/<span class="gsc_a_h gsc_a_hc gs_ibl">(\d{4})<\/span>/);

		const title = cleanText(stripTags(titleMatch?.[1] ?? ''));
		const authors = cleanText(stripTags(metadataMatches[0]?.[1] ?? ''));
		const venue = cleanText(stripTags(metadataMatches[1]?.[1] ?? ''));
		const year = yearMatch?.[1] ?? '';
		const scholarUrl = hrefMatch?.[1]
			? new URL(decodeHtmlEntities(hrefMatch[1]), 'https://scholar.google.com').toString()
			: '';

		return {
			title,
			authors,
			venue,
			year,
			scholarUrl,
		};
	});
}

function chooseBestOpenAlexResult(title, year, results) {
	const normalizedTitle = normalizeTitle(title);
	const numericYear = Number(year);

	return (
		results.find(
			(item) =>
				normalizeTitle(item.title ?? item.display_name ?? '') === normalizedTitle &&
				(!numericYear || item.publication_year === numericYear),
		) ??
		results.find((item) => normalizeTitle(item.title ?? item.display_name ?? '') === normalizedTitle) ??
		results.find((item) => !numericYear || item.publication_year === numericYear) ??
		results[0] ??
		null
	);
}

async function enrichPublication(publication) {
	const searchUrl = `${OPENALEX_URL}?search=${encodeURIComponent(publication.title)}&per-page=5`;
	const openAlex = await fetchJson(searchUrl);
	const bestResult = chooseBestOpenAlexResult(publication.title, publication.year, openAlex.results ?? []);

	if (!bestResult) {
		return {
			year: publication.year,
			journal: publication.venue,
			title: publication.title,
			citation: publication.authors,
			summary: '',
			scholarUrl: publication.scholarUrl,
		};
	}

	const authors = (bestResult.authorships ?? [])
		.map((item) => item.author?.display_name)
		.filter(Boolean)
		.join(', ');

	const journal =
		bestResult.primary_location?.source?.display_name ||
		bestResult.primary_location?.raw_source_name ||
		publication.venue;
	const pubmedAbstract = await fetchPubMedAbstract(publication.title);
	const scholarDescription = await fetchScholarDescription(publication.scholarUrl);

	return {
		year: String(publication.year ?? bestResult.publication_year ?? ''),
		journal: cleanText(journal ?? ''),
		title: cleanText(publication.title || bestResult.title || bestResult.display_name || ''),
		citation: cleanText(authors || publication.authors),
		summary:
			cleanText(pubmedAbstract) ||
			cleanText(scholarDescription) ||
			cleanText(reconstructAbstract(bestResult.abstract_inverted_index)),
		scholarUrl: publication.scholarUrl,
	};
}

function toTsModule(publications) {
	return `export type Publication = {
	year: string;
	journal: string;
	title: string;
	citation: string;
	summary: string;
	scholarUrl: string;
};

export const publications: Publication[] = ${JSON.stringify(publications, null, 2)};\n`;
}

async function main() {
	const scholarHtml = await fetchText(SCHOLAR_URL);
	const parsed = parseScholarPublications(scholarHtml);
	const enriched = [];

	for (const publication of parsed) {
		const item = await enrichPublication(publication);
		enriched.push(item);
	}

	await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
	await writeFile(OUTPUT_PATH, toTsModule(enriched), 'utf8');

	console.log(`Synced ${enriched.length} publications to ${OUTPUT_PATH}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
