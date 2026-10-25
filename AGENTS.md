<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve published Git history and keep the connected branch in a working state to avoid losing synchronized changes.

- Keep source-derived project figures in `src/lib/project.ts` and test them separately so presentation changes cannot silently alter prices or development facts.
- Serve downloaded reference-site media through Lovable Assets JSON pointers to keep binary media out of the repository.
- Resolve Lovable Assets pointers through `src/lib/assets.ts` to the published Lovable image host so images work on external deployments without duplicating binary media.
- Keep error handling limited to standard logging and recovery screens, without optional platform-specific browser reporting hooks, to avoid unnecessary attribution and telemetry.
- Map lead-service failures through `src/lib/lead-errors.ts` and log only error codes, so failed saves are diagnosable without exposing visitor data or raw service details.

- Reuse the same enquiry form rendering and submission handler for page and plan dialogs, with distinct input IDs, to keep lead validation and payloads consistent.
