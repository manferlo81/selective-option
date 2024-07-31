# Selective Option Changelog

## Version History

## [0.1.0](https://github.com/manferlo81/selective-option/compare/v0.0.2...v0.1.0) (2024-07-31)


### ⚠ BREAKING CHANGES

* **types:** StringOption type has been renamed to KeyOption
* createNullishResolver has been removed, use createValueResolver passing a default value
* remove deprecated functions
* new syntax
* stop exporting unnecessary types (Nullable & TypeCheckFunction)

### Features

* Allow "+" prefixed key as positive key ([7fdb5a0](https://github.com/manferlo81/selective-option/commit/7fdb5a0a108ba2e84bb963c7525f280350671674))
* Allow nullish as value validator in boolean based resolver to resolve boolean only ([2e2060a](https://github.com/manferlo81/selective-option/commit/2e2060ad3eb8252f67e55d6b7c87e91c54019dd6))
* Negative key support ([d7baefc](https://github.com/manferlo81/selective-option/commit/d7baefc6bddddb4b777bf1525783e29c336cd408))
* **type:** Allow input type on Resolve type ([e65069b](https://github.com/manferlo81/selective-option/commit/e65069bf1cb4c13c9b4e71306b8dacab9e73d3df))
* Validate special keys ([92119d4](https://github.com/manferlo81/selective-option/commit/92119d4530438e4bd2f67929b08f6c059000fa2e))


### Bug Fixes

* **type:** fix ValueBasedResolver type ([c2c173d](https://github.com/manferlo81/selective-option/commit/c2c173d20f78c1336e07fced4e773ab5864878d1))
* **types:** Allow boolean as default value in boolean based resolver ([4ad11a6](https://github.com/manferlo81/selective-option/commit/4ad11a6d61f6ec5b33155e950d34c03af4c03284))
* **types:** fix wrongly implemented input types ([837067e](https://github.com/manferlo81/selective-option/commit/837067e44a5bf5afcbb69f81f41618e6290879fc))
* validate value before skipping nullish value ([14054b6](https://github.com/manferlo81/selective-option/commit/14054b65ce82fd10d93afad95994bf04570f0adb))


* Declare breaking changes ([88ef625](https://github.com/manferlo81/selective-option/commit/88ef6259ca44e551d97d6533da1e8835a9569c18))
* Remove nullish resolver ([3adf329](https://github.com/manferlo81/selective-option/commit/3adf329bca89d071aa97032bbaf9963873d76caa))
* Resolver new syntax ([abb1768](https://github.com/manferlo81/selective-option/commit/abb17688e221c962db42d5b127c7845068a877a8))
* Stop exporting unnecessary types ([ce2c132](https://github.com/manferlo81/selective-option/commit/ce2c132cdbec8d5bdfba9479d091e1c3afafb7de))
* **types:** Rename type StringOption to KeyOption ([20cfa6a](https://github.com/manferlo81/selective-option/commit/20cfa6a5e6830738a8843ea52d4c3bd1cc957d02))

### [0.0.2](https://github.com/manferlo81/selective-option/compare/v0.0.1...v0.0.2) (2024-07-22)

### Features

* Allow to set default key name ([5f77dfd](https://github.com/manferlo81/selective-option/commit/5f77dfdbfff63eb10c1bbdbb2e5fd96c621f3353))
* Bool based resolves boolean value ([b53f983](https://github.com/manferlo81/selective-option/commit/b53f983d2d9e6e664d34b36e404ba580f89c5426))
* Implement new API ([ac53a21](https://github.com/manferlo81/selective-option/commit/ac53a215e17076829798d7d51e3e14ecbed428a7))
* Use options ([df334a1](https://github.com/manferlo81/selective-option/commit/df334a10163cff8b9f421975166ff6bd50e25f2c))

### 0.0.1 (2020-11-18)

### Features

* Accept output result for strings ([bcda65d](https://github.com/manferlo81/selective-option/commit/bcda65d72f70d786d131d486f2abe61db54be53e))
