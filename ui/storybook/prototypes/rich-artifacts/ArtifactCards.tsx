import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowRight,
  CircleCheck,
  CircleHelp,
  Clock,
  ExternalLink,
  File,
  FileText,
  Film,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  Globe,
  Image as ImageIcon,
  Table2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Renderers contain UI labels only. All artifact-specific content is passed in.
// Example values live exclusively in the individual stories' args.
export interface ArtifactIdentity {
  title: string;
  summary: string;
  author: string;
  updatedAt: string;
}

function Identity({
  title,
  summary,
}: Pick<ArtifactIdentity, "title" | "summary">) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="break-words text-lg font-semibold leading-snug">
        {title}
      </h2>
      {summary && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {summary}
        </p>
      )}
    </div>
  );
}

function Footer({
  author,
  updatedAt,
  action,
}: Pick<ArtifactIdentity, "author" | "updatedAt"> & { action: ReactNode }) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
      <span className="text-xs text-muted-foreground">
        {[author, updatedAt].filter(Boolean).join(" · ")}
      </span>
      {action}
    </footer>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <article className="w-full overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
      {children}
    </article>
  );
}

function SourceLink({ url, children }: { url: string; children: ReactNode }) {
  return url ? (
    <Button variant="outline" size="sm" asChild>
      <a href={url} target="_blank" rel="noreferrer">
        {children}
        <ExternalLink className="size-3" />
      </a>
    </Button>
  ) : (
    <Button variant="outline" size="sm" disabled>
      {children}
    </Button>
  );
}

