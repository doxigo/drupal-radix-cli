# Radix Drupal CLI

[![NPM](https://img.shields.io/npm/v/drupal-radix-cli.svg)](https://www.npmjs.com/package/drupal-radix-cli)

Radix Drupal CLI is an interactive prompt designed to manage [Drupal Radix 6](https://www.drupal.org/project/radix) components. It allows for easy listing, adding and generating of components to your Drupal theme, leveraging the power of the Radix base theme components.

_Note_: that this CLI uses your own local Radix theme as a source for components. If you want to add components from the latest version of Radix, you must first update your local Radix theme.

## Features

- **List Components**: Display all available Radix components.
- **Add Components**: Add Radix components to your theme, automatically replacing any existing ones.
- **Generate Components**: Generate a new component folder with all the necessary files.

## Installation

Ensure you have Node.js and npm installed on your system. Install the CLI tool within your subtheme or globally via npm:

```bash
npm install drupal-radix-cli
```

_Note_: You may also install the package globally: `npm install -g drupal-radix-cli`

## Usage

Once installed, you can use the CLI tool with the following commands:

### List Components

To list all Radix components available in the default directory:

```bash
drupal-radix-cli list
```

### Add Components

To add a Radix component to your current theme:

```bash
drupal-radix-cli add
```

Use the `--radix-path` flag to specify a custom Radix components directory if your Radix base theme is installed in a non-standard location:

```bash
drupal-radix-cli add --radix-path ../../radix/components
```

### Generate Components

To generate a clean new component folder within your subtheme `components` directory:

```bash
drupal-radix-cli generate
```

This will generate a new component folder with the following files:

- `[component-name]/[component-name].twig`
- `[component-name]/[component-name].component.yml`
- `[component-name]/[component-name].scss`
- `[component-name]/_[component-name].js`
- `[component-name]/README.md`

Make sure to remove any unwanted files and update your files accordingly.

## Help

Display usage instructions:

```bash
drupal-radix-cli --help
```

Or simply `drupal-radix-cli`.

## Radix Theme

The Radix theme is a component-base theme for Drupal. For more information, visit the [Radix theme project page on Drupal.org](https://www.drupal.org/project/radix).

## Contributing

Contributions are welcome! Submit pull requests or create issues for any enhancements, bugs, or features.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
