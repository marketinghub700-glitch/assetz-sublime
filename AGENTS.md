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

- Keep source-derived project figures in `src/lib/project.ts` and test them separately so presentation changes cannot silently alter prices or development facts.
- Serve downloaded reference-site media through Lovable Assets JSON pointers to keep binary media out of the repository.