function Viewer({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {action}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-dvh overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-6">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

interface DiffProps {
  additions: number;
  deletions: number;
  filesChanged: number;
}
function Diff({ additions, deletions, filesChanged }: DiffProps) {
  return (
    <div className="flex flex-wrap gap-2 font-mono text-xs">
      <span className="text-(--status-task-icon-done)">
        +{additions.toLocaleString("en-US")}
      </span>
      <span className="text-(--status-task-icon-blocked)">
        −{deletions.toLocaleString("en-US")}
      </span>
      <span className="text-muted-foreground">
        · {filesChanged} {filesChanged === 1 ? "file" : "files"}
      </span>
    </div>
  );
}

export interface PullRequestCardProps extends ArtifactIdentity, DiffProps {
  number: number;
  repository: string;
  sourceBranch: string;
  targetBranch: string;
  state: "open" | "merged" | "closed";
  checks: "passed" | "pending" | "failed" | "unknown";
  evidenceSource: string;
  reviewSummary: string;
  url: string;
}

const checksLabel = {
  passed: "Checks passed",
  pending: "Checks pending",
  failed: "Checks failed",
  unknown: "Checks not available",
};
const stateLabel = { open: "Open", merged: "Merged", closed: "Closed" };

export function PullRequestCard(props: PullRequestCardProps) {
  const {
    number,
    repository,
    sourceBranch,
    targetBranch,
    state,
    checks,
    evidenceSource,
    reviewSummary,
    url,
  } = props;
  const CheckIcon = {
    passed: CircleCheck,
    pending: Clock,
    failed: TriangleAlert,
    unknown: CircleHelp,
  }[checks];
  const checkTone = {
    passed: "text-(--status-task-icon-done)",
    pending: "text-muted-foreground",
    failed: "text-(--status-task-icon-blocked)",
    unknown: "text-muted-foreground",
  }[checks];
  return (
    <Card>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <GitPullRequest className="size-4" /> Pull request{" "}
            <span className="font-mono">#{number}</span>
          </span>
          <Badge
            variant="outline"
            className={
              state === "merged"
                ? "text-(--status-task-icon-done)"
                : "text-muted-foreground"
            }
          >
            {state === "merged" && <GitMerge className="size-3" />}
            {stateLabel[state]}
          </Badge>
        </div>
        <Identity {...props} />
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <span>{repository}</span>
          <div className="flex min-w-0 items-center gap-2">
            <GitBranch className="size-3.5 shrink-0" />
            <code className="min-w-0 truncate" title={sourceBranch}>
              {sourceBranch}
            </code>
            <ArrowRight className="size-3.5 shrink-0" />
            <code className="min-w-0 truncate" title={targetBranch}>
              {targetBranch}
            </code>
          </div>
        </div>
        <Diff {...props} />
      </div>
      <div className="flex flex-col gap-2 border-t border-border px-5 py-4">
        <span className="flex items-center gap-2 text-xs">
          <CheckIcon className={`size-4 ${checkTone}`} />
          {checksLabel[checks]}
        </span>
        {reviewSummary && (
          <p className="text-xs leading-relaxed">{reviewSummary}</p>
        )}
        {evidenceSource && (
          <p className="text-xs text-muted-foreground">
            Source: {evidenceSource}
          </p>
        )}
      </div>
      <Footer
        {...props}
        action={<SourceLink url={url}>Open pull request</SourceLink>}
      />
    </Card>
  );
}

export interface CommitCardProps extends ArtifactIdentity, DiffProps {
  sha: string;
  repository: string;
  branch: string;
  url: string;
}
export function CommitCard(props: CommitCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-4 p-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <GitCommitHorizontal className="size-4" /> Commit{" "}
          <code title={props.sha}>{props.sha.slice(0, 8)}</code>
        </span>
        <Identity {...props} />
        <span className="break-words text-xs text-muted-foreground">
          {props.repository}
        </span>
        {props.branch && (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <GitBranch className="size-3.5" />
            <code className="min-w-0 truncate">{props.branch}</code>
          </span>
        )}
        <Diff {...props} />
      </div>
      <Footer
        {...props}
        action={<SourceLink url={props.url}>View commit</SourceLink>}
      />
    </Card>
  );
}

function Markdown({ body }: { body: string }) {
  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h3 className="text-lg font-semibold">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="text-base font-semibold">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-sm font-semibold">{children}</h4>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-5">{children}</ol>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {children}
            </a>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

export interface DocumentCardProps extends ArtifactIdentity {
  filename: string;
  revision: number;
  body: string;
}
export function DocumentCard(props: DocumentCardProps) {
  return (
    <Card>
      <div className="max-h-52 overflow-hidden border-b border-border bg-muted/20 p-5">
        <Markdown body={props.body} />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="size-4" /> Markdown · revision {props.revision}
        </span>
        <Identity {...props} />
        <span className="break-all font-mono text-xs text-muted-foreground">
          {props.filename}
        </span>
      </div>
      <Footer
        {...props}
        action={
          <Viewer
            title={props.title}
            description={`${props.filename} · revision ${props.revision}`}
            action="Read document"
          >
            <Markdown body={props.body} />
          </Viewer>
        }
      />
    </Card>
  );
}

export interface DataCardProps extends ArtifactIdentity {
  filename: string;
  columns: string[];
  rows: (string | number)[][];
}
function DataTable({ columns, rows }: Pick<DataCardProps, "columns" | "rows">) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th
                key={i}
                className="border-b border-border px-3 py-3 font-medium text-muted-foreground"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((_, j) => (
                <td key={j} className="border-b border-border/50 px-3 py-3">
                  {row[j] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="p-4 text-xs text-muted-foreground">No rows</p>
      )}
    </div>
  );
}
export function DataCard(props: DataCardProps) {
  const csv = [props.columns, ...props.rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  return (
    <Card>
      <div className="border-b border-border bg-muted/20 px-2">
        <DataTable columns={props.columns} rows={props.rows.slice(0, 3)} />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Table2 className="size-4" /> CSV · {props.rows.length}{" "}
          {props.rows.length === 1 ? "row" : "rows"} · {props.columns.length}{" "}
          {props.columns.length === 1 ? "column" : "columns"}
        </span>
        <Identity {...props} />
        <span className="break-all font-mono text-xs text-muted-foreground">
          {props.filename}
        </span>
      </div>
      <Footer
        {...props}
        action={
          <Viewer
            title={props.title}
            description={props.filename}
            action="View data"
          >
            <DataTable {...props} />
            <Button asChild variant="outline" size="sm" className="w-fit">
              <a
                download={props.filename}
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
              >
                Download CSV
              </a>
            </Button>
          </Viewer>
        }
      />
    </Card>
  );
}

function ImageContent({ src, alt }: { src: string; alt: string }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  return src && failedUrl !== src ? (
    <img
      src={src}
      alt={alt}
      onError={() => setFailedUrl(src)}
      className="aspect-video w-full object-contain"
    />
  ) : (
    <div className="flex aspect-video flex-col items-center justify-center gap-3 text-muted-foreground">
      <ImageIcon className="size-8" />
      <span className="text-xs">No preview available</span>
    </div>
  );
}

export interface ImageCardProps extends ArtifactIdentity {
  filename: string;
  imageUrl: string;
  alt: string;
  width: number;
  height: number;
}
export function ImageCard(props: ImageCardProps) {
  return (
    <Card>
      <div className="border-b border-border bg-muted/20">
        <ImageContent src={props.imageUrl} alt={props.alt} />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="size-4" /> Image · {props.width} ×{" "}
          {props.height}
        </span>
        <Identity {...props} />
        <span className="break-all font-mono text-xs text-muted-foreground">
          {props.filename}
        </span>
      </div>
      <Footer
        {...props}
        action={
          <Viewer
            title={props.title}
            description={props.filename}
            action="View image"
          >
            <ImageContent src={props.imageUrl} alt={props.alt} />
          </Viewer>
        }
      />
    </Card>
  );
}

export interface VideoCardProps extends ArtifactIdentity {
  filename: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
}
export function VideoCard(props: VideoCardProps) {
  return (
    <Card>
      <video
        key={props.videoUrl}
        src={props.videoUrl || undefined}
        poster={props.posterUrl || undefined}
        controls
        preload="metadata"
        aria-label={props.title}
        className="aspect-video w-full border-b border-border bg-muted"
      />
      <div className="flex flex-col gap-3 p-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Film className="size-4" /> Video · {props.duration}
        </span>
        <Identity {...props} />
        <span className="break-all font-mono text-xs text-muted-foreground">
          {props.filename}
        </span>
      </div>
      <Footer
        {...props}
        action={<SourceLink url={props.videoUrl}>Open video</SourceLink>}
      />
    </Card>
  );
}

export interface LinkPreviewCardProps extends ArtifactIdentity {
  url: string;
  imageUrl: string;
  imageAlt: string;
}
export function LinkPreviewCard(props: LinkPreviewCardProps) {
  return (
    <Card>
      {props.imageUrl && (
        <div className="border-b border-border bg-muted/20">
          <ImageContent src={props.imageUrl} alt={props.imageAlt} />
        </div>
      )}
      <div className="flex flex-col gap-4 p-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Globe className="size-4" /> Link preview
        </span>
        <Identity {...props} />
        <span className="break-all font-mono text-xs text-muted-foreground">
          {props.url}
        </span>
      </div>
      <Footer
        {...props}
        action={<SourceLink url={props.url}>Open link</SourceLink>}
      />
    </Card>
  );
}

export interface FileCardProps extends ArtifactIdentity {
  filename: string;
  contentType: string;
  fileSize: string;
  entries: string[];
  downloadUrl: string;
}
export function FileCard(props: FileCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-4 p-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <File className="size-4" /> File · {props.fileSize}
        </span>
        <Identity {...props} />
        <div className="flex flex-col gap-1">
          <span className="break-all font-mono text-xs">{props.filename}</span>
          <span className="break-all text-xs text-muted-foreground">
            {props.contentType}
          </span>
        </div>
        {props.entries.length > 0 && (
          <ul className="flex flex-col gap-2 border-t border-border pt-4">
            {props.entries.map((entry, i) => (
              <li
                key={i}
                className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
              >
                <FileText className="size-3.5 shrink-0" />
                {entry}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer
        {...props}
        action={
          props.downloadUrl ? (
            <Button asChild size="sm" variant="outline">
              <a href={props.downloadUrl} download={props.filename}>
                Download file
              </a>
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Download unavailable
            </Button>
          )
        }
      />
    </Card>
  );
}
