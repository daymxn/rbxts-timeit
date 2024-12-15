# Contributing

Any and all contributions are entirely welcomed! Before you contribute though, there are
some things you should know.

> [!NOTE]
> Making public contributions to this repo means you accept the [LICENSE](LICENSE) agreement and you're contributing code that also respects the [LICENSE](LICENSE) agreement.

## Getting started

Make sure you've given the [API Reference](api/timeit.api.md) a read before moving forward,
such that you understand the design behind **timeit**.

### Scripts

We use the [bs-cli](https://github.com/daymxn/bs-cli) to organize our scripts.

Run the help command to see a full list of options.

```sh
pnpm bs --help
```

### Building

Use the `build` command to build the source files.

```sh
pnpm build
```

Or `watch` to watch the source files.

```sh
pnpm watch
```

### Running Tests

You can run tests either directly in Roblox Studio, or through the command line with Lune.

#### Lune

Use the `test` command to run unit tests inside lune.

```sh
pnpm test
```

> [!TIP]
> If you want more control over the test run, you can check out the test options in `bs`.
>
> ```sh
> pnpm bs test --help
> ```

#### Roblox studio

Start a watch for the test place.

```sh
pnpm dev
```

Serve `test.project.json` with rojo and link with an empty base plate in roblox studio.

Finally, use the shortcut `ctrl` + `:` with the [Test EZ Companion](https://github.com/tacheometry/testez-companion) plugin
to run the tests.

### Public API

For syncing the API, you can run the `bs api` command from the root directory.

```sh
pnpm bs api
```

## Making changes

To make changes, clone the repo to your local disk.

`git clone git@github.com:daymxn/rbxts-timeit.git`

Then, checkout to a new feature branch named whatever you want it to be.

`git checkout -b SOME_BRANCH_NAME`

After you've made changes to your local branch, and you want to submit, you can open a Pull Request (PR)
via the [GitHub web panel](https://github.com/daymxn/rbxts-timeit/compare).

### Code Formatting

Code in this repo is formatted according to eslint and prettier.
You can use the attached `.vscode` folder for automatically formatting on file save,
or you can manually run both via the command line with the `bs format` and `bs lint` scripts:

```sh
pnpm bs format
```

```sh
pnpm bs lint
```

### Changesets

We use [changesets](https://github.com/changesets/changesets) for our release notes and version bumping.

When submitting a change that should be apart of a release, you
can run the `bs change` script.

```sh
pnpm bs change
```

The script will prompt you with options for setting the message and version type.

> [!IMPORTANT]
> If your change impacts the public API, ensure you're choosing the appropriate version type (according to [semver](https://semver.org/)).
>
> Alternatively, just follow the given table:
>
> `major` = Removes something from the public api, or changes the behavior of something in a breaking manner.
>
> `minor` = Adds to the public api.
>
> `patch` = Fixes a bug. The bug fix must be done in a non breaking manner, other-wise it's a major change.

#### Additional Commands

You can check out the help section of `bs change` to see a list of available commands.

```sh
pnpm bs change --help
```

### Releasing

To invoke a release, you'll need to pull the `main` branch
and run the `bs change:version` command.

```sh
pnpm bs change:version
```

This will automatically bump the releasing projects.

After merging these changes back into `main`, you can move forward
with the actual publishing.

```sh
pnpm bs publish
```

This will publish the releasing projects to npm, with the generated changelogs.

#### Git tags

If you generate git tags for the release, but have auto push disabled for publish,
you can manually push the tags with the `bs publish:tags` command.

```sh
pnpm bs publish:tags
```

This will also automatically generate them for you, if you had git tags disabled completely
when pushing the release.
