# How Search Engines Work

A search engine is a machine that answers questions by pointing at documents. You type a few words, it returns a ranked list of pages it thinks are relevant. That's the entire user-facing product.

What happens between your query and those results is one of the largest computational efforts ever built. Google alone crawls hundreds of billions of pages, indexes them, and re-ranks the web on every query — in under a second.

Understanding the pipeline explains a lot: why some pages rank, why others don't, why results change, and why SEO exists at all.

## The Three Stages

Every search engine, from Google to DuckDuckGo to a small self-hosted one, does the same three things.

- **Crawling** — finding pages on the web.
- **Indexing** — understanding and storing what's on them.
- **Ranking** — deciding what to show for a given query.

Each stage is a different problem, solved by different systems. Most of the complexity lives in the last one.

## Crawling

A search engine starts with a list of known URLs and follows links outward, like a spider. Programs called **crawlers** (or **spiders**) fetch pages, extract every link on them, and add those links to a queue.

Some ground rules:

- **`robots.txt`** — a file at the root of a site that tells crawlers what they may and may not fetch.
- **`sitemap.xml`** — a file that lists all the pages a site wants indexed.
- **`noindex`** — a meta tag or header that tells the engine not to include a page in results.
- **`nofollow`** — a link attribute that says "don't count this as an endorsement."

Crawling is continuous. Google re-crawls popular pages frequently and obscure ones rarely. A page that changes often gets crawled often. A page nobody links to might be crawled once and never again.

## Indexing

Once a crawler fetches a page, the engine has to understand it. That means more than storing the text.

- **Tokenization** — breaking text into words and phrases.
- **Stemming** — reducing words to their root forms, so "running" matches "run."
- **Language detection** — figuring out what language the page is in.
- **Entity extraction** — recognizing people, places, brands, and concepts.
- **Link analysis** — counting who links to the page and with what anchor text.
- **Structure parsing** — reading headings, lists, tables, and metadata.

The result is an **inverted index**: a lookup table mapping every word to the pages that contain it. That's what makes search fast. Instead of scanning every page for "encryption," the engine looks up "encryption" and gets back a list of pages that contain it.

> The inverted index is the core data structure of search. Everything else is optimization on top of it.

## Ranking

Ranking is where search engines compete. Given a query and a set of candidate pages, which ones go first?

Modern ranking uses hundreds of signals. Some of the most important categories:

- **Relevance** — does the page actually answer the query?
- **Authority** — do other trustworthy pages link to it?
- **Freshness** — is the content recent, and does the query care?
- **User signals** — do people click and stay, or bounce?
- **Page experience** — is it fast, mobile-friendly, free of intrusive ads?
- **Context** — where is the user, what language, what device?

Traditional engines weighted links heavily — that's the original PageRank idea. Modern engines layer machine learning on top, using behavior and semantics to fine-tune.

The exact formula is a trade secret, updated constantly, and never published. That's why SEO is more art than engineering.

## PageRank, Briefly

**PageRank** was Google's original ranking algorithm. The idea: a page is important if important pages link to it.

Each page gets a score. Incoming links pass some of that score onward. Links from high-scoring pages count more. Links from many pages add up. Over time, the whole web settles into a ranking of importance, computed iteratively.

It's no longer the dominant signal, but its logic still underlies how search engines think about authority.

## Why Results Differ Between Engines

Google, Bing, DuckDuckGo, and Brave all crawl and index the web, but they rank differently and cover different portions of it.

- **Google** — largest index, most signals, most aggressive personalization.
- **Bing** — smaller index, powers DuckDuckGo results, strong on some verticals.
- **DuckDuckGo** — meta-search built primarily on Bing, no personalization.
- **Brave Search** — independent index, privacy-focused, no tracking.
- **Kagi** — paid, no ads, fully customizable ranking.

If you search the same thing on three engines, you'll often get three different top results. That's a feature, not a bug — it reflects different assumptions about what matters.

## Why SEO Exists

Because ranking determines traffic, and traffic determines revenue, an entire industry exists to influence it. **Search engine optimization** is the practice of trying to rank higher in organic results.

Legitimate SEO is boring: write clear content, use proper headings, make pages fast, get linked by trustworthy sites, don't spam. That's it.

The rest — link farms, keyword stuffing, cloaking, content spinning — is a cat-and-mouse game against the ranking algorithms. It works briefly, then stops working, often with a penalty.

> SEO is not about tricking search engines. It's about making it easy for them to recognize that your page is the right answer.

## The Ad Layer

Organic results are only half the page. The other half is **paid search** — ads that appear above, below, or beside the organic list.

Advertisers bid on keywords. The winning bidder pays per click. Ranking for ads is a mix of bid amount, quality score, and relevance. A high-quality ad with a moderate bid can beat a low-quality ad with a high bid.

This is how Google makes most of its money, and it's why the visible page is often more ads than answers.

## What Search Engines Can't Do

Despite the scale, search engines have real limits:

- They can't index what they can't crawl — paywalls, login walls, `robots.txt` blocks.
- They can't read what isn't there — content inside images, videos, or JavaScript that never renders.
- They can't judge truth — popularity and relevance are not the same as accuracy.
- They can't ignore manipulation entirely — spam, SEO games, and coordinated content still work.
- They can't give you the same result twice — personalization and freshness mean your results change constantly.

## The Honest Summary

Search engines are:

- One of the largest distributed systems ever built
- Fundamentally about crawling, indexing, and ranking
- Increasingly powered by machine learning
- Financially driven by advertising, not by search quality alone
- Occasionally wrong, often useful, and never neutral

They're infrastructure now, like electricity. Most people never think about them until they can't find something.

> A search engine isn't a truth machine. It's a relevance machine. Knowing the difference is half the skill of using one well.

## Further Reading

- [How Search Works — Google](https://www.google.com/search/howsearchworks/)
- [Introduction to Information Retrieval — Manning, Raghavan, Schütze](https://nlp.stanford.edu/IR-book/)
- [The Anatomy of a Large-Scale Hypertextual Web Search Engine — Brin & Page (1998)](http://infolab.stanford.edu/~backrub/google.html)
- [Brave Search — Independent index](https://search.brave.com/)
