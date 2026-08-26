# Data outputs — Google Sheets and tokens

## When to use
Any task whose result lands somewhere the user owns (a spreadsheet, a
file). The user's own resource identifiers (which sheet, which folder) are
USER-OWNED values: never invent them, never finish a job with them silently
empty.

## Call shapes (IR / automation document)
A WriteGoogleSheet step's `value` object:
```json
{
  "spreadsheet": "<the user's spreadsheet URL or id — user-supplied>",
  "sheetName":   "",              // OPTIONAL — user can pick a tab later; never block on it
  "data":        "[articles]"     // a BRACKETED token referencing the extract step's output
}
```
- Data tokens are square-bracketed references to earlier steps' outputs
  (`[articles]`), not literal data and not `{{mustache}}` syntax in the
  compiled document.
- The extract step it references must set that output name.
- Google Drive destinations use the dedicated widgets
  (`WidgetDriverDownloadToGoogleDrive` / `WidgetDriverUploadFromGoogleDrive`);
  the plain download/upload actions target the user's LOCAL computer. The
  wrong side ships a run that puts files in the wrong place and still
  reports Success.

## Failure modes
- A failure at the sheet-write step almost always has one of five
  USER-side causes: the connected Google account cannot see the sheet
  (bad/foreign link) · it can see but cannot WRITE (view-only share) ·
  the file is .xls/.xlsx, not a real Google Sheet (needs File → Save as
  Google Sheets) · no Google account is connected to Axiom at all · the
  value is not a Sheets URL. Identify which and ask the user (your job
  protocol has a question mechanism) instead of burning repair rounds
  re-guessing the link.
- Sheet tab names you never verified: leave `sheetName` empty rather than
  inventing one.

## Anti-patterns
- Fabricating spreadsheet ids/URLs to make a verify run pass.
- Treating the optional tab name as required and stalling on it.
- Writing a sample/subset during verification and calling it done — the
  verify run must exercise the same extract the user will run.
