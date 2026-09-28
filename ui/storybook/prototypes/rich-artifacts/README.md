# Artifact cards

Storybook: **Explorations → Artifact cards**.

Each story renders exactly one card, without a page shell, study heading, or
gallery. The previous mixed studies and their hardcoded Settings/workspace
previews have been removed. This is a design prototype, isolated from production
routes and APIs.

## Editing the cards

Open **Controls** in Storybook. Every artifact-specific value is an arg in its
individual `ui/storybook/stories/artifact-cards/*.stories.tsx` file. No sample
titles, authors, content, filenames, repository names, or URLs live in the
renderers in `ArtifactCards.tsx`.

| Story | Editable data besides title, summary, author, and date |
| --- | --- |
| Pull request | Number, repository, source/target branches, state, check state, evidence source, review summary, diff counts, URL |
| Commit | SHA, repository, branch, diff counts, URL |
| Document | Filename, revision, actual Markdown body |
| Data | Filename, column array, row array; displayed counts and CSV download derive from these arrays |
| Image | Filename, actual image URL, alt text, dimensions |
| Video | Filename, actual video URL, poster URL, duration |
| Link preview | Destination URL, optional saved image URL and alt text |
| File | Filename, MIME type, size, optional archive entry list, download URL |

Clear **summary** to remove the description. For arrays, use Storybook's
**Edit … as JSON** switch or its tree editor. **Reset controls** restores the
example values. Theme and viewport use Storybook's existing toolbar controls;
they do not need additional stories.

Fixed component copy is limited to type labels, action labels, metadata labels,
and state labels: e.g. “Pull request,” “Open pull request,” “Source,” “Checks
passed,” “Read document,” “View data,” and “No preview available.” Markdown
headings and table column names are artifact content, not fixed labels.

## Where the examples come from

PAP-54 was inspected on staging on 2026-09-28. It contains four registered GitHub
work products created by Codie:

- PR #14141, “Per-user keyboard shortcut preference,” merged; +1,159 / −68 in
  30 files.
- `274d3f52`: preference isolation and audit fixes; +105 / −37 in 10 files.
- `b99adf15`: publication and API contract fixes; +38 / −4 in 5 files.
- `1c3c9ddf`: historical-schema worktree fixture fix; +12 / −8 in 1 file.

The PR and Commit stories use captured task facts. Their explanatory summaries
are authored examples; CI and review results are agent-reported from the final
handoff, not live GitHub data. All other story data is illustrative. The image
and video use the repository's existing local Paper Trail fixtures. The File
story downloads its small sample text from a data URL. The Link preview has no
embedded demo app or simulated workspace.

## Run

```sh
pnpm --filter @paperclipai/ui exec storybook dev --port 6014 --host 127.0.0.1 --no-open -c storybook/.storybook
```

Start at `/?path=/story/explorations-artifact-cards-pull-request--pull-request`.

## Integration boundary

Production integration should extend the existing `RichWorkProductCard` and
`IssuePropertiesArtifactsTab`. Preserve company authorization, attachment/work
product deduplication, source attribution, and freshness. Missing summaries
should be omitted. Missing provider state must remain unknown. These prototypes
do not infer runtime health or synthesize content for absent files.

## Verification (2026-09-28)

- UI typecheck, token gates, and the static Storybook build pass.
- Story index contains eight card stories; each renders one card.
- Browser checks exercised text and state controls on the PR, JSON column/row
  controls on Data, and Markdown body edits in both the Document card and viewer.
- Image preview loaded; local video metadata reports three seconds and no error.
- Built Storybook is served at `http://127.0.0.1:6015`; the development server
  remains at port 6014. Use the built preview for reviewing the finished stories.
