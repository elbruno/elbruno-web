# v0.7 owner approval checklist

November 5, 2026. This is a decision record, not authorization inferred from QA.

## Existing approvals preserved

- [x] On November 5 at 17:27 EST, the owner independently verified that staging
      displays the latest approved four featured projects, .NET Conf 2026 section
      and six-story carousel, with PromptDot absent from homepage features.
      No stale-content remediation or component redesign is pending.
- [x] Purple .NET identity, clear professional hero and six-story carousel retained.
- [x] Current Cloud Advocate at GitHub / Microsoft positioning retained, not upgraded
      to Principal or extended with invented history.
- [x] The existing six selected web story assets/captions were previously approved
      for repository/staging publication, as recorded in the
      [hero asset manifest](../hero-asset-manifest.md).
- [x] No new photographs or derivatives introduced. Official downloads unchanged.
- [x] Prior ten moderate development-tool findings were accepted for the previous
      staging deployment. This release's final audit still has ten moderate
      development findings and zero production advisories. This is not a permanent
      waiver for new vulnerabilities.
- [x] Four curated projects, short Speaker Kit introduction, EN/ES and external
      WordPress/podcast new-tab behavior preserved.

## Required for the next staging publication

- [ ] Review the V07 reconciliation, actual QA results and complete local ZIP.
- [ ] Confirm the same scoped asset/credit approval still applies to these unchanged
      web derivatives and public Speaker Kit materials.
- [ ] Accept the documented residual dev advisory chain or require a separately
      verified remediation.
- [ ] Review the unknown historical feed-refresh timestamps and native
      screen-reader listening limitation.
- [x] On November 5 at 17:33 EST, the owner explicitly requested pushing the
      reviewed work to GitHub and running the workflow to update the existing
      Static Web App. This authorizes repository publication and staging only.

**Technical staging decision:** GO for owner review / an independently authorized
staging deployment, subject to the residual observations in the QA report.
**Execution authorization:** explicitly granted by the owner's 17:33 EST request
for this reviewed V07 change set and the existing staging workflow.

The owner's staging-content confirmation does not authorize publishing the
additional local V07 changes by itself. The subsequent explicit publication
request authorizes those changes, but not DNS changes or production cutover.

## Production gates, all unresolved unless separately recorded

- [ ] Approve the exact EN/ES public introduction/job title, or approve keeping
      current copy. No Principal title is proposed without evidence.
- [ ] Approve each of the six extended biography drafts, or explicitly approve
      leaving them unpublished. A new long bio is not a prerequisite if omitted.
- [ ] Confirm photo rights, photographer/event credits and organizer-use boundaries.
      Staging approval does not grant production or third-party reuse rights.
- [ ] Supply/approve CV and career facts, or explicitly approve their omission.
      No invented CV, awards, speaking counts, employment dates or recordings.
- [ ] Approve WordPress primary hostname relocation after testing the actual plan,
      account and `blog.elbruno.com` TLS/content/feed/media availability.
- [ ] Approve the historical URL inventory and all Astro/WordPress collisions.
- [ ] Prove exact path/query-preserving 301s in the selected actual edge product.
- [ ] Export/verify DNS, mail and DNSSEC state; approve the Cloudflare/Network
      Solutions change window with named authority.
- [ ] Approve Azure custom-domain/TLS/proxy configuration and production artifact.
- [ ] Check live canonical/hreflang/robots/meta/X-Robots-Tag and social previews.
- [ ] Complete native screen-reader listening and any required cross-browser/device
      acceptance before claiming accessibility conformance.
- [ ] Rehearse rollback and verify old origin, DNS, WordPress and edge-rule recovery.
- [ ] Explicitly authorize production deployment and cutover.

**Production decision: NO-GO.** Current blog target fails TLS validation,
redirects/DNS cutover/rollback are not rehearsed and owner permissions are open.

## Optional decisions, not implemented

- [ ] Consider /now or /contact only if there is an actual owner use case.
- [ ] Consider smaller variants of already approved images after assessing any
      required asset approval; current measured LCP/CLS meet the stated local targets.
- [ ] Supply original Claude/Gemini reports for original-section traceability.

Changing purple to green, removing the carousel, inventing claims, uploading
private masters or exposing local automation settings is not authorized.

## Decision recording template

For each approved item record: decision, exact material/version, approver, date,
scope (repository/staging/production/reuse), conditions and evidence link.
Keep sensitive account/DNS exports out of this public repository.
