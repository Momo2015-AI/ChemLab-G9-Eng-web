# ChemLab-G9-Eng-web Release & Deployment Workflow

## Canonical Repository

`Momo2015-AI/ChemLab-G9-Eng-web` is the **single canonical repository** for the ChemLab G9 English project.

All future:

- development
- tests
- documentation
- releases
- GitHub Pages deployment
- CI/CD configuration

must be performed from this repository.

The default development branch is `main`.

## Single-source-of-truth rule

Do not continue development, synchronization, or release work in the legacy ChemLab-G9-S2 or ChemLab-G9-S2-web repositories. They are historical references only and are not part of the active V1.8 delivery pipeline.

## Development flow

```text
main
  ↓
code / docs change
  ↓
npm test
  ↓
GitHub Actions: ChemLab G9 Build Check
  ↓
GREEN
  ↓
commit to main
  ↓
GitHub Pages deployment
  ↓
public preview / release
```

## Quality gate

A change is release-ready only when:

1. `npm test` passes with zero failures.
2. The GitHub Actions Build Check is GREEN.
3. Production entry remains `index.html → app/bootstrap.js`.
4. Documentation reflects the current version and architecture.
5. No legacy repository is required to build or publish the current application.

## Deployment model

GitHub Pages is the canonical publication mechanism for this repository. The published site must be built from the same `main` source that passes CI.

The deployment workflow should therefore use:

```text
ChemLab-G9-Eng-web/main
        ↓
GitHub Actions（单一 workflow：Validate → build-pages → Deploy）
        ↓
scripts/build-pages.mjs 组装 runtime-only dist/
        ↓
GitHub Pages（仅发布运行时资产：app/、content/、views/、frontend/ 等；
  docs/、reports/、tests/、scripts/ 不进入学生端站点）
```

There should be no second source repository and no manual copy step between development and publication.

## Release discipline

For V1.8 and later:

- Keep development on `main` unless a temporary branch is explicitly required.
- Do not create parallel product repositories.
- Do not copy the application into a separate `*-web` repository for publication.
- Treat CI as the release gate.
- Treat GitHub Pages as the deployment target, not as a separate codebase.
- Keep release documentation in this repository under `docs/`.

## Current baseline

V2.2 学习闭环加固基线（2026-08-16）：

```text
tests: 133 / 133 GREEN
runtime audit / content integrity / lesson readiness: GREEN
deployment: GitHub Pages（runtime-only dist/）
```

版本历史见 `archive/HISTORY-V1.5-V2.2.md`。
